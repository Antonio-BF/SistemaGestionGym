package com.gym.sistemagestiongym.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * NO es @Component a propósito: Spring Boot registraría automáticamente
 * cualquier Filter-bean también en la cadena del servlet (fuera de Spring
 * Security). Se instancia manualmente en SecurityConfig.
 * <p>
 * Si el token falta o es inválido NO responde error: simplemente deja el
 * contexto sin autenticar y RestSecurityErrorHandler devuelve el 401 en
 * los endpoints protegidos (los públicos siguen funcionando).
 */
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final String PREFIJO = "Bearer ";

    private final JwtProvider jwtProvider;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (header != null && header.startsWith(PREFIJO)
                && SecurityContextHolder.getContext().getAuthentication() == null) {

            jwtProvider.obtenerEmailSiValido(header.substring(PREFIJO.length())).ifPresent(email -> {
                try {
                    UserDetails ud = userDetailsService.loadUserByUsername(email);
                    if (ud.isEnabled()) {
                        var auth = new UsernamePasswordAuthenticationToken(ud, null, ud.getAuthorities());
                        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                } catch (UsernameNotFoundException ignorado) {
                    // Usuario eliminado tras emitir el token: queda sin autenticar
                }
            });
        }
        chain.doFilter(request, response);
    }
}