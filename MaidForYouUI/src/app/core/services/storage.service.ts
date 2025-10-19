import { Injectable } from '@angular/core';
import { AuthResponseDto } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class StorageService {
    private TOKEN_KEY = 'auth_token';
    private USER_KEY = 'auth_user';

    private isBrowser(): boolean {
        return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    }

    saveToken(token: string): void {
        if (this.isBrowser()) {
            localStorage.setItem(this.TOKEN_KEY, token);
        }
    }

    getToken(): string | null {
        if (this.isBrowser()) {
            return localStorage.getItem(this.TOKEN_KEY);
        }
        return null;
    }

    saveUser(user: Omit<AuthResponseDto, 'token'>): void {
        if (this.isBrowser()) {
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        }
    }

    getUser(): Omit<AuthResponseDto, 'token'> | null {
        if (this.isBrowser()) {
            const user = localStorage.getItem(this.USER_KEY);
            return user ? JSON.parse(user) : null;
        }
        return null;
    }

    clear(): void {
        if (this.isBrowser()) {
            localStorage.removeItem(this.TOKEN_KEY);
            localStorage.removeItem(this.USER_KEY);
        }
    }
}
