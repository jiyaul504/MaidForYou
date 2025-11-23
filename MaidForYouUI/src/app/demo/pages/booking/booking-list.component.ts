import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from 'src/app/core/services/api/booking.service';
import { BookingDto } from 'src/app/core/models/bookingDto';
import { ToastrService } from 'ngx-toastr';

interface BookingFormModel {
    serviceType: string;
    bookingDate: string;
    notes?: string;
    customerName?: string;
}

@Component({
    selector: 'app-booking-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Bookings</h5>
              <button class="btn btn-primary btn-sm" (click)="openCreate()">Create Booking</button>
            </div>
            <div class="card-body">
              <table class="table table-striped" *ngIf="bookings?.length; else noBookings">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let b of bookings">
                    <td>{{ b.id }}</td>
                    <td>{{ b.customerName }}</td>
                    <td>{{ b.serviceType }}</td>
                    <td>{{ b.bookingDate }}</td>
                    <td>{{ b.status }}</td>
                    <td>
                      <button class="btn btn-sm btn-outline-secondary me-2" (click)="openEdit(b)">Edit</button>
                      <button class="btn btn-sm btn-outline-danger" (click)="openDelete(b)">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <ng-template #noBookings>
                <p class="text-muted mb-0">No bookings found.</p>
              </ng-template>
            </div>
          </div>
        </div>
      </div>

      <!-- Create / Edit Modal -->
      <div class="modal fade" 
           [class.show]="showFormModal" 
           [style.display]="showFormModal ? 'block' : 'none'" 
           tabindex="-1" aria-modal="true" role="dialog">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ isEditing ? 'Edit Booking' : 'Create Booking' }}</h5>
              <button type="button" class="btn-close" aria-label="Close" (click)="closeForm()"></button>
            </div>
            <div class="modal-body">
              <form #f="ngForm">
                <div class="mb-3">
                  <label class="form-label">Customer Name</label>
                  <input
                    type="text"
                    class="form-control"
                    [(ngModel)]="formModel.customerName"
                    name="customerName"
                    placeholder="Enter customer name"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Service Type</label>
                  <select
                    class="form-select"
                    required
                    [(ngModel)]="formModel.serviceType"
                    name="serviceType">
                    <option value="">Select service</option>
                    <option value="Standard Cleaning">Standard Cleaning</option>
                    <option value="Deep Cleaning">Deep Cleaning</option>
                    <option value="Move Out/In">Move Out/In</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label class="form-label">Booking Date</label>
                  <input
                    type="date"
                    class="form-control"
                    required
                    [(ngModel)]="formModel.bookingDate"
                    name="bookingDate" />
                </div>

                <div class="mb-3">
                  <label class="form-label">Notes</label>
                  <textarea
                    class="form-control"
                    rows="3"
                    [(ngModel)]="formModel.notes"
                    name="notes">
                  </textarea>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeForm()">Cancel</button>
              <button type="button" class="btn btn-primary" (click)="saveForm()">
                {{ isEditing ? 'Save' : 'Create' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirm Modal -->
      <div class="modal fade" 
           [class.show]="showDeleteModal" 
           [style.display]="showDeleteModal ? 'block' : 'none'" 
           tabindex="-1" aria-modal="true" role="dialog">
        <div class="modal-dialog modal-sm">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirm Delete</h5>
              <button type="button" class="btn-close" aria-label="Close" (click)="closeDelete()"></button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to delete booking <strong>{{ deleteTarget?.id }}</strong>?</p>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary btn-sm" (click)="closeDelete()">Cancel</button>
              <button class="btn btn-danger btn-sm" (click)="confirmDelete()">Delete</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  `
})
export class BookingListComponent implements OnInit {
    bookings: BookingDto[] = [];

    showFormModal = false;
    showDeleteModal = false;
    isEditing = false;
    formModel: BookingFormModel = { serviceType: '', bookingDate: '', notes: '', customerName: '' };
    editTarget: BookingDto | null = null;
    deleteTarget: BookingDto | null = null;

    constructor(
        private bookingService: BookingService,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.loadBookings();
    }

    loadBookings() {
        this.bookingService.getAllBookings().subscribe({
            next: (res) => {
                if (res?.success && res.data) {
                    this.bookings = res.data;
                } else {
                    this.bookings = [];
                    this.toastr.warning(res?.message || 'Failed to load bookings', 'Warning');
                }
            },
            error: (err) => {
                console.error('getAllBookings error:', err);
                this.bookings = [];
                this.toastr.error('Could not load bookings from server.', 'Error');
            }
        });
    }

    openCreate() {
        this.isEditing = false;
        this.editTarget = null;
        this.formModel = { serviceType: '', bookingDate: '', notes: '', customerName: '' };
        this.showFormModal = true;
    }

    openEdit(b: BookingDto) {
        this.isEditing = true;
        this.editTarget = b;
        this.formModel = {
            serviceType: b.serviceType,
            bookingDate: b.bookingDate,
            notes: (b as any).notes || '',
            customerName: b.customerName
        };
        this.showFormModal = true;
    }

    closeForm() {
        this.showFormModal = false;
        this.editTarget = null;
    }

    saveForm() {
        if (!this.formModel.serviceType || !this.formModel.bookingDate) {
            this.toastr.error('Please fill required fields', 'Validation');
            return;
        }

        // EDIT
        if (this.isEditing && this.editTarget) {
            const payload: Partial<BookingDto> = {
                serviceType: this.formModel.serviceType,
                bookingDate: this.formModel.bookingDate,
                customerName: this.formModel.customerName,
            };

            this.bookingService.updateBooking(this.editTarget.id, payload).subscribe({
                next: (res) => {
                    console.log('updateBooking response:', res);
                    if (res?.success) {
                        this.toastr.success('Booking updated', 'Success');
                        this.loadBookings();
                    } else {
                        this.toastr.error(res?.message || 'Failed to update booking', 'Error');
                    }
                    this.closeForm();
                },
                error: (err) => {
                    console.error('updateBooking error:', err);
                    if (err.status === 401) {
                        this.toastr.error('You must be logged in to update bookings.', 'Authentication required');
                    } else {
                        this.toastr.error('Failed to update booking on server', 'Error');
                    }
                    this.closeForm();
                }
            });

            return;
        }

        // CREATE
        const payload: BookingDto = {
            serviceType: this.formModel.serviceType,
            bookingDate: this.formModel.bookingDate,
            status: 'Pending',
            customerName: this.formModel.customerName || 'Guest'
        } as BookingDto;

        this.bookingService.createBooking(payload).subscribe({
            next: (res) => {
                console.log('createBooking response:', res);
                if (res?.success) {
                    this.toastr.success('Booking created', 'Success');
                    this.loadBookings();
                } else {
                    this.toastr.error(res?.message || 'Failed to create booking on server', 'Error');
                }
                this.closeForm();
            },
            error: (err) => {
                console.error('createBooking error:', err);
                if (err.status === 401) {
                    this.toastr.error('You must be logged in to create bookings.', 'Authentication required');
                } else {
                    this.toastr.error('Failed to create booking on server', 'Error');
                }
                this.closeForm();
            }
        });
    }

    openDelete(b: BookingDto) {
        this.deleteTarget = b;
        this.showDeleteModal = true;
    }

    closeDelete() {
        this.showDeleteModal = false;
        this.deleteTarget = null;
    }

    confirmDelete() {
        if (!this.deleteTarget) return;

        const id = this.deleteTarget.id;
        this.bookingService.cancelBooking(id).subscribe({
            next: (res) => {
                console.log('cancelBooking response:', res);
                if (res?.success) {
                    this.toastr.success('Booking deleted', 'Success');
                    this.loadBookings();
                } else {
                    this.toastr.error(res?.message || 'Failed to delete booking on server', 'Error');
                }
                this.closeDelete();
            },
            error: (err) => {
                console.error('cancelBooking error:', err);
                if (err.status === 401) {
                    this.toastr.error('You must be logged in to delete bookings.', 'Authentication required');
                } else {
                    this.toastr.error('Failed to delete booking on server', 'Error');
                }
                this.closeDelete();
            }
        });
    }
}
