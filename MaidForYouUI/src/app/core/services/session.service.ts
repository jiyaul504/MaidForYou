import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { StorageService } from './storage.service';
import { AuthService } from './api/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class SessionService {
    // whether modal should be visible
    public showModal$ = new BehaviorSubject<boolean>(false);
    public countdown$ = new BehaviorSubject<number>(0);

    private popupTimerId: any = null;
    private countdownSub: Subscription | null = null;

    constructor(
        private storage: StorageService,
        private auth: AuthService,
        private router: Router,
        private toastr: ToastrService,
        private ngZone: NgZone
    ) {
        // react to token changes (login/logout)
        this.storage.token$.subscribe((t) => {
            this.clearTimers();
            if (t) {
                this.schedulePopupForToken(t);
            }
        });

        // Initialize if token already present on app load
        const initial = this.storage.getToken();
        if (initial) {
            this.schedulePopupForToken(initial);
        }
    }

    private decodeJwt(token: string): any {
        try {
            const payload = token.split('.')[1];
            const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
            return JSON.parse(decodeURIComponent(escape(decoded)));
        } catch {
            return null;
        }
    }

    private schedulePopupForToken(token: string) {
        const payload = this.decodeJwt(token);
        if (!payload || !payload.exp) return;

        const expMs = payload.exp * 1000;
        const now = Date.now();
        const msUntilExp = expMs - now;

        // show popup 60 seconds before expiry, or immediately if already expired
        const showIn = msUntilExp > 60000 ? msUntilExp - 60000 : 0;

        this.popupTimerId = setTimeout(() => {
            // Remaining seconds to expiry
            const remaining = Math.max(0, Math.ceil((expMs - Date.now()) / 1000));
            const showSeconds = Math.max(60, remaining); // show at least 60s timer
            this.startCountdown(showSeconds);
        }, showIn);
    }

    private startCountdown(seconds: number) {
        this.countdown$.next(seconds);
        this.showModal$.next(true);

        // Run countdown outside Angular to avoid change detection spam
        this.ngZone.runOutsideAngular(() => {
            this.countdownSub = interval(1000).subscribe(() => {
                const current = this.countdown$.value - 1;
                this.ngZone.run(() => this.countdown$.next(current));
                if (current <= 0) {
                    this.ngZone.run(() => {
                        this.closeAndRedirect();
                    });
                }
            });
        });
    }

    private clearTimers() {
        if (this.popupTimerId) {
            clearTimeout(this.popupTimerId);
            this.popupTimerId = null;
        }
        if (this.countdownSub) {
            this.countdownSub.unsubscribe();
            this.countdownSub = null;
        }
        this.showModal$.next(false);
        this.countdown$.next(0);
    }

    continueSession() {
        const refresh = this.storage.getRefreshToken();
        if (!refresh) {
            this.toastr.error('No refresh token available. Please login again.');
            this.router.navigate(['/login']);
            return;
        }

        this.auth.refreshToken(refresh).subscribe({
            next: (res) => {
                if (res?.success && res.data?.token) {
                    this.storage.saveToken(res.data.token);
                    if (res.data.refreshToken) this.storage.saveRefreshToken(res.data.refreshToken);
                    this.toastr.success('Session extended');
                    this.clearTimers();
                } else {
                    this.toastr.error(res.message || 'Could not refresh session');
                    this.logoutAndRedirect();
                }
            },
            error: () => {
                this.toastr.error('Session refresh failed. Please login again.');
                this.logoutAndRedirect();
            }
        });
    }

    loginNow() {
        this.logoutAndRedirect();
    }

    private logoutAndRedirect() {
        this.storage.clear();
        this.clearTimers();
        this.router.navigate(['/login']);
    }

    private closeAndRedirect() {
        this.clearTimers();
        this.router.navigate(['/login']);
    }
}
