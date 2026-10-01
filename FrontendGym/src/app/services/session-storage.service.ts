import { Injectable } from '@angular/core';
import { STORAGE_KEY } from '@app/core/constants/app.constants';
import { StoredSession } from '@app/models/auth.model';

/**
 * Solo persistencia. Usa localStorage: la sesión sobrevive al cierre de la pestaña/ventana
 * y termina únicamente al cerrar sesión o al vencer el token (expiraEn).
 * Tolera storage bloqueado y datos corruptos.
 */
@Injectable({ providedIn: 'root' })
export class SessionStorageService {
  leer(): StoredSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const s = JSON.parse(raw) as StoredSession;
      // Token vencido o datos incompletos: se descarta y se limpia
      if (!s?.token || !s.usuario || !(s.expiraEn > Date.now())) {
        this.limpiar();
        return null;
      }
      return s;
    } catch {
      return null;
    }
  }

  guardar(sesion: StoredSession): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sesion));
    } catch {
      // Sin storage disponible: la sesión vive solo en memoria
    }
  }

  limpiar(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // nada que limpiar
    }
  }
}