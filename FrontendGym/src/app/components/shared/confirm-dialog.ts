import { booleanAttribute, Component, input, output } from '@angular/core';
import { AppButton } from './button.directive';
import { Modal } from './modal';

@Component({
    selector: 'app-confirm-dialog',
    imports: [Modal, AppButton],
    template: `
    <app-modal [title]="title()" size="sm" (closed)="cancelled.emit()">
      <p>{{ message() }}</p>
      <div modal-footer>
        <button appButton="secondary" type="button" (click)="cancelled.emit()">Cancelar</button>
        <button [appButton]="danger() ? 'danger' : 'primary'" type="button" [loading]="loading()" (click)="confirmed.emit()">
          {{ confirmText() }}
        </button>
      </div>
    </app-modal>
  `,
})
export class ConfirmDialog {
    readonly title = input('Confirmar acción');
    readonly message = input.required<string>();
    readonly confirmText = input('Confirmar');
    readonly danger = input(false, { transform: booleanAttribute });
    readonly loading = input(false, { transform: booleanAttribute });
    readonly confirmed = output<void>();
    readonly cancelled = output<void>();
}