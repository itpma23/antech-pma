import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('token');

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.status === 401) {

          alert('Session habis, silakan login kembali');

          localStorage.clear();

          this.router.navigate(['/auth/login']);
        }

        return throwError(() => error);
      })
    );
  }
}