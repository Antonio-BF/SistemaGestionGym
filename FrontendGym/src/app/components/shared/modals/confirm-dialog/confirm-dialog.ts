import { booleanAttribute, Component, input, output } from '@angular/core';
import { Modal } from '../modal/modal';
import { AppButton } from '../../buttons/button/button';


@Component({
  selector: 'app-confirm-dialog',
  imports: [Modal, AppButton],
  template: `
    <app-modal [title]="title()" size="sm" (closed)="cancelled.emit()">
      <p>{{ message() }}</p>
      <div modal-footer>
        <app-button variant="secondary" (click)="cancelled.emit()">Cancelar</app-button>
        <app-button [variant]="danger() ? 'danger' : 'primary'" [loading]="loading()" (click)="confirmed.emit()">
          {{ confirmText() }}
        </app-button>
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