import { Component, input } from '@angular/core';

/** Título + subtítulo; el contenido proyectado son las acciones. */
@Component({
    selector: 'app-page-header',
    template: `
    <div>
      <h1>{{ title() }}</h1>
      @if (subtitle()) { <p class="muted">{{ subtitle() }}</p> }
    </div>
    <div class="actions"><ng-content /></div>
  `,
    styles: `
    :host { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 20px; }
    .actions { display: flex; gap: 8px; }
  `,
})
export class PageHeader {
    readonly title = input.required<string>();
    readonly subtitle = input('');
}