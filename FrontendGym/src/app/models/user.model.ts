export type Genero = 'MASCULINO' | 'FEMENINO' | 'OTRO' | 'PREFIERO_NO_DECIR';
export type Estado = 'ACTIVO' | 'INACTIVO';

/** UsuarioResponse del backend. Fechas: LocalDate 'YYYY-MM-DD', LocalDateTime ISO sin zona. */
export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  genero: Genero;
  fechaNacimiento: string | null;
  rolId: number;
  rol: string;
  fechaUltimoAcceso: string | null;
  estado: Estado;
  fechaRegistro: string;
  fechaActualizacion: string;
}

export interface UsuarioCreateRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono: string;
  genero: Genero;
  fechaNacimiento: string | null;
  rolId: number;
}

export interface UsuarioUpdateRequest extends Omit<UsuarioCreateRequest, 'password'> {
  password?: string | null; // vacío/null => conserva la actual
}

export interface PerfilUpdateRequest {
  nombre: string;
  apellido: string;
  telefono: string;
  genero: Genero;
  fechaNacimiento: string | null;
}

export interface CambioPasswordRequest { passwordActual: string; passwordNueva: string; }

export interface UsuarioFiltros {
  q?: string;
  rolId?: number | null;
  estado?: Estado | '';
  page?: number;
  size?: number;
}