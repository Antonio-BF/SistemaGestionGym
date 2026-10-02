import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Avatar } from '@app/components/shared/avatar';
import { Badge } from '@app/components/shared/badge';
import { AppButton } from '@app/components/shared/button.directive';
import { ListState } from '@app/components/shared/list-state';
import { PageHeader } from '@app/components/shared/page-header';
import { StatCard } from '@app/components/shared/stat-card';
import { ESTADO_TONE, PERMISOS } from '@app/core/constants/app.constants';
import { createLoader } from '@app/core/utils/loader';
import { DashboardService } from '@app/services/dashboard.service';
import { SessionService } from '@app/services/session.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, Avatar, Badge, AppButton, ListState, PageHeader, StatCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly session = inject(SessionService);
  private readonly service = inject(DashboardService);

  protected readonly nombre = computed(() => this.session.user()?.nombre ?? '');
  protected readonly esStaff = this.session.hasAnyRole(PERMISOS.usuarios.ver);
  protected readonly esAdmin = this.session.hasAnyRole(PERMISOS.roles.gestionar);
  protected readonly estadoTone = ESTADO_TONE;
  protected readonly dashboard = createLoader(() => this.service.obtenerDashboard(this.esAdmin));
  protected readonly maxRol = computed(() => Math.max(1, ...(this.dashboard.data()?.resumen.porRol.map((r) => r.total) ?? [])));
  protected readonly maxMensual = computed(() => Math.max(1, ...(this.dashboard.data()?.resumenMensual.map((m) => m.total) ?? [])));

  constructor() {
    if (this.esStaff) this.dashboard.load();
  }
}