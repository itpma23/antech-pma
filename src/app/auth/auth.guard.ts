import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../shared/services/authentication.service';

//import '../../shared/getIP/get_ip.js'
//import {internalIp}  '../../../../node_modules/internal-ip/index'

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private ActRoute: ActivatedRoute,
    private authenticationService: AuthenticationService

  ) { }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) {

    const currentUser = this.authenticationService.getUserProfile();
    const menu = this.authenticationService.getMenuAkses();

    var url = state.url;
    // console.log(url);
    // console.log(menu);
    if (currentUser != null) {
     /* SEMENTARA DI NON AKTIFKAN DULU
     let ada_data = false;
      menu.forEach(el => {
        if (url == ('/' + el['url'])) {
          ada_data = true;
        }
      });
      if (ada_data) {
        console.log(' oke')
        return true
      } else {
        if (url == '/dashboard') {
          return true
        } else {
          console.log('false oke')
          return false;

        }

      }
      */ //SEMENTARA DI NON AKTIFKAN DULU

      return true

    } else {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;

    }

    // not logged in so redirect to login page with the return url
    // this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    // return false;
  }
}
