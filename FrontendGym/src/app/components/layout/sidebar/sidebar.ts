import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Icon } from '@app/components/shared/icons/icons';
import { NAV_ITEMS } from '@app/core/constants/navigation.constants';
import { AuthService } from '@app/services/auth.service';


@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, Icon],
  template: `
    <div class="overlay" [class.show]="open()" (click)="closeRequested.emit()"></div>
    <aside class="sidebar" [class.open]="open()">
      <div class="brand">
        <span class="logo">G</span>
        <div><strong>Gimnasio</strong><small>CIBERTEC</small></div>
      </div>
      <nav>
        @for (item of items(); track item.route) {
          <a [routerLink]="item.route" routerLinkActive="active" (click)="closeRequested.emit()">
            <app-icon [name]="item.icon" /> {{ item.label }}
          </a>
        }
      </nav>
    </aside>
  `,
  styles: `
    .sidebar { position: fixed; inset: 0 auto 0 0; z-index: 60; width: 250px; padding: 20px 14px; background: var(--dark); color: #cfe0d6;
      transform: translateX(-100%); transition: transform 0.25s; }
    .sidebar.open { transform: none; }
    .overlay { position: fixed; inset: 0; z-index: 50; background: rgba(0,0,0,.45); opacity: 0; pointer-events: none; transition: opacity .25s; }
    .overlay.show { opacity: 1; pointer-events: auto; }
    .brand { display: flex; align-items: center; gap: 12px; padding: 4px 8px 24px; color: #fff; }
    .brand small { display: block; color: #7f9a8c; letter-spacing: .08em; }
    .logo { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 10px; background: var(--primary); font-weight: 700; }
    nav { display: flex; flex-direction: column; gap: 4px; }
    nav a { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; color: #b4c7bb; font-weight: 500; }
    nav a:hover { background: var(--dark-2); color: #fff; }
    nav a.active { background: var(--primary); color: #fff; }
    @media (min-width: 992px) { .sidebar { transform: none; } .overlay { display: none; } }
  `,
})
export class Sidebar {
  private readonly auth = inject(AuthService);
  readonly open = input(false);
  readonly closeRequested = output<void>();
  protected readonly items = computed(() => NAV_ITEMS.filter((i) => !i.roles || this.auth.hasAnyRole(i.roles)));
}