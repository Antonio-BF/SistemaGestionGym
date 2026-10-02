
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { ROLES } from '@app/core/constants/app.constants';
import { parseApiError } from '@app/core/utils/http-error.util';
import { ResumenUsuarios } from '@app/models/dashboard.model';
import { Usuario } from '@app/models/user.model';
import { AuthService } from '@app/services/auth.service';
import { DashboardService } from '@app/services/dashboard.service';
import { ToastService } from '@app/services/toast.service';
import { StatCard } from '@app/components/shared/cards/stat-card/stat-card';
import { Spinner } from '@app/components/shared/loaders/spinner/spinner';

interface RegistroMensual {
  etiqueta: string;
  total: number;
  porcentaje: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, StatCard, Spinner, DatePipe, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  protected readonly auth = inject(AuthService);
  private readonly service = inject(DashboardService);
  private readonly toast = inject(ToastService);

  protected readonly Math = Math;

  protected readonly hoy = new Date();
  protected readonly resumen = signal<ResumenUsuarios | null>(null);
  protected readonly loading = signal(false);
  protected readonly loadingUsuarios = signal(false);

  protected readonly usuariosRecientes = signal<Usuario[]>([]);
  protected readonly nuevosEsteMes = signal(0);
  protected readonly nuevosMesAnterior = signal(0);
  protected readonly registrosMensuales = signal<RegistroMensual[]>([]);
  protected readonly totalRegistrosRecibidos = signal(0);

  protected readonly esStaff = computed(() =>
    this.auth.hasAnyRole([ROLES.ADMIN, ROLES.RECEPCION])
  );

  protected readonly esAdmin = computed(() =>
    this.auth.hasAnyRole([ROLES.ADMIN])
  );

  protected readonly maxRol = computed(() =>
    Math.max(1, ...(this.resumen()?.porRol.map(r => r.total) ?? [0]))
  );

  protected readonly variacionMensual = computed(() => {
    const actual = this.nuevosEsteMes();
    const anterior = this.nuevosMesAnterior();

    if (anterior === 0) {
      return actual > 0 ? null : 0;
    }

    return Math.round(((actual - anterior) / anterior) * 100);
  });

  protected readonly mesActualNombre = new Date().toLocaleDateString(
    'es-PE',
    { month: 'long', year: 'numeric' }
  );

  ngOnInit(): void {
    if (!this.esStaff()) return;

    this.cargarResumen();
    this.cargarUsuarios();
  }

  private cargarResumen(): void {
    this.loading.set(true);

    this.service.obtenerResumenUsuarios(this.esAdmin())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: r => this.resumen.set(r),
        error: e => this.toast.error(parseApiError(e).message),
      });
  }

  private cargarUsuarios(): void {
    this.loadingUsuarios.set(true);

    this.service.obtenerUsuariosParaEstadisticas()
      .pipe(finalize(() => this.loadingUsuarios.set(false)))
      .subscribe({
        next: usuarios => {
          this.totalRegistrosRecibidos.set(usuarios.length);
          this.usuariosRecientes.set(usuarios.slice(0, 5));
          this.calcularEstadisticasMensuales(usuarios);
        },
        error: e => this.toast.error(parseApiError(e).message),
      });
  }

  private calcularEstadisticasMensuales(usuarios: Usuario[]): void {
    const ahora = new Date();
    const mesActual = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const mesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);

    const fechas = usuarios
      .map(u => new Date(u.fechaRegistro))
      .filter(fecha => !Number.isNaN(fecha.getTime()));

    const contarMes = (mes: Date) =>
      fechas.filter(fecha =>
        fecha.getMonth() === mes.getMonth() &&
        fecha.getFullYear() === mes.getFullYear()
      ).length;

    this.nuevosEsteMes.set(contarMes(mesActual));
    this.nuevosMesAnterior.set(contarMes(mesAnterior));

    const meses: RegistroMensual[] = [];

    for (let i = 5; i >= 0; i--) {
      const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
      const total = contarMes(fecha);

      meses.push({
        etiqueta: fecha.toLocaleDateString('es-PE', { month: 'short' }),
        total,
        porcentaje: 0,
      });
    }

    const maximo = Math.max(1, ...meses.map(m => m.total));

    this.registrosMensuales.set(
      meses.map(m => ({
        ...m,
        porcentaje: m.total === 0 ? 0 : Math.max(4, (m.total / maximo) * 100),
      }))
    );
  }
}