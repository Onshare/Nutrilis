package com.nutrilis.server.common

data class ApiError(
    val code: String,
    val message: String,
)

data class ApiResponse<T>(
    val data: T? = null,
    val meta: Map<String, Any?> = emptyMap(),
    val error: ApiError? = null,
) {
    companion object {
        fun <T> success(
            data: T,
            meta: Map<String, Any?> = emptyMap(),
        ): ApiResponse<T> = ApiResponse(data = data, meta = meta)

        fun failure(
            code: String,
            message: String,
            meta: Map<String, Any?> = emptyMap(),
        ): ApiResponse<Nothing> = ApiResponse(error = ApiError(code = code, message = message), meta = meta)
    }
}
