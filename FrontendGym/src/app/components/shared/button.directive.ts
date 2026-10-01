import { booleanAttribute, computed, Directive, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'md' | 'sm' | 'icon';

/**
 * Estiliza el <button>/<a> NATIVO (sin wrapper): conserva type, disabled, foco y formularios.
 * Uso: <button appButton="danger" size="sm" [loading]="guardando()">…</button>
 * Los handlers deben ignorar el submit mientras `loading` sea true.
 */
@Directive({
  selector: 'button[appButton], a[appButton]',
  host: { '[class]': 'classes()', '[attr.aria-busy]': 'loading() || null' },
})
export class AppButton {
  readonly variant = input<ButtonVariant | ''>('primary', { alias: 'appButton' });
  readonly size = input<ButtonSize>('md');
  readonly block = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });

  protected readonly classes = computed(() => {
    const size = this.size() === 'md' ? '' : ` btn--${this.size()}`;
    return `btn btn--${this.variant() || 'primary'}${size}${this.block() ? ' btn--block' : ''}`;
  });
}