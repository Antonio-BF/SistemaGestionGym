package com.gym.sistemagestiongym.repository;

import com.gym.sistemagestiongym.model.Usuario;
import com.gym.sistemagestiongym.model.enums.Estado;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, Integer id);
    boolean existsByRolId(Integer rolId);

    /**
     * Cada parámetro null desactiva su condición.
     * :q llega ya en minúsculas y con comodines (%texto%).
     * ESCAPE '!' permite que un "%" o "_" escrito por el usuario se busque como texto literal.
     */
    @EntityGraph(attributePaths = "rol")   // un solo JOIN en lugar de un select por rol
    @Query("""
            SELECT u FROM Usuario u
            WHERE (:rolId IS NULL OR u.rol.id = :rolId)
              AND (:estado IS NULL OR u.estado = :estado)
              AND (:q IS NULL
                   OR LOWER(u.nombre) LIKE :q ESCAPE '!'
                   OR LOWER(u.apellido) LIKE :q ESCAPE '!'
                   OR LOWER(u.email) LIKE :q ESCAPE '!'
                   OR LOWER(CONCAT(u.nombre, ' ', u.apellido)) LIKE :q ESCAPE '!')
            ORDER BY u.estado ASC, u.nombre ASC, u.apellido ASC
            """)
    Page<Usuario> buscar(@Param("q") String q,
                         @Param("rolId") Integer rolId,
                         @Param("estado") Estado estado,
                         Pageable pageable);
}