// angular imports
import { Component, inject, input, output } from '@angular/core';
import { Router, RouterModule, NavigationStart } from '@angular/router';

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

import { NgbDropdownModule, NgbNavModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  private modal = inject(NgbModal);

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
    { icon: 'edit', title: 'Edit Profile', action: 'editProfile' },
    { icon: 'user', title: 'View Profile', action: 'viewProfile' },
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

    if (task.action === 'viewProfile') {
      // open the profile component as a modal instead of navigating
      import('src/app/demo/pages/profile/view-profile.component').then((m) => {
        const modalRef = this.modal.open(m.ViewProfileComponent, { size: 'lg' });

        // close the modal if the user navigates elsewhere (e.g. clicks Edit inside)
        const sub = this.router.events.subscribe((e) => {
          if (e instanceof NavigationStart) {
            try {
              modalRef.close();
            } catch { }
            sub.unsubscribe();
          }
        });
      });
      return;
    }

    if (task.action === 'editProfile') {
      import('src/app/demo/pages/profile/edit-profile.component').then((m) => {
        const modalRef = this.modal.open(m.EditProfileComponent, { size: 'md' });

        // close the modal if the user navigates elsewhere
        const sub = this.router.events.subscribe((e) => {
          if (e instanceof NavigationStart) {
            try {
              modalRef.close();
            } catch { }
            sub.unsubscribe();
          }
        });
      });
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
