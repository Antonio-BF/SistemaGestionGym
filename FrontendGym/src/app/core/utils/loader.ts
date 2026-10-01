import { DestroyRef, inject, signal, Signal } from '@angular/core';
import { finalize, Observable, Subscription } from 'rxjs';
import { ApiError } from '@app/models/error.model';

export interface Loader<T> {
    readonly data: Signal<T | null>;
    readonly loading: Signal<boolean>;
    readonly error: Signal<ApiError | null>;
    load(): void;
}

/** Carga puntual con estado (data/loading/error). Cancela la petición previa y al destruir el componente. */
export function createLoader<T>(source: () => Observable<T>): Loader<T> {
    const data = signal<T | null>(null);
    const loading = signal(false);
    const error = signal<ApiError | null>(null);
    let sub: Subscription | undefined;

    inject(DestroyRef).onDestroy(() => sub?.unsubscribe());

    return {
        data: data.asReadonly(),
        loading: loading.asReadonly(),
        error: error.asReadonly(),
        load: () => {
            sub?.unsubscribe();
            loading.set(true);
            error.set(null);
            sub = source()
                .pipe(finalize(() => loading.set(false)))
                .subscribe({
                    next: (value) => data.set(value),
                    error: (e: unknown) => error.set(ApiError.from(e)),
                });
        },
    };
}