import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    standalone: true,
    template: `<footer class="footer">
    <p>© {{ currentYear }} AhanTech. All rights reserved.</p>
  </footer>`,
    styles: [`
    .footer {
      text-align: center;
      padding: 1rem;
      background-color: #f1f1f1;
      font-size: 0.9rem;
      color: #333;
      margin-top: auto;
    }
  `]
})
export class FooterComponent {
    currentYear = new Date().getFullYear();
}
