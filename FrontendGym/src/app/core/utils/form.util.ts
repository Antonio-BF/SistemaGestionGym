import { AbstractControl, FormGroup } from '@angular/forms';

/** Mensaje de error de un control (solo si fue tocado/modificado). */
export function mensajeError(c: AbstractControl | null, mensajePatron?: string): string | null {
  if (!c || !c.errors || !(c.touched || c.dirty)) return null;
  const e = c.errors;
  if (e['server']) return String(e['server']);
  if (e['required']) return 'Este campo es obligatorio';
  if (e['email']) return 'Ingrese un email válido';
  if (e['minlength']) return `Mínimo ${e['minlength'].requiredLength} caracteres`;
  if (e['maxlength']) return `Máximo ${e['maxlength'].requiredLength} caracteres`;
  if (e['pattern']) return mensajePatron ?? 'El formato no es válido';
  if (e['fechaFutura']) return 'La fecha de nacimiento debe ser pasada';
  if (e['noCoincide']) return 'Las contraseñas no coinciden';
  return 'Valor inválido';
}

/** Vuelca validationErrors del backend en los controles con el mismo nombre. */
export function applyServerErrors(form: FormGroup, errores: Record<string, string> | null): boolean {
  if (!errores) return false;
  let aplicado = false;
  for (const [campo, mensaje] of Object.entries(errores)) {
    const control = form.get(campo);
    if (control) {
      control.setErrors({ server: mensaje });
      control.markAsTouched();
      aplicado = true;
    }
  }
  return aplicado;
}