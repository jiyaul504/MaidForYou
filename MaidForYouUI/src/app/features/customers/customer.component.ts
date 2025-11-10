import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';

import { CustomerDto } from '../../core/models/customerDto';
import { CustomerService } from '../../core/services/api/customer.service';

@Component({
    selector: 'app-customer-page',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule
    ],
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.scss']
})
export class CustomerPageComponent implements OnInit {
    customers: CustomerDto[] = [];
    selectedCustomer?: CustomerDto;
    newCustomer: CustomerDto = { id: 0, fullName: '', email: '', phone: '' };
    searchId: number = 0;

    constructor(
        private customerService: CustomerService,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.loadCustomers();
    }

    loadCustomers(): void {
        this.customerService.getAllCustomers()
            .pipe(
                catchError(err => {
                    this.toastr.error('Failed to load customers.');
                    return of(null);
                })
            )
            .subscribe(response => {
                if (response?.success && response.data) {
                    this.customers = response.data;
                } else {
                    this.toastr.error(response?.message || 'Failed to load customers.');
                }
            });
    }

    findCustomerById(): void {
        if (!this.searchId) {
            this.toastr.warning('Please enter a valid customer ID.');
            return;
        }

        this.customerService.getCustomerById(this.searchId)
            .pipe(
                catchError(err => {
                    this.toastr.error('Customer not found.');
                    return of(null);
                })
            )
            .subscribe(response => {
                if (response?.success && response.data) {
                    this.selectedCustomer = response.data;
                } else {
                    this.toastr.error(response?.message || 'Customer not found.');
                }
            });
    }

    registerCustomer(): void {
        const { fullName, email, phone } = this.newCustomer;
        if (!fullName || !email || !phone) {
            this.toastr.warning('Please fill all fields before submitting.');
            return;
        }

        this.customerService.registerCustomer(this.newCustomer)
            .subscribe({
                next: (response) => {
                    if (response.success) {
                        this.toastr.success('Customer registered successfully.');
                        this.newCustomer = { id: 0, fullName: '', email: '', phone: '' };
                        this.loadCustomers();
                    } else {
                        this.toastr.error(response.message || 'Registration failed.');
                    }
                },
                error: () => {
                    this.toastr.error('Error registering customer.');
                }
            });
    }
}
