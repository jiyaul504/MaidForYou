import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import {
    RegisterRequestDto,
    LoginRequestDto,
    AuthResponseDto,
    ApiResponse
} from '../../models/auth.model';
import { EncryptionService } from '../encryption.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private baseUrl = `${environment.apiBaseUrl}/auth`;

    constructor(
        private http: HttpClient,
        private encryption: EncryptionService
    ) { }

    register(request: RegisterRequestDto): Observable<ApiResponse<AuthResponseDto>> {
        const plainRequest = {
            fullName: request.fullName,
            email: request.email,
            password: request.password,
            role: request.role || 'Customer'
        };

        return this.http.post<ApiResponse<AuthResponseDto>>(
            `${this.baseUrl}/register`,
            plainRequest
        );
    }

    login(request: LoginRequestDto): Observable<ApiResponse<AuthResponseDto>> {
        const encryptedRequest = {
            email: this.encryption.encrypt(request.email),
            password: this.encryption.encrypt(request.password)
        };

        return this.http.post<ApiResponse<AuthResponseDto>>(
            `${this.baseUrl}/login`,
            encryptedRequest
        );
    }

    logout(): Observable<ApiResponse<string>> {
        return this.http.post<ApiResponse<string>>(`${this.baseUrl}/logout`, {});
    }

    updateProfile(profile: { fullName?: string; email?: string }): Observable<ApiResponse<AuthResponseDto>> {
        return this.http.put<ApiResponse<AuthResponseDto>>(`${this.baseUrl}/profile`, profile);
    }
}
