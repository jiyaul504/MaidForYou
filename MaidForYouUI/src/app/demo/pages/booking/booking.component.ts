import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { BookingDto } from 'src/app/core/models/bookingDto';
import { BookingService } from 'src/app/core/services/api/booking.service';
import { StoredUser, ApiResponse } from 'src/app/core/models/auth.model';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
    selector: 'app-booking',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Create Booking</h5>
            </div>
            <div class="card-body">
              <form (ngSubmit)="save()" #f="ngForm">
                <div class="mb-3">
                  <label class="form-label">Service Type</label>
                  <select
                    class="form-select"
                    required
                    [(ngModel)]="model.serviceType"
                    name="serviceType">
                    <option value="">Select service</option>
                    <option value="Standard Cleaning">Standard Cleaning</option>
                    <option value="Deep Cleaning">Deep Cleaning</option>
                    <option value="Move Out/In">Move Out/In</option>
                  </select>
                  <div *ngIf="f.submitted && !model.serviceType" class="text-danger small mt-1">
                    Please select a service type.
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Booking Date</label>
                  <input
                    type="date"
                    class="form-control"
                    required
                    [(ngModel)]="model.bookingDate"
                    name="bookingDate" />
                  <div *ngIf="f.submitted && !model.bookingDate" class="text-danger small mt-1">
                    Please choose a date.
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Address</label>
                  <input
                    type="text"
                    class="form-control"
                    [(ngModel)]="address"
                    name="address" />
                </div>

                <div class="mb-3">
                  <label class="form-label">Notes</label>
                  <textarea
                    class="form-control"
                    rows="3"
                    [(ngModel)]="notes"
                    name="notes">
                  </textarea>
                </div>

                <button
                  class="btn btn-primary"
                  type="submit"
                  [disabled]="!model.serviceType || !model.bookingDate">
                  Create Booking
                </button>
                <a class="btn btn-outline-secondary ms-2" routerLink="/dashboard/default">Cancel</a>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BookingComponent {
    model: Partial<BookingDto> = {
        serviceType: '',
        bookingDate: ''
    };

    address = '';
    notes = '';

    constructor(
        private router: Router,
        private toastr: ToastrService,
        private bookingService: BookingService,
        private storageService: StorageService
    ) {
        const user: StoredUser | null = this.storageService.getUser();
        if (user) {
            this.model.customerName = user.fullName;
        }
    }

    save() {
        if (!this.model.serviceType || !this.model.bookingDate) {
            this.toastr.error('Please fill required fields', 'Validation');
            return;
        }

        const payload: Partial<BookingDto> = {
            customerName: this.model.customerName || 'Guest',
            bookingDate: this.model.bookingDate,
            serviceType: this.model.serviceType,
            status: 'Pending'
            // address: this.address,
            // notes: this.notes
        };

        this.bookingService.createBooking(payload as BookingDto).subscribe({
            next: (res) => {
                // HTTP 2xx
                if (res.success && res.data) {
                    this.toastr.success('Booking created', 'Success');
                    this.router.navigate(['/dashboard/default']);
                } else {
                    const msg = res?.message || 'Failed to create booking';
                    this.toastr.error(msg, 'Error');
                }
            },
            error: (err) => {
                console.error('createBooking error:', err);

                const backend = err?.error as ApiResponse<any> | string | undefined;
                let msg: string | undefined;

                if (backend && typeof backend === 'object') {
                    msg = backend.message || (Array.isArray(backend.errors) && backend.errors[0]);
                }

                if (!msg && typeof backend === 'string') {
                    msg = backend;
                }

                if (!msg && err.status === 401) {
                    msg = 'You must be logged in to create bookings.';
                }

                if (!msg) {
                    msg = 'Failed to create booking on server';
                }

                this.toastr.error(msg, 'Error');
            }
        });
    }
}
