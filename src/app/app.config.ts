// src/app/app.config.ts
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

// ✅ HTTP + interceptor
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';

// ✅ Animaciones para Angular Material
// Usa uno de los dos según prefieras carga inmediata o diferida.
// Opción A (inmediata):
import { provideAnimations } from '@angular/platform-browser/animations';
// Opción B (diferida):
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),

    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    // 👉 HTTP + interceptor
    provideHttpClient(withInterceptors([httpErrorInterceptor])),

    // 👉 Animaciones (elige una)
    provideAnimations(),
    // o: provideAnimationsAsync(),
  ]
};
