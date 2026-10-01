import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_BASE_URL, PUBLIC_REQUEST } from '@app/core/constants/api.constants';
import { SessionService } from '@app/services/session.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(SessionService).token();
  const esApiPropia = req.url.startsWith(inject(API_BASE_URL));

  if (!token || !esApiPropia || req.context.get(PUBLIC_REQUEST)) return next(req);
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};