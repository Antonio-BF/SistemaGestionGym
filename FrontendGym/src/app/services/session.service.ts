import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { STORAGE_KEY } from '@app/core/constants/app.constants';
import { AuthResponse, StoredSession, UsuarioSesion } from '@app/models/auth.model';
import { SessionStorageService } from './session-storage.service';
import { ToastService } from './toast.service';

const MAX_TIMEOUT = 2_147_483_647; // límite de setTimeout (~24,8 días)

/** Estado de sesión (fuente única). No depende de HttpClient: los interceptores pueden usarlo sin ciclos. */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly storage = inject(SessionStorageService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  private readonly state = signal<StoredSession | null>(this.storage.leer());
  private timer: ReturnType<typeof setTimeout> | undefined;

  readonly user = computed(() => this.state()?.usuario ?? null);
  readonly token = computed(() => this.state()?.token ?? null);
  readonly isAuthenticated = computed(() => this.state() !== null);

  constructor() {
    this.programarExpiracion();
    this.escucharCambiosExternos();
  }

  start(res: AuthResponse): void {
    const sesion: StoredSession = { token: res.token, expiraEn: Date.now() + res.expiraEnMs, usuario: res.usuario };
    this.storage.guardar(sesion);
    this.state.set(sesion);
    this.programarExpiracion();
  }

  /** Sincroniza datos visibles (p. ej. nombre) tras editar el perfil. */
  updateUser(parcial: Partial<UsuarioSesion>): void {
    const actual = this.state();
    if (!actual) return;
    const nueva: StoredSession = { ...actual, usuario: { ...actual.usuario, ...parcial } };
    this.storage.guardar(nueva);
    this.state.set(nueva);
  }

  /** Cierre voluntario (botón Salir). Se propaga a las demás pestañas vía localStorage. */
  end(): void {
    clearTimeout(this.timer);
    this.storage.limpiar();
    this.state.set(null);
    void this.router.navigate(['/login']);
  }

  /** Cierre por token vencido o inválido (401): avisa al usuario. */
  expire(): void {
    this.end();
    this.toast.info('Tu sesión expiró. Inicia sesión nuevamente.');
  }

  hasAnyRole(roles: readonly string[]): boolean {
    const rol = this.user()?.rol;
    return !!rol && roles.includes(rol);
  }

  private programarExpiracion(): void {
    clearTimeout(this.timer);
    const sesion = this.state();
    if (!sesion) return;
    const restante = Math.min(Math.max(sesion.expiraEn - Date.now(), 0), MAX_TIMEOUT);
    this.timer = setTimeout(() => this.expire(), restante);
  }

  /**
   * Con sesiones que sobreviven al navegador hay dos escenarios nuevos:
   * 1) Otra pestaña inicia/cierra sesión o actualiza datos: el evento `storage` (solo se dispara
   *    en las OTRAS pestañas) mantiene este estado sincronizado.
   * 2) El equipo se suspendió o la pestaña estuvo en segundo plano y el setTimeout se retrasó:
   *    al volver a ser visible se comprueba la expiración real.
   */
  private escucharCambiosExternos(): void {
    window.addEventListener('storage', (e: StorageEvent) => {
      if (e.key !== null && e.key !== STORAGE_KEY) return; // key null = localStorage.clear()
      const estabaAutenticado = this.state() !== null;
      this.state.set(this.storage.leer());
      this.programarExpiracion();
      if (estabaAutenticado && this.state() === null) void this.router.navigate(['/login']);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible') return;
      const sesion = this.state();
      if (sesion && sesion.expiraEn <= Date.now()) this.expire();
    });
  }
}