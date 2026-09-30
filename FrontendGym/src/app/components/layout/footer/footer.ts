import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `<footer>© {{ year }} Gimnasio CIBERTEC · Sistema de gestión</footer>`,
  styles: `footer { padding: 16px 24px; text-align: center; color: var(--muted); font-size: .8rem; }`,
})
export class Footer {
  protected readonly year = new Date().getFullYear();
}