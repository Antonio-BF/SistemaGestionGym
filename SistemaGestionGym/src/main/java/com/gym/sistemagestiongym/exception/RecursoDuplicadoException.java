package com.gym.sistemagestiongym.exception;

import org.springframework.http.HttpStatus;

public class RecursoDuplicadoException extends NegocioException{

    public RecursoDuplicadoException(String message) {
        super(message, HttpStatus.CONFLICT);
    }
}
