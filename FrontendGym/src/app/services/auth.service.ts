import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_PATHS } from '@app/core/constants/api.constants';
import { AuthResponse, LoginRequest, RegisterRequest } from '@app/models/auth.model';
import { ApiClient } from './api-client.service';
import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiClient);
  private readonly session = inject(SessionService);

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.api
      .post<AuthResponse>(API_PATHS.auth.login, req, { public: true })
      .pipe(tap((r) => this.session.start(r)));
  }

  /** Registro público: el backend siempre asigna el rol CLIENTE. */
  registrar(req: RegisterRequest): Observable<AuthResponse> {
    return this.api
      .post<AuthResponse>(API_PATHS.auth.register, req, { public: true })
      .pipe(tap((r) => this.session.start(r)));
  }

  logout(): void {
    this.session.end();
  }
}