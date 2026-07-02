import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
// import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
// import { TranslateService } from '@ngx-translate/core';
// import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user.model';
import { Token } from '../models/token.model';

import { environment } from '../../../environments/environment';
import { SERVER_API_URL, SERVER_FOLDER_NAME } from 'src/app/app.constants';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { Menu } from '../models/menu.model';
import { UserAccess } from '../models/user-access.model';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  public loginUser: Observable<User>;
  public loginToken: Observable<Token>;
  private currentUserSubject: BehaviorSubject<User>;
  private currentTokenSubject: BehaviorSubject<Token>;
  private apiUrl = SERVER_API_URL;
  private folderName = SERVER_FOLDER_NAME;
  loginCurrentUser: any;
  userAccessToken: any;

  constructor(
    public router: Router,
    private http: HttpClient,
    // public toastrService: ToastrService,
    // public translate: TranslateService,
    public ngxRolesService: NgxRolesService,
    public permissions: NgxPermissionsService
  ) {
    // if(localStorage.getItem('loginUser')) {
    // 	this.loginCurrentUser = JSON.parse(localStorage.getItem('loginUser'));
    // 	this.userAccessToken = JSON.parse(localStorage.getItem('access_token'));
    // }
    // this.currentUserSubject = new BehaviorSubject<User>(this.loginCurrentUser);
    // this.currentTokenSubject = new BehaviorSubject<Token>(this.userAccessToken);
    // this.loginUser = this.currentUserSubject.asObservable();
    // this.loginToken = this.currentTokenSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get currentTokenValue(): Token {
    return this.currentTokenSubject.value;
  }


  setLoginUser(user) {
    localStorage.setItem('loginUser', JSON.stringify(user));
    // this.setUserPermissions(user);
    this.currentUserSubject.next(user);
  }

  // setUserPermissions(user) {
  // 	this.ngxRolesService.flushRoles();
  // 	this.ngxPermissionsService.flushPermissions();

  // 	localStorage.setItem("permissions", JSON.stringify(user));

  // 	for (let iRow in user.permissions) {
  // 		this.ngxPermissionsService.addPermission(user.permissions[iRow]);
  // 	}
  // 	this.ngxRolesService.addRoles(user.permissions);
  // }

  getToken() {
    return localStorage.getItem("access_token")
  }

  getRoles() {
    return JSON.parse(localStorage.getItem("roles"));
  }
  getTokenExpUser() {
    return JSON.parse(localStorage.getItem("userExp"))
  }

  getUserProfile() {
    return JSON.parse(localStorage.getItem('loginUser'));
  }
  getMenuAkses() {
    return JSON.parse(localStorage.getItem('menuAkses'));
  }

  getUserCompanyName() {
    return localStorage.getItem("user_company_name")
  }
  getUserCompanyLogo() {
    return localStorage.getItem("logo_company")
  }
  getUserDB() {
    return localStorage.getItem("user_db")
  }
  getUserPath() {
    return localStorage.getItem("user_path")
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }

  register(user: User) {
    return this.http.post(`${this.apiUrl}/api/register`, user);
  }


  setDB_PATH(db, path, name) {
    localStorage.setItem('user_db', db);
    localStorage.setItem('user_path', path);
    // localStorage.setItem('user_company_name', name);
    localStorage.setItem('user_company_name', name);



  }
  login(email: string, password: string) {
    let body = { "username": email, "password": password };
    // console.log(body);
    return this.http.post<any>(`${this.apiUrl}/auth/login`, body)
      .pipe(map(user => {
        if (user) {
          //  console.log(user);
          if (user['status'] == 'OK') {
            localStorage.setItem('access_token', (user['token']));
            localStorage.setItem('loginUser', JSON.stringify(user['data']));
            localStorage.setItem('menuAkses', JSON.stringify(user['menu']));
            let roleUser = [];
            let roles = [];

            // if (user['data']['is_admin'] == '1') {
            //   roleUser.push('ADMIN');
            //   roles = roleUser;
            // } else if (user['data']['is_siswa'] == '1'){
            //   roleUser.push('SISWA');
            //   roles = roleUser;

            // } else {
            //   roleUser = user['role'];
            //   roles = roleUser.map(r => { return r['role'] });

            // }
            // this.ngxRolesService.flushRoles();
            // this.permissions.flushPermissions();
            // this.permissions.loadPermissions(roles);
            localStorage.setItem('user_path', (this.folderName));
            localStorage.setItem('user_company_name', 'PT PALM MAS ASRI');
            // localStorage.setItem('user_company_name', user['nama_company']);
            // localStorage.setItem('roles', JSON.stringify(roles));
            localStorage.setItem('logo_company', user['logo_company']);
            localStorage.setItem('alamat', user['alamat']);
            localStorage.setItem('telp', user['telp']);
            localStorage.setItem('whatapps', user['whatapps']);
            // localStorage.setItem('img-slide-1',  user['img-slide-1']);
            // localStorage.setItem('img-slide-2',  user['img-slide-2']);
            // localStorage.setItem('img-slide-3',  user['img-slide-3']);
            // localStorage.setItem('img-slide-4',  user['img-slide-4']);

          }
          //this.currentTokenSubject.next(user);

          // this.getTokenExp().subscribe(ret=>{
          //   localStorage.setItem('userExp', JSON.stringify(ret));

          // });
        }
        return user;
      }));
  }
  getMenuAccess_old() {
    let user = this.getUserProfile();
    return this.http.post<any>(`${this.apiUrl}/auth/getMenuAccess/${user['id']}`, null);
  }
  getMenuAccess() {
     return this.http.post<any>(`${this.apiUrl}/auth/getMenuAccess`, null);
  }
  getMenuByUrl(url) {
    // let user = this.getUserProfile();
    let data={url:url};
    return this.http.post<any>(`${this.apiUrl}/auth/getMenuByUrl`, data)
  }
  getAccessButton(menuName) {
    let user = this.getUserProfile();
    return this.http.post<any>(`${this.apiUrl}/auth/getMenuButton/${user['id']}/${menuName}`, null)
  }
  getMenuEdit(user_id) {

    return this.http.post<any>(`${this.apiUrl}/auth/get_menu_edit/${user_id}`, null);
  }
  getMenu() {

    return this.http.post<any>(`${this.apiUrl}/auth/get_menu_access`, null);
  }
  forgotPassword(email) {
    return this.http.post(`${this.apiUrl}/api/forgot-password`, email);
  }

  getTokenExp() {
    return this.http.post(`${this.apiUrl}/auth/get_user_exp`, null);

  }
  getVerifyUser(data) {
    return this.http.post(`${this.apiUrl}/api/verify/user`, data);
  }

  getVerifyUserToken(data) {
    return this.http.post(`${this.apiUrl}/api/verify/token`, data);
  }

  resetPassword(data) {
    return this.http.post(`${this.apiUrl}/api/reset-password`, data);
  }

  logout() {
    this.http.post<any>(`${this.apiUrl}/auth/logout`, null).subscribe(l=>{
      console.log(l);
    })
    this.ngxRolesService.flushRoles();
    this.permissions.flushPermissions();
    localStorage.removeItem('access_token');
    localStorage.removeItem('loginUser');
    localStorage.removeItem('menuAkses');
    localStorage.removeItem('user_db');
    localStorage.removeItem('user_path');
    localStorage.removeItem('user_company_name');
    localStorage.removeItem('logo_company');
    localStorage.removeItem('alamat');
    localStorage.removeItem('telp');
    localStorage.removeItem('whatapps');
    localStorage.removeItem('img-slide-1');
    localStorage.removeItem('img-slide-2');
    localStorage.removeItem('img-slide-3');
    localStorage.removeItem('img-slide-4');
    localStorage.removeItem('roles');
    console.log('logout');
    this.router.navigate(['/auth/login']);
    //   this.http.get(`${this.apiUrl}/auth/logout`)
    //     .subscribe(
    //       data => {
    //         localStorage.removeItem('loginUser');
    //         localStorage.removeItem('access_token');
    //         if (isheader) {
    //           	this.toastrService.success(this.translate.instant('common.error_messages.message6'));
    //         }

    //         if (localStorage.getItem("permissions") != 'undefined' && localStorage.getItem("permissions") != null) {
    //           localStorage.removeItem("permissions");
    //         }

    //         this.router.navigate(['/auth/login']);
    //       });
  }
}
