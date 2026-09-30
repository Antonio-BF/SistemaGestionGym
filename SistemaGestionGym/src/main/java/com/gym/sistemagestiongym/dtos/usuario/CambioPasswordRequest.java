package com.gym.sistemagestiongym.dtos.usuario;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import static com.gym.sistemagestiongym.dtos.usuario.UsuarioReglas.*;

public record CambioPasswordRequest(
        @NotBlank(message = "Ingrese su contraseña actual")
        String passwordActual,

        @NotBlank(message = "Ingrese la nueva contraseña")
        @Size(min = PASSWORD_MIN, max = PASSWORD_MAX, message = MSG_PASSWORD)
        String passwordNueva
) { }