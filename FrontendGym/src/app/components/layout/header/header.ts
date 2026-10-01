import { Component, inject, output } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { SessionService } from '@app/services/session.service';
import { Avatar } from '../../shared/avatar';
import { Badge } from '../../shared/badge';
import { AppButton } from '../../shared/button.directive';
import { Icon } from '../../shared/icon';

@Component({
  selector: 'app-header',
  imports: [Icon, Badge, Avatar, AppButton],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected readonly session = inject(SessionService);
  protected readonly auth = inject(AuthService);
  readonly menuToggle = output<void>();
}