import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { ToastrService } from 'ngx-toastr';
import { BookingService } from '../../core/services/api/booking.service';
import { BookingDto } from '../../core/models/bookingDto';

@Component({
    selector: 'app-booking-page',
    templateUrl: './booking.component.html',
    styleUrls: ['./booking.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule
    ]
})

export class BookingPageComponent implements OnInit {
    bookings: BookingDto[] = [];

    constructor(private bookingService: BookingService, private toastr: ToastrService) { }

    ngOnInit() {
        this.loadBookings();
    }

    loadBookings() {
        this.bookingService.getAllBookings()
            .pipe(
                catchError(err => {
                    this.toastr.error('Failed to load bookings.');
                    return of(null);
                })
            )
            .subscribe(response => {
                if (response && response.success && response.data) {
                    this.bookings = response.data;
                } else if (response) {
                    this.toastr.error(response.message || 'Error fetching bookings.');
                }
            });
    }

    cancelBooking(id: number) {
        this.bookingService.cancelBooking(id).subscribe({
            next: (response) => {
                if (response.success) {
                    this.bookings = this.bookings.filter(b => b.id !== id);
                    this.toastr.success('Booking cancelled successfully');
                } else {
                    this.toastr.error(response.message || 'Failed to cancel booking.');
                }
            },
            error: () => {
                this.toastr.error('Failed to cancel booking.');
            }
        });
    }
}
