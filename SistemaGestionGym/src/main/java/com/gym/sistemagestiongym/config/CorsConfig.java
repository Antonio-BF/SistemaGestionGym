package com.gym.sistemagestiongym.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Habilita que Angular (ejecutándose en un puerto distinto, típicamente 4200)
 * pueda consumir la API sin ser bloqueado por la política same-origin del navegador.
 *
 * Nota: esto es independiente de la configuración CORS que también debe
 * declararse dentro de SecurityConfig (Proceso 1) — Spring Security intercepta
 * las peticiones ANTES de que lleguen a esta capa MVC, así que cuando agregues
 * SecurityConfig deberás registrar un CorsConfigurationSource allí también,
 * apuntando a este mismo origen.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(allowedOrigins.split(","))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}