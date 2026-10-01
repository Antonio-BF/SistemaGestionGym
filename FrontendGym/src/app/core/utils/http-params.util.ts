import { HttpParams } from '@angular/common/http';

/** Omite null/undefined/'' para que el backend trate el filtro como "sin filtro". */
export function toHttpParams(params: object = {}): HttpParams {
    let result = new HttpParams();
    for (const [clave, valor] of Object.entries(params)) {
        if (valor !== null && valor !== undefined && valor !== '') result = result.set(clave, String(valor));
    }
    return result;
}