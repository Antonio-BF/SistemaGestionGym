import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@env/environment';
import { finalize } from 'rxjs';
import { AppButton } from '@app/components/shared/button.directive';
import { FormField } from '@app/components/shared/form-field';
import { applyApiErrors } from '@app/core/utils/form.util';
import { ApiError } from '@app/models/error.model';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, AppButton, FormField],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly esDev = !environment.production;

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  protected enviar(): void {
    if (this.loading()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.auth
      .login(this.form.getRawValue())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => void this.router.navigateByUrl(this.destino()),
        // 401 "Email o contraseña incorrectos" / 403 cuenta inactiva / 400 con campos
        error: (e: unknown) => this.error.set(applyApiErrors(this.form, ApiError.from(e))),
      });
  }

  /** Solo rutas internas: evita redirecciones a valores arbitrarios del query string. */
  private destino(): string {
    const url = this.route.snapshot.queryParamMap.get('returnUrl');
    return url?.startsWith('/') && !url.startsWith('//') ? url : '/dashboard';
  }
}