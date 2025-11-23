import { enableProdMode, importProvidersFrom } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { environment } from './environments/environment';
import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';

import { ToastrModule } from 'ngx-toastr';
import { authInterceptorFn } from './app/core/interceptors/auth.interceptor';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      ToastrModule.forRoot({
        timeOut: 5000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
        closeButton: true,
        progressBar: true
      })
    ),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([authInterceptorFn])
    )
  ]
}).catch((err) => console.error(err));
