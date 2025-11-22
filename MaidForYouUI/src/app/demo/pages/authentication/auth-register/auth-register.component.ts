import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RegisterRequestDto } from '../../../../core/models/auth.model';
import { AuthService } from 'src/app/core/services/api/auth.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-auth-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './auth-register.component.html',
  styleUrl: './auth-register.component.scss'
})
export class AuthRegisterComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  fullName = '';
  email = '';
  password = '';

  isLoading = false;
  errorMessage = '';

  SignUpOptions = [
    { image: 'assets/images/authentication/google.svg', name: 'Google' },
    { image: 'assets/images/authentication/twitter.svg', name: 'Twitter' },
    { image: 'assets/images/authentication/facebook.svg', name: 'Facebook' }
  ];

  register() {
    this.errorMessage = '';

    if (!this.fullName || !this.email || !this.password) {
      this.errorMessage = 'All fields are required.';
      this.toastr.error(this.errorMessage, 'Validation Error');
      return;
    }

    const request: RegisterRequestDto = {
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      role: 'Customer'
    };

    this.isLoading = true;

    this.authService.register(request).subscribe({
      next: (res) => {
        this.isLoading = false;

        if (res.success) {
          this.toastr.success('Account created successfully!', 'Success');
          this.router.navigate(['/login']);
        } else {
          const msg = res.message || 'Registration failed.';
          this.errorMessage = msg;
          this.toastr.error(msg, 'Error');
        }
      },
      error: (err) => {
        this.isLoading = false;
        const msg =
          err?.error?.message || 'Something went wrong. Please try again.';
        this.errorMessage = msg;
        this.toastr.error(msg, 'Request Failed');
        console.error('Register error:', err);
      }
    });
  }
}
