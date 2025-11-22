// angular import
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import tableData from 'src/fake-data/default-data.json';

import { MonthlyBarChartComponent } from 'src/app/theme/shared/apexchart/monthly-bar-chart/monthly-bar-chart.component';
import { IncomeOverviewChartComponent } from 'src/app/theme/shared/apexchart/income-overview-chart/income-overview-chart.component';
import { AnalyticsChartComponent } from 'src/app/theme/shared/apexchart/analytics-chart/analytics-chart.component';
import { SalesReportChartComponent } from 'src/app/theme/shared/apexchart/sales-report-chart/sales-report-chart.component';

// icons
import { IconService, IconDirective } from '@ant-design/icons-angular';
import { FallOutline, GiftOutline, MessageOutline, RiseOutline, SettingOutline } from '@ant-design/icons-angular/icons';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';

@Component({
  selector: 'app-default',
  imports: [
    CommonModule,
    CardComponent,
    IconDirective,
    MonthlyBarChartComponent,
    IncomeOverviewChartComponent,
    AnalyticsChartComponent,
    SalesReportChartComponent
  ],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent {
  private iconService = inject(IconService);

  // constructor
  constructor() {
    this.iconService.addIcon(...[RiseOutline, FallOutline, SettingOutline, GiftOutline, MessageOutline]);
  }

  recentOrder = tableData;

  AnalyticEcommerce = [
    {
      title: 'Total Bookings',
      amount: '12,540',
      background: 'bg-light-primary',
      border: 'border-primary',
      icon: 'rise',
      percentage: '64.2%',
      color: 'text-primary',
      number: '1,250'
    },
    {
      title: 'Active Customers',
      amount: '4,380',
      background: 'bg-light-primary',
      border: 'border-primary',
      icon: 'rise',
      percentage: '72.1%',
      color: 'text-primary',
      number: '580'
    },
    {
      title: 'Assigned Cleaners',
      amount: '320',
      background: 'bg-light-warning',
      border: 'border-warning',
      icon: 'fall',
      percentage: '18.3%',
      color: 'text-warning',
      number: '45'
    },
    {
      title: 'Total Revenue',
      amount: '₹12,75,430',
      background: 'bg-light-warning',
      border: 'border-warning',
      icon: 'rise',
      percentage: '41.9%',
      color: 'text-warning',
      number: '₹2,43,800'
    }
  ];
  transaction = [
    {
      background: 'text-success bg-light-success',
      icon: 'clean',
      title: 'Booking #MFY2344 - Full Home Cleaning',
      time: 'Today, 9:45 AM',
      amount: '+ ₹1,899',
      percentage: '92%'
    },
    {
      background: 'text-primary bg-light-primary',
      icon: 'user',
      title: 'Booking #MFY1221 - Sofa Shampoo',
      time: 'Yesterday, 4:20 PM',
      amount: '+ ₹750',
      percentage: '56%'
    },
    {
      background: 'text-danger bg-light-danger',
      icon: 'alert',
      title: 'Refund #MFY8772 - Cancelled Booking',
      time: '2 hours ago',
      amount: '- ₹450',
      percentage: '21%'
    }
  ];
}
