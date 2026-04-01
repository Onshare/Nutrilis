package com.nutrilis.server.auth.service

import org.springframework.stereotype.Service
import java.util.UUID

@Service
class TokenService {
    fun issueAccessToken(): String = "atk_${UUID.randomUUID()}"

    fun issueRefreshToken(): String = "rtk_${UUID.randomUUID()}"
}
