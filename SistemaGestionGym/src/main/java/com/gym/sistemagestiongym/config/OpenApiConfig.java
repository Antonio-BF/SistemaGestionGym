package com.gym.sistemagestiongym.config;


import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Documentación interactiva de la API (accesible en /swagger-ui.html).
 *
 * Se define el esquema de seguridad "bearerAuth" desde ahora, aunque el login
 * JWT recién se implementa en el Proceso 1, para que Swagger UI ya muestre el
 * botón "Authorize" listo para usar apenas exista el endpoint de login —
 * evita tener que volver a tocar esta clase más adelante.
 */
@Configuration
public class OpenApiConfig {

    private static final String ESQUEMA_BEARER = "bearerAuth";

    @Bean
    public OpenAPI gymManagementOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API - Sistema de Gestión de Gimnasio")
                        .description("""
                                API REST para el control de acceso por membresía, punto de venta
                                con control de stock, reservas de clases con control de cupos y
                                detección de clientes en riesgo de abandono.
                                """)
                        .version("v1.0"))
                .addSecurityItem(new SecurityRequirement().addList(ESQUEMA_BEARER))
                .components(new Components()
                        .addSecuritySchemes(ESQUEMA_BEARER, new SecurityScheme()
                                .name(ESQUEMA_BEARER)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}