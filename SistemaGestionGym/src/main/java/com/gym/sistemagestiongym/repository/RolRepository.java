package com.gym.sistemagestiongym.repository;

import com.gym.sistemagestiongym.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RolRepository extends JpaRepository<Rol, Integer> {
    boolean existsByNombreIgnoreCase(String nombre);
    Optional<Rol> findByNombreIgnoreCase(String nombre);
}
