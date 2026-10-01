import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, finalize, of } from 'rxjs';
import { Avatar } from '@app/components/shared/avatar';
import { Badge } from '@app/components/shared/badge';
import { AppButton } from '@app/components/shared/button.directive';
import { Icon } from '@app/components/shared/icon';
import { ListState } from '@app/components/shared/list-state';
import { ConfirmDialog } from '@app/components/shared/confirm-dialog';
import { PageHeader } from '@app/components/shared/page-header';
import { Pagination } from '@app/components/shared/pagination';
import { SearchBox } from '@app/components/shared/search-box';
import { ESTADO_OPTIONS, ESTADO_TONE, PAGE_SIZE, PERMISOS } from '@app/core/constants/app.constants';
import { createPagedList } from '@app/core/utils/paged-list';
import { Rol } from '@app/models/role.model';
import { Estado, Usuario, UsuarioFiltros } from '@app/models/user.model';
import { RoleService } from '@app/services/role.service';
import { SessionService } from '@app/services/session.service';
import { ToastService } from '@app/services/toast.service';
import { UserService } from '@app/services/user.service';
import { UserForm } from '../user-form/user-form';

@Component({
  selector: 'app-user-list',
  imports: [DatePipe, Avatar, Badge, AppButton, Icon, ListState, ConfirmDialog, PageHeader, Pagination, SearchBox, UserForm],
  templateUrl: './user-list.html',
})
export class UserList {
  private readonly users = inject(UserService);
  private readonly roleService = inject(RoleService);
  private readonly session = inject(SessionService);
  private readonly toast = inject(ToastService);

  protected readonly puedeGestionar = this.session.hasAnyRole(PERMISOS.usuarios.gestionar);
  protected readonly miId = computed(() => this.session.user()?.id);
  protected readonly pageSize = PAGE_SIZE;
  protected readonly estados = ESTADO_OPTIONS;
  protected readonly estadoTone = ESTADO_TONE;

  protected readonly list = createPagedList<Usuario, UsuarioFiltros>({
    filters: { q: '', rolId: null, estado: '' },
    fetch: (query) => this.users.listar(query),
    onRefreshError: (e) => this.toast.showError(e),
  });

  // GET /api/roles es solo ADMIN: RECEPCION no ve el filtro por rol ni lo solicita
  protected readonly roles = toSignal(
    this.puedeGestionar ? this.roleService.listar().pipe(catchError(() => of<Rol[]>([]))) : of<Rol[]>([]),
    { initialValue: [] as Rol[] },
  );

  /** null = cerrado; { usuario: null } = alta; { usuario } = edición. */
  protected readonly editor = signal<{ usuario: Usuario | null } | null>(null);
  protected readonly porDesactivar = signal<Usuario | null>(null);
  protected readonly cambiando = signal(false);

  protected onRol(value: string): void {
    this.list.setFilters({ rolId: value ? Number(value) : null });
  }

  protected onEstado(value: string): void {
    this.list.setFilters({ estado: value as Estado | '' });
  }

  protected nuevo(): void { this.editor.set({ usuario: null }); }
  protected editar(u: Usuario): void { this.editor.set({ usuario: u }); }

  protected alGuardar(res: Usuario): void {
    const eraEdicion = this.editor()?.usuario != null;
    this.editor.set(null);
    if (res.id === this.session.user()?.id) {
      this.session.updateUser({ nombre: res.nombre, apellido: res.apellido });
    }
    this.toast.success(eraEdicion ? 'Usuario actualizado' : 'Usuario creado');
    if (eraEdicion) this.list.reload();
    else this.list.setFilters({}); // el alta vuelve a la página 0
  }

  protected alternarEstado(u: Usuario): void {
    if (u.estado === 'ACTIVO') this.porDesactivar.set(u); // desactivar pide confirmación
    else this.cambiarEstado(u);
  }

  protected confirmarDesactivar(): void {
    const u = this.porDesactivar();
    if (u) this.cambiarEstado(u);
  }

  private cambiarEstado(u: Usuario): void {
    if (this.cambiando()) return;
    this.cambiando.set(true);
    const req$ = u.estado === 'ACTIVO' ? this.users.desactivar(u.id) : this.users.activar(u.id);
    req$
      .pipe(finalize(() => { this.cambiando.set(false); this.porDesactivar.set(null); }))
      .subscribe({
        next: (r) => {
          this.toast.success(`Usuario ${r.estado === 'ACTIVO' ? 'activado' : 'desactivado'}`);
          this.list.reload();
        },
        error: (e: unknown) => this.toast.showError(e), // 409: p. ej. "No puedes desactivar tu propia cuenta"
      });
  }
}