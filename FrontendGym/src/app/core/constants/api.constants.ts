import { InjectionToken } from '@angular/core';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

export const API_PATHS = {
  login: '/auth/login',
  register: '/auth/register',
  perfil: '/perfil',
  roles: '/roles',
  usuarios: '/usuarios',
} as const;