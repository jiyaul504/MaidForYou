import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { StorageService } from '../../core/services/storage.service';
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatDividerModule
    ],
    template: `
    <mat-toolbar class="navbar">
      <span class="spacer-left"></span>  <!-- Left flexible spacer -->
      <span class="logo" routerLink="/">MaidForYou</span>
      <span class="spacer"></span>       <!-- Right flexible spacer -->
      <nav>
        <ng-container *ngIf="isLoggedIn; else loggedOut">
          <button mat-button [matMenuTriggerFor]="profileMenu">
            <mat-icon>person</mat-icon>
            {{ fullName }}
            <mat-icon>arrow_drop_down</mat-icon>
          </button>
          <mat-menu #profileMenu="matMenu">
            <button mat-menu-item (click)="navigateTo('/profile/view')">
              <mat-icon>visibility</mat-icon>
              View Profile
            </button>
            <button mat-menu-item (click)="navigateTo('/profile/edit')">
              <mat-icon>edit</mat-icon>
              Edit Profile
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              Logout
            </button>
          </mat-menu>
        </ng-container>

        <ng-template #loggedOut>
          <button mat-button routerLink="/auth/login" routerLinkActive="active">Login</button>
          <button mat-stroked-button routerLink="/auth/register" routerLinkActive="active">Register</button>
        </ng-template>
      </nav>
    </mat-toolbar>
  `,
    styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      background-color: #1a237e; /* Dark blue */
      color: white;
      padding: 0 16px;
    }

    .spacer-left {
      flex: 1; /* Take up left space */
    }

    .spacer {
      flex: 1; /* Take up right space */
    }

    .logo {
      font-weight: bold;
      font-size: 1.5rem;
      cursor: pointer;
      user-select: none;
      color: white;
      text-decoration: none;
      flex: none; /* Prevent flex-grow */
      text-align: center;
    }

    nav {
      display: flex;
      align-items: center;
      flex: none; /* Do not grow or shrink */
    }

    nav button.active {
      background-color: rgba(255, 255, 255, 0.2);
    }

    mat-icon {
      color: white;
    }

    nav button {
      color: white;
    }
  `]
})
export class NavbarComponent implements OnInit {
    isLoggedIn = false;
    fullName = '';

    constructor(private storage: StorageService, private router: Router) { }

    ngOnInit() {
        const user = this.storage.getUser();
        if (user) {
            this.isLoggedIn = true;
            this.fullName = user.fullName || user.email || 'User';
        }
    }

    navigateTo(path: string) {
        this.router.navigate([path]);
    }

    logout() {
        this.storage.clear();
        this.isLoggedIn = false;
        this.router.navigate(['/auth/login']);
    }
}
