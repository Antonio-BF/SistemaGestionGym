package com.gym.sistemagestiongym.exception;


import org.springframework.http.HttpStatus;

/**
 * 404 — se usa para CUALQUIER entidad (Usuario, Producto, ClaseProgramada,
 * Reserva, MembresiaCliente, etc.) que se busque por id y no exista.
 * No tiene una clase "familia" propia porque es la única excepción 404
 * del sistema; crear una jerarquía de un solo miembro sería sobre-ingeniería.
 */
public class RecursoNoEncontradoException extends NegocioException {
    public RecursoNoEncontradoException(String entidad, Object id) {
        super("%s con id %s no fue encontrado".formatted(entidad, id), HttpStatus.NOT_FOUND);
    }
}