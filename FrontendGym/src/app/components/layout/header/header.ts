import { Component, inject, output } from '@angular/core';
import { Badge } from '@app/components/shared/badges/badge/badge';
import { Icon } from '@app/components/shared/icons/icons';
import { InicialesPipe } from '@app/core/utils/iniciales.pipe';
import { AuthService } from '@app/services/auth.service';


@Component({
  selector: 'app-header',
  imports: [Icon, Badge, InicialesPipe],
  template: `
    <header class="header">
      <button class="btn btn--ghost btn--icon menu" aria-label="Menú" (click)="menuToggle.emit()"><app-icon name="menu" [size]="22" /></button>
      <span class="spacer"></span>
      @if (auth.sesion(); as s) {
        <div class="user">
          <span class="avatar">{{ s.nombre | iniciales: s.apellido }}</span>
          <div class="info"><strong>{{ s.nombre }} {{ s.apellido }}</strong><app-badge tone="blue">{{ s.rol }}</app-badge></div>
        </div>
      }
      <button class="btn btn--secondary btn--sm" (click)="auth.logout()"><app-icon name="logout" [size]="16" /> Salir</button>
    </header>
  `,
  styles: `
    .header { position: sticky; top: 0; z-index: 40; display: flex; align-items: center; gap: 14px; height: 60px; padding: 0 20px; background: #fff; border-bottom: 1px solid var(--border); }
    .spacer { flex: 1; }
    .user { display: flex; align-items: center; gap: 10px; }
    .info { display: flex; flex-direction: column; align-items: flex-start; line-height: 1.2; gap: 2px; }
    @media (min-width: 992px) { .menu { display: none; } }
    @media (max-width: 560px) { .info strong { display: none; } }
  `,
})
export class Header {
  protected readonly auth = inject(AuthService);
  readonly menuToggle = output<void>();
}