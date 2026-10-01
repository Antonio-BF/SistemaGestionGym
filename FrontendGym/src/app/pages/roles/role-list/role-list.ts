import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AppButton } from '@app/components/shared/button.directive';
import { ConfirmDialog } from '@app/components/shared/confirm-dialog';
import { FormField } from '@app/components/shared/form-field';
import { Icon } from '@app/components/shared/icon';
import { ListState } from '@app/components/shared/list-state';
import { PageHeader } from '@app/components/shared/page-header';
import { REGLAS } from '@app/core/constants/app.constants';
import { applyApiErrors } from '@app/core/utils/form.util';
import { createLoader } from '@app/core/utils/loader';
import { ApiError } from '@app/models/error.model';
import { Rol } from '@app/models/role.model';
import { RoleService } from '@app/services/role.service';
import { ToastService } from '@app/services/toast.service';

@Component({
  selector: 'app-role-list',
  imports: [ReactiveFormsModule, AppButton, Icon, FormField, ListState, ConfirmDialog, PageHeader],
  templateUrl: './role-list.html',
})
export class RoleList {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly service = inject(RoleService);
  private readonly toast = inject(ToastService);

  protected readonly lista = createLoader<Rol[]>(() => this.service.listar());
  protected readonly guardando = signal(false);
  protected readonly porEliminar = signal<Rol | null>(null);
  protected readonly eliminando = signal(false);

  protected readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(REGLAS.rolNombreMax)]],
  });

  constructor() {
    this.lista.load();
  }

  protected crear(): void {
    if (this.guardando()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    this.service
      .crear({ nombre: this.form.getRawValue().nombre.trim() })
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: (rol) => {
          this.toast.success(`Rol ${rol.nombre} creado`);
          this.form.reset();
          this.lista.load();
        },
        // 400 con campos -> en el campo; 409 "El nombre ya esta registrado" -> en 'nombre'
        error: (e: unknown) => {
          const general = applyApiErrors(this.form, ApiError.from(e), 'nombre');
          if (general) this.toast.error(general);
        },
      });
  }

  protected eliminar(): void {
    const rol = this.porEliminar();
    if (!rol || this.eliminando()) return;
    this.eliminando.set(true);
    this.service
      .eliminar(rol.id)
      .pipe(finalize(() => { this.eliminando.set(false); this.porEliminar.set(null); }))
      .subscribe({
        next: () => { this.toast.success('Rol eliminado'); this.lista.load(); },
        error: (e: unknown) => this.toast.showError(e), // 409: tiene usuarios asociados
      });
  }
}