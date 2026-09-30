package com.gym.sistemagestiongym.service.validacion;

import com.gym.sistemagestiongym.exception.RecursoDuplicadoException;
import com.gym.sistemagestiongym.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/** Reglas de unicidad compartidas por AuthService (registro) y UsuarioService (alta/edición). */
@Component
@RequiredArgsConstructor
public class UsuarioValidator {

    private static final String MSG_EMAIL_DUPLICADO = "El email ya está registrado";

    private final UsuarioRepository usuarioRepository;

    /** Alta: el email no debe existir. Recibe el email ya normalizado. */
    public void validarEmailDisponible(String email) {
        if (usuarioRepository.existsByEmail(email)) {
            throw new RecursoDuplicadoException(MSG_EMAIL_DUPLICADO);
        }
    }

    /** Edición: el email puede repetirse solo con el propio usuario. */
    public void validarEmailDisponible(String email, Integer idUsuarioExcluido) {
        if (usuarioRepository.existsByEmailAndIdNot(email, idUsuarioExcluido)) {
            throw new RecursoDuplicadoException(MSG_EMAIL_DUPLICADO);
        }
    }
}