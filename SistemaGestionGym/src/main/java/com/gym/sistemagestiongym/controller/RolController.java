package com.gym.sistemagestiongym.controller;

import com.gym.sistemagestiongym.dtos.rol.RolRequest;
import com.gym.sistemagestiongym.dtos.rol.RolResponse;
import com.gym.sistemagestiongym.service.RolService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/roles")
public class RolController {
    private final RolService rolService;

    @GetMapping
    public ResponseEntity<List<RolResponse>> listarRoles() {
        return ResponseEntity.ok(rolService.listarRoles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RolResponse> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(rolService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<RolResponse> crearRol(@Valid @RequestBody RolRequest rolRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(rolService.registrarRol(rolRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarRol(@PathVariable Integer id) {
        rolService.eliminarRol(id);
        return ResponseEntity.noContent().build();
    }

}
