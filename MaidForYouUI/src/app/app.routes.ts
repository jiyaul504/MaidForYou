import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { DashboardDefaultComponent } from './features/dashboard/dashboarddefault';

export const routes: Routes = [
    { path: '', component: LoginComponent }, // Default route
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            { path: '', component: DashboardDefaultComponent }
            // add child routes here later like:
            // { path: 'customer', component: CustomerComponent },
        ],
    },


    { path: '**', redirectTo: '' }
];
