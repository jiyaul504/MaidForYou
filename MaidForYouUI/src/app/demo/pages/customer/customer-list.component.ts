import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from 'src/app/core/services/api/customer.service';
import { CustomerDto } from 'src/app/core/models/customerDto';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/core/models/auth.model';

interface CustomerFormModel {
    fullName: string;
    email: string;
    phone: string;
}

@Component({
    selector: 'app-customer-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Customers</h5>
              <button class="btn btn-primary btn-sm" (click)="openCreate()">Create Customer</button>
            </div>
            <div class="card-body">
              <table class="table table-striped" *ngIf="customers?.length; else noCustomers">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let c of customers">
                    <td>{{ c.id }}</td>
                    <td>{{ c.fullName }}</td>
                    <td>{{ c.email }}</td>
                    <td>{{ c.phone }}</td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary me-2" (click)="openEdit(c)">Edit</button>
                      <button class="btn btn-sm btn-outline-danger" (click)="openDelete(c)">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <ng-template #noCustomers>
                <p class="text-muted mb-0">No customers found.</p>
              </ng-template>
            </div>
          </div>
        </div>
      </div>

      <!-- Create / Edit Modal -->
      <div
        class="modal fade"
        [class.show]="showFormModal"
        [style.display]="showFormModal ? 'block' : 'none'"
        tabindex="-1"
        aria-modal="true"
        role="dialog">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ isEditing ? 'Edit Customer' : 'Create Customer' }}</h5>
              <button type="button" class="btn-close" aria-label="Close" (click)="closeForm()"></button>
            </div>
            <div class="modal-body">
              <form #f="ngForm">
                <div class="mb-3">
                  <label class="form-label">Full Name</label>
                  <input type="text" class="form-control" required [(ngModel)]="formModel.fullName" name="fullName" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" [(ngModel)]="formModel.email" name="email" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Phone</label>
                  <input type="text" class="form-control" [(ngModel)]="formModel.phone" name="phone" />
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeForm()">Cancel</button>
              <button type="button" class="btn btn-primary" (click)="saveForm()">{{ isEditing ? 'Save' : 'Create' }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirm Modal -->
      <div
        class="modal fade"
        [class.show]="showDeleteModal"
        [style.display]="showDeleteModal ? 'block' : 'none'"
        tabindex="-1"
        aria-modal="true"
        role="dialog">
        <div class="modal-dialog modal-sm">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirm Delete</h5>
              <button type="button" class="btn-close" aria-label="Close" (click)="closeDelete()"></button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to delete customer <strong>{{ deleteTarget?.id }}</strong>?</p>
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
export class CustomerListComponent implements OnInit {
    customers: CustomerDto[] = [];

    showFormModal = false;
    showDeleteModal = false;
    isEditing = false;
    editTarget: CustomerDto | null = null;
    deleteTarget: CustomerDto | null = null;
    formModel: CustomerFormModel = { fullName: '', email: '', phone: '' };

    constructor(private customerService: CustomerService, private toastr: ToastrService) { }

    ngOnInit(): void {
        this.loadCustomers();
    }

    private extractApiMessage(err: any): string {
        const backend = err?.error as ApiResponse<any> | string | undefined;
        let msg: string | undefined;

        if (backend && typeof backend === 'object') {
            msg = backend.message || (Array.isArray(backend.errors) && backend.errors[0]);
        }

        if (!msg && typeof backend === 'string') {
            msg = backend;
        }

        if (!msg && err?.status === 401) {
            msg = 'User is not authenticated.';
        }

        if (!msg) msg = 'Unexpected error';

        return msg;
    }

    loadCustomers() {
        this.customerService.getAllCustomers().subscribe({
            next: (res) => {
                if (res?.success && res.data) {
                    this.customers = res.data;
                } else {
                    this.customers = [];
                    if (res?.message) this.toastr.warning(res.message);
                }
            },
            error: (err) => {
                console.error('getAllCustomers error:', err);
                this.customers = [];
                const msg = this.extractApiMessage(err);
                this.toastr.error(msg);
            }
        });
    }

    openCreate() {
        this.isEditing = false;
        this.editTarget = null;
        this.formModel = { fullName: '', email: '', phone: '' };
        this.showFormModal = true;
    }

    openEdit(c: CustomerDto) {
        this.isEditing = true;
        this.editTarget = c;
        this.formModel = { fullName: c.fullName, email: c.email, phone: c.phone };
        this.showFormModal = true;
    }

    closeForm() {
        this.showFormModal = false;
        this.editTarget = null;
    }

    saveForm() {
        if (!this.formModel.fullName) {
            this.toastr.error('Please enter full name');
            return;
        }

        const payload: CustomerDto = {
            id: this.editTarget ? this.editTarget.id : 0,
            fullName: this.formModel.fullName,
            email: this.formModel.email || '',
            phone: this.formModel.phone || ''
        } as CustomerDto;

        if (this.isEditing && this.editTarget) {
            this.customerService.updateCustomer(this.editTarget.id, payload).subscribe({
                next: (res) => {
                    console.log('updateCustomer response:', res);
                    if (res?.success) {
                        if (res.message) this.toastr.success(res.message);
                        this.loadCustomers();
                    } else if (res?.message) {
                        this.toastr.error(res.message);
                    }
                    this.closeForm();
                },
                error: (err) => {
                    console.error('updateCustomer error:', err);
                    const msg = this.extractApiMessage(err);
                    this.toastr.error(msg);
                    this.closeForm();
                }
            });
            return;
        }

        this.customerService.registerCustomer(payload).subscribe({
            next: (res) => {
                console.log('registerCustomer response:', res);
                if (res?.success) {
                    if (res.message) this.toastr.success(res.message);
                    this.loadCustomers();
                } else if (res?.message) {
                    this.toastr.error(res.message);
                }
                this.closeForm();
            },
            error: (err) => {
                console.error('registerCustomer error:', err);
                const msg = this.extractApiMessage(err);
                this.toastr.error(msg);
                this.closeForm();
            }
        });
    }

    openDelete(c: CustomerDto) {
        this.deleteTarget = c;
        this.showDeleteModal = true;
    }

    closeDelete() {
        this.showDeleteModal = false;
        this.deleteTarget = null;
    }

    confirmDelete() {
        if (!this.deleteTarget) return;
        const id = this.deleteTarget.id;
        this.customerService.deleteCustomer(id).subscribe({
            next: (res) => {
                console.log('deleteCustomer response:', res);
                if (res?.success) {
                    if (res.message) this.toastr.success(res.message);
                    this.loadCustomers();
                } else if (res?.message) {
                    this.toastr.error(res.message);
                }
                this.closeDelete();
            },
            error: (err) => {
                console.error('deleteCustomer error:', err);
                const msg = this.extractApiMessage(err);
                this.toastr.error(msg);
                this.closeDelete();
            }
        });
    }
}
