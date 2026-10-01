import { HttpContextToken } from '@angular/common/http';
import { InjectionToken } from '@angular/core';
import { environment } from '@env/environment';

/** Sustituible en pruebas con { provide: API_BASE_URL, useValue: '...' }. */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => environment.apiUrl,
});

export const API_PATHS = {
  auth: { login: '/auth/login', register: '/auth/register' },
  perfil: '/perfil',
  roles: '/roles',
  usuarios: '/usuarios',
} as const;

/** Petición pública: sin Authorization y sin cierre de sesión ante un 401. */
export const PUBLIC_REQUEST = new HttpContextToken<boolean>(() => false);