import { Estado, Genero } from '@app/models/user.model';

export const ROLES = {
  ADMIN: 'ADMIN',
  RECEPCION: 'RECEPCION',
  ENTRENADOR: 'ENTRENADOR',
  CLIENTE: 'CLIENTE',
} as const;

export const STORAGE_KEYS = {
  token: 'gym.token',
  expira: 'gym.expira',
  usuario: 'gym.usuario',
} as const;

export const PAGE_SIZE = 10;
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 72;
export const TELEFONO_REGEX = /^(\+?[0-9]{7,15})?$/;
export const PASSWORD_OPCIONAL_REGEX = /^(.{8,72})?$/;

export const GENEROS: { value: Genero; label: string }[] = [
  { value: 'MASCULINO', label: 'Masculino' },
  { value: 'FEMENINO', label: 'Femenino' },
  { value: 'OTRO', label: 'Otro' },
  { value: 'PREFIERO_NO_DECIR', label: 'Prefiero no decir' },
];

export const ESTADOS: { value: Estado; label: string }[] = [
  { value: 'ACTIVO', label: 'Activo' },
  { value: 'INACTIVO', label: 'Inactivo' },
];