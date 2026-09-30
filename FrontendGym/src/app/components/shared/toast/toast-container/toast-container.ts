import { Component, inject } from '@angular/core';
import { ToastService } from '@app/services/toast.service';

@Component({
  selector: 'app-toast-container',
  template: `
    <div class="toasts" aria-live="polite">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast" [class]="'toast toast--' + t.tipo" (click)="toast.dismiss(t.id)">{{ t.mensaje }}</div>
      }
    </div>
  `,
  styles: `
    .toasts { position: fixed; top: 16px; right: 16px; z-index: 200; display: flex; flex-direction: column; gap: 8px; max-width: calc(100vw - 32px); }
    .toast { padding: 12px 16px; border-radius: 8px; color: #fff; box-shadow: var(--shadow); cursor: pointer; min-width: 240px; }
    .toast--success { background: var(--primary); } .toast--error { background: var(--danger); } .toast--info { background: var(--dark-2); }
  `,
})
export class ToastContainer {
  protected readonly toast = inject(ToastService);
}