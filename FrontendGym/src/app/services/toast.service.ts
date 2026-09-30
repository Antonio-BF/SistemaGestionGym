import { Injectable, signal } from '@angular/core';

export interface Toast { id: number; tipo: 'success' | 'error' | 'info'; mensaje: string; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  private seq = 0;
  readonly toasts = signal<Toast[]>([]);

  success(m: string) { this.show('success', m); }
  error(m: string) { this.show('error', m); }
  info(m: string) { this.show('info', m); }

  dismiss(id: number) { this.toasts.update((t) => t.filter((x) => x.id !== id)); }

  private show(tipo: Toast['tipo'], mensaje: string) {
    const id = ++this.seq;
    this.toasts.update((t) => [...t, { id, tipo, mensaje }]);
    setTimeout(() => this.dismiss(id), 4500);
  }
}