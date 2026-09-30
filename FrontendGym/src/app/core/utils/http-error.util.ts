import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponse } from '@app/models/error.model';

export interface ApiError {
  status: number;
  message: string;
  validationErrors: Record<string, string> | null;
}

export function parseApiError(err: unknown, fallback = 'Ocurrió un error inesperado'): ApiError {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) {
      return { status: 0, message: 'No se pudo conectar con el servidor', validationErrors: null };
    }
    const body = err.error as Partial<ErrorResponse> | null;
    return {
      status: err.status,
      message: body?.message ?? fallback,
      validationErrors: body?.validationErrors ?? null,
    };
  }
  return { status: -1, message: fallback, validationErrors: null };
}