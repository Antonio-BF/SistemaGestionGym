import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '@app/services/session.service';

/** Evita que un usuario autenticado vuelva al login. */
export const guestGuard: CanActivateFn = () =>
  inject(SessionService).isAuthenticated() ? inject(Router).createUrlTree(['/dashboard']) : true;