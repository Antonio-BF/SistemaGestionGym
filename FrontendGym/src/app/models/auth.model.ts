import { Genero } from './user.model';

export interface LoginRequest { email: string; password: string; }

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
  genero?: Genero;
  fechaNacimiento?: string | null;
}

export interface UsuarioSesion {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string; 
}

export interface AuthResponse {
  token: string;
  tipo: string;
  expiraEnMs: number;
  usuario: UsuarioSesion;
}

/** Lo que se persiste: expiraEn es un timestamp absoluto (ms). */
export interface StoredSession { token: string; expiraEn: number; usuario: UsuarioSesion; }