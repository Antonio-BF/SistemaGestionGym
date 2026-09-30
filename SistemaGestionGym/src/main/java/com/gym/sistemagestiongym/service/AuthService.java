package com.gym.sistemagestiongym.service;

import com.gym.sistemagestiongym.dtos.auth.AuthResponse;
import com.gym.sistemagestiongym.dtos.auth.LoginRequest;
import com.gym.sistemagestiongym.dtos.auth.RegisterRequest;
import com.gym.sistemagestiongym.dtos.auth.UsuarioSesionResponse;
import com.gym.sistemagestiongym.exception.RecursoDuplicadoException;
import com.gym.sistemagestiongym.model.Rol;
import com.gym.sistemagestiongym.model.Usuario;
import com.gym.sistemagestiongym.repository.RolRepository;
import com.gym.sistemagestiongym.repository.UsuarioRepository;
import com.gym.sistemagestiongym.security.JwtProvider;
import com.gym.sistemagestiongym.service.validacion.UsuarioValidator;
import com.gym.sistemagestiongym.util.EmailUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String ROL_CLIENTE = "CLIENTE";

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final UsuarioValidator usuarioValidator;

    /**
     * Si las credenciales son incorrectas, authenticate() lanza
     * BadCredentialsException (o DisabledException si el usuario está INACTIVO)
     * y la transacción termina SIN tocar fecha_ultimo_acceso.
     */
    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email =  EmailUtils.normalizar(request.email());

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.password()));

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Credenciales inválidas"));

        usuario.setFechaUltimoAcceso(LocalDateTime.now());

        return construirRespuesta(usuario);
    }

    @Transactional
    public AuthResponse registrar(RegisterRequest request) {
        String email = EmailUtils.normalizar(request.email());

        usuarioValidator.validarEmailDisponible(email);

        Rol rolCliente = rolRepository.findByNombreIgnoreCase(ROL_CLIENTE)
                .orElseThrow(() -> new IllegalStateException(
                        "Configuración inválida: no existe el rol " + ROL_CLIENTE));

        Usuario usuario = new Usuario();
        usuario.setRol(rolCliente);
        usuario.setNombre(request.nombre().trim());
        usuario.setApellido(request.apellido().trim());
        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(request.password()));
        usuario.setTelefono(request.telefono());
        usuario.setFechaNacimiento(request.fechaNacimiento());
        if (request.genero() != null) {
            usuario.setGenero(request.genero());
        }
        usuario.setFechaUltimoAcceso(LocalDateTime.now());

        return construirRespuesta(usuarioRepository.save(usuario));
    }

    private AuthResponse construirRespuesta(Usuario usuario) {
        return new AuthResponse(
                jwtProvider.generarToken(usuario.getEmail()),
                "Bearer",
                jwtProvider.getExpirationMs(),
                UsuarioSesionResponse.desde(usuario));
    }
}