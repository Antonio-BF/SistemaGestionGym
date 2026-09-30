package com.gym.sistemagestiongym.controller;

import com.gym.sistemagestiongym.dtos.common.PaginaResponse;
import com.gym.sistemagestiongym.dtos.usuario.UsuarioCreateRequest;
import com.gym.sistemagestiongym.dtos.usuario.UsuarioResponse;
import com.gym.sistemagestiongym.dtos.usuario.UsuarioUpdateRequest;
import com.gym.sistemagestiongym.model.enums.Estado;
import com.gym.sistemagestiongym.service.UsuarioService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    public PaginaResponse<UsuarioResponse> listar(
            @RequestParam(required = false)
            @Size(max = 100, message = "La búsqueda no puede exceder 100 caracteres") String q,
            @RequestParam(required = false) Integer rolId,
            @RequestParam(required = false) Estado estado,
            @RequestParam(defaultValue = "0")
            @Min(value = 0, message = "La página no puede ser negativa") int page,
            @RequestParam(defaultValue = "10")
            @Min(value = 1, message = "El tamaño mínimo es 1")
            @Max(value = 100, message = "El tamaño máximo es 100") int size) {
        return usuarioService.listarUsuarios(q, rolId, estado, page, size);
    }

    @GetMapping("/{id}")
    public UsuarioResponse obtener(@PathVariable Integer id) {
        return usuarioService.buscarUsuarioPorId(id);
    }

    @PostMapping
    public ResponseEntity<UsuarioResponse> crear(@Valid @RequestBody UsuarioCreateRequest request) {
        UsuarioResponse creado = usuarioService.crearUsuario(request);
        URI ubicacion = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(creado.id()).toUri();
        return ResponseEntity.created(ubicacion).body(creado);
    }

    @PutMapping("/{id}")
    public UsuarioResponse actualizar(@PathVariable Integer id,
                                      @Valid @RequestBody UsuarioUpdateRequest request,
                                      @AuthenticationPrincipal UserDetails admin) {
        return usuarioService.actualizarUsuario(id, request, admin.getUsername());
    }

    @PatchMapping("/{id}/activar")
    public UsuarioResponse activar(@PathVariable Integer id) {
        return usuarioService.activarUsuario(id);
    }

    @PatchMapping("/{id}/desactivar")
    public UsuarioResponse desactivar(@PathVariable Integer id,
                                      @AuthenticationPrincipal UserDetails admin) {
        return usuarioService.desactivarUsuario(id, admin.getUsername());
    }
}