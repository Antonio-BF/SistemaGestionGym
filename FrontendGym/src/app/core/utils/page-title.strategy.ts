import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { APP_NAME } from '@app/core/constants/app.constants';

/** Usa el `title` de cada ruta: "Usuarios · Gimnasio CIBERTEC". */
@Injectable({ providedIn: 'root' })
export class AppTitleStrategy extends TitleStrategy {
    private readonly title = inject(Title);

    override updateTitle(snapshot: RouterStateSnapshot): void {
        const t = this.buildTitle(snapshot);
        this.title.setTitle(t ? `${t} · ${APP_NAME}` : APP_NAME);
    }
}