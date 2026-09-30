package com.gym.sistemagestiongym.exception;


import org.springframework.http.HttpStatus;

/**
 * Excepción base para toda regla de negocio violada en el sistema.
 *
 * Cada subtipo declara su propio HttpStatus en el constructor, de modo que
 * GlobalExceptionHandler puede traducir CUALQUIER NegocioException con un
 * único @ExceptionHandler, sin necesidad de un método por cada excepción
 * concreta (principio abierto/cerrado: agregar una regla de negocio nueva
 * no obliga a modificar el handler global).
 */
public abstract class NegocioException extends RuntimeException {

    private final HttpStatus httpStatus;

    protected NegocioException(String message, HttpStatus httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}