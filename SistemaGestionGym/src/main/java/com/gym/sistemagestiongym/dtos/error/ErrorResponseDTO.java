package com.gym.sistemagestiongym.dtos.error;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Estructura uniforme de error para TODAS las respuestas 4xx/5xx de la API.
 * Angular puede confiar en este contrato fijo sin importar qué excepción
 * lo generó, lo que simplifica el interceptor de errores del lado del cliente.
 */
public record ErrorResponseDTO(
        LocalDateTime timestamp,
        int status,
        String error,
        String message,
        String path,
        Map<String, String> validationErrors // null si no aplica
) {
    public static ErrorResponseDTO of(int status, String error, String message, String path) {
        return new ErrorResponseDTO(LocalDateTime.now(), status, error, message, path, null);
    }

    public static ErrorResponseDTO ofValidation(int status, String error, String message, String path,
                                                Map<String, String> validationErrors) {
        return new ErrorResponseDTO(LocalDateTime.now(), status, error, message, path, validationErrors);
    }
}