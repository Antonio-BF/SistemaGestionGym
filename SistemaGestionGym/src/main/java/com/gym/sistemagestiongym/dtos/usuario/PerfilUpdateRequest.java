package com.gym.sistemagestiongym.dtos.usuario;

import com.gym.sistemagestiongym.model.enums.Genero;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

import static com.gym.sistemagestiongym.dtos.usuario.UsuarioReglas.*;

public record PerfilUpdateRequest(
        @NotBlank(message = "Ingrese su nombre")
        @Size(max = NOMBRE_MAX, message = "El nombre no puede exceder 100 caracteres")
        String nombre,

        @NotBlank(message = "Ingrese su apellido")
        @Size(max = NOMBRE_MAX, message = "El apellido no puede exceder 100 caracteres")
        String apellido,

        @Pattern(regexp = TELEFONO_REGEX, message = MSG_TELEFONO)
        String telefono,

        Genero genero,

        @Past(message = "La fecha de nacimiento debe ser pasada")
        LocalDate fechaNacimiento
) { }