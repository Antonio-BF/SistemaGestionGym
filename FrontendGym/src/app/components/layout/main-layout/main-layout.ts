import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Sidebar, Header, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  host: { '(document:keydown.escape)': 'menuOpen.set(false)' },
})
export class MainLayout {
  protected readonly menuOpen = signal(false);
}