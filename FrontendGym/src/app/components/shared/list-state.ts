import { Component, computed, input, output } from '@angular/core';
import { ApiError } from '@app/models/error.model';
import { AppButton } from './button.directive';

/**
 * Estados de un listado: primera carga, error con reintento, vacío y contenido.
 * Mientras se refresca con datos en pantalla, el contenido se atenúa (no parpadea).
 */
@Component({
    selector: 'app-list-state',
    imports: [AppButton],
    template: `
    @if (errorMessage(); as msg) {
      <div class="state" role="alert">
        <p>{{ msg }}</p>
        <button appButton="secondary" size="sm" type="button" (click)="retry.emit()">Reintentar</button>
      </div>
    } @else if (loading() && empty()) {
      <div class="state"><span class="spinner" role="status" aria-label="Cargando"></span></div>
    } @else if (empty()) {
      <div class="state muted">{{ emptyText() }}</div>
    } @else {
      <div [class.refreshing]="loading()"><ng-content /></div>
    }
  `,
    styles: `
    .state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 40px 20px; text-align: center; }
    .refreshing { opacity: .6; transition: opacity .15s; }
  `,
})
export class ListState {
    readonly loading = input(false);
    readonly empty = input(false);
    readonly error = input<ApiError | null>(null);
    readonly emptyText = input('No hay registros para mostrar.');
    readonly retry = output<void>();

    protected readonly errorMessage = computed(() => (this.empty() ? (this.error()?.message ?? null) : null));
}