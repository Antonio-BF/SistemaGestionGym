import { Component, computed, input, output } from '@angular/core';
import { AppButton } from './button.directive';

@Component({
    selector: 'app-pagination',
    imports: [AppButton],
    template: `
    <span class="muted">{{ desde() }}–{{ hasta() }} de {{ total() }}</span>
    <div class="ctrl">
      <button appButton="secondary" size="sm" type="button" [disabled]="page() === 0" (click)="pageChange.emit(page() - 1)">Anterior</button>
      <span>Página {{ page() + 1 }} de {{ totalPages() || 1 }}</span>
      <button appButton="secondary" size="sm" type="button" [disabled]="page() + 1 >= totalPages()" (click)="pageChange.emit(page() + 1)">Siguiente</button>
    </div>
  `,
    styles: `
    :host { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; padding: 14px 20px; border-top: 1px solid var(--border); }
    .ctrl { display: flex; align-items: center; gap: 12px; }
  `,
})
export class Pagination {
    readonly page = input.required<number>();
    readonly totalPages = input.required<number>();
    readonly total = input.required<number>();
    readonly size = input.required<number>();
    readonly pageChange = output<number>();

    protected readonly desde = computed(() => (this.total() === 0 ? 0 : this.page() * this.size() + 1));
    protected readonly hasta = computed(() => Math.min(this.total(), (this.page() + 1) * this.size()));
}