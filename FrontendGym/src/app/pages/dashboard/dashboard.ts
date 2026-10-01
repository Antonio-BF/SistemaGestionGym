import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppButton } from '@app/components/shared/button.directive';
import { ListState } from '@app/components/shared/list-state';
import { PageHeader } from '@app/components/shared/page-header';
import { StatCard } from '@app/components/shared/stat-card';
import { PERMISOS } from '@app/core/constants/app.constants';
import { createLoader } from '@app/core/utils/loader';
import { DashboardService } from '@app/services/dashboard.service';
import { SessionService } from '@app/services/session.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, StatCard, ListState, PageHeader, AppButton],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly session = inject(SessionService);
  private readonly service = inject(DashboardService);

  protected readonly nombre = computed(() => this.session.user()?.nombre ?? '');
  protected readonly esStaff = this.session.hasAnyRole(PERMISOS.usuarios.ver);
  protected readonly esAdmin = this.session.hasAnyRole(PERMISOS.roles.gestionar);

  protected readonly resumen = createLoader(() => this.service.obtenerResumenUsuarios(this.esAdmin));
  protected readonly maxRol = computed(() =>
    Math.max(1, ...(this.resumen.data()?.porRol.map((r) => r.total) ?? [])),
  );

  constructor() {
    if (this.esStaff) this.resumen.load();
  }
}