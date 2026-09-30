import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL, API_PATHS } from '@app/core/constants/api.constants';
import { AuthResponse, LoginRequest, UsuarioSesion } from '@app/models/auth.model';
import { TokenStorageService } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);
  private readonly storage = inject(TokenStorageService);
  private readonly router = inject(Router);

  private readonly _sesion = signal<UsuarioSesion | null>(this.storage.obtenerUsuario());
  readonly sesion = this._sesion.asReadonly();
  readonly isAuthenticated = computed(() => this._sesion() !== null);

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(this.base + API_PATHS.login, req)
      .pipe(tap((r) => this.iniciarSesion(r)));
  }

  /** Registro público: el backend siempre asigna el rol CLIENTE. */
  registrar(req: Record<string, unknown>): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(this.base + API_PATHS.register, req)
      .pipe(tap((r) => this.iniciarSesion(r)));
  }

  logout(): void {
    this.storage.limpiar();
    this._sesion.set(null);
    this.router.navigate(['/login']);
  }

  hasAnyRole(roles: readonly string[]): boolean {
    const rol = this._sesion()?.rol;
    return !!rol && roles.includes(rol);
  }

  /** Sincroniza nombre/apellido tras editar el perfil. */
  actualizarSesion(parcial: Partial<UsuarioSesion>): void {
    const actual = this._sesion();
    if (!actual) return;
    const nueva = { ...actual, ...parcial };
    this.storage.guardarUsuario(nueva);
    this._sesion.set(nueva);
  }

  private iniciarSesion(r: AuthResponse): void {
    this.storage.guardar(r);
    this._sesion.set(r.usuario);
  }
}