import { Injectable, signal } from '@angular/core';
import { TOAST_DURATION_MS } from '@app/core/constants/app.constants';
import { ApiError } from '@app/models/error.model';

export interface Toast { id: number; tipo: 'success' | 'error' | 'info'; mensaje: string; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  private seq = 0;
  readonly toasts = signal<Toast[]>([]);

  success(mensaje: string) { this.show('success', mensaje); }
  error(mensaje: string) { this.show('error', mensaje); }
  info(mensaje: string) { this.show('info', mensaje); }

  /** Atajo para `error: (e) => this.toast.showError(e)`. */
  showError(e: unknown) { this.error(ApiError.from(e).message); }

  dismiss(id: number) { this.toasts.update((t) => t.filter((x) => x.id !== id)); }

  private show(tipo: Toast['tipo'], mensaje: string) {
    const id = ++this.seq;
    this.toasts.update((t) => [...t.slice(-3), { id, tipo, mensaje }]); // máximo 4 visibles
    setTimeout(() => this.dismiss(id), TOAST_DURATION_MS);
  }
}