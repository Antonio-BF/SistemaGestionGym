import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL, API_PATHS } from '@app/core/constants/api.constants';
import { CambioPasswordRequest, PerfilUpdateRequest, Usuario } from '@app/models/user.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly url = inject(API_BASE_URL) + API_PATHS.perfil;

  obtener(): Observable<Usuario> {
    return this.http.get<Usuario>(this.url);
  }

  actualizar(req: PerfilUpdateRequest): Observable<Usuario> {
    return this.http.put<Usuario>(this.url, req);
  }

  cambiarPassword(req: CambioPasswordRequest): Observable<void> {
    return this.http.patch<void>(`${this.url}/password`, req); // 204
  }
}