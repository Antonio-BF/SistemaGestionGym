import { Component, computed, contentChild, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NgControl, Validators } from '@angular/forms';
import { of, scan, startWith, switchMap } from 'rxjs';
import { mensajeError } from '@app/core/utils/form.util';

/**
 * Etiqueta + error + ayuda alrededor de cualquier <input>/<select> con formControlName.
 * Detecta solo el control (sin [control]) y el asterisco de "obligatorio" (Validators.required).
 * Se repinta con control.events (valor, estado, touched), así que también refleja los errores
 * del servidor (setErrors) en una app zoneless.
 */
@Component({
    selector: 'app-form-field',
    template: `
    <label class="wrap">
      @if (label()) {
        <span class="label">{{ label() }}@if (required()) { <span class="req"> *</span> }</span>
      }
      <ng-content />
    </label>
    @if (mensaje(); as m) {
      <small class="error" role="alert">{{ m }}</small>
    } @else if (hint()) {
      <small class="hint">{{ hint() }}</small>
    }
  `,
    styles: `
    :host { display: block; margin-bottom: 14px; }
    .wrap { display: flex; flex-direction: column; gap: 6px; }
    .label { font-size: .8rem; font-weight: 500; }
    .req, .error { color: var(--danger); }
    .hint { color: var(--muted); }
    small { display: block; margin-top: 6px; }
  `,
})
export class FormField {
    readonly label = input('');
    readonly hint = input('');
    readonly patternMessage = input<string>();

    private readonly ngControl = contentChild(NgControl);
    private readonly control = computed(() => this.ngControl()?.control ?? null);

    /** Contador que se incrementa con cada evento del control (los signals comparan por valor). */
    private readonly cambios = toSignal(
        toObservable(this.control).pipe(
            switchMap((c) => (c ? c.events.pipe(startWith(null)) : of(null))),
            scan((n) => n + 1, 0),
        ),
        { initialValue: 0 },
    );

    protected readonly mensaje = computed(() => {
        this.cambios();
        return mensajeError(this.control(), this.patternMessage());
    });

    protected readonly required = computed(() => {
        this.cambios();
        return this.control()?.hasValidator(Validators.required) ?? false;
    });
}