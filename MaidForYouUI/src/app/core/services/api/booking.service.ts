import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/auth.model';
import { BookingDto } from '../../models/bookingDto';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    private readonly baseUrl = `${environment.apiBaseUrl}/booking`;

    constructor(private http: HttpClient) { }

    getAllBookings(): Observable<ApiResponse<BookingDto[]>> {
        return this.http.get<ApiResponse<BookingDto[]>>(this.baseUrl);
    }

    getBookingById(id: number): Observable<ApiResponse<BookingDto>> {
        return this.http.get<ApiResponse<BookingDto>>(`${this.baseUrl}/${id}`);
    }

    createBooking(booking: BookingDto): Observable<ApiResponse<BookingDto>> {
        return this.http.post<ApiResponse<BookingDto>>(this.baseUrl, booking);
    }

    cancelBooking(id: number): Observable<ApiResponse<null>> {
        return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`);
    }

    // (Optional) Example: update booking
    updateBooking(id: number, booking: Partial<BookingDto>): Observable<ApiResponse<BookingDto>> {
        return this.http.put<ApiResponse<BookingDto>>(`${this.baseUrl}/${id}`, booking);
    }
}
