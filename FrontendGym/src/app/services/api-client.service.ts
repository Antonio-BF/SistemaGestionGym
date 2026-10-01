import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL, PUBLIC_REQUEST } from '@app/core/constants/api.constants';
import { toHttpParams } from '@app/core/utils/http-params.util';

export interface ApiOptions {
    params?: object;
    /** true: endpoint público (sin token y sin logout ante 401). */
    public?: boolean;
}

/** Única puerta hacia HttpClient: URL base, query params y contexto en un solo lugar. */
@Injectable({ providedIn: 'root' })
export class ApiClient {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(API_BASE_URL);

    get<T>(path: string, opts?: ApiOptions) {
        return this.http.get<T>(this.baseUrl + path, this.config(opts));
    }
    post<T>(path: string, body: unknown, opts?: ApiOptions) {
        return this.http.post<T>(this.baseUrl + path, body, this.config(opts));
    }
    put<T>(path: string, body: unknown, opts?: ApiOptions) {
        return this.http.put<T>(this.baseUrl + path, body, this.config(opts));
    }
    patch<T>(path: string, body: unknown = {}, opts?: ApiOptions) {
        return this.http.patch<T>(this.baseUrl + path, body, this.config(opts));
    }
    delete<T>(path: string, opts?: ApiOptions) {
        return this.http.delete<T>(this.baseUrl + path, this.config(opts));
    }

    private config(opts?: ApiOptions) {
        return {
            params: toHttpParams(opts?.params),
            context: new HttpContext().set(PUBLIC_REQUEST, opts?.public ?? false),
        };
    }
}