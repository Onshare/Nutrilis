package com.nutrilis.server.auth.controller

import com.nutrilis.server.auth.service.AuthService
import com.nutrilis.server.common.ApiResponse
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/auth")
class AuthController(
    private val authService: AuthService,
) {
    @PostMapping("/otp/send")
    fun sendOtp(
        @Valid @RequestBody request: SendOtpRequest,
    ): ApiResponse<SendOtpResponse> {
        return ApiResponse.success(
            authService.sendOtp(channelRaw = request.channel, target = request.target),
        )
    }

    @PostMapping("/otp/verify")
    fun verifyOtp(
        @Valid @RequestBody request: VerifyOtpRequest,
    ): ApiResponse<VerifyOtpResponse> {
        return ApiResponse.success(authService.verifyOtp(request))
    }

    @PostMapping("/refresh")
    fun refresh(
        @Valid @RequestBody request: RefreshTokenRequest,
    ): ApiResponse<RefreshTokenResponse> {
        return ApiResponse.success(authService.refresh(request.refreshToken))
    }

    @PostMapping("/logout")
    fun logout(
        @Valid @RequestBody request: LogoutRequest,
    ): ApiResponse<Map<String, String>> {
        authService.logout(request.refreshToken)
        return ApiResponse.success(mapOf("status" to "logged_out"))
    }

    @ExceptionHandler(IllegalArgumentException::class)
    fun handleBadRequest(error: IllegalArgumentException): ResponseEntity<ApiResponse<Nothing>> {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.failure(code = "BAD_REQUEST", message = error.message ?: "Invalid request"))
    }
}
