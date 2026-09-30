package com.gym.sistemagestiongym.dtos.rol;

import com.gym.sistemagestiongym.model.Rol;

public record RolResponse(
        Integer id,
        String nombre
) {
    //Mapper
    public static RolResponse from(Rol rol){
        return new RolResponse(
                rol.getId(),
                rol.getNombre()
        );
    }
}
