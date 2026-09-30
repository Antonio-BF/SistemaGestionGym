package com.gym.sistemagestiongym.exception;

import org.springframework.http.HttpStatus;

/**
 * 409 Conflict — la petición es válida en sí misma, pero el ESTADO ACTUAL
 * del recurso impide ejecutarla (sin stock, sin cupo, reserva duplicada,
 * clase cancelada, email ya registrado, etc.).
 */
public class ConflictoEstadoException extends NegocioException {
    public ConflictoEstadoException(String message) {
        super(message, HttpStatus.CONFLICT);
    }
}