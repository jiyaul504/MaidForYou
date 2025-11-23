import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private previousUrl: string | null = null;
  private currentUrl: string | null = null;

  constructor(private router: Router) {
    this.currentUrl = this.router.url;
    router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      const navEnd = event as NavigationEnd;
      this.previousUrl = this.currentUrl;
      this.currentUrl = navEnd.urlAfterRedirects;
    });
  }

  getPreviousUrl(): string | null {
    return this.previousUrl;
  }

  getCurrentUrl(): string | null {
    return this.currentUrl;
  }
}
