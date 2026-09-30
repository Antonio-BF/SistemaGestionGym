package com.gym.sistemagestiongym.service;

import com.gym.sistemagestiongym.dtos.common.PaginaResponse;
import com.gym.sistemagestiongym.dtos.usuario.UsuarioCreateRequest;
import com.gym.sistemagestiongym.dtos.usuario.UsuarioResponse;
import com.gym.sistemagestiongym.dtos.usuario.UsuarioUpdateRequest;
import com.gym.sistemagestiongym.exception.ConflictoEstadoException;
import com.gym.sistemagestiongym.exception.RecursoNoEncontradoException;
import com.gym.sistemagestiongym.exception.SolicitudInvalidaException;
import com.gym.sistemagestiongym.model.Rol;
import com.gym.sistemagestiongym.model.Usuario;
import com.gym.sistemagestiongym.model.enums.Estado;
import com.gym.sistemagestiongym.repository.RolRepository;
import com.gym.sistemagestiongym.repository.UsuarioRepository;
import com.gym.sistemagestiongym.service.validacion.UsuarioValidator;
import com.gym.sistemagestiongym.util.EmailUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

/** Gestión administrativa de usuarios. El autoservicio vive en PerfilService. */
@Service
@RequiredArgsConstructor
public class UsuarioService {

    private static final Sort ORDEN = Sort.by("apellido", "nombre", "id");   // id desempata: paginación estable

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioValidator usuarioValidator;

    // ---------------------------------------------------------------- consultas

    @Transactional(readOnly = true)
    public PaginaResponse<UsuarioResponse> listarUsuarios(String q, Integer rolId, Estado estado,
                                                          int pagina, int tamano) {
        Pageable pageable = PageRequest.of(pagina, tamano, ORDEN);
        Page<Usuario> resultado = usuarioRepository.buscar(patronBusqueda(q), rolId, estado, pageable);
        return PaginaResponse.from(resultado, UsuarioResponse::from);
    }

    @Transactional(readOnly = true)
    public UsuarioResponse buscarUsuarioPorId(Integer id) {
        return UsuarioResponse.from(obtenerEntidad(id));
    }

    // ---------------------------------------------------------------- comandos

    @Transactional
    public UsuarioResponse crearUsuario(UsuarioCreateRequest request) {
        String email = EmailUtils.normalizar(request.email());
        usuarioValidator.validarEmailDisponible(email);
        Rol rol = obtenerRol(request.rolId());

        Usuario usuario = new Usuario();
        usuario.actualizarDatosBasicos(request.nombre(), request.apellido(), request.telefono(),
                request.genero(), request.fechaNacimiento());
        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(request.password()));
        usuario.setRol(rol);

        // saveAndFlush: fuerza el INSERT y la relectura de fecha_registro antes de armar la respuesta
        return UsuarioResponse.from(usuarioRepository.saveAndFlush(usuario));
    }

    @Transactional
    public UsuarioResponse actualizarUsuario(Integer id, UsuarioUpdateRequest request, String emailAdminActual) {
        Usuario usuario = obtenerEntidad(id);
        boolean cuentaPropia = esCuentaPropia(usuario, emailAdminActual);
        String email = EmailUtils.normalizar(request.email());

        usuarioValidator.validarEmailDisponible(email, id);
        aplicarCambioDeRol(usuario, request.rolId(), cuentaPropia);
        aplicarCambioDePassword(usuario, request.password(), cuentaPropia);

        usuario.actualizarDatosBasicos(request.nombre(), request.apellido(), request.telefono(),
                request.genero(), request.fechaNacimiento());
        usuario.setEmail(email);

        return UsuarioResponse.from(usuarioRepository.saveAndFlush(usuario));
    }

    @Transactional
    public UsuarioResponse activarUsuario(Integer id) {
        return aplicarEstado(obtenerEntidad(id), Estado.ACTIVO);
    }

    @Transactional
    public UsuarioResponse desactivarUsuario(Integer id, String emailAdminActual) {
        Usuario usuario = obtenerEntidad(id);
        if (esCuentaPropia(usuario, emailAdminActual)) {
            throw new ConflictoEstadoException("No puedes desactivar tu propia cuenta");
        }
        return aplicarEstado(usuario, Estado.INACTIVO);
    }

    // ---------------------------------------------------------------- helpers privados

    private Usuario obtenerEntidad(Integer id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("usuario", id));
    }

    /** 400 y no 404: la URL es válida, lo inválido es un dato del cuerpo. */
    private Rol obtenerRol(Integer rolId) {
        return rolRepository.findById(rolId)
                .orElseThrow(() -> new SolicitudInvalidaException("El rol indicado no existe"));
    }

    private boolean esCuentaPropia(Usuario usuario, String emailAdminActual) {
        return usuario.getEmail().equalsIgnoreCase(emailAdminActual);
    }

    private void aplicarCambioDeRol(Usuario usuario, Integer nuevoRolId, boolean cuentaPropia) {
        if (usuario.getRol().getId().equals(nuevoRolId)) return;   // sin cambio, no se consulta la BD

        if (cuentaPropia) {
            throw new ConflictoEstadoException("No puedes cambiar tu propio rol");
        }
        usuario.setRol(obtenerRol(nuevoRolId));
    }

    /** Idempotente: si ya tiene ese estado no escribe nada. */
    private UsuarioResponse aplicarEstado(Usuario usuario, Estado nuevoEstado) {
        if (usuario.getEstado() != nuevoEstado) {
            usuario.setEstado(nuevoEstado);
            usuarioRepository.saveAndFlush(usuario);
        }
        return UsuarioResponse.from(usuario);
    }
    /** null o en blanco => se conserva la actual. Se cifra con el mismo PasswordEncoder del login. */
    private void aplicarCambioDePassword(Usuario usuario, String nuevaPassword, boolean cuentaPropia) {
        if (nuevaPassword == null || nuevaPassword.isBlank()) return;

        if (cuentaPropia) {
            throw new ConflictoEstadoException(
                    "Para cambiar tu propia contraseña usa tu perfil");
        }
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));   // dirty checking + saveAndFlush
    }

    /** null/vacío => sin filtro de texto. Si no, minúsculas, comodines y caracteres especiales escapados. */
    private String patronBusqueda(String q) {
        if (q == null || q.isBlank()) return null;
        String limpio = q.trim().toLowerCase(Locale.ROOT)
                .replace("!", "!!").replace("%", "!%").replace("_", "!_");
        return "%" + limpio + "%";
    }
}