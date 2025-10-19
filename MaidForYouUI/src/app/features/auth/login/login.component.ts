import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// Angular Material modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

// Services
import { StorageService } from '../../../core/services/storage.service';
import { AuthService } from '../../../core/services/api/auth.service';
import { LoginRequestDto, ApiResponse, AuthResponseDto } from '../../../core/models/auth.model';

// ngx-toastr
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatIconModule
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    form: FormGroup;
    loading = false;
    hidePassword = true;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private storage: StorageService,
        private router: Router,
        private toastr: ToastrService
    ) {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    submit(): void {
        if (this.form.invalid) return;

        this.loading = true;

        const loginRequest: LoginRequestDto = this.form.value;

        this.authService.login(loginRequest).subscribe({
            next: (res: ApiResponse<AuthResponseDto>) => {
                this.loading = false;

                if (res.success && res.data?.token) {
                    this.storage.saveToken(res.data.token);
                    this.toastr.success('Login successful!');
                    this.router.navigate(['/dashboard']);
                } else {
                    this.toastr.error(res.message || 'Login failed');
                }
            },
            error: (err) => {
                this.loading = false;
                this.toastr.error(err.error?.message || 'Login failed');
            }
        });
    }

    togglePasswordVisibility(): void {
        this.hidePassword = !this.hidePassword;
    }
}
