import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import 'bootstrap-notify';
declare var $: any;
@Injectable()

export class HttpConfigInterceptor implements HttpInterceptor {

  /**
   *	@class HttpConfigInterceptor
   *	@constructor
  */
  constructor(
    public router: Router,
    public authenticationService: AuthenticationService,
    // private loading: LoadingService
  ) { }

  /**
   *	Transform the outgoing request before passing it to the next interceptor in the chain, by calling next.handle() method
   *
   *	@class HttpConfigInterceptor
   *	@method intercept
   *	@param {request} request
   *	@param {next} httpHandler
  */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //	let loginToken = this.authenticationService.currentTokenValue;
    let token = this.authenticationService.getToken();
    let tokeExp = this.authenticationService.getTokenExpUser();
    let userProfile = this.authenticationService.getUserProfile();
    let db = this.authenticationService.getUserDB();
    let path = this.authenticationService.getUserPath();
    if (db == null) {
      db = '';
    }

    if (path == null) {
      path = '';
    }
    // Check expiration token
    // console.log(userProfile);
    //  console.log(token);
    //  console.log(tokeExp);

    // if (tokeExp) {
    //   if (tokeExp['exp'] && (Date.now() > (Date.now() + tokeExp['exp']))) {
    //     this.authenticationService.logout();
    //   }

    //   request = request.clone({ headers: request.headers.set('Authorization', token) });
    // }
    // token='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjM3IiwidXNlcm5hbWUiOiJhcmlzcHJhcyIsImlhdCI6MTYzMTYzOTMzMCwiZXhwIjoxNjM1MjM5MzMwfQ.9sA4hlyu7P1fKBVis5FenEK9qhLAQcpeqd8EAhrCNEs';
    if (token != null) {


      request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
    }

    // request = request.clone({ headers: request.headers.set('Authorization', token) });
    // if (!request.headers.has('Content-Type')) {
    //   request = request.clone(
    //     {
    //       headers: new HttpHeaders({
    //         'Content-Type': 'application/json',
    //         'NAMADB': db,
    //         'NAMAPATH': path
    //       })


    //     })
    //  }

    request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {

        let errorMessages = [];

        switch (error.status) {
          case 200:
            break;
          case 400:
            if (error.error.error) {

              this.showNotification('bottom', 'center', 'code:' + error.status + '\n' + error.error);

              //this.toastrService.error(error.error.error, this.translate.instant('common.errors_keys.key2'));
            }
            break;
          case 401:

            this.showNotification('bottom', 'center', 'Session habis, silakan login kembali');

            localStorage.clear();

            this.router.navigate(['/auth/login']);

            break;

            break;
          case 403:
            // this.showNotification('bottom', 'center', error.error.error);
            this.showNotification('bottom', 'center', 'code:' + error.status + '\n' + error.error);
            //	this.toastrService.error(this.translate.instant('common.error_messages.message1'), this.translate.instant('common.errors_keys.key4'));
            break;
          case 404:
            // this.showNotification('bottom', 'center', error.error.error);
            this.showNotification('bottom', 'center', 'code:' + error.status + '\n' + error.error);
            //this.toastrService.error(this.translate.instant('common.error_messages.message4'), this.translate.instant('common.errors_keys.key5'));
            break;
          case 422:
            if (error.error.error) {
              // this.showNotification('bottom', 'center', error.error.error);
              this.showNotification('bottom', 'center', 'code:' + error.status + '\n' + error.error);
              //this.toastrService.error(error.error.error, this.translate.instant('common.errors_keys.key6'));
            } else {
              for (let iRow in error.error.errors) {
                for (let jRow in error.error.errors[iRow]) {
                  errorMessages.push(error.error.errors[iRow][jRow]);
                }
              }
              //this.errorDialogService.openDialog(error, errorMessages);
            }
            break;
          case 500:
            errorMessages.push(error.error.message);
            // this.showNotification('bottom', 'center', error.error.error);
            this.showNotification('bottom', 'center', 'code:' + error.status + '\n' + error.error);
            // this.errorDialogService.openDialog(error, errorMessages);
            //	this.toastrService.error(error.error.error, this.translate.instant('common.error_messages.message5'));
            break;
          default:
            // this.showNotification('bottom', 'center', error.error.error);
            this.showNotification('bottom', 'center', 'code:' + error.status + ' \n' + error.error);
            // this.errorDialogService.openDialog(error, errorMessages);
            break;
        }
        return throwError(error);
      }));
  }
  showNotification(from, align, message, color = 4) {
    var type = ['', 'info', 'success', 'warning', 'danger', 'rose', 'primary'];

    //var color = Math.floor((Math.random() * 6) + 1);

    $.notify({
      icon: "notifications",
      message: "Error " + message

    }, {
      type: type[color],
      timer: 3000,
      placement: {
        from: from,
        align: align
      }
    });
  }
}
