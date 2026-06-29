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

export class MenuService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAllHirarki() {
		return this.http.get<any>(`${this.apiUrl}/menu`);
	}
  getAllChild() {
		return this.http.get<Menu[]>(`${this.apiUrl}/menu/getmenuAllChild`);
	}
  getAllParent() {
		return this.http.get<Menu[]>(`${this.apiUrl}/menu/getmenuAllParent`);
	}



	getById(id: number) {
		return this.http.get(`${this.apiUrl}/menu/getById/${id}`);
	}

	create(menu: any) {
		return this.http.post(`${this.apiUrl}/menu/getById`, menu,

    );
	}

	update(id:any,menu: any) {
		return this.http.put(`${this.apiUrl}/menu/${id}`, menu);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/menu/edit_picture/${id}`, file);
	}


	delete(id: number) {
		return this.http.delete(`${this.apiUrl}/menu/${id}`);
	}


}
