// src/app/core/models/auth.model.ts

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    errors: string[];
    statusCode: number;
    correlationId?: string;
    validationErrors: Record<string, string[]>;
}

export interface AuthResponseDto {
    token: string;
    role: string;
    email: string;
    fullName: string;
}

export interface RegisterRequestDto {
    fullName: string;
    email: string;
    password: string;
    role?: string;
}


export interface LoginRequestDto {
    email: string;
    password: string;
}
export interface StoredUser {
    fullName: string;
    email: string;
    role: string;
}