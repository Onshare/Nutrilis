package com.nutrilis.server.auth.data

import com.nutrilis.server.auth.domain.SessionPrincipal
import com.nutrilis.server.auth.entity.OtpTicketEntity
import com.nutrilis.server.auth.entity.UserEntity
import org.springframework.stereotype.Repository
import java.util.concurrent.ConcurrentHashMap

interface OtpTicketRepository {
    fun save(ticket: OtpTicketEntity)
    fun findById(requestId: String): OtpTicketEntity?
    fun delete(requestId: String)
}

interface UserRepository {
    fun findByIdentifier(identifier: String): UserEntity?
    fun save(user: UserEntity): UserEntity
}

interface SessionRepository {
    fun saveAccessToken(token: String, principal: SessionPrincipal)
    fun saveRefreshToken(token: String, principal: SessionPrincipal)
    fun findAccessPrincipal(token: String?): SessionPrincipal?
    fun findRefreshPrincipal(token: String): SessionPrincipal?
    fun removeRefreshToken(token: String)
}

@Repository
class InMemoryOtpTicketRepository : OtpTicketRepository {
    private val tickets = ConcurrentHashMap<String, OtpTicketEntity>()

    override fun save(ticket: OtpTicketEntity) {
        tickets[ticket.requestId] = ticket
    }

    override fun findById(requestId: String): OtpTicketEntity? = tickets[requestId]

    override fun delete(requestId: String) {
        tickets.remove(requestId)
    }
}

@Repository
class InMemoryUserRepository : UserRepository {
    private val users = ConcurrentHashMap<String, UserEntity>()

    override fun findByIdentifier(identifier: String): UserEntity? = users[identifier]

    override fun save(user: UserEntity): UserEntity {
        users[user.identifier] = user
        return user
    }
}

@Repository
class InMemorySessionRepository : SessionRepository {
    private val accessTokens = ConcurrentHashMap<String, SessionPrincipal>()
    private val refreshTokens = ConcurrentHashMap<String, SessionPrincipal>()

    override fun saveAccessToken(token: String, principal: SessionPrincipal) {
        accessTokens[token] = principal
    }

    override fun saveRefreshToken(token: String, principal: SessionPrincipal) {
        refreshTokens[token] = principal
    }

    override fun findAccessPrincipal(token: String?): SessionPrincipal? {
        return if (token.isNullOrBlank()) null else accessTokens[token]
    }

    override fun findRefreshPrincipal(token: String): SessionPrincipal? = refreshTokens[token]

    override fun removeRefreshToken(token: String) {
        refreshTokens.remove(token)
    }
}
