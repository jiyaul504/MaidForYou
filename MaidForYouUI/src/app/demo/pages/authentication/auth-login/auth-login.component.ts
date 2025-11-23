import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from 'src/app/core/services/api/auth.service';
import {
  LoginRequestDto,
  StoredUser,
  ApiResponse,
  AuthResponseDto
} from 'src/app/core/models/auth.model';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './auth-login.component.html',
  styleUrl: './auth-login.component.scss'
})
export class AuthLoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private storageService = inject(StorageService);

  email = '';
  password = '';
  isLoading = false;

  SignInOptions = [
    {
      image: 'assets/images/authentication/google.svg',
      name: 'Google'
    },
    {
      image: 'assets/images/authentication/twitter.svg',
      name: 'Twitter'
    },
    {
      image: 'assets/images/authentication/facebook.svg',
      name: 'Facebook'
    }
  ];

  login() {
    if (!this.email || !this.password) {
      this.toastr.error('Please enter email and password.');
      return;
    }

    const request: LoginRequestDto = {
      email: this.email,
      password: this.password
    };

    this.isLoading = true;

    this.authService.login(request).subscribe({
      next: (res: ApiResponse<AuthResponseDto>) => {
        this.isLoading = false;

        if (res.success && res.data) {
          const user: StoredUser = {
            fullName: res.data.fullName,
            email: res.data.email,
            role: res.data.role
          };

          this.storageService.saveToken(res.data.token);
          this.storageService.saveUser(user);

          if (res.message) {
            this.toastr.success(res.message);
          }

          this.router.navigate(['/dashboard/default']);
        } else {
          const msg = res.message || 'Login failed. Please try again.';
          this.toastr.error(msg);
        }
      },
      error: (err) => {
        this.isLoading = false;

        const backend = err?.error as ApiResponse<any> | string | undefined;
        let msg: string | undefined;

        if (backend && typeof backend === 'object') {
          msg =
            backend.message ||
            (Array.isArray(backend.errors) && backend.errors[0]) ||
            (backend.validationErrors &&
              Object.values(backend.validationErrors)[0]?.[0]);
        }

        if (!msg && typeof backend === 'string') {
          msg = backend;
        }

        if (!msg && err.status === 401) {
          msg = 'Invalid email or password.';
        }
        if (!msg) {
          msg = 'Something went wrong. Please try again.';
        }

        this.toastr.error(msg);
      }
    });
  }
}
