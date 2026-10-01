import { Routes } from '@angular/router';
import { MainLayout } from './components/layout/main-layout/main-layout';
import { PERMISOS } from './core/constants/app.constants';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { requireRoles } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Iniciar sesión',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'usuarios',
        title: 'Usuarios',
        canMatch: [requireRoles(PERMISOS.usuarios.ver)],
        loadComponent: () => import('./pages/users/user-list/user-list').then((m) => m.UserList),
      },
      {
        path: 'roles',
        title: 'Roles',
        canMatch: [requireRoles(PERMISOS.roles.gestionar)],
        loadComponent: () => import('./pages/roles/role-list/role-list').then((m) => m.RoleList),
      },
      {
        path: 'perfil',
        title: 'Mi perfil',
        loadComponent: () => import('./pages/profile/profile').then((m) => m.Profile),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];