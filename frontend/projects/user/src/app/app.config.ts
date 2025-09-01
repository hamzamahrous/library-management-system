import {
  ApplicationConfig,
  provideZoneChangeDetection,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {
  HttpHandlerFn,
  HttpRequest,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

function loggingInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');
    if (token) {
      const cloned = request.clone({
        setHeaders: {
          Authorization: `token ${token}`,
        },
      });

      return next(cloned);
    }
  }

  return next(request);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(),
    provideHttpClient(withInterceptors([loggingInterceptor])),
  ],
};
