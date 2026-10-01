import { Component, inject } from '@angular/core';
import { ToastService } from '@app/services/toast.service';
import { Icon } from './icon';

@Component({
  selector: 'app-toast-container',
  imports:[Icon],
  template: `
    <div class="toasts" aria-live="polite" aria-atomic="true">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast" [class]="'toast toast--' + t.tipo" role="status" (click)="toast.dismiss(t.id)">
          <span class="toast__indicator"></span>
          <span class="toast__message">{{ t.mensaje }}</span>

          <button type="button" class="toast__close" aria-label="Cerrar" (click)="$event.stopPropagation(); toast.dismiss(t.id)">
            <app-icon name="x" />
          </button>
        </div>
      }
    </div>
  `,

  styles: `
    .toasts { position: fixed; top: 20px; right: 20px; z-index: 1000; display: flex; flex-direction: column; gap: 8px; width: min(360px, calc(100vw - 40px)); pointer-events: none; }
    .toast { --color: var(--muted); display: flex; align-items: center; gap: 10px; min-height: 48px; padding: 8px 8px 8px 10px; background: var(--surface); color: var(--text); border: 1px solid #cfd6d0; border-radius: var(--radius); box-shadow: 0 4px 14px rgba(20, 33, 27, .12), 0 1px 3px rgba(20, 33, 27, .08); cursor: pointer; pointer-events: auto; animation: toast-in .15s ease-out; }
    .toast__indicator { width: 3px; height: 24px; flex: none; border-radius: 2px; background: var(--color); }
    .toast__message { flex: 1; min-width: 0; color: var(--text); font-size: .82rem; font-weight: 500; line-height: 1.35; overflow-wrap: anywhere; }
    .toast__close { width: 26px; height: 26px; padding: 0; border: 0; border-radius: 4px; background: transparent; color: var(--muted); font-size: 18px; font-weight: 400; line-height: 1; transition: background .15s, color .15s; }
    .toast__close:hover { background: #e7ebe7; color: var(--text); }
    .toast--success { --color: var(--primary); }
    .toast--error { --color: var(--danger); }
    .toast--warning { --color: var(--warning); }
    .toast--info { --color: var(--info); }
    @keyframes toast-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
    @media (max-width: 600px) { .toasts { top: 12px; right: 12px; left: 12px; width: auto; } }
  `,
})
export class ToastContainer {
  protected readonly toast = inject(ToastService);
}
