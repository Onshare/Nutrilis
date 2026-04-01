package com.nutrilis.server.auth.domain

data class SessionPrincipal(
    val userId: String,
    val identifier: String,
    val displayName: String,
    val channel: AuthChannel,
)
