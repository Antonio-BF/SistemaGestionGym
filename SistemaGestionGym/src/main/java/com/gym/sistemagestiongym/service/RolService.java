package com.gym.sistemagestiongym.service;

import com.gym.sistemagestiongym.dtos.rol.RolRequest;
import com.gym.sistemagestiongym.dtos.rol.RolResponse;
import com.gym.sistemagestiongym.exception.ConflictoEstadoException;
import com.gym.sistemagestiongym.exception.RecursoDuplicadoException;
import com.gym.sistemagestiongym.exception.RecursoNoEncontradoException;
import com.gym.sistemagestiongym.model.Rol;
import com.gym.sistemagestiongym.repository.RolRepository;
import com.gym.sistemagestiongym.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RolService {

    public final RolRepository rolRepository;
    public final UsuarioRepository usuarioRepository;


    @Transactional(readOnly = true)
    public List<RolResponse> listarRoles() {
        return rolRepository.findAll().stream()
                .map(RolResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public RolResponse obtenerPorId(Integer id) {
        return rolRepository.findById(id).map(RolResponse::from)
                .orElseThrow(()-> new RecursoNoEncontradoException("rol", id));
    }

    @Transactional
    public RolResponse registrarRol(RolRequest request) {
        var nombre = request.nombre().trim();
        if (rolRepository.existsByNombreIgnoreCase(nombre))
            throw new RecursoDuplicadoException("El nombre ya esta registrado");

        Rol rol = new Rol();
        rol.setNombre(nombre.toUpperCase());

        return RolResponse.from(rolRepository.save(rol));

    }

    @Transactional
    public void eliminarRol(Integer id) {
        var rol = rolRepository.findById(id)
                .orElseThrow(()-> new RecursoNoEncontradoException("rol", id));

        if (usuarioRepository.existsByRolId(id))
            throw new ConflictoEstadoException("No se puede eliminar el rol porque tiene usuarios asociados");

        rolRepository.delete(rol);
    }
}
