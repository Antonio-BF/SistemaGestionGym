import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '@app/services/session.service';

/** Úsalo en canActivate y canActivateChild: revalida en cada navegación interna. */
export const authGuard: CanActivateFn = (_route, state) =>
  inject(SessionService).isAuthenticated()
    ? true
    : inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
