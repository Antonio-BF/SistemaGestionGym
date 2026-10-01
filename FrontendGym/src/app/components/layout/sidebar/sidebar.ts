import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { APP_NAME } from '@app/core/constants/app.constants';
import { NAV_ITEMS } from '@app/core/constants/navigation.constants';
import { SessionService } from '@app/services/session.service';
import { Icon } from '../../shared/icon';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private readonly session = inject(SessionService);
  protected readonly appName = APP_NAME;
  readonly open = input(false);
  readonly closeRequested = output<void>();
  protected readonly items = computed(() => NAV_ITEMS.filter((i) => !i.roles || this.session.hasAnyRole(i.roles)));
}