import { IconName } from '@app/components/shared/icons/icons';
import { ROLES } from './app.constants';


export interface NavItem {
  label: string;
  route: string;
  icon: IconName;
  roles?: readonly string[]; // sin roles => visible para todos
}

/** Para sumar módulos (membresías, POS, reservas...) basta con agregar un ítem. */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', route: '/dashboard', icon: 'grid' },
  { label: 'Usuarios', route: '/usuarios', icon: 'users', roles: [ROLES.ADMIN, ROLES.RECEPCION] },
  { label: 'Roles', route: '/roles', icon: 'shield', roles: [ROLES.ADMIN] },
  { label: 'Mi perfil', route: '/perfil', icon: 'user' },
];