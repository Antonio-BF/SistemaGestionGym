import { Option, Tone } from '@app/models/common.model';
import { Estado, Genero } from '@app/models/user.model';

export const APP_NAME = 'Gimnasio CIBERTEC';
export const STORAGE_KEY = 'gym.session';
export const PAGE_SIZE = 10;
export const SEARCH_DEBOUNCE_MS = 350;
export const TOAST_DURATION_MS = 4500;

export const ROLES = {
  ADMIN: 'ADMIN',
  RECEPCION: 'RECEPCION',
  ENTRENADOR: 'ENTRENADOR',
  CLIENTE: 'CLIENTE',
} as const;

/**
 * Espejo de SecurityConfig (backend). Única fuente para rutas, menú y botones:
 * si cambia una regla del backend, se cambia aquí y se propaga a toda la UI.
 */
export const PERMISOS = {
  usuarios: { ver: [ROLES.ADMIN, ROLES.RECEPCION], gestionar: [ROLES.ADMIN] },
  roles: { gestionar: [ROLES.ADMIN] }, // incluye GET /api/roles
} as const;

/** Mismas reglas que UsuarioReglas / DTOs del backend. */
export const REGLAS = {
  nombreMax: 100,
  emailMax: 150,
  passwordMin: 8,
  passwordMax: 72,
  rolNombreMax: 50,
  busquedaMax: 100,
} as const;

export const REGEX = {
  telefono: /^(\+?[0-9]{7,15})?$/,
  passwordOpcional: /^(.{8,72})?$/,
} as const;

export const MENSAJES = {
  telefono: 'Debe tener entre 7 y 15 dígitos',
  passwordOpcional: 'Debe tener entre 8 y 72 caracteres, o dejarse en blanco',
} as const;

export const GENERO_OPTIONS: readonly Option<Genero>[] = [
  { value: 'MASCULINO', label: 'Masculino' },
  { value: 'FEMENINO', label: 'Femenino' },
  { value: 'OTRO', label: 'Otro' },
  { value: 'PREFIERO_NO_DECIR', label: 'Prefiero no decir' },
];

export const ESTADO_OPTIONS: readonly Option<Estado>[] = [
  { value: 'ACTIVO', label: 'Activo' },
  { value: 'INACTIVO', label: 'Inactivo' },
];

export const ESTADO_TONE: Record<Estado, Tone> = { ACTIVO: 'green', INACTIVO: 'gray' };