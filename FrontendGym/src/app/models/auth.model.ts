export interface LoginRequest { email: string; password: string; }

export interface UsuarioSesion {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string; // ADMIN | RECEPCION | ENTRENADOR | CLIENTE (u otros creados en /roles)
}

export interface AuthResponse {
  token: string;
  tipo: string;
  expiraEnMs: number;
  usuario: UsuarioSesion;
}