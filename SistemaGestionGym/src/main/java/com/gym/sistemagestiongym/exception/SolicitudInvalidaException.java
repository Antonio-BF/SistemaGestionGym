package com.gym.sistemagestiongym.exception;


import org.springframework.http.HttpStatus;

/**
 * 400 Bad Request — el cliente envió datos que, aunque pasaron Bean Validation
 * (formato correcto), violan una regla de negocio evaluable ANTES de tocar
 * el estado de otro recurso (ej. un rol que no corresponde, un carrito vacío).
 */
public class SolicitudInvalidaException extends NegocioException {
    public SolicitudInvalidaException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}