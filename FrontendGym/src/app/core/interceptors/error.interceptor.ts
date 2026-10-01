import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { PUBLIC_REQUEST } from '@app/core/constants/api.constants';
import { ApiError } from '@app/models/error.model';
import { SessionService } from '@app/services/session.service';

/**
 * Punto único de traducción HttpErrorResponse -> ApiError.
 * Solo gestiona la sesión: la presentación del error (toast, inline, campo) es de cada pantalla.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const session = inject(SessionService);
    const esPublica = req.context.get(PUBLIC_REQUEST);

    return next(req).pipe(
        catchError((e: unknown) => {
            if (!(e instanceof HttpErrorResponse)) return throwError(() => e);
            const error = ApiError.fromHttp(e);
            // isAuthenticated() evita repetir logout/toast cuando varias peticiones fallan a la vez
            if (error.kind === 'unauthorized' && !esPublica && session.isAuthenticated()) session.expire();
            return throwError(() => error);
        }),
    );
};