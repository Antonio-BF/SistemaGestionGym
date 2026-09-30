package com.gym.sistemagestiongym.controller;

import com.gym.sistemagestiongym.dtos.usuario.CambioPasswordRequest;
import com.gym.sistemagestiongym.dtos.usuario.PerfilUpdateRequest;
import com.gym.sistemagestiongym.dtos.usuario.UsuarioResponse;
import com.gym.sistemagestiongym.service.PerfilService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/** Cualquier usuario autenticado (ADMIN, RECEPCION, ENTRENADOR, CLIENTE), solo sobre sí mismo. */
@RestController
@RequestMapping("/api/perfil")
@RequiredArgsConstructor
public class PerfilController {

    private final PerfilService perfilService;

    @GetMapping
    public UsuarioResponse obtener(@AuthenticationPrincipal UserDetails usuario) {
        return perfilService.obtenerPerfil(usuario.getUsername());
    }

    @PutMapping
    public UsuarioResponse actualizar(@AuthenticationPrincipal UserDetails usuario,
                                      @Valid @RequestBody PerfilUpdateRequest request) {
        return perfilService.actualizarPerfil(usuario.getUsername(), request);
    }

    @PatchMapping("/password")
    public ResponseEntity<Void> cambiarPassword(@AuthenticationPrincipal UserDetails usuario,
                                                @Valid @RequestBody CambioPasswordRequest request) {
        perfilService.cambiarPassword(usuario.getUsername(), request);
        return ResponseEntity.noContent().build();
    }
}