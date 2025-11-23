import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SessionService } from '../services/session.service';

@Component({
    selector: 'app-session-timeout',
    standalone: true,
    imports: [CommonModule, NgbModalModule],
    template: `
    <div
      class="modal fade"
      [class.show]="show"
      [style.display]="show ? 'block' : 'none'"
      tabindex="-1"
      aria-modal="true"
      role="dialog">
      <div class="modal-dialog modal-sm modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Session expiring</h5>
          </div>
          <div class="modal-body text-center">
            <p>Your session will expire in <strong>{{ seconds$ | async }}</strong> seconds.</p>
            <p>Do you want to continue your session?</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" (click)="login()">Login</button>
            <button class="btn btn-primary" (click)="continue()">Continue</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SessionTimeoutComponent {
    show = false;
    seconds$ = this.session.countdown$;

    constructor(private session: SessionService) {
        this.session.showModal$.subscribe((s) => (this.show = s));
    }

    continue() {
        this.session.continueSession();
    }

    login() {
        this.session.loginNow();
    }
}
