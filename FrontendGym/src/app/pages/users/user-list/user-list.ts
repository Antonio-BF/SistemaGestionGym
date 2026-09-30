import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, finalize, Subject, switchMap } from 'rxjs';
import { ESTADOS, PAGE_SIZE, ROLES } from '@app/core/constants/app.constants';
import { parseApiError } from '@app/core/utils/http-error.util';
import { InicialesPipe } from '@app/core/utils/iniciales.pipe';
import { Pagina } from '@app/models/page.model';
import { Rol } from '@app/models/role.model';
import { Estado, Usuario } from '@app/models/user.model';
import { AuthService } from '@app/services/auth.service';
import { RoleService } from '@app/services/role.service';
import { ToastService } from '@app/services/toast.service';
import { UserService } from '@app/services/user.service';
import { Badge } from '@app/components/shared/badges/badge/badge';
import { AppButton } from '@app/components/shared/buttons/button/button';
import { Icon } from '@app/components/shared/icons/icons';
import { Spinner } from '@app/components/shared/loaders/spinner/spinner';
import { ConfirmDialog } from '@app/components/shared/modals/confirm-dialog/confirm-dialog';
import { Pagination } from '@app/components/shared/tables/pagination/pagination';
import { UserForm } from '../user-form/user-form';

@Component({
  selector: 'app-user-list',
  imports: [DatePipe, Badge, AppButton, Icon, Spinner, ConfirmDialog, Pagination, InicialesPipe, UserForm],
  templateUrl: './user-list.html',
})
export class UserList implements OnInit {
  private readonly users = inject(UserService);
  private readonly roleService = inject(RoleService);
  private readonly toast = inject(ToastService);
  private readonly auth = inject(AuthService);

  protected readonly pageSize = PAGE_SIZE;
  protected readonly estados = ESTADOS;
  protected readonly esAdmin = computed(() => this.auth.hasAnyRole([ROLES.ADMIN]));
  protected readonly miId = computed(() => this.auth.sesion()?.id);

  protected readonly pagina = signal<Pagina<Usuario> | null>(null);
  protected readonly roles = signal<Rol[]>([]);
  protected readonly loading = signal(false);

  private readonly q = signal('');
  private readonly rolId = signal<number | null>(null);
  private readonly estado = signal<Estado | ''>('');
  protected readonly page = signal(0);

  protected readonly formAbierto = signal(false);
  protected readonly editando = signal<Usuario | null>(null);
  protected readonly porDesactivar = signal<Usuario | null>(null);
  protected readonly cambiando = signal(false);

  private readonly refrescar$ = new Subject<void>();
  private readonly buscar$ = new Subject<string>();

  constructor() {
    // switchMap cancela la petición anterior: evita respuestas fuera de orden
    this.refrescar$
      .pipe(
        switchMap(() => {
          this.loading.set(true);
          return this.users
            .listar({ q: this.q(), rolId: this.rolId(), estado: this.estado(), page: this.page(), size: PAGE_SIZE })
            .pipe(
              catchError((e) => {
                this.toast.error(parseApiError(e).message);
                return EMPTY;
              }),
              finalize(() => this.loading.set(false)),
            );
        }),
        takeUntilDestroyed(),
      )
      .subscribe((p) => this.pagina.set(p));

    this.buscar$
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((v) => {
        this.q.set(v);
        this.page.set(0);
        this.refrescar$.next();
      });
  }

  ngOnInit(): void {
    this.refrescar$.next();
    // GET /api/roles es solo ADMIN: RECEPCION no ve el filtro por rol
    if (this.esAdmin()) this.roleService.listar().subscribe({ next: (r) => this.roles.set(r) });
  }

  protected onBuscar(v: string) { this.buscar$.next(v); }
  protected onRol(v: string) { this.rolId.set(v ? Number(v) : null); this.reiniciar(); }
  protected onEstado(v: string) { this.estado.set(v as Estado | ''); this.reiniciar(); }
  protected irAPagina(p: number) { this.page.set(p); this.refrescar$.next(); }

  protected nuevo() { this.editando.set(null); this.formAbierto.set(true); }
  protected editar(u: Usuario) { this.editando.set(u); this.formAbierto.set(true); }
  protected cerrarForm() { this.formAbierto.set(false); }

  protected alGuardar() {
    this.formAbierto.set(false);
    this.toast.success(this.editando() ? 'Usuario actualizado' : 'Usuario creado');
    this.refrescar$.next();
  }

  protected alternarEstado(u: Usuario) {
    if (u.estado === 'ACTIVO') this.porDesactivar.set(u); // pide confirmación
    else this.aplicarEstado(u);
  }

  protected confirmarDesactivar() {
    const u = this.porDesactivar();
    if (u) this.aplicarEstado(u);
  }

  private aplicarEstado(u: Usuario) {
    const req$ = u.estado === 'ACTIVO' ? this.users.desactivar(u.id) : this.users.activar(u.id);
    this.cambiando.set(true);
    req$
      .pipe(finalize(() => { this.cambiando.set(false); this.porDesactivar.set(null); }))
      .subscribe({
        next: (r) => {
          this.toast.success(`Usuario ${r.estado === 'ACTIVO' ? 'activado' : 'desactivado'}`);
          this.refrescar$.next();
        },
        error: (e) => this.toast.error(parseApiError(e).message),
      });
  }

  private reiniciar() { this.page.set(0); this.refrescar$.next(); }
}