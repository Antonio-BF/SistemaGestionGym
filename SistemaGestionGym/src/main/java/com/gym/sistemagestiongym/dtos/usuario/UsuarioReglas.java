package com.gym.sistemagestiongym.dtos.usuario;

public final class UsuarioReglas {

    private UsuarioReglas() { }

    public static final int NOMBRE_MAX = 100;
    public static final int EMAIL_MAX = 150;

    public static final int PASSWORD_MIN = 8;
    public static final int PASSWORD_MAX = 72;   // límite real de BCrypt
    public static final String MSG_PASSWORD = "La contraseña debe tener entre 8 y 72 caracteres";


    // El grupo opcional permite "" (formularios Angular con campo vacío); la entidad lo guarda como null
    public static final String TELEFONO_REGEX = "^(\\+?[0-9]{7,15})?$";
    public static final String MSG_TELEFONO = "El teléfono debe tener entre 7 y 15 dígitos";
    public static final String PASSWORD_OPCIONAL_REGEX = "^(.{8,72})?$";
    public static final String MSG_PASSWORD_OPCIONAL =
            "La contraseña debe tener entre 8 y 72 caracteres, o dejarse en blanco para conservar la actual";
}