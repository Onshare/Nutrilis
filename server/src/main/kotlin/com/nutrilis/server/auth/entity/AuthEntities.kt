package com.nutrilis.server.auth.entity

import com.nutrilis.server.auth.domain.AuthChannel

data class UserEntity(
    val id: String,
    val identifier: String,
    val displayName: String,
    val channel: AuthChannel,
)

data class OtpTicketEntity(
    val requestId: String,
    val channel: AuthChannel,
    val target: String,
)
