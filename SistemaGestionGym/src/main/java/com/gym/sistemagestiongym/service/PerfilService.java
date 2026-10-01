package com.gym.sistemagestiongym.service;

import com.gym.sistemagestiongym.dtos.usuario.CambioPasswordRequest;
import com.gym.sistemagestiongym.dtos.usuario.PerfilUpdateRequest;
import com.gym.sistemagestiongym.dtos.usuario.UsuarioResponse;
import com.gym.sistemagestiongym.exception.SolicitudInvalidaException;
import com.gym.sistemagestiongym.model.Usuario;
import com.gym.sistemagestiongym.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Autoservicio: el usuario solo opera sobre SÍ MISMO. La identidad viene del token
 * (nunca de un id en la URL o el body), por lo que no hay forma de tocar a otro usuario.
 */
@Service
@RequiredArgsConstructor
public class PerfilService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UsuarioResponse obtenerPerfil(String emailAutenticado) {
        return UsuarioResponse.from(obtenerAutenticado(emailAutenticado));
    }

    @Transactional
    public UsuarioResponse actualizarPerfil(String emailAutenticado, PerfilUpdateRequest request) {
        Usuario usuario = obtenerAutenticado(emailAutenticado);
        usuario.actualizarDatosBasicos(request.nombre(), request.apellido(), request.telefono(),
                request.genero(), request.fechaNacimiento());
        return UsuarioResponse.from(usuarioRepository.save(usuario));
    }

    @Transactional
    public void cambiarPassword(String emailAutenticado, CambioPasswordRequest request) {
        Usuario usuario = obtenerAutenticado(emailAutenticado);

        // 400 y no 401: un 401 haría que el interceptor de Angular cierre la sesión
        if (!passwordEncoder.matches(request.passwordActual(), usuario.getPassword())) {
            throw new SolicitudInvalidaException("La contraseña actual es incorrecta");
        }
        if (passwordEncoder.matches(request.passwordNueva(), usuario.getPassword())) {
            throw new SolicitudInvalidaException("La nueva contraseña debe ser distinta a la actual");
        }
        usuario.setPassword(passwordEncoder.encode(request.passwordNueva()));   // dirty checking
    }

    /** Si el token es válido pero el usuario ya no existe, la sesión dejó de ser válida: 401. */
    private Usuario obtenerAutenticado(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("El usuario autenticado ya no existe"));
    }
}