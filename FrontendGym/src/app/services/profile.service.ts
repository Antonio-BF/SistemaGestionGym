import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_PATHS } from '@app/core/constants/api.constants';
import { CambioPasswordRequest, PerfilUpdateRequest, Usuario } from '@app/models/user.model';
import { ApiClient } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly api = inject(ApiClient);
  private readonly path = API_PATHS.perfil;

  obtener(): Observable<Usuario> {
    return this.api.get<Usuario>(this.path);
  }

  actualizar(req: PerfilUpdateRequest): Observable<Usuario> {
    return this.api.put<Usuario>(this.path, req);
  }

  cambiarPassword(req: CambioPasswordRequest): Observable<void> {
    return this.api.patch<void>(`${this.path}/password`, req);
  }
}