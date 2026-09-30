import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL, API_PATHS } from '@app/core/constants/api.constants';
import { toHttpParams } from '@app/core/utils/http-params.util';
import { Pagina } from '@app/models/page.model';
import { Usuario, UsuarioCreateRequest, UsuarioFiltros, UsuarioUpdateRequest } from '@app/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly url = inject(API_BASE_URL) + API_PATHS.usuarios;

  listar(f: UsuarioFiltros = {}): Observable<Pagina<Usuario>> {
    const params = toHttpParams({
      q: f.q?.trim(),
      rolId: f.rolId,
      estado: f.estado,
      page: f.page ?? 0,
      size: f.size ?? 10,
    });
    return this.http.get<Pagina<Usuario>>(this.url, { params });
  }

  obtener(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/${id}`);
  }

  crear(req: UsuarioCreateRequest): Observable<Usuario> {
    return this.http.post<Usuario>(this.url, req);
  }

  actualizar(id: number, req: UsuarioUpdateRequest): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.url}/${id}`, req);
  }

  activar(id: number): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.url}/${id}/activar`, {});
  }

  desactivar(id: number): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.url}/${id}/desactivar`, {});
  }
}