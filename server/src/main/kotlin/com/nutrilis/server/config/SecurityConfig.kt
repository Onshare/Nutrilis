package com.nutrilis.server.config

import com.fasterxml.jackson.databind.ObjectMapper
import com.nutrilis.server.auth.domain.SessionPrincipal
import com.nutrilis.server.auth.service.AuthService
import com.nutrilis.server.common.ApiResponse
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.MediaType
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

data class AuthenticatedUser(
    val userId: String,
    val identifier: String,
    val displayName: String,
    val channel: String,
)

@Component
class BearerTokenFilter(
    private val authService: AuthService,
) : OncePerRequestFilter() {
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        val header = request.getHeader("Authorization")
        val token = header?.takeIf { it.startsWith("Bearer ") }?.removePrefix("Bearer ")?.trim()
        val principal = authService.resolvePrincipal(token)

        if (principal != null) {
            val authentication = UsernamePasswordAuthenticationToken(
                principal.toAuthenticatedUser(),
                null,
                listOf(SimpleGrantedAuthority("ROLE_USER")),
            )
            SecurityContextHolder.getContext().authentication = authentication
        }

        filterChain.doFilter(request, response)
    }

    override fun shouldNotFilter(request: HttpServletRequest): Boolean {
        return request.requestURI.startsWith("/api/v1/auth/")
    }
}

@Configuration
class SecurityConfig(
    private val bearerTokenFilter: BearerTokenFilter,
) {
    @Bean
    fun securityFilterChain(
        http: HttpSecurity,
    ): SecurityFilterChain {
        return http
            .csrf { it.disable() }
            .formLogin { it.disable() }
            .httpBasic { it.disable() }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authorizeHttpRequests {
                it.requestMatchers(
                    "/api/v1/auth/**",
                    "/api/v1/home",
                    "/api/v1/recipes",
                    "/api/v1/recipes/*",
                    "/api/v1/therapies",
                    "/api/v1/therapies/*",
                    "/api/v1/daily-care",
                    "/api/v1/quiz",
                    "/api/v1/quiz/submit",
                ).permitAll()
                    .anyRequest().authenticated()
            }
            .addFilterBefore(bearerTokenFilter, UsernamePasswordAuthenticationFilter::class.java)
            .exceptionHandling {
                it.authenticationEntryPoint { _, response, _ ->
                    response.status = HttpServletResponse.SC_UNAUTHORIZED
                    response.contentType = MediaType.APPLICATION_JSON_VALUE
                    response.writer.write(
                        ObjectMapper().writeValueAsString(
                            ApiResponse.failure("UNAUTHORIZED", "Authentication required"),
                        ),
                    )
                }
            }
            .build()
    }
}

private fun SessionPrincipal.toAuthenticatedUser(): AuthenticatedUser {
    return AuthenticatedUser(
        userId = userId,
        identifier = identifier,
        displayName = displayName,
        channel = channel.name,
    )
}
