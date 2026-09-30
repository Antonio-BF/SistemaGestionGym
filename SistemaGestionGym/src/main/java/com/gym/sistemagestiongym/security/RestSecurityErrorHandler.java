package com.gym.sistemagestiongym.security;

import com.gym.sistemagestiongym.dtos.error.ErrorResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class RestSecurityErrorHandler implements AuthenticationEntryPoint, AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    /** Sin token, token inválido o expirado -> 401 */
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException ex) throws IOException {
        escribir(request, response, HttpStatus.UNAUTHORIZED,
                "Autenticación requerida o token inválido/expirado");
    }

    /** Autenticado pero con rol insuficiente en una regla URL -> 403 */
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException ex) throws IOException {
        escribir(request, response, HttpStatus.FORBIDDEN,
                "No tienes permisos para realizar esta acción");
    }

    private void escribir(HttpServletRequest request, HttpServletResponse response,
                          HttpStatus status, String mensaje) throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        objectMapper.writeValue(response.getWriter(),
                ErrorResponseDTO.of(status.value(), status.getReasonPhrase(),
                        mensaje, request.getRequestURI()));
    }
}