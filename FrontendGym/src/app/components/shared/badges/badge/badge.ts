import { Component, input } from '@angular/core';

export type BadgeTone = 'green' | 'red' | 'blue' | 'amber' | 'gray';

@Component({
  selector: 'app-badge',
  template: `<span class="badge" [class]="'badge tone-' + tone()"><ng-content /></span>`,
  styles: `
    .badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
    .tone-green { background: var(--primary-soft); color: var(--primary-dark); }
    .tone-red { background: var(--danger-soft); color: var(--danger); }
    .tone-blue { background: var(--info-soft); color: var(--info); }
    .tone-amber { background: var(--warning-soft); color: var(--warning); }
    .tone-gray { background: #eceeea; color: var(--muted); }
  `,
})
export class Badge {
  readonly tone = input<BadgeTone>('gray');
}