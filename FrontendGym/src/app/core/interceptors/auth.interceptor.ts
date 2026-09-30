import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_BASE_URL, API_PATHS } from '@app/core/constants/api.constants';
import { TokenStorageService } from '@app/services/token-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const base = inject(API_BASE_URL);
  const token = inject(TokenStorageService).token;
  const esPublica = req.url === base + API_PATHS.login || req.url === base + API_PATHS.register;

  if (!token || !req.url.startsWith(base) || esPublica) return next(req);
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};