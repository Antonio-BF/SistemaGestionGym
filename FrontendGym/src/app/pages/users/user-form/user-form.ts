import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AppButton } from '@app/components/shared/button.directive';
import { FormField } from '@app/components/shared/form-field';
import { Modal } from '@app/components/shared/modal';
import { GENERO_OPTIONS, MENSAJES, REGEX, REGLAS } from '@app/core/constants/app.constants';
import { applyApiErrors } from '@app/core/utils/form.util';
import { fechaPasada } from '@app/core/utils/validators.util';
import { ApiError } from '@app/models/error.model';
import { Rol } from '@app/models/role.model';
import { Genero, Usuario } from '@app/models/user.model';
import { SessionService } from '@app/services/session.service';
import { UserService } from '@app/services/user.service';

/** Crea o edita según reciba `usuario`. El padre lo monta/desmonta con @if. */
@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, Modal, FormField, AppButton],
  templateUrl: './user-form.html',
})
export class UserForm implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly users = inject(UserService);
  private readonly session = inject(SessionService);

  readonly usuario = input<Usuario | null>(null);
  readonly roles = input.required<Rol[]>();
  readonly saved = output<Usuario>();
  readonly closed = output<void>();

  protected readonly generos = GENERO_OPTIONS;
  protected readonly msgTelefono = MENSAJES.telefono;
  protected readonly msgPassword = MENSAJES.passwordOpcional;
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly esEdicion = computed(() => this.usuario() !== null);
  /** El backend no permite cambiar el propio rol ni la propia contraseña desde aquí. */
  protected readonly cuentaPropia = computed(() => {
    const u = this.usuario();
    return !!u && u.id === this.session.user()?.id;
  });

  protected readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(REGLAS.nombreMax)]],
    apellido: ['', [Validators.required, Validators.maxLength(REGLAS.nombreMax)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(REGLAS.emailMax)]],
    password: ['', [Validators.required, Validators.minLength(REGLAS.passwordMin), Validators.maxLength(REGLAS.passwordMax)]],
    telefono: ['', [Validators.pattern(REGEX.telefono)]],
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
    pw.setValidators([Validators.pattern(REGEX.passwordOpcional)]);
    pw.updateValueAndValidity();

    if (this.cuentaPropia()) {
      this.form.controls.rolId.disable();
      pw.disable();
    }
  }

  protected guardar(): void {
    if (this.guardando()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue(); // incluye controles deshabilitados
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
      error: (e: unknown) => {
        const err = ApiError.from(e);
        this.error.set(applyApiErrors(this.form, err, this.campoDe(err)));
      },
    });
  }

  /** No se cierra con Esc / fondo mientras se guarda. */
  protected cerrar(): void {
    if (!this.guardando()) this.closed.emit();
  }

  /** 409/400 de negocio sin campo: se ubican en el control que nombra el mensaje del backend. */
  private campoDe(err: ApiError): string | undefined {
    const m = err.message.toLowerCase();
    if (m.includes('email')) return 'email';
    if (m.includes('contraseña')) return 'password';
    if (m.includes('rol')) return 'rolId';
    return undefined;
  }
}