import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
//import { ProfileComponent } from './features/profile/profile.component';
//import { SettingsComponent } from './features/settings/settings.component';

export const routes: Routes = [
    { path: '', component: LoginComponent }, // Default route
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // Main app routes
    { path: 'dashboard', component: DashboardComponent },
    //{ path: 'profile', component: ProfileComponent },
    //{ path: 'settings', component: SettingsComponent },

    // Optional: Redirect unknown routes
    { path: '**', redirectTo: '' }
];
