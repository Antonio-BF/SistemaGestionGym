import type { IconName } from '@app/components/shared/icon';
import { PERMISOS } from './app.constants';

export interface NavItem {
  label: string;
  route: string;
  icon: IconName;
  roles?: readonly string[]; // sin roles => visible para todos
}

/** Para sumar un módulo (membresías, POS, reservas…) basta con agregar un ítem aquí. */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Dashboard', route: '/dashboard', icon: 'grid' },
  { label: 'Usuarios', route: '/usuarios', icon: 'users', roles: PERMISOS.usuarios.ver },
  { label: 'Roles', route: '/roles', icon: 'shield', roles: PERMISOS.roles.gestionar },
  { label: 'Mi perfil', route: '/perfil', icon: 'user' },
];