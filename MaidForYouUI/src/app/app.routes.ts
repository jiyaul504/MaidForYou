import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { DashboardDefaultComponent } from './features/dashboard/dashboarddefault';
import { ViewProfileComponent } from './features/user/viewprofilecomponent';
import { BookingPageComponent } from './features/Booking/booking.component';

import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DashboardDefaultComponent },
            { path: 'profile/view', component: ViewProfileComponent },
            { path: 'bookings', component: BookingPageComponent }
        ]
    },

    { path: '**', redirectTo: '' }
];
