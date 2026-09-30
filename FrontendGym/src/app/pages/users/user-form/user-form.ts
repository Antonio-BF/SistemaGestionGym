import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { GENEROS, PASSWORD_MAX, PASSWORD_MIN, PASSWORD_OPCIONAL_REGEX, TELEFONO_REGEX } from '@app/core/constants/app.constants';
import { applyServerErrors } from '@app/core/utils/form.util';
import { parseApiError } from '@app/core/utils/http-error.util';
import { fechaPasada } from '@app/core/utils/validators.util';
import { Rol } from '@app/models/role.model';
import { Genero, Usuario } from '@app/models/user.model';
import { UserService } from '@app/services/user.service';
import { Modal } from '@app/components/shared/modals/modal/modal';
import { FormField } from '@app/components/shared/inputs/form-field/form-field';
import { AppButton } from '@app/components/shared/buttons/button/button';

/** Crea o edita según reciba `usuario`. El padre lo monta/desmonta con @if. */
@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, Modal, FormField, AppButton],
  templateUrl: './user-form.html',
})
export class UserForm implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly users = inject(UserService);

  readonly usuario = input<Usuario | null>(null);
  readonly roles = input.required<Rol[]>();
  readonly saved = output<Usuario>();
  readonly closed = output<void>();

  protected readonly generos = GENEROS;
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly esEdicion = computed(() => this.usuario() !== null);

  protected readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    apellido: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    password: ['', [Validators.required, Validators.minLength(PASSWORD_MIN), Validators.maxLength(PASSWORD_MAX)]],
    telefono: ['', [Validators.pattern(TELEFONO_REGEX)]],
    genero: this.fb.control<Genero>('PREFIERO_NO_DECIR'),
    fechaNacimiento: ['', [fechaPasada]],
    rolId: this.fb.control<number | null>(null, Validators.required),
  });

  ngOnInit(): void {
    const u = this.usuario();
    if (!u) return;
    this.form.patchValue({
      nombre: u.nombre, apellido: u.apellido, email: u.email, telefono: u.telefono ?? '',
      genero: u.genero, fechaNacimiento: u.fechaNacimiento ?? '', rolId: u.rolId,
    });
    // En edición la contraseña es opcional (vacía = conservar la actual)
    const pw = this.form.controls.password;
    pw.setValidators([Validators.pattern(PASSWORD_OPCIONAL_REGEX)]);
    pw.updateValueAndValidity();
  }

  protected guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const base = {
      nombre: v.nombre.trim(),
      apellido: v.apellido.trim(),
      email: v.email.trim(),
      telefono: v.telefono.trim(),
      genero: v.genero,
      fechaNacimiento: v.fechaNacimiento || null,
      rolId: v.rolId as number,
    };
    const u = this.usuario();
    const req$ = u
      ? this.users.actualizar(u.id, { ...base, password: v.password || null })
      : this.users.crear({ ...base, password: v.password });

    this.guardando.set(true);
    this.error.set(null);
    req$.pipe(finalize(() => this.guardando.set(false))).subscribe({
      next: (res) => this.saved.emit(res),
      error: (e) => {
        const err = parseApiError(e);
        if (!applyServerErrors(this.form, err.validationErrors)) this.error.set(err.message);
        else this.error.set(null);
      },
    });
  }
}