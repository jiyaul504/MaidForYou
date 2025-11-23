// src/app/core/services/api/maid.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/core/models/auth.model';
import { MaidDto } from '../../models/maidDto';

@Injectable({
    providedIn: 'root'
})
export class MaidService {
    private readonly baseUrl = `${environment.apiBaseUrl}/maid`;

    constructor(private http: HttpClient) { }

    /**
     * GET: api/maid/available
     */
    getAvailableMaids(): Observable<ApiResponse<MaidDto[]>> {
        return this.http.get<ApiResponse<MaidDto[]>>(`${this.baseUrl}/available`);
    }

    /**
     * GET: api/maid/{id}
     */
    getMaidById(id: number): Observable<ApiResponse<MaidDto>> {
        return this.http.get<ApiResponse<MaidDto>>(`${this.baseUrl}/${id}`);
    }

    /**
     * POST: api/maid
     */
    registerMaid(maid: MaidDto): Observable<ApiResponse<MaidDto>> {
        return this.http.post<ApiResponse<MaidDto>>(this.baseUrl, maid);
    }

    /**
     * PUT: api/maid/{id}
     */
    updateMaid(id: number, maid: MaidDto): Observable<ApiResponse<MaidDto>> {
        return this.http.put<ApiResponse<MaidDto>>(`${this.baseUrl}/${id}`, maid);
    }

    /**
     * PUT: api/maid/{id}/availability?isAvailable=true|false
     */
    updateAvailability(id: number, isAvailable: boolean): Observable<ApiResponse<MaidDto>> {
        return this.http.put<ApiResponse<MaidDto>>(
            `${this.baseUrl}/${id}/availability`,
            null,
            { params: { isAvailable } as any } // Angular will serialize to ?isAvailable=true/false
        );
    }
}
