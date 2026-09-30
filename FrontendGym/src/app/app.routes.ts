import { Routes } from '@angular/router';
import { MainLayout } from './components/layout/main-layout/main-layout';
import { ROLES } from './core/constants/app.constants';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'usuarios',
        canActivate: [roleGuard],
        data: { roles: [ROLES.ADMIN, ROLES.RECEPCION] },
        loadComponent: () => import('./pages/users/user-list/user-list').then((m) => m.UserList),
      },
      {
        path: 'roles',
        canActivate: [roleGuard],
        data: { roles: [ROLES.ADMIN] },
        loadComponent: () => import('./pages/roles/role-list/role-list').then((m) => m.RoleList),
      },
      {
        path: 'perfil',
        loadComponent: () => import('./pages/profile/profile').then((m) =>m.Profile),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];