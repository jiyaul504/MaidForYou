import { Component, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StoredUser } from 'src/app/core/models/auth.model';
import { AuthService } from 'src/app/core/services/api/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Edit Profile</h5>
            </div>
            <div class="card-body">
              <form #f="ngForm" (ngSubmit)="save()">
                <div class="mb-3">
                  <label class="form-label">Full Name</label>
                  <input type="text" name="fullName" class="form-control" [(ngModel)]="model.fullName" required />
                </div>

                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" name="email" class="form-control" [(ngModel)]="model.email" required />
                </div>

                <div class="mb-3">
                  <label class="form-label">Role</label>
                  <input type="text" name="role" class="form-control" [(ngModel)]="model.role" readonly />
                </div>

                <button class="btn btn-primary me-2" type="submit">Save</button>
                <a class="btn btn-outline-secondary" routerLink="/profile">Cancel</a>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EditProfileComponent {
  model: StoredUser = { fullName: '', email: '', role: '' };

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private authService: AuthService,
    private storageService: StorageService,
    @Optional() private activeModal?: NgbActiveModal
  ) {
    const stored = this.storageService.getUser();
    if (stored) {
      this.model = stored;
    }
  }

  save() {
    // Call server API to update profile, then update local storage
    this.authService.updateProfile({ fullName: this.model.fullName, email: this.model.email }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const updatedUser: StoredUser = {
            fullName: res.data.fullName,
            email: res.data.email,
            role: res.data.role
          };

          this.storageService.saveUser(updatedUser);
          if (res.data.token) {
            this.storageService.saveToken(res.data.token);
          }

          this.toastrService.success('Profile updated', 'Success');
          // If opened inside a modal, close it; otherwise navigate back to profile page
          if (this.activeModal) {
            try {
              this.activeModal.close();
            } catch { }
          } else {
            this.router.navigate(['/profile']);
          }
        } else {
          this.toastrService.error(res.message || 'Failed to update profile', 'Error');
        }
      },
      error: (err) => {
        const msg = err?.error?.message || 'Something went wrong while updating profile.';
        this.toastrService.error(msg, 'Error');
      }
    });
  }

  cancel() {
    if (this.activeModal) {
      try {
        this.activeModal.dismiss();
      } catch { }
      return;
    }

    this.router.navigate(['/profile']);
  }
}
