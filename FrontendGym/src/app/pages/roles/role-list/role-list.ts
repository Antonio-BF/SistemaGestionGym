import { Component, inject, OnInit, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { applyServerErrors } from '@app/core/utils/form.util';
import { parseApiError } from '@app/core/utils/http-error.util';
import { Rol } from '@app/models/role.model';
import { RoleService } from '@app/services/role.service';
import { ToastService } from '@app/services/toast.service';
import { AppButton } from '@app/components/shared/buttons/button/button';
import { Icon } from '@app/components/shared/icons/icons';
import { FormField } from '@app/components/shared/inputs/form-field/form-field';
import { Spinner } from '@app/components/shared/loaders/spinner/spinner';
import { ConfirmDialog } from '@app/components/shared/modals/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-role-list',
  imports: [ReactiveFormsModule, AppButton, Icon, FormField, Spinner, ConfirmDialog],
  templateUrl: './role-list.html',
})
export class RoleList implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly service = inject(RoleService);
  private readonly toast = inject(ToastService);

  protected readonly roles = signal<Rol[]>([]);
  protected readonly loading = signal(false);
  protected readonly guardando = signal(false);
  protected readonly porEliminar = signal<Rol | null>(null);
  protected readonly eliminando = signal(false);

  protected readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
  });

  ngOnInit(): void { this.cargar(); }

  private cargar(): void {
    this.loading.set(true);
    this.service.listar().pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (r) => this.roles.set(r),
      error: (e) => this.toast.error(parseApiError(e).message),
    });
  }

  protected crear(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.guardando.set(true);
    this.service.crear({ nombre: this.form.getRawValue().nombre.trim() })
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: (rol) => {
          this.toast.success(`Rol ${rol.nombre} creado`);
          this.form.reset();
          this.cargar();
        },
        error: (e) => {
          const err = parseApiError(e);
          if (!applyServerErrors(this.form, err.validationErrors)) {
            this.form.controls.nombre.setErrors({ server: err.message }); // p. ej. 409 nombre duplicado
            this.form.controls.nombre.markAsTouched();
          }
        },
      });
  }

  protected eliminar(): void {
    const rol = this.porEliminar();
    if (!rol) return;
    this.eliminando.set(true);
    this.service.eliminar(rol.id)
      .pipe(finalize(() => { this.eliminando.set(false); this.porEliminar.set(null); }))
      .subscribe({
        next: () => { this.toast.success('Rol eliminado'); this.cargar(); },
        error: (e) => this.toast.error(parseApiError(e).message), // 409: tiene usuarios asociados
      });
  }
}