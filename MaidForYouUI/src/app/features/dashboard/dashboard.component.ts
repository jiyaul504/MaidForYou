// dashboard.component.ts
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { RouterModule } from "@angular/router";
import { SidebarComponent } from "../../shared/sidebar/sidebar.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { Component } from "@angular/core";
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        SidebarComponent,
        NavbarComponent,
        FooterComponent
    ],
    template: `
    <mat-sidenav-container class="dashboard-container">
      <mat-sidenav mode="side" opened class="sidebar">
        <app-sidebar></app-sidebar>
      </mat-sidenav>

      <mat-sidenav-content>
        <div class="main-content">
          <app-navbar></app-navbar>

          <div class="content-area">
            <router-outlet></router-outlet>
          </div>

          <app-footer></app-footer>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent { }
