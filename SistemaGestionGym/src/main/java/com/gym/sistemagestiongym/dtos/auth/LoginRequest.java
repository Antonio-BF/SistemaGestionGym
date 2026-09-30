package com.gym.sistemagestiongym.dtos.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Ingrese su email")
        @Email(message = "El email no tiene un formato válido")
        String email,

        @NotBlank(message = "Ingrese su contraseña")
        String password
) { }