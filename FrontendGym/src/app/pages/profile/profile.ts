import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { Avatar } from '@app/components/shared/avatar';
import { Badge } from '@app/components/shared/badge';
import { AppButton } from '@app/components/shared/button.directive';
import { FormField } from '@app/components/shared/form-field';
import { ListState } from '@app/components/shared/list-state';
import { PageHeader } from '@app/components/shared/page-header';
import { ESTADO_TONE, GENERO_OPTIONS, MENSAJES, REGEX, REGLAS } from '@app/core/constants/app.constants';
import { applyApiErrors } from '@app/core/utils/form.util';
import { coincideCon, fechaPasada } from '@app/core/utils/validators.util';
import { ApiError } from '@app/models/error.model';
import { Genero, Usuario } from '@app/models/user.model';
import { ProfileService } from '@app/services/profile.service';
import { SessionService } from '@app/services/session.service';
import { ToastService } from '@app/services/toast.service';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, DatePipe, Avatar, Badge, AppButton, FormField, ListState, PageHeader],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly service = inject(ProfileService);
  private readonly session = inject(SessionService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly generos = GENERO_OPTIONS;
  protected readonly estadoTone = ESTADO_TONE;
  protected readonly msgTelefono = MENSAJES.telefono;

  protected readonly perfil = signal<Usuario | null>(null);
  protected readonly loading = signal(false);
  protected readonly loadError = signal<ApiError | null>(null);
  protected readonly guardandoPerfil = signal(false);
  protected readonly guardandoPass = signal(false);
  protected readonly errorPass = signal<string | null>(null);

  protected readonly formPerfil = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(REGLAS.nombreMax)]],
    apellido: ['', [Validators.required, Validators.maxLength(REGLAS.nombreMax)]],
    telefono: ['', [Validators.pattern(REGEX.telefono)]],
    genero: this.fb.control<Genero>('PREFIERO_NO_DECIR'),
    fechaNacimiento: ['', [fechaPasada]],
  });

  protected readonly formPass = this.fb.group({
    passwordActual: ['', Validators.required],
    passwordNueva: ['', [Validators.required, Validators.minLength(REGLAS.passwordMin), Validators.maxLength(REGLAS.passwordMax)]],
    confirmar: ['', [Validators.required, coincideCon('passwordNueva')]],
  });

  constructor() {
    // Si cambia la nueva contraseña, se revalida la confirmación
    this.formPass.controls.passwordNueva.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.formPass.controls.confirmar.updateValueAndValidity());

    this.cargar();
  }

  protected cargar(): void {
    this.loading.set(true);
    this.loadError.set(null);
    this.service
      .obtener()
      .pipe(finalize(() => this.loading.set(false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (u) => this.aplicarPerfil(u),
        error: (e: unknown) => this.loadError.set(ApiError.from(e)),
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
    if (this.guardandoPerfil()) return;
    if (this.formPerfil.invalid) {
      this.formPerfil.markAllAsTouched();
      return;
    }
    const v = this.formPerfil.getRawValue();
    this.guardandoPerfil.set(true);
    this.service
      .actualizar({
        nombre: v.nombre.trim(),
        apellido: v.apellido.trim(),
        telefono: v.telefono.trim(),
        genero: v.genero,
        fechaNacimiento: v.fechaNacimiento || null,
      })
      .pipe(finalize(() => this.guardandoPerfil.set(false)))
      .subscribe({
        next: (u) => {
          this.aplicarPerfil(u);
          this.session.updateUser({ nombre: u.nombre, apellido: u.apellido });
          this.toast.success('Perfil actualizado');
        },
        error: (e: unknown) => {
          const general = applyApiErrors(this.formPerfil, ApiError.from(e));
          if (general) this.toast.error(general);
        },
      });
  }

  protected cambiarPassword(): void {
    if (this.guardandoPass()) return;
    if (this.formPass.invalid) {
      this.formPass.markAllAsTouched();
      return;
    }
    const { passwordActual, passwordNueva } = this.formPass.getRawValue();
    this.guardandoPass.set(true);
    this.errorPass.set(null);
    this.service
      .cambiarPassword({ passwordActual, passwordNueva })
      .pipe(finalize(() => this.guardandoPass.set(false)))
      .subscribe({
        next: () => {
          this.formPass.reset();
          this.toast.success('Contraseña actualizada correctamente');
        },
        // 400: "La contraseña actual es incorrecta" / "debe ser distinta a la actual"
        error: (e: unknown) => this.errorPass.set(applyApiErrors(this.formPass, ApiError.from(e))),
      });
  }
}