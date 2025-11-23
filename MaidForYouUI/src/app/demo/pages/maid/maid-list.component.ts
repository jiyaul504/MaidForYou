import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaidService } from 'src/app/core/services/api/maid.service';
import { MaidDto } from 'src/app/core/models/maidDto';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/core/models/auth.model';

interface MaidFormModel {
    fullName: string;
    email: string;
    phone: string;
    experience: string;
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
}

@Component({
    selector: 'app-maid-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Maids</h5>
              <button class="btn btn-primary btn-sm" (click)="openCreate()">Register Maid</button>
            </div>
            <div class="card-body">
              <table class="table table-striped" *ngIf="maids?.length; else noMaids">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Experience</th>
                    <th>Available</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let m of maids">
                    <td>{{ m.id }}</td>
                    <td>{{ m.fullName }}</td>
                    <td>{{ m.email }}</td>
                    <td>{{ m.phone }}</td>
                    <td>{{ m.experience }}</td>
                    <td>
                      <span class="badge" [ngClass]="m.isAvailable ? 'bg-success' : 'bg-secondary'">{{ m.isAvailable ? 'Yes' : 'No' }}</span>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary me-2" (click)="openEdit(m)">Edit</button>
                      <button class="btn btn-sm btn-outline-secondary me-2" (click)="toggleAvailability(m)">
                        {{ m.isAvailable ? 'Set Unavailable' : 'Set Available' }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <ng-template #noMaids>
                <p class="text-muted mb-0">No maids found.</p>
              </ng-template>
            </div>
          </div>
        </div>
      </div>

      <!-- Register Modal -->
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
              <h5 class="modal-title">{{ isEditing ? 'Edit Maid' : 'Register Maid' }}</h5>
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

                <div class="mb-3">
                  <label class="form-label">Experience</label>
                  <input type="text" class="form-control" [(ngModel)]="formModel.experience" name="experience" />
                </div>

                <div class="mb-3">
                  <label class="form-label">Street</label>
                  <input type="text" class="form-control" [(ngModel)]="formModel.street" name="street" />
                </div>

                <div class="row">
                  <div class="col-md-4 mb-3">
                    <label class="form-label">City</label>
                    <input type="text" class="form-control" [(ngModel)]="formModel.city" name="city" />
                  </div>
                  <div class="col-md-4 mb-3">
                    <label class="form-label">State</label>
                    <input type="text" class="form-control" [(ngModel)]="formModel.state" name="state" />
                  </div>
                  <div class="col-md-4 mb-3">
                    <label class="form-label">Zip</label>
                    <input type="text" class="form-control" [(ngModel)]="formModel.zipCode" name="zipCode" />
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeForm()">Cancel</button>
              <button type="button" class="btn btn-primary" (click)="saveForm()">{{ isEditing ? 'Save' : 'Register' }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MaidListComponent implements OnInit {
    maids: MaidDto[] = [];

    showFormModal = false;
    isEditing = false;
    editTarget: MaidDto | null = null;
    formModel: MaidFormModel = { fullName: '', email: '', phone: '', experience: '' };

    constructor(private maidService: MaidService, private toastr: ToastrService) { }

    ngOnInit(): void {
        this.loadMaids();
    }

    openEdit(m: MaidDto) {
        this.isEditing = true;
        this.editTarget = m;
        this.formModel = {
            fullName: m.fullName,
            email: m.email,
            phone: m.phone,
            experience: m.experience,
            street: m.address?.street,
            city: m.address?.city,
            state: m.address?.state,
            zipCode: m.address?.zipCode
        };
        this.showFormModal = true;
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

    loadMaids() {
        this.maidService.getAvailableMaids().subscribe({
            next: (res) => {
                if (res?.success && res.data) {
                    this.maids = res.data;
                } else {
                    this.maids = [];
                    if (res?.message) {
                        this.toastr.warning(res.message);
                    }
                }
            },
            error: (err) => {
                console.error('getAvailableMaids error:', err);
                this.maids = [];
                const msg = this.extractApiMessage(err);
                this.toastr.error(msg);
            }
        });
    }

    openCreate() {
        this.isEditing = false;
        this.editTarget = null;
        this.formModel = { fullName: '', email: '', phone: '', experience: '' };
        this.showFormModal = true;
    }

    closeForm() {
        this.showFormModal = false;
    }

    saveForm() {
        if (!this.formModel.fullName) {
            this.toastr.error('Please enter full name');
            return;
        }
        const payload: MaidDto = {
            id: this.editTarget ? this.editTarget.id : 0,
            fullName: this.formModel.fullName,
            email: this.formModel.email || '',
            phone: this.formModel.phone || '',
            experience: this.formModel.experience || '',
            isAvailable: this.editTarget ? this.editTarget.isAvailable : true,
            address: {
                street: this.formModel.street || '',
                city: this.formModel.city || '',
                state: this.formModel.state || '',
                zipCode: this.formModel.zipCode || ''
            }
        } as MaidDto;

        if (this.isEditing && this.editTarget) {
            this.maidService.updateMaid(this.editTarget.id, payload).subscribe({
                next: (res) => {
                    console.log('updateMaid response:', res);
                    if (res?.success) {
                        if (res.message) this.toastr.success(res.message);
                        this.loadMaids();
                    } else if (res?.message) {
                        this.toastr.error(res.message);
                    }
                    this.closeForm();
                },
                error: (err) => {
                    console.error('updateMaid error:', err);
                    const msg = this.extractApiMessage(err);
                    this.toastr.error(msg);
                    this.closeForm();
                }
            });
            return;
        }

        this.maidService.registerMaid(payload).subscribe({
            next: (res) => {
                console.log('registerMaid response:', res);
                if (res?.success) {
                    if (res.message) this.toastr.success(res.message);
                    this.loadMaids();
                } else if (res?.message) {
                    this.toastr.error(res.message);
                }
                this.closeForm();
            },
            error: (err) => {
                console.error('registerMaid error:', err);
                const msg = this.extractApiMessage(err);
                this.toastr.error(msg);
                this.closeForm();
            }
        });
    }

    toggleAvailability(m: MaidDto) {
        this.maidService.updateAvailability(m.id, !m.isAvailable).subscribe({
            next: (res) => {
                console.log('updateAvailability response:', res);
                if (res?.success) {
                    if (res.message) this.toastr.success(res.message);
                    this.loadMaids();
                } else if (res?.message) {
                    this.toastr.error(res.message);
                }
            },
            error: (err) => {
                console.error('updateAvailability error:', err);
                const msg = this.extractApiMessage(err);
                this.toastr.error(msg);
            }
        });
    }
}
