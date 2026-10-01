import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { SessionService } from '@app/services/session.service';

/**
 * canMatch: si el rol no alcanza, ni siquiera se descarga el chunk lazy.
 * Uso: { path: 'roles', canMatch: [requireRoles(PERMISOS.roles.gestionar)], ... }
 */
export const requireRoles = (roles: readonly string[]): CanMatchFn => () =>
  inject(SessionService).hasAnyRole(roles) || inject(Router).createUrlTree(['/dashboard']);