import { HttpParams } from '@angular/common/http';

type Valor = string | number | boolean | null | undefined;

/** Omite null/undefined/'' para que el backend trate el filtro como "sin filtro". */
export function toHttpParams(obj: Record<string, Valor>): HttpParams {
    let params = new HttpParams();
    for (const [clave, valor] of Object.entries(obj)) {
        if (valor !== null && valor !== undefined && valor !== '') {
            params = params.set(clave, String(valor));
        }
    }
    return params;
}