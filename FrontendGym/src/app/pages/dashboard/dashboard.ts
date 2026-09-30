import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ROLES } from '@app/core/constants/app.constants';
import { parseApiError } from '@app/core/utils/http-error.util';
import { ResumenUsuarios } from '@app/models/dashboard.model';
import { AuthService } from '@app/services/auth.service';
import { DashboardService } from '@app/services/dashboard.service';
import { ToastService } from '@app/services/toast.service';
import { StatCard } from '@app/components/shared/cards/stat-card/stat-card';
import { Spinner } from '@app/components/shared/loaders/spinner/spinner';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, StatCard, Spinner],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  protected readonly auth = inject(AuthService);
  private readonly service = inject(DashboardService);
  private readonly toast = inject(ToastService);

  protected readonly resumen = signal<ResumenUsuarios | null>(null);
  protected readonly loading = signal(false);

  protected readonly esStaff = computed(() => this.auth.hasAnyRole([ROLES.ADMIN, ROLES.RECEPCION]));
  protected readonly esAdmin = computed(() => this.auth.hasAnyRole([ROLES.ADMIN]));
  protected readonly maxRol = computed(() => Math.max(1, ...(this.resumen()?.porRol.map((r) => r.total) ?? [0])));

  ngOnInit(): void {
    if (!this.esStaff()) return;
    this.loading.set(true);
    this.service
      .obtenerResumenUsuarios(this.esAdmin())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (r) => this.resumen.set(r),
        error: (e) => this.toast.error(parseApiError(e).message),
      });
  }
}