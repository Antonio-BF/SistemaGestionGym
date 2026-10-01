import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_PATHS } from '@app/core/constants/api.constants';
import { PageQuery, Pagina } from '@app/models/common.model';
import { Usuario, UsuarioCreateRequest, UsuarioFiltros, UsuarioUpdateRequest } from '@app/models/user.model';
import { ApiClient } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly api = inject(ApiClient);
  private readonly path = API_PATHS.usuarios;

  listar(f: PageQuery<UsuarioFiltros>): Observable<Pagina<Usuario>> {
    return this.api.get<Pagina<Usuario>>(this.path, {
      params: { q: f.q?.trim(), rolId: f.rolId, estado: f.estado, page: f.page, size: f.size },
    });
  }

  obtener(id: number): Observable<Usuario> {
    return this.api.get<Usuario>(`${this.path}/${id}`);
  }

  crear(req: UsuarioCreateRequest): Observable<Usuario> {
    return this.api.post<Usuario>(this.path, req);
  }

  actualizar(id: number, req: UsuarioUpdateRequest): Observable<Usuario> {
    return this.api.put<Usuario>(`${this.path}/${id}`, req);
  }

  activar(id: number): Observable<Usuario> {
    return this.api.patch<Usuario>(`${this.path}/${id}/activar`);
  }

  desactivar(id: number): Observable<Usuario> {
    return this.api.patch<Usuario>(`${this.path}/${id}/desactivar`);
  }
}