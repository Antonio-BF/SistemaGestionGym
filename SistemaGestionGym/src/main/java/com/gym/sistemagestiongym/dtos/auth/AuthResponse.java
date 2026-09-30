package com.gym.sistemagestiongym.dtos.auth;


public record AuthResponse(
        String token,
        String tipo,
        long expiraEnMs,
        UsuarioSesionResponse usuario
) { }