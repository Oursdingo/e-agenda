import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideAnimations(),
    provideToastr({
      timeOut: 3000, // 3 secondes
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true
    }),
  ],
})
  .catch(err => console.error(err));
