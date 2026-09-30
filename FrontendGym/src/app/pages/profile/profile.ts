import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { GENEROS, PASSWORD_MAX, PASSWORD_MIN, TELEFONO_REGEX } from '@app/core/constants/app.constants';
import { applyServerErrors } from '@app/core/utils/form.util';
import { parseApiError } from '@app/core/utils/http-error.util';
import { InicialesPipe } from '@app/core/utils/iniciales.pipe';
import { coincideCon, fechaPasada } from '@app/core/utils/validators.util';
import { Genero, Usuario } from '@app/models/user.model';
import { AuthService } from '@app/services/auth.service';
import { ProfileService } from '@app/services/profile.service';
import { ToastService } from '@app/services/toast.service';
import { FormField } from '@app/components/shared/inputs/form-field/form-field';
import { Spinner } from '@app/components/shared/loaders/spinner/spinner';
import { AppButton } from '@app/components/shared/buttons/button/button';
import { Badge } from '@app/components/shared/badges/badge/badge';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, DatePipe, Badge, AppButton, FormField, Spinner, InicialesPipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly service = inject(ProfileService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  protected readonly generos = GENEROS;
  protected readonly perfil = signal<Usuario | null>(null);
  protected readonly loading = signal(false);
  protected readonly guardandoPerfil = signal(false);
  protected readonly guardandoPass = signal(false);
  protected readonly errorPass = signal<string | null>(null);

  protected readonly formPerfil = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    apellido: ['', [Validators.required, Validators.maxLength(100)]],
    telefono: ['', [Validators.pattern(TELEFONO_REGEX)]],
    genero: this.fb.control<Genero>('PREFIERO_NO_DECIR'),
    fechaNacimiento: ['', [fechaPasada]],
  });

  protected readonly formPass = this.fb.group({
    passwordActual: ['', Validators.required],
    passwordNueva: ['', [Validators.required, Validators.minLength(PASSWORD_MIN), Validators.maxLength(PASSWORD_MAX)]],
    confirmar: ['', [Validators.required, coincideCon('passwordNueva')]],
  });

  constructor() {
    // Si cambia la nueva contraseña, se revalida la confirmación
    this.formPass.controls.passwordNueva.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.formPass.controls.confirmar.updateValueAndValidity());
  }

  ngOnInit(): void {
    this.loading.set(true);
    this.service.obtener().pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (u) => this.aplicarPerfil(u),
      error: (e) => this.toast.error(parseApiError(e).message),
    });
  }

  private aplicarPerfil(u: Usuario): void {
    this.perfil.set(u);
    this.formPerfil.reset({
      nombre: u.nombre, apellido: u.apellido, telefono: u.telefono ?? '',
      genero: u.genero, fechaNacimiento: u.fechaNacimiento ?? '',
    });
  }

  protected guardarPerfil(): void {
    if (this.formPerfil.invalid) { this.formPerfil.markAllAsTouched(); return; }
    const v = this.formPerfil.getRawValue();
    this.guardandoPerfil.set(true);
    this.service
      .actualizar({ ...v, nombre: v.nombre.trim(), apellido: v.apellido.trim(), telefono: v.telefono.trim(), fechaNacimiento: v.fechaNacimiento || null })
      .pipe(finalize(() => this.guardandoPerfil.set(false)))
      .subscribe({
        next: (u) => {
          this.aplicarPerfil(u);
          this.auth.actualizarSesion({ nombre: u.nombre, apellido: u.apellido });
          this.toast.success('Perfil actualizado');
        },
        error: (e) => {
          const err = parseApiError(e);
          if (!applyServerErrors(this.formPerfil, err.validationErrors)) this.toast.error(err.message);
        },
      });
  }

  protected cambiarPassword(): void {
    if (this.formPass.invalid) { this.formPass.markAllAsTouched(); return; }
    const { passwordActual, passwordNueva } = this.formPass.getRawValue();
    this.guardandoPass.set(true);
    this.errorPass.set(null);
    this.service.cambiarPassword({ passwordActual, passwordNueva })
      .pipe(finalize(() => this.guardandoPass.set(false)))
      .subscribe({
        next: () => {
          this.formPass.reset();
          this.toast.success('Contraseña actualizada correctamente');
        },
        error: (e) => {
          const err = parseApiError(e);
          // 400: "La contraseña actual es incorrecta" / "debe ser distinta a la actual"
          if (!applyServerErrors(this.formPass, err.validationErrors)) this.errorPass.set(err.message);
        },
      });
  }
}