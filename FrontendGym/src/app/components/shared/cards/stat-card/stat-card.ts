import { Component, input } from '@angular/core';
import { Icon, IconName } from '../../icons/icons';


@Component({
  selector: 'app-stat-card',
  imports: [Icon],
  template: `
    <div class="card stat">
      <span class="stat__icon" [class]="'stat__icon tone-' + tone()"><app-icon [name]="icon()" [size]="22" /></span>
      <div>
        <small class="muted">{{ label() }}</small>
        <strong class="stat__value">{{ value() }}</strong>
      </div>
    </div>
  `,
  styles: `
    .stat { display: flex; align-items: center; gap: 16px; padding: 18px 20px; }
    .stat__value { display: block; font-size: 1.6rem; line-height: 1.1; }
    .stat__icon { display: grid; place-items: center; width: 46px; height: 46px; border-radius: 12px; }
    .tone-green { background: var(--primary-soft); color: var(--primary-dark); }
    .tone-red { background: var(--danger-soft); color: var(--danger); }
    .tone-blue { background: var(--info-soft); color: var(--info); }
    .tone-amber { background: var(--warning-soft); color: var(--warning); }
  `,
})
export class StatCard {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly icon = input<IconName>('grid');
  readonly tone = input<'green' | 'red' | 'blue' | 'amber'>('green');
}