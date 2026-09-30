package com.gym.sistemagestiongym.dtos.common;

import org.springframework.data.domain.Page;

import java.util.List;
import java.util.function.Function;

/** Contrato de paginación propio: no se expone PageImpl, cuyo JSON no es estable entre versiones. */
public record PaginaResponse<T>(
        List<T> contenido,
        int pagina,
        int tamano,
        long totalElementos,
        int totalPaginas
) {
    public static <E, T> PaginaResponse<T> from(Page<E> page, Function<E, T> mapper) {
        Page<T> mapeada = page.map(mapper);
        return new PaginaResponse<>(
                mapeada.getContent(),
                mapeada.getNumber(),
                mapeada.getSize(),
                mapeada.getTotalElements(),
                mapeada.getTotalPages());
    }
}