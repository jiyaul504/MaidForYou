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
}
