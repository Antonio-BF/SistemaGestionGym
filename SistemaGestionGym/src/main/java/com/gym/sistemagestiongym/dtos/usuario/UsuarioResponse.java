package com.gym.sistemagestiongym.dtos.usuario;

import com.gym.sistemagestiongym.model.Usuario;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record UsuarioResponse(
        Integer id,
        String nombre,
        String apellido,
        String email,
        String telefono,
        String genero,
        LocalDate fechaNacimiento,
        Integer rolId,
        String rol,
        LocalDateTime fechaUltimoAcceso,
        String estado,
        LocalDateTime fechaRegistro,
        LocalDateTime fechaActualizacion
) {
    // Mapper
    public static UsuarioResponse from(Usuario u){
        return new UsuarioResponse(
                u.getId(),
                u.getNombre(),
                u.getApellido(),
                u.getEmail(),
                u.getTelefono(),
                u.getGenero().name(),
                u.getFechaNacimiento(),
                u.getRol().getId(),
                u.getRol().getNombre(),
                u.getFechaUltimoAcceso(),
                u.getEstado().name(),
                u.getFechaRegistro(),
                u.getFechaActualizacion()
        );
    }
}
