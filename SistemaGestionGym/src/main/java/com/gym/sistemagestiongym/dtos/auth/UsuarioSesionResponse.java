package com.gym.sistemagestiongym.dtos.auth;

import com.gym.sistemagestiongym.model.Usuario;

/** Solo lo que el cliente necesita para pintar la sesión y decidir rutas por rol. */
public record UsuarioSesionResponse(
        Integer id,
        String nombre,
        String apellido,
        String email,
        String rol          // "ADMIN", "RECEPCION", "ENTRENADOR" o "CLIENTE"
) {
    public static UsuarioSesionResponse desde(Usuario u) {
        return new UsuarioSesionResponse(
                u.getId(),
                u.getNombre(),
                u.getApellido(),
                u.getEmail(),
                u.getRol().getNombre());
    }
}