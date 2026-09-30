export interface ConteoRol { nombre: string; total: number; }

export interface ResumenUsuarios {
  total: number;
  activos: number;
  inactivos: number;
  porRol: ConteoRol[];
}