import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { ConteoRol, ResumenUsuarios } from '@app/models/dashboard.model';
import { UsuarioFiltros } from '@app/models/user.model';
import { RoleService } from './role.service';
import { UserService } from './user.service';

/**
 * Métricas iniciales calculadas con los endpoints actuales. Cuando exista
 * GET /api/reportes/dashboard solo se reemplaza este servicio.
 */
@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly users = inject(UserService);
  private readonly roles = inject(RoleService);

  obtenerResumenUsuarios(incluirRoles: boolean): Observable<ResumenUsuarios> {
    const contar = (f: UsuarioFiltros) =>
      this.users.listar({ ...f, page: 0, size: 1 }).pipe(map((p) => p.totalElementos));

    const porRol$: Observable<ConteoRol[]> = incluirRoles
      ? this.roles.listar().pipe(
        switchMap((rs) =>
          rs.length
            ? forkJoin(rs.map((r) => contar({ rolId: r.id }).pipe(map((total) => ({ nombre: r.nombre, total })))))
            : of<ConteoRol[]>([]),
        ),
      )
      : of<ConteoRol[]>([]);

    return forkJoin({
      total: contar({}),
      activos: contar({ estado: 'ACTIVO' }),
      inactivos: contar({ estado: 'INACTIVO' }),
      porRol: porRol$,
    });
  }
}