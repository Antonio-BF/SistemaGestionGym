import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL, API_PATHS } from '@app/core/constants/api.constants';
import { Rol, RolRequest } from '@app/models/role.model';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly http = inject(HttpClient);
  private readonly url = inject(API_BASE_URL) + API_PATHS.roles;

  listar(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.url);
  }

  obtener(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.url}/${id}`);
  }

  crear(req: RolRequest): Observable<Rol> {
    return this.http.post<Rol>(this.url, req);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}