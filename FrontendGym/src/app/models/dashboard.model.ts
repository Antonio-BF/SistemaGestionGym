import { Usuario } from './user.model';

export interface ConteoRol {
  nombre: string;
  total: number;
}

export interface ResumenMensual {
  clave: string;
  etiqueta: string;
  total: number;
}

export interface ResumenUsuarios {
  total: number;
  activos: number;
  inactivos: number;
  nuevosEsteMes: number;
  porRol: ConteoRol[];
}

export interface DashboardUsuarios {
  resumen: ResumenUsuarios;
  recientes: Usuario[];
  resumenMensual: ResumenMensual[];
}