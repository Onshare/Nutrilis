package com.nutrilis.server.auth.service

import com.nutrilis.server.auth.controller.AuthUserView
import com.nutrilis.server.auth.controller.RefreshTokenResponse
import com.nutrilis.server.auth.controller.SendOtpResponse
import com.nutrilis.server.auth.controller.VerifyOtpRequest
import com.nutrilis.server.auth.controller.VerifyOtpResponse
import com.nutrilis.server.auth.data.OtpTicketRepository
import com.nutrilis.server.auth.data.SessionRepository
import com.nutrilis.server.auth.data.UserRepository
import com.nutrilis.server.auth.domain.AuthChannel
import com.nutrilis.server.auth.domain.SessionPrincipal
import com.nutrilis.server.auth.entity.OtpTicketEntity
import com.nutrilis.server.auth.entity.UserEntity
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class AuthService(
    private val otpTicketRepository: OtpTicketRepository,
    private val userRepository: UserRepository,
    private val sessionRepository: SessionRepository,
    private val tokenService: TokenService,
    private val aliyunSmsOtpSender: AliyunSmsOtpSender,
    private val emailOtpSender: EmailOtpSender,
) {
    fun sendOtp(channelRaw: String, target: String): SendOtpResponse {
        val channel = channelRaw.toChannel()
        validateTarget(channel, target)

        val requestId = UUID.randomUUID().toString()
        otpTicketRepository.save(
            OtpTicketEntity(
                requestId = requestId,
                channel = channel,
                target = target,
            ),
        )

        val sender = when (channel) {
            AuthChannel.phone -> aliyunSmsOtpSender
            AuthChannel.email -> emailOtpSender
        }
        sender.send(target, OTP_CODE)

        return SendOtpResponse(
            requestId = requestId,
            channel = channel,
            maskedTarget = target.mask(),
            provider = sender.providerName,
            expiresInSeconds = 300,
        )
    }

    fun verifyOtp(request: VerifyOtpRequest): VerifyOtpResponse {
        val channel = request.channel.toChannel()
        validateTarget(channel, request.target)
        val ticket = otpTicketRepository.findById(request.requestId)
            ?: throw IllegalArgumentException("OTP request does not exist or has expired")

        if (ticket.target != request.target || ticket.channel != channel) {
            throw IllegalArgumentException("OTP request target mismatch")
        }
        if (request.code != OTP_CODE) {
            throw IllegalArgumentException("Invalid OTP code")
        }

        val existingUser = userRepository.findByIdentifier(request.target)
        val user = existingUser ?: userRepository.save(
            UserEntity(
                id = UUID.randomUUID().toString(),
                identifier = request.target,
                displayName = defaultDisplayName(channel, request.target),
                channel = channel,
            ),
        )

        val principal = SessionPrincipal(
            userId = user.id,
            identifier = user.identifier,
            displayName = user.displayName,
            channel = user.channel,
        )
        val accessToken = tokenService.issueAccessToken()
        val refreshToken = tokenService.issueRefreshToken()
        sessionRepository.saveAccessToken(accessToken, principal)
        sessionRepository.saveRefreshToken(refreshToken, principal)
        otpTicketRepository.delete(request.requestId)

        return VerifyOtpResponse(
            accessToken = accessToken,
            refreshToken = refreshToken,
            user = AuthUserView(
                id = user.id,
                identifier = user.identifier,
                displayName = user.displayName,
                channel = user.channel,
            ),
            created = existingUser == null,
        )
    }

    fun refresh(refreshToken: String): RefreshTokenResponse {
        val principal = sessionRepository.findRefreshPrincipal(refreshToken)
            ?: throw IllegalArgumentException("Refresh token is invalid")
        sessionRepository.removeRefreshToken(refreshToken)

        val nextAccessToken = tokenService.issueAccessToken()
        val nextRefreshToken = tokenService.issueRefreshToken()
        sessionRepository.saveAccessToken(nextAccessToken, principal)
        sessionRepository.saveRefreshToken(nextRefreshToken, principal)

        return RefreshTokenResponse(
            accessToken = nextAccessToken,
            refreshToken = nextRefreshToken,
        )
    }

    fun logout(refreshToken: String) {
        sessionRepository.removeRefreshToken(refreshToken)
    }

    fun resolvePrincipal(accessToken: String?): SessionPrincipal? {
        return sessionRepository.findAccessPrincipal(accessToken)
    }

    private fun validateTarget(channel: AuthChannel, target: String) {
        val valid = when (channel) {
            AuthChannel.phone -> PHONE_REGEX.matches(target)
            AuthChannel.email -> EMAIL_REGEX.matches(target)
        }
        require(valid) { "Target does not match selected channel" }
    }

    private fun defaultDisplayName(channel: AuthChannel, target: String): String {
        return when (channel) {
            AuthChannel.phone -> "Nutrilis ${target.takeLast(4)}"
            AuthChannel.email -> target.substringBefore("@")
        }
    }

    private fun String.toChannel(): AuthChannel {
        return runCatching { AuthChannel.valueOf(this) }
            .getOrElse { throw IllegalArgumentException("Unsupported auth channel") }
    }

    private fun String.mask(): String {
        return if (contains("@")) {
            val name = substringBefore("@")
            val domain = substringAfter("@")
            val safeName = if (name.length <= 2) "${name.first()}*" else "${name.take(2)}***"
            "$safeName@$domain"
        } else {
            replaceRange(3, length.coerceAtMost(7), "****")
        }
    }

    companion object {
        private const val OTP_CODE = "111111"
        private val PHONE_REGEX = Regex("^\\+?[0-9]{7,15}$")
        private val EMAIL_REGEX = Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")
    }
}
