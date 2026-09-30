package com.gym.sistemagestiongym.dtos.auth;

import com.gym.sistemagestiongym.model.enums.Genero;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

import static com.gym.sistemagestiongym.dtos.usuario.UsuarioReglas.*;

public record RegisterRequest(
        @NotBlank(message = "Ingrese el nombre")
        @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
        String nombre,

        @NotBlank(message = "Ingrese el apellido")
        @Size(max = 100, message = "El apellido no puede exceder 100 caracteres")
        String apellido,

        @NotBlank(message = "Ingrese el email")
        @Email(message = "El email no tiene un formato válido")
        @Size(max = 150, message = "El email no puede exceder 150 caracteres")
        String email,

        // 72 = límite real de BCrypt (trunca lo que excede)
        @NotBlank(message = "Ingrese una contraseña")
        @Size(min = PASSWORD_MIN, max = PASSWORD_MAX, message = MSG_PASSWORD)
        String password,

        @Pattern(regexp = TELEFONO_REGEX, message = MSG_TELEFONO)
        String telefono,

        Genero genero,

        @Past(message = "La fecha de nacimiento debe ser pasada")
        LocalDate fechaNacimiento
) { }