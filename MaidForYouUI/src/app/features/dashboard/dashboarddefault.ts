import { Component } from '@angular/core';

@Component({
    selector: 'app-dashboard-default',
    standalone: true,
    template: `
    <div class="dashboard-default">
      <h2>Welcome to MaidForYou Dashboard!</h2>
      <p>This is the default dashboard content.</p>
    </div>
  `,
    styles: [`
    .dashboard-default {
      padding: 16px;
      font-family: Arial, sans-serif;
    }

    h2 {
      color: #1a237e;
    }
  `]
})
export class DashboardDefaultComponent { }
