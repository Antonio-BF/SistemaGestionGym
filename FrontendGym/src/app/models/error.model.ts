import { HttpErrorResponse } from '@angular/common/http';

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  validationErrors: Record<string, string> | null;
}

export type ApiErrorKind =
  | 'network' | 'unauthorized' | 'forbidden' | 'not-found'
  | 'conflict' | 'bad-request' | 'server' | 'unknown';

const MENSAJE_POR_TIPO: Record<ApiErrorKind, string> = {
  network: 'No se pudo conectar con el servidor',
  unauthorized: 'Tu sesión no es válida. Inicia sesión nuevamente',
  forbidden: 'No tienes permisos para realizar esta acción',
  'not-found': 'El recurso solicitado no existe',
  conflict: 'La operación no se puede completar por el estado actual de los datos',
  'bad-request': 'La solicitud no es válida',
  server: 'Error interno del servidor. Inténtalo nuevamente',
  unknown: 'Ocurrió un error inesperado',
};

function tipoPorEstado(status: number): ApiErrorKind {
  if (status === 0) return 'network';
  if (status === 400 || status === 422) return 'bad-request';
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not-found';
  if (status === 409) return 'conflict';
  return status >= 500 ? 'server' : 'unknown';
}

/** Error de API tipado: es lo único que ven las pantallas. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly kind: ApiErrorKind,
    readonly fieldErrors: Readonly<Record<string, string>> = {},
    readonly path: string | null = null,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get hasFieldErrors(): boolean {
    return Object.keys(this.fieldErrors).length > 0;
  }

  /** Normaliza cualquier valor lanzado por un Observable. */
  static from(e: unknown): ApiError {
    if (e instanceof ApiError) return e;
    if (e instanceof HttpErrorResponse) return ApiError.fromHttp(e);
    return new ApiError(-1, MENSAJE_POR_TIPO.unknown, 'unknown');
  }

  static fromHttp(err: HttpErrorResponse): ApiError {
    const kind = tipoPorEstado(err.status);
    const body = typeof err.error === 'object' && err.error !== null ? (err.error as Partial<ErrorResponse>) : null;
    const message = kind === 'network'
      ? MENSAJE_POR_TIPO.network
      : typeof body?.message === 'string' && body.message ? body.message : MENSAJE_POR_TIPO[kind];
    const campos = body?.validationErrors && typeof body.validationErrors === 'object' ? body.validationErrors : {};
    return new ApiError(err.status, message, kind, campos, typeof body?.path === 'string' ? body.path : null);
  }
}