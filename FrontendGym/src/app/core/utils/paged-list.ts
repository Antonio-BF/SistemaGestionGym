import { computed, Signal, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { PAGE_SIZE } from '@app/core/constants/app.constants';
import { PageQuery, Pagina } from '@app/models/common.model';
import { ApiError } from '@app/models/error.model';

export interface PagedListConfig<T, F extends object> {
    filters: F;
    fetch: (query: PageQuery<F>) => Observable<Pagina<T>>;
    pageSize?: number;
    /** Se invoca solo si ya había datos en pantalla (en la primera carga el error se muestra inline). */
    onRefreshError?: (error: ApiError) => void;
}

export interface PagedList<T, F extends object> {
    readonly items: Signal<T[]>;
    readonly pagina: Signal<Pagina<T> | null>;
    readonly loading: Signal<boolean>;
    readonly error: Signal<ApiError | null>;
    readonly filters: Signal<F>;
    setFilters(patch: Partial<F>): void; // fusiona filtros y vuelve a la página 0
    goTo(page: number): void;
    reload(): void;
}

type Outcome<T> = { ok: Pagina<T> } | { fail: ApiError };

/**
 * Listado paginado reutilizable. Debe llamarse en un contexto de inyección (inicializador de campo).
 * switchMap cancela la petición anterior, así que no hay respuestas desordenadas, y varios cambios
 * en el mismo tick (filtro + página) producen UNA sola petición.
 */
export function createPagedList<T, F extends object>(config: PagedListConfig<T, F>): PagedList<T, F> {
    const size = config.pageSize ?? PAGE_SIZE;
    const filters = signal<F>(config.filters);
    const page = signal(0);
    const refresh = signal(0);
    const data = signal<Pagina<T> | null>(null);
    const loading = signal(false);
    const error = signal<ApiError | null>(null);

    const request = computed(() => {
        refresh(); // dependencia: reload() fuerza una nueva petición
        return { ...filters(), page: page(), size } as PageQuery<F>;
    });

    toObservable(request)
        .pipe(
            tap(() => {
                loading.set(true);
                error.set(null);
            }),
            switchMap((query): Observable<Outcome<T>> =>
                config.fetch(query).pipe(
                    map((ok) => ({ ok })),
                    catchError((e: unknown) => of({ fail: ApiError.from(e) })),
                ),
            ),
            takeUntilDestroyed(),
        )
        .subscribe((outcome) => {
            if ('fail' in outcome) {
                error.set(outcome.fail);
                loading.set(false);
                if (data()) config.onRefreshError?.(outcome.fail);
                return;
            }
            const res = outcome.ok;
            // Se borró el último elemento de la última página: retrocede en vez de mostrar una página vacía
            if (res.contenido.length === 0 && res.pagina > 0) {
                page.set(Math.max(res.totalPaginas - 1, 0));
                return;
            }
            data.set(res);
            loading.set(false);
        });

    return {
        items: computed(() => data()?.contenido ?? []),
        pagina: data.asReadonly(),
        loading: loading.asReadonly(),
        error: error.asReadonly(),
        filters: filters.asReadonly(),
        setFilters: (patch) => {
            filters.update((f) => ({ ...f, ...patch }));
            page.set(0);
        },
        goTo: (p) => page.set(p),
        reload: () => refresh.update((n) => n + 1),
    };
}