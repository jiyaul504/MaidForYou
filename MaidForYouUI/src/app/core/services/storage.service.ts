import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StoredUser } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class StorageService {
    private TOKEN_KEY = 'auth_token';
    private REFRESH_KEY = 'refresh_token';
    private USER_KEY = 'auth_user';

    // Observable token stream for other services to react to login/logout
    public token$ = new BehaviorSubject<string | null>(this.getToken());

    private isBrowser(): boolean {
        return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    }

    saveToken(token: string): void {
        if (this.isBrowser()) {
            localStorage.setItem(this.TOKEN_KEY, token);
            this.token$.next(token);
        }
    }

    saveRefreshToken(refreshToken: string): void {
        if (this.isBrowser()) {
            localStorage.setItem(this.REFRESH_KEY, refreshToken);
        }
    }

    getToken(): string | null {
        if (this.isBrowser()) {
            return localStorage.getItem(this.TOKEN_KEY);
        }
        return null;
    }

    getRefreshToken(): string | null {
        if (this.isBrowser()) {
            return localStorage.getItem(this.REFRESH_KEY);
        }
        return null;
    }

    saveUser(user: StoredUser): void {
        if (this.isBrowser()) {
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        }
    }

    getUser(): StoredUser | null {
        if (this.isBrowser()) {
            const user = localStorage.getItem(this.USER_KEY);
            return user ? JSON.parse(user) : null;
        }
        return null;
    }

    clear(): void {
        if (this.isBrowser()) {
            localStorage.removeItem(this.TOKEN_KEY);
            localStorage.removeItem(this.REFRESH_KEY);
            localStorage.removeItem(this.USER_KEY);
            this.token$.next(null);
        }
    }
}
