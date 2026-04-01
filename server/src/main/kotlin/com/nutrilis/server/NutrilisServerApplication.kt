package com.nutrilis.server

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class NutrilisServerApplication

fun main(args: Array<String>) {
	runApplication<NutrilisServerApplication>(*args)
}
