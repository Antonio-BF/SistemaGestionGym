package com.gym.sistemagestiongym.util;

import java.util.Locale;

public final class EmailUtils {

    private EmailUtils() { }

    /** Locale.ROOT evita resultados distintos según el idioma del servidor. */
    public static String normalizar(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}