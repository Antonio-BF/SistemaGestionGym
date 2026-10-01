import { ValidatorFn } from '@angular/forms';

/** Fecha local YYYY-MM-DD. (toISOString() devuelve UTC y falla después de las 19:00 en Lima.) */
export function hoyISO(): string {
  const d = new Date();
  const dos = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
}

/** Equivale a @Past del backend (hoy NO es pasado). */
export const fechaPasada: ValidatorFn = (control) =>
  !control.value || control.value < hoyISO() ? null : { fechaFutura: true };

export function coincideCon(otroCampo: string): ValidatorFn {
  return (control) => {
    const otro = control.parent?.get(otroCampo);
    return otro && control.value !== otro.value ? { noCoincide: true } : null;
  };
}