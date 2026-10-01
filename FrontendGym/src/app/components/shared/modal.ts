import { afterNextRender, Component, ElementRef, input, output, viewChild } from '@angular/core';
import { AppButton } from './button.directive';
import { Icon } from './icon';

let siguienteId = 0;

/**
 * Basado en <dialog> nativo: focus trap, aria-modal e inert del fondo gratis.
 * El padre lo monta con @if; Esc y clic en el fondo emiten (closed) y el padre decide si cierra.
 * Un arrastre (mousedown dentro / mouseup fuera) NO cierra, así no se pierden datos.
 */
@Component({
    selector: 'app-modal',
    imports: [Icon, AppButton],
    template: `
    <dialog #dlg [class]="'dialog--' + size()" [attr.aria-labelledby]="titleId"
            (cancel)="onCancel($event)" (mousedown)="onMouseDown($event)" (click)="onClick($event)">
      <div class="panel">
        <header>
          <h2 [id]="titleId">{{ title() }}</h2>
          <button appButton="ghost" size="icon" type="button" aria-label="Cerrar" (click)="closed.emit()">
            <app-icon name="x" />
          </button>
        </header>
        <div class="body"><ng-content /></div>
        <footer><ng-content select="[modal-footer]" /></footer>
      </div>
    </dialog>
  `,
    styles: `
    dialog { width: calc(100% - 32px); max-height: 90dvh; padding: 0; border: 0; border-radius: 12px;
      background: #fff; color: var(--text); box-shadow: 0 20px 50px rgba(0, 0, 0, .25); overflow: hidden; }
    dialog::backdrop { background: rgba(20, 33, 27, .55); }
    .dialog--sm { max-width: 400px; } .dialog--md { max-width: 580px; } .dialog--lg { max-width: 740px; }
    .panel { display: flex; flex-direction: column; max-height: 90dvh; }
    header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); }
    .body { padding: 20px; overflow-y: auto; }
    footer { display: flex; justify-content: flex-end; gap: 10px; padding: 14px 20px; border-top: 1px solid var(--border); }
    footer:empty { display: none; }
    :host ::ng-deep [modal-footer] { display: flex; gap: 10px; }
  `,
})
export class Modal {
    readonly title = input.required<string>();
    readonly size = input<'sm' | 'md' | 'lg'>('md');
    readonly closed = output<void>();

    protected readonly titleId = `modal-title-${++siguienteId}`;
    private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');
    private pressedOnBackdrop = false;

    constructor() {
        afterNextRender(() => {
            const d = this.dialog().nativeElement;
            if (!d.open) d.showModal();
        });
    }

    protected onCancel(e: Event): void {
        e.preventDefault(); 
        this.closed.emit();
    }

    protected onMouseDown(e: MouseEvent): void {
        this.pressedOnBackdrop = e.target === this.dialog().nativeElement;
    }

    protected onClick(e: MouseEvent): void {
        if (this.pressedOnBackdrop && e.target === this.dialog().nativeElement) this.closed.emit();
        this.pressedOnBackdrop = false;
    }
}