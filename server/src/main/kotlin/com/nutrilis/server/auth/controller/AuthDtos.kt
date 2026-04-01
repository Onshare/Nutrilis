package com.nutrilis.server.auth.controller

import com.nutrilis.server.auth.domain.AuthChannel
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size

data class SendOtpRequest(
    @field:NotBlank
    val channel: String,
    @field:NotBlank
    val target: String,
)

data class VerifyOtpRequest(
    @field:NotBlank
    val requestId: String,
    @field:NotBlank
    val channel: String,
    @field:NotBlank
    val target: String,
    @field:Size(min = 6, max = 6)
    @field:Pattern(regexp = "\\d{6}")
    val code: String,
)

data class RefreshTokenRequest(
    @field:NotBlank
    val refreshToken: String,
)

data class LogoutRequest(
    @field:NotBlank
    val refreshToken: String,
)

data class SendOtpResponse(
    val requestId: String,
    val channel: AuthChannel,
    val maskedTarget: String,
    val provider: String,
    val expiresInSeconds: Long,
)

data class AuthUserView(
    val id: String,
    val identifier: String,
    val displayName: String,
    val channel: AuthChannel,
)

data class VerifyOtpResponse(
    val accessToken: String,
    val refreshToken: String,
    val user: AuthUserView,
    val created: Boolean,
)

data class RefreshTokenResponse(
    val accessToken: String,
    val refreshToken: String,
)
