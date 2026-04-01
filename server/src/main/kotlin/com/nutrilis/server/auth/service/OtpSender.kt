package com.nutrilis.server.auth.service

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

interface OtpSender {
    val providerName: String
    fun send(target: String, code: String)
}

@Component
class AliyunSmsOtpSender : OtpSender {
    private val logger = LoggerFactory.getLogger(javaClass)

    override val providerName: String = "aliyun-sms"

    override fun send(target: String, code: String) {
        logger.info("Mock sending Aliyun SMS OTP to {} with code {}", target, code)
    }
}

@Component
class EmailOtpSender : OtpSender {
    private val logger = LoggerFactory.getLogger(javaClass)

    override val providerName: String = "smtp-email"

    override fun send(target: String, code: String) {
        logger.info("Mock sending email OTP to {} with code {}", target, code)
    }
}
