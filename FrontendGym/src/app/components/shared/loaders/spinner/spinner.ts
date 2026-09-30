import { Component, input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: `<span class="spinner" [style.width.px]="size()" [style.height.px]="size()"></span>`,
  styles: `
    .spinner { display: inline-block; border-radius: 50%; border: 2px solid currentColor;
      border-right-color: transparent; animation: giro 0.7s linear infinite; color: var(--primary); }
    @keyframes giro { to { transform: rotate(360deg); } }
  `,
})
export class Spinner {
  readonly size = input(22);
}