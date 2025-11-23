// auth.interceptor.ts
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';

export const authInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
    const storageService = inject(StorageService);
    const token = storageService.getToken();

    const cloned = token
        ? req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        })
        : req;

    return next(cloned);
};
