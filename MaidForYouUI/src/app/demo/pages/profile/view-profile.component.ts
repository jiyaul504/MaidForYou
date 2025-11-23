import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { StoredUser } from 'src/app/core/models/auth.model';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Profile</h5>
            </div>
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <img src="assets/images/user/avatar-2.jpg" class="rounded-circle me-3" alt="avatar" width="80" />
                <div>
                  <h4 class="mb-0">{{ user?.fullName || 'User' }}</h4>
                  <small class="text-muted">{{ user?.role || '' }}</small>
                </div>
              </div>

              <dl class="row">
                <dt class="col-sm-3">Full Name</dt>
                <dd class="col-sm-9">{{ user?.fullName }}</dd>

                <dt class="col-sm-3">Email</dt>
                <dd class="col-sm-9">{{ user?.email }}</dd>

                <dt class="col-sm-3">Role</dt>
                <dd class="col-sm-9">{{ user?.role }}</dd>
              </dl>

                <div class="mt-3">
                <button class="btn btn-sm btn-outline-primary me-2" (click)="goBack()">Back</button>
                <a routerLink="/profile/edit" class="btn btn-sm btn-primary">Edit Profile</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ViewProfileComponent {
  user: StoredUser | null = null;
  private location = inject(Location);
  private router = inject(Router);
  private navService = inject(NavigationService);
  private storageService = inject(StorageService);

  constructor() {
    this.user = this.storageService.getUser();
  }

  goBack() {
    const prev = this.navService.getPreviousUrl();
    if (prev && prev !== '/' && prev !== '/login') {
      this.router.navigateByUrl(prev);
      return;
    }

    // try to go back in history; if that lands on login or root, fallback to dashboard
    this.location.back();
    setTimeout(() => {
      const url = this.router.url;
      if (!url || url === '/' || url === '/login') {
        this.router.navigate(['/dashboard/default']);
      }
    }, 50);
  }
}
