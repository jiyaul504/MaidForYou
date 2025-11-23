// angular imports
import { Component, inject, input, output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

// project imports
import { StoredUser } from 'src/app/core/models/auth.model';
import { AuthService } from 'src/app/core/services/api/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';

// icons
import { IconService, IconDirective } from '@ant-design/icons-angular';
import {
  BellOutline,
  SettingOutline,
  GiftOutline,
  MessageOutline,
  PhoneOutline,
  CheckCircleOutline,
  LogoutOutline,
  EditOutline,
  UserOutline,
  ProfileOutline,
  WalletOutline,
  QuestionCircleOutline,
  LockOutline,
  CommentOutline,
  UnorderedListOutline,
  ArrowRightOutline,
  GithubOutline
} from '@ant-design/icons-angular/icons';

import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgScrollbarModule } from 'ngx-scrollbar';


@Component({
  selector: 'app-nav-right',
  standalone: true,
  imports: [IconDirective, RouterModule, NgScrollbarModule, NgbNavModule, NgbDropdownModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {
  private iconService = inject(IconService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private storageService = inject(StorageService);

  styleSelectorToggle = input<boolean>();
  Customize = output();
  windowWidth: number = window.innerWidth;
  screenFull: boolean = true;

  currentUser: StoredUser | null = null;

  constructor() {
    this.iconService.addIcon(
      ...[
        CheckCircleOutline,
        GiftOutline,
        MessageOutline,
        SettingOutline,
        PhoneOutline,
        LogoutOutline,
        UserOutline,
        EditOutline,
        ProfileOutline,
        QuestionCircleOutline,
        LockOutline,
        CommentOutline,
        UnorderedListOutline,
        ArrowRightOutline,
        BellOutline,
        GithubOutline,
        WalletOutline
      ]
    );

    // Read the stored user using StorageService (uses key `auth_user`)
    this.currentUser = this.storageService.getUser();
  }

  profile = [
    { icon: 'edit', title: 'Edit Profile', route: '/profile/edit' },
    { icon: 'user', title: 'View Profile', route: '/profile' },
    { icon: 'profile', title: 'Social Profile' },
    { icon: 'wallet', title: 'Billing' },
    { icon: 'logout', title: 'Logout', action: 'logout' }
  ];

  setting = [
    { icon: 'question-circle', title: 'Support' },
    { icon: 'user', title: 'Account Settings' },
    { icon: 'lock', title: 'Privacy Center' },
    { icon: 'comment', title: 'Feedback' },
    { icon: 'unordered-list', title: 'History' }
  ];

  logout() {
    this.authService.logout().subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession()
    });
  }

  handleTask(task: any) {
    if (!task) return;

    if (task.action === 'logout') {
      this.logout();
      return;
    }

    if (task.route) {
      this.router.navigate([task.route]);
      return;
    }
  }

  private clearSession() {
    this.storageService.clear();
    this.currentUser = null;
    this.router.navigate(['/login']);
  }
}
