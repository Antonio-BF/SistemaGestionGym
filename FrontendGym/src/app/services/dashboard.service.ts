import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { ConteoRol, DashboardUsuarios, ResumenMensual, ResumenUsuarios } from '@app/models/dashboard.model';
import { Pagina } from '@app/models/common.model';
import { Usuario } from '@app/models/user.model';
import { RoleService } from './role.service';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly users = inject(UserService);
  private readonly roles = inject(RoleService);

  obtenerTodosUsuarios(): Observable<Usuario[]> {
    const pageSize = 100;
    return this.users.listar({ page: 0, size: pageSize }).pipe(
      switchMap((primera) => {
        if (primera.totalPaginas <= 1) return of(primera.contenido);
        const paginas = Array.from({ length: primera.totalPaginas - 1 }, (_, i) => i + 1);
        return forkJoin(paginas.map((page) => this.users.listar({ page, size: primera.tamano || pageSize }))).pipe(
          map((resto) => [primera.contenido, ...resto.map((p) => p.contenido)].flat()),
        );
      }),
    );
  }

  obtenerUsuariosRecientes(): Observable<Usuario[]> {
    return this.obtenerTodosUsuarios().pipe(
      map((usuarios) => [...usuarios].sort((a, b) => this.fechaTimestamp(b.fechaRegistro) - this.fechaTimestamp(a.fechaRegistro)).slice(0, 5)),
    );
  }

  obtenerResumenMensual(usuarios: Usuario[]): ResumenMensual[] {
    const ahora = new Date();
    const meses: ResumenMensual[] = [];
    for (let i = 5; i >= 0; i--) {
      const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
      const clave = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      const etiqueta = fecha.toLocaleDateString('es-PE', { month: 'short' }).replace('.', '');
      meses.push({
        clave,
        etiqueta: etiqueta.charAt(0).toUpperCase() + etiqueta.slice(1),
        total: usuarios.filter((u) => u.fechaRegistro?.slice(0, 7) === clave).length,
      });
    }
    return meses;
  }

  obtenerResumenUsuarios(usuarios: Usuario[], incluirRoles: boolean): Observable<ResumenUsuarios> {
    const roles$ = incluirRoles ? this.roles.listar() : of([]);
    return roles$.pipe(
      map((roles) => {
        const resumenMensual = this.obtenerResumenMensual(usuarios);
        const conteos = new Map<string, number>();
        for (const usuario of usuarios) conteos.set(usuario.rol, (conteos.get(usuario.rol) ?? 0) + 1);
        const porRol: ConteoRol[] = incluirRoles
          ? roles.map((rol) => ({ nombre: rol.nombre, total: conteos.get(rol.nombre) ?? 0 }))
          : [];
        return {
          total: usuarios.length,
          activos: usuarios.filter((u) => u.estado === 'ACTIVO').length,
          inactivos: usuarios.filter((u) => u.estado === 'INACTIVO').length,
          nuevosEsteMes: resumenMensual[resumenMensual.length - 1]?.total ?? 0,
          porRol,
        };
      }),
    );
  }

  obtenerDashboard(incluirRoles: boolean): Observable<DashboardUsuarios> {
    return this.obtenerTodosUsuarios().pipe(
      switchMap((usuarios) =>
        forkJoin({
          resumen: this.obtenerResumenUsuarios(usuarios, incluirRoles),
          recientes: of([...usuarios].sort((a, b) => this.fechaTimestamp(b.fechaRegistro) - this.fechaTimestamp(a.fechaRegistro)).slice(0, 5)),
          resumenMensual: of(this.obtenerResumenMensual(usuarios)),
        }),
      ),
    );
  }

  private fechaTimestamp(fecha: string | null | undefined): number {
    if (!fecha) return 0;
    const timestamp = Date.parse(fecha);
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }
}