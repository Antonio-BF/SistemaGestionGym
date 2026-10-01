import { effect, inject, Injectable } from '@angular/core';
import { catchError, Observable, shareReplay, tap, throwError } from 'rxjs';
import { API_PATHS } from '@app/core/constants/api.constants';
import { Rol, RolRequest } from '@app/models/role.model';
import { ApiClient } from './api-client.service';
import { SessionService } from './session.service';

/** Los roles se piden una vez y se comparten (dashboard, filtros, formulario). */
@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly api = inject(ApiClient);
  private readonly session = inject(SessionService);
  private readonly path = API_PATHS.roles;
  private cache$: Observable<Rol[]> | null = null;

  constructor() {
    // Otra sesión puede tener otros permisos: la caché no se arrastra entre usuarios
    effect(() => {
      this.session.user();
      this.cache$ = null;
    });
  }

  listar(): Observable<Rol[]> {
    return (this.cache$ ??= this.api.get<Rol[]>(this.path).pipe(
      catchError((e: unknown) => {
        this.cache$ = null; 
        return throwError(() => e);
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    ));
  }

  crear(req: RolRequest): Observable<Rol> {
    return this.api.post<Rol>(this.path, req).pipe(tap(() => (this.cache$ = null)));
  }

  eliminar(id: number): Observable<void> {
    return this.api.delete<void>(`${this.path}/${id}`).pipe(tap(() => (this.cache$ = null)));
  }
}