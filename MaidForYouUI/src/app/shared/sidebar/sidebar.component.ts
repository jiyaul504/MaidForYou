import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../core/services/storage.service';
import { RouterModule } from '@angular/router';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    standalone: true,
    imports: [
        RouterModule,
        MatListModule,
        MatIconModule,
        MatDividerModule,
    ]
})
export class SidebarComponent {
    constructor(private router: Router, private storage: StorageService) { }

    navigateTo(path: string): void {
        this.router.navigate([path]);
    }

    logout(): void {
        this.storage.clear();
        this.router.navigate(['/login']);
    }
}
