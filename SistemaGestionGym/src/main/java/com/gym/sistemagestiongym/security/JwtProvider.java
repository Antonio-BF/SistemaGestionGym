package com.gym.sistemagestiongym.security;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Optional;

@Slf4j
@Component
public class JwtProvider {

    private final SecretKey key;
    private final long expirationMs;

    public JwtProvider(@Value("${app.jwt.secret}") String secretBase64,
                       @Value("${app.jwt.expiration-ms}") long expirationMs) {
        // El secreto está en Base64 (32 bytes => HS256)
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretBase64));
        this.expirationMs = expirationMs;
    }

    public String generarToken(String email) {
        Date ahora = new Date();
        return Jwts.builder()
                .subject(email)
                .issuedAt(ahora)
                .expiration(new Date(ahora.getTime() + expirationMs))
                .signWith(key)
                .compact();
    }

    /**
     * Valida firma y expiración y devuelve el email (subject) en UN solo parseo.
     * Vacío si el token es inválido, está manipulado o expiró.
     */
    public Optional<String> obtenerEmailSiValido(String token) {
        try {
            String subject = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getSubject();
            return Optional.ofNullable(subject);
        } catch (JwtException | IllegalArgumentException e) {
            log.debug("Token JWT rechazado: {}", e.getMessage());
            return Optional.empty();
        }
    }

    public long getExpirationMs() {
        return expirationMs;
    }
}