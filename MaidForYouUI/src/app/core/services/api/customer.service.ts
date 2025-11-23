import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerDto } from '../../models/customerDto';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/auth.model';

@Injectable({
    providedIn: 'root',
})
export class CustomerService {
    private baseUrl = `${environment.apiBaseUrl}/customer`;

    constructor(private http: HttpClient) { }


    getAllCustomers(): Observable<ApiResponse<CustomerDto[]>> {
        return this.http.get<ApiResponse<CustomerDto[]>>(this.baseUrl);
    }


    getCustomerById(id: number): Observable<ApiResponse<CustomerDto>> {
        return this.http.get<ApiResponse<CustomerDto>>(`${this.baseUrl}/${id}`);
    }

    registerCustomer(customer: CustomerDto): Observable<ApiResponse<CustomerDto>> {
        return this.http.post<ApiResponse<CustomerDto>>(this.baseUrl, customer);
    }

    updateCustomer(id: number, customer: CustomerDto): Observable<ApiResponse<CustomerDto>> {
        return this.http.put<ApiResponse<CustomerDto>>(`${this.baseUrl}/${id}`, customer);
    }

    deleteCustomer(id: number): Observable<ApiResponse<boolean>> {
        return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`);
    }
}
