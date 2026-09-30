import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Equivale a @Past del backend. */
export const fechaPasada: ValidatorFn = (c: AbstractControl): ValidationErrors | null => {
  if (!c.value) return null;
  const hoy = new Date().toISOString().slice(0, 10);
  return c.value < hoy ? null : { fechaFutura: true };
};

export function coincideCon(otroCampo: string): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null => {
    const otro = c.parent?.get(otroCampo);
    return otro && c.value !== otro.value ? { noCoincide: true } : null;
  };
}