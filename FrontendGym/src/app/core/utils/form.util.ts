import { AbstractControl, FormGroup } from '@angular/forms';
import { ApiError } from '@app/models/error.model';

/** Mensaje de un control (solo si fue tocado o modificado). */
export function mensajeError(control: AbstractControl | null, mensajePatron?: string): string | null {
  const errors = control?.errors;
  if (!control || !errors || !(control.touched || control.dirty)) return null;
  if (errors['server']) return String(errors['server']);
  if (errors['required']) return 'Este campo es obligatorio';
  if (errors['email']) return 'Ingrese un email válido';
  if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
  if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
  if (errors['pattern']) return mensajePatron ?? 'El formato no es válido';
  if (errors['fechaFutura']) return 'La fecha de nacimiento debe ser pasada';
  if (errors['noCoincide']) return 'Las contraseñas no coinciden';
  return 'Valor inválido';
}

/**
 * Vuelca los fieldErrors del backend en los controles homónimos (los nombres coinciden con los DTO).
 * Devuelve el mensaje general que quedó sin ubicar, o null si todo se pintó en campos.
 * `fallbackControl`: para 400/409 de negocio sin campo (p. ej. "El nombre ya esta registrado").
 * Los errores de servidor se limpian solos cuando el usuario edita el campo.
 */
export function applyApiErrors(form: FormGroup, err: ApiError, fallbackControl?: string): string | null {
  let sinUbicar = false;
  for (const [campo, mensaje] of Object.entries(err.fieldErrors)) {
    const control = form.get(campo);
    if (control) {
      control.setErrors({ server: mensaje });
      control.markAsTouched();
    } else {
      sinUbicar = true;
    }
  }
  if (err.hasFieldErrors && !sinUbicar) return null;

  const destino = fallbackControl ? form.get(fallbackControl) : null;
  if (destino && (err.kind === 'conflict' || err.kind === 'bad-request')) {
    destino.setErrors({ server: err.message });
    destino.markAsTouched();
    return null;
  }
  return err.message;
}