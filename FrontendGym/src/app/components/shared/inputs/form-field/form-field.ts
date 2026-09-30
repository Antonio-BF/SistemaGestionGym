import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { mensajeError } from '@app/core/utils/form.util';

/** Envuelve cualquier <input>/<select>: etiqueta + mensaje de error + ayuda. */
@Component({
  selector: 'app-form-field',
  template: `
    <label class="field">
      @if (label()) {
        <span class="field__label">{{ label() }} @if (required()) { <span class="req">*</span> }</span>
      }
      <ng-content />
      @if (mensaje; as m) {
        <small class="field__error">{{ m }}</small>
      } @else if (hint()) {
        <small class="field__hint">{{ hint() }}</small>
      }
    </label>
  `,
})
export class FormField {
  readonly label = input('');
  readonly hint = input('');
  readonly required = input(false);
  readonly control = input<AbstractControl | null>(null);
  readonly mensajePatron = input<string | undefined>(undefined);

  protected get mensaje(): string | null {
    return mensajeError(this.control(), this.mensajePatron());
  }
}