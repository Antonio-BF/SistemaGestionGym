package com.gym.sistemagestiongym.dtos.usuario;

import com.gym.sistemagestiongym.model.enums.Genero;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

import static com.gym.sistemagestiongym.dtos.usuario.UsuarioReglas.*;

public record UsuarioCreateRequest(
        @NotBlank(message = "Ingrese el nombre")
        @Size(max = NOMBRE_MAX, message = "El nombre no puede exceder 100 caracteres")
        String nombre,

        @NotBlank(message = "Ingrese el apellido")
        @Size(max = NOMBRE_MAX, message = "El apellido no puede exceder 100 caracteres")
        String apellido,

        @NotBlank(message = "Ingrese el email")
        @Email(message = "El email no tiene un formato válido")
        @Size(max = EMAIL_MAX, message = "El email no puede exceder 150 caracteres")
        String email,

        @NotBlank(message = "Ingrese una contraseña")
        @Size(min = PASSWORD_MIN, max = PASSWORD_MAX, message = MSG_PASSWORD)
        String password,

        @Pattern(regexp = TELEFONO_REGEX, message = MSG_TELEFONO)
        String telefono,

        Genero genero,

        @Past(message = "La fecha de nacimiento debe ser pasada")
        LocalDate fechaNacimiento,

        @NotNull(message = "Seleccione un rol")
        Integer rolId
) { }