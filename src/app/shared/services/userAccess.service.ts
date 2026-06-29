import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
// import { TranslateService } from '@ngx-translate/core';
// import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { Menu } from '../models/menu.model';

@Injectable({
	providedIn: 'root'
})

export class UserAccessService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}




	getById(id: number) {
		return this.http.get(`${this.apiUrl}/userAccess/getById/${id}`);
	}

  getMenuAccess(user_id: number) {
		return this.http.post(`${this.apiUrl}/userAccess/getMenuAccess/${user_id}`,null);
	}
  // getMenuAccess() {
	// 	return this.http.post(`${this.apiUrl}/userAccess/getMenuAccess`,null);
	// }

  getLocationAccess(user_id: number) {
		return this.http.post(`${this.apiUrl}/userAccess/getLocationAccess/${user_id}`,null);
	}
  getAfdelingAccess(user_id: number) {
		return this.http.post(`${this.apiUrl}/userAccess/getAfdelingAccess/${user_id}`,null);
	}
  getKasbankAccess(user_id: number) {
		return this.http.post(`${this.apiUrl}/userAccess/getKasbankAccess/${user_id}`,null);
	}
  getPostingAccess(user_id: number) {
		return this.http.post(`${this.apiUrl}/userAccess/getPostingAccess/${user_id}`,null);
	}

	getPostingAll() {
		return this.http.get(`${this.apiUrl}/userAccess/getPostingAll`);
	}


	save(user_id:number,menus: any) {
    let data:any={user_id:user_id,menus:menus};
		return this.http.post(`${this.apiUrl}/userAccess/save`, data,

    );
	}

	update(id:any,menu: any) {
		return this.http.put(`${this.apiUrl}/userAccess/${id}`, menu);
	}

  updateLocation(user_id:any,data: any) {
		return this.http.post(`${this.apiUrl}/userAccess/updateLocation/${user_id}`, data);
	}
  updateAfdeling(user_id:any,data: any) {
		return this.http.post(`${this.apiUrl}/userAccess/updateAfdeling/${user_id}`, data);
	}
  updateKasbank(user_id:any,data: any) {
		return this.http.post(`${this.apiUrl}/userAccess/updateKasbank/${user_id}`, data);
	}
  updatePosting(user_id:any,data: any) {
		return this.http.post(`${this.apiUrl}/userAccess/updatePosting/${user_id}`, data);
	}
	delete(id: number) {
		return this.http.delete(`${this.apiUrl}/userAccess/${id}`);
	}
	deleteAuditUserAll() {
		return this.http.post(`${this.apiUrl}/UserAudit/delete_audit_all`,null);
	}

}
