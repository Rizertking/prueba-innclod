import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError(err => {
      const msg = err.status ? `Error ${err.status}: ${err.statusText}` : 'Error de red';
      console.error(msg);
      // Aquí puedes disparar un snackbar si tienes un servicio de UI
      return throwError(() => err);
    })
  );
};