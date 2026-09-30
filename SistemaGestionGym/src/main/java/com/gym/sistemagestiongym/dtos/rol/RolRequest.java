package com.gym.sistemagestiongym.dtos.rol;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RolRequest(
        @NotBlank(message = "Ingrese el nombre del rol")
        @Size(max = 50, message = "El nombre del rol solo puede tener 50 caracteres")
        String nombre
) {
}
