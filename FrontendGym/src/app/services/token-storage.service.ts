import { Injectable } from '@angular/core';
import { STORAGE_KEYS as K } from '@app/core/constants/app.constants';
import { AuthResponse, UsuarioSesion } from '@app/models/auth.model';

/** Única responsabilidad: persistir/leer la sesión (sessionStorage). */
@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  get token(): string | null {
    return this.vigente() ? sessionStorage.getItem(K.token) : null;
  }

  guardar(r: AuthResponse): void {
    sessionStorage.setItem(K.token, r.token);
    sessionStorage.setItem(K.expira, String(Date.now() + r.expiraEnMs));
    this.guardarUsuario(r.usuario);
  }

  guardarUsuario(u: UsuarioSesion): void {
    sessionStorage.setItem(K.usuario, JSON.stringify(u));
  }

  obtenerUsuario(): UsuarioSesion | null {
    if (!this.vigente()) return null;
    try {
      return JSON.parse(sessionStorage.getItem(K.usuario) ?? 'null') as UsuarioSesion | null;
    } catch {
      return null;
    }
  }

  limpiar(): void {
    Object.values(K).forEach((k) => sessionStorage.removeItem(k));
  }

  private vigente(): boolean {
    const expira = Number(sessionStorage.getItem(K.expira));
    return !!sessionStorage.getItem(K.token) && expira > Date.now();
  }
}