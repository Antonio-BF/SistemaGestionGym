import { Component, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map, Subject } from 'rxjs';
import { REGLAS, SEARCH_DEBOUNCE_MS } from '@app/core/constants/app.constants';
import { Icon } from './icon';

/** Búsqueda con debounce: emite solo cuando el usuario deja de escribir. */
@Component({
    selector: 'app-search-box',
    imports: [Icon],
    template: `
    <app-icon name="search" [size]="16" />
    <input #box class="input" type="search" [placeholder]="placeholder()" [attr.aria-label]="placeholder()"
           [attr.maxlength]="max" (input)="typed$.next(box.value)" />
  `,
    styles: `
    :host { position: relative; display: block; flex: 1 1 240px; }
    app-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--muted); }
    input { padding-left: 34px; }
  `,
})
export class SearchBox {
    readonly placeholder = input('Buscar…');
    readonly searchChange = output<string>();

    protected readonly max = REGLAS.busquedaMax;
    protected readonly typed$ = new Subject<string>();

    constructor() {
        this.typed$
            .pipe(debounceTime(SEARCH_DEBOUNCE_MS), map((v) => v.trim()), distinctUntilChanged(), takeUntilDestroyed())
            .subscribe((v) => this.searchChange.emit(v));
    }
}