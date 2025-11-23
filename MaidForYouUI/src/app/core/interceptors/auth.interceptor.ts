// auth.interceptor.ts
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, Subject, of } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/api/auth.service';
import { Router } from '@angular/router';

// Simple in-file refresh guard so only one refresh runs at a time and pending requests wait
let isRefreshing = false;
const refreshSubject: Subject<string | null> = new Subject<string | null>();

export const authInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
    const storageService = inject(StorageService);
    const authService = inject(AuthService);
    const router = inject(Router);

    const token = storageService.getToken();

    const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    return next(authReq).pipe(
        catchError((err: any) => {
            if (err instanceof HttpErrorResponse && err.status === 401) {
                // Attempt refresh
                const refreshToken = storageService.getRefreshToken();
                if (!refreshToken) {
                    // No refresh token -> force logout
                    storageService.clear();
                    router.navigate(['/login']);
                    return throwError(() => err);
                }

                if (!isRefreshing) {
                    isRefreshing = true;
                    refreshSubject.next(null);

                    return authService.refreshToken(refreshToken).pipe(
                        switchMap((res: any) => {
                            isRefreshing = false;
                            if (res?.success && res.data?.token) {
                                const newToken = res.data.token;
                                storageService.saveToken(newToken);
                                if (res.data.refreshToken) {
                                    storageService.saveRefreshToken(res.data.refreshToken);
                                }
                                refreshSubject.next(newToken);
                                // retry original request with new token
                                const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
                                return next(retryReq);
                            }
                            // refresh failed -> clear and redirect
                            storageService.clear();
                            router.navigate(['/login']);
                            return throwError(() => err);
                        }),
                        catchError((refreshErr) => {
                            isRefreshing = false;
                            storageService.clear();
                            router.navigate(['/login']);
                            return throwError(() => refreshErr);
                        })
                    );
                }

                // If refresh is already in progress, queue the request until a new token is available
                return refreshSubject.pipe(
                    filter((t) => t != null),
                    take(1),
                    switchMap((t) => {
                        const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${t}` } });
                        return next(retryReq);
                    })
                );
            }

            return throwError(() => err);
        })
    );
};
