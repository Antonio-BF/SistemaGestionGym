package com.gym.sistemagestiongym.exception;


import org.springframework.http.HttpStatus;

/**
 * 403 Forbidden — el usuario está autenticado e identificado correctamente,
 * pero no tiene permiso para realizar la acción sobre ESE recurso puntual
 * (a diferencia de Spring Security's AccessDeniedException, que es por rol
 * a nivel de endpoint, esto es autorización a nivel de dato: ej. "este
 * cliente no puede cancelar la reserva de otro cliente").
 */
public class AccesoNoAutorizadoException extends NegocioException {
    public AccesoNoAutorizadoException(String message) {
        super(message, HttpStatus.FORBIDDEN);
    }
}