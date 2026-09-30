import { Component, input, output } from '@angular/core';
import { Icon } from '../../icons/icons';

/** El padre controla la visibilidad con @if; Esc y clic en el fondo emiten (closed). */
@Component({
  selector: 'app-modal',
  imports: [Icon],
  template: `
    <div class="backdrop" (click)="closed.emit()">
      <div class="dialog" [class]="'dialog dialog--' + size()" role="dialog" aria-modal="true" (click)="$event.stopPropagation()">
        <header class="dialog__header">
          <h2>{{ title() }}</h2>
          <button type="button" class="btn btn--ghost btn--icon" aria-label="Cerrar" (click)="closed.emit()">
            <app-icon name="x" />
          </button>
        </header>
        <div class="dialog__body"><ng-content /></div>
        <footer class="dialog__footer"><ng-content select="[modal-footer]" /></footer>
      </div>
    </div>
  `,
  host: { '(document:keydown.escape)': 'closed.emit()' },
  styles: `
    .backdrop { position: fixed; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center; padding: 16px; background: rgba(20, 33, 27, 0.55); }
    .dialog { display: flex; flex-direction: column; width: 100%; max-height: 90vh; background: #fff; border-radius: 12px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25); }
    .dialog--sm { max-width: 400px; } .dialog--md { max-width: 580px; } .dialog--lg { max-width: 740px; }
    .dialog__header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); }
    .dialog__body { padding: 20px; overflow-y: auto; }
    .dialog__footer { display: flex; justify-content: flex-end; gap: 10px; padding: 14px 20px; border-top: 1px solid var(--border); }
  `,
})
export class Modal {
  readonly title = input.required<string>();
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly closed = output<void>();
}