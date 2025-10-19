import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Angular Material modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Services
import { AuthService } from '../../../core/services/api/auth.service';

// ngx-toastr
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-register',
    standalone: true,
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatProgressSpinnerModule
    ]
})
export class RegisterComponent {
    form: FormGroup;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService  // <-- Inject ToastrService
    ) {
        this.form = this.fb.group({
            fullName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            role: ['User', Validators.required]
        });
    }

    submit(): void {
        if (this.form.invalid) return;

        this.loading = true;

        this.authService.register(this.form.value).subscribe({
            next: (res) => {
                this.loading = false;
                if (res.success) {
                    this.toastr.success('Registration successful! Redirecting to login...');
                    setTimeout(() => this.router.navigate(['/auth/login']), 1500);
                } else {
                    this.toastr.error(res.message || 'Registration failed.');
                }
            },
            error: (err) => {
                this.loading = false;
                this.toastr.error(err.error?.message || 'Something went wrong!');
            }
        });
    }
}
