import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from 'src/app/core/services/api/auth.service';
import { LoginRequestDto, StoredUser } from 'src/app/core/models/auth.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './auth-login.component.html',
  styleUrl: './auth-login.component.scss'
})
export class AuthLoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

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
      this.errorMessage = 'Please enter email and password.';
      this.toastr.error(this.errorMessage, 'Login failed');
      return;
    }

    const request: LoginRequestDto = {
      email: this.email,
      password: this.password
    };

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(request).subscribe({
      next: (res) => {
        this.isLoading = false;

        if (res.success && res.data) {
          const user: StoredUser = {
            fullName: res.data.fullName,
            email: res.data.email,
            role: res.data.role
          };

          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(user));

          this.toastr.success('Login successful', 'Success');
          this.router.navigate(['/dashboard/default']);
        } else {
          const msg = res.message || 'Login failed. Please try again.';
          this.errorMessage = msg;
          this.toastr.error(msg, 'Login failed');
        }
      },
      error: (err) => {
        this.isLoading = false;
        const msg =
          err?.error?.message || 'Something went wrong. Please try again.';
        this.errorMessage = msg;
        this.toastr.error(msg, 'Error');
        console.error('Login error:', err);
      }
    });
  }
}
