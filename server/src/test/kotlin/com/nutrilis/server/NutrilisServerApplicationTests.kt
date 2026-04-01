package com.nutrilis.server

import com.nutrilis.server.auth.controller.VerifyOtpRequest
import com.nutrilis.server.auth.data.InMemoryOtpTicketRepository
import com.nutrilis.server.auth.data.InMemorySessionRepository
import com.nutrilis.server.auth.data.InMemoryUserRepository
import com.nutrilis.server.auth.service.AliyunSmsOtpSender
import com.nutrilis.server.auth.service.AuthService
import com.nutrilis.server.auth.service.EmailOtpSender
import com.nutrilis.server.auth.service.TokenService
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith

class NutrilisServerApplicationTests {

    private val authService = AuthService(
        otpTicketRepository = InMemoryOtpTicketRepository(),
        userRepository = InMemoryUserRepository(),
        sessionRepository = InMemorySessionRepository(),
        tokenService = TokenService(),
        aliyunSmsOtpSender = AliyunSmsOtpSender(),
        emailOtpSender = EmailOtpSender(),
    )

    @Test
    fun `accepts fixed otp for sign in or sign up`() {
        val sendResult = authService.sendOtp(
            channelRaw = "phone",
            target = "+8613812345678",
        )

        val verified = authService.verifyOtp(
            VerifyOtpRequest(
                requestId = sendResult.requestId,
                channel = "phone",
                target = "+8613812345678",
                code = "111111",
            ),
        )

        assertEquals("+8613812345678", verified.user.identifier)
    }

    @Test
    fun `rejects wrong otp`() {
        val sendResult = authService.sendOtp(
            channelRaw = "email",
            target = "demo@nutrilis.app",
        )

        assertFailsWith<IllegalArgumentException> {
            authService.verifyOtp(
                VerifyOtpRequest(
                    requestId = sendResult.requestId,
                    channel = "email",
                    target = "demo@nutrilis.app",
                    code = "000000",
                ),
            )
        }
    }
}
