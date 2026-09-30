import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const roles = (route.data['roles'] as string[] | undefined) ?? [];
  return inject(AuthService).hasAnyRole(roles) || inject(Router).createUrlTree(['/dashboard']);
};