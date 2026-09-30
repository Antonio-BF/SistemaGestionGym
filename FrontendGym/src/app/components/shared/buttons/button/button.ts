import { booleanAttribute, Component, computed, input } from '@angular/core';
import { Spinner } from '../../loaders/spinner/spinner';


export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

@Component({
  selector: 'app-button',
  imports: [Spinner],
  template: `
    <button [class]="clases()" [type]="type()" [disabled]="disabled() || loading()">
      @if (loading()) { <app-spinner [size]="14" /> }
      <ng-content />
    </button>
  `,
  styles: `:host { display: contents; }`,
})
export class AppButton {
  readonly variant = input<ButtonVariant>('primary');
  readonly type = input<'button' | 'submit'>('button');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly block = input(false, { transform: booleanAttribute });
  readonly small = input(false, { transform: booleanAttribute });

  protected readonly clases = computed(
    () => `btn btn--${this.variant()}${this.block() ? ' btn--block' : ''}${this.small() ? ' btn--sm' : ''}`,
  );
}