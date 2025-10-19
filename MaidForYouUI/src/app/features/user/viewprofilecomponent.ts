import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { StorageService } from '../../core/services/storage.service';
import { StoredUser } from '../../core/models/auth.model';
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: 'app-view-profile',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule, MatDividerModule],
    templateUrl: './viewprofilecomponent.html',
    styleUrls: ['./viewprofilecomponent.scss']
})
export class ViewProfileComponent implements OnInit {
    user: StoredUser | null = null;

    constructor(private storageService: StorageService) { }

    ngOnInit() {
        this.user = this.storageService.getUser();
    }
}

