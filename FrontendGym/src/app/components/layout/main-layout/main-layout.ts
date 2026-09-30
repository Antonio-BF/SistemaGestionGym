import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Sidebar, Header, Footer],
  template: `
    <app-sidebar [open]="menuOpen()" (closeRequested)="menuOpen.set(false)" />
    <div class="main">
      <app-header (menuToggle)="menuOpen.set(!menuOpen())" />
      <main class="content"><router-outlet /></main>
      <app-footer />
    </div>
  `,
  styles: `
    .main { display: flex; flex-direction: column; min-height: 100vh; }
    .content { flex: 1; padding: 24px 20px; width: 100%; max-width: 1280px; margin: 0 auto; }
    @media (min-width: 992px) { .main { margin-left: 250px; } .content { padding: 28px 32px; } }
  `,
})
export class MainLayout {
  protected readonly menuOpen = signal(false);
}