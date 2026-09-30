package com.gym.sistemagestiongym.exception;

import com.gym.sistemagestiongym.dtos.error.ErrorResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Único handler para TODA excepción de negocio (400/403/404/409, según
     * el árbol de herencia). Cubre las que ya existen y las que agregues
     * en Proceso 2, 3 y 4 sin modificar esta clase — solo hace falta que
     * la excepción nueva extienda NegocioException (directa o indirectamente).
     */
    @ExceptionHandler(NegocioException.class)
    public ResponseEntity<ErrorResponseDTO> handleNegocioException(
            NegocioException ex, HttpServletRequest request) {
        return construirRespuesta(ex.getHttpStatus(), ex.getMessage(), request);
    }

    // --- Validación de Bean Validation (@Valid en los DTOs de entrada) ---

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> handleValidacion(
            MethodArgumentNotValidException ex, HttpServletRequest request) {

        Map<String, String> errores = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        fe -> fe.getDefaultMessage() != null ? fe.getDefaultMessage() : "valor inválido",
                        (existente, nuevo) -> existente
                ));

        ErrorResponseDTO body = ErrorResponseDTO.ofValidation(
                HttpStatus.BAD_REQUEST.value(), "Bad Request",
                "Uno o más campos no son válidos", request.getRequestURI(), errores);
        return ResponseEntity.badRequest().body(body);
    }

    // @Min/@Max/@Size sobre @RequestParam (validación de parámetros, Spring 6.1+)
    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<ErrorResponseDTO> handleValidacionParametros(
            HandlerMethodValidationException ex, HttpServletRequest request) {

        Map<String, String> errores = new LinkedHashMap<>();
        ex.getParameterValidationResults().forEach(resultado -> {
            String campo = resultado.getMethodParameter().getParameterName();
            resultado.getResolvableErrors().forEach(error ->
                    errores.putIfAbsent(campo != null ? campo : "parametro",
                            error.getDefaultMessage() != null ? error.getDefaultMessage() : "valor inválido"));
        });

        ErrorResponseDTO body = ErrorResponseDTO.ofValidation(
                HttpStatus.BAD_REQUEST.value(), "Bad Request",
                "Uno o más parámetros no son válidos", request.getRequestURI(), errores);
        return ResponseEntity.badRequest().body(body);
    }

    // ?estado=XYZ, ?rolId=abc, /usuarios/abc
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponseDTO> handleTipoInvalido(
            MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
        return construirRespuesta(HttpStatus.BAD_REQUEST,
                "El parámetro '%s' tiene un valor inválido".formatted(ex.getName()), request);
    }


    // --- Violaciones de integridad de BD no atrapadas antes en el servicio
    //     (red de seguridad: UNIQUE KEY, CHECK constraints del .sql) ---

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponseDTO> handleIntegridadDatos(
            DataIntegrityViolationException ex, HttpServletRequest request) {
        return construirRespuesta(HttpStatus.CONFLICT,
                "La operación viola una restricción de integridad de datos (duplicado o valor no permitido)",
                request);
    }
    // JSON mal formado, tipos incorrectos, enum inválido (ej. genero: "XYZ")
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponseDTO> handleJsonIlegible(
            HttpMessageNotReadableException ex, HttpServletRequest request) {
        return construirRespuesta(HttpStatus.BAD_REQUEST,
                "El cuerpo de la petición es inválido o tiene valores no permitidos", request);
    }


    // --- Seguridad a nivel de framework (autenticación/autorización por rol) ---

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponseDTO> handleCredencialesInvalidas(
            BadCredentialsException ex, HttpServletRequest request) {
        return construirRespuesta(HttpStatus.UNAUTHORIZED, "Email o contraseña incorrectos", request);
    }
    // Usuario con estado INACTIVO
    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ErrorResponseDTO> handleCuentaInactiva(
            DisabledException ex, HttpServletRequest request) {
        return construirRespuesta(HttpStatus.FORBIDDEN,
                "Tu cuenta está inactiva. Contacta con administración", request);
    }
    // Cualquier otra AuthenticationException (antes caía en el 500)
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponseDTO> handleAutenticacion(
            AuthenticationException ex, HttpServletRequest request) {
        return construirRespuesta(HttpStatus.UNAUTHORIZED, "No se pudo autenticar la solicitud", request);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponseDTO> handleAccesoDenegado(
            AccessDeniedException ex, HttpServletRequest request) {
        return construirRespuesta(HttpStatus.FORBIDDEN, "No tienes permisos para realizar esta acción", request);
    }

    // --- Fallback genérico: nunca debe filtrarse un stacktrace crudo a Angular ---

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleGenerico(
            Exception ex, HttpServletRequest request) {
        return construirRespuesta(HttpStatus.INTERNAL_SERVER_ERROR,"Ocurrió un error interno. Inténtalo nuevamente", request);
    }

    private ResponseEntity<ErrorResponseDTO> construirRespuesta(
            HttpStatus status, String message, HttpServletRequest request) {
        ErrorResponseDTO body = ErrorResponseDTO.of(
                status.value(), status.getReasonPhrase(), message, request.getRequestURI());
        return ResponseEntity.status(status).body(body);
    }
}