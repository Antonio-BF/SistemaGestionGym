import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { API_BASE_URL, API_PATHS } from '@app/core/constants/api.constants';
import { AuthService } from '@app/services/auth.service';
import { ToastService } from '@app/services/toast.service';

/**
 * 401 fuera de /auth => sesión inválida: cierra sesión.
 * Sin conexión (0) o 5xx => aviso global. 400/403/404/409 los maneja cada pantalla.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const base = inject(API_BASE_URL);
    const auth = inject(AuthService);
    const toast = inject(ToastService);
    const esAuth = req.url === base + API_PATHS.login || req.url === base + API_PATHS.register;

    return next(req).pipe(
        catchError((err: unknown) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401 && !esAuth) {
                    auth.logout();
                    toast.info('Tu sesión expiró. Inicia sesión nuevamente.');
                } else if (err.status === 0) {
                    toast.error('No se pudo conectar con el servidor');
                } else if (err.status >= 500) {
                    toast.error('Error interno del servidor. Inténtalo nuevamente');
                }
            }
            return throwError(() => err);
        }),
    );
};