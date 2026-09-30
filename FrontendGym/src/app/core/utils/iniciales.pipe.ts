import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'iniciales' })
export class InicialesPipe implements PipeTransform {
  transform(nombre?: string | null, apellido?: string | null): string {
    return `${nombre?.charAt(0) ?? ''}${apellido?.charAt(0) ?? ''}`.toUpperCase() || '?';
  }
}