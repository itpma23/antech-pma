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
import { Akun } from '../models/akun.model';

@Injectable({
	providedIn: 'root'
})

export class AccAkunTipeService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getById(id: number){
		return this.http.get(`${this.apiUrl}/accAkunTipe/${id}`);
	}

	create(akunTipe: any){
		return this.http.post(`${this.apiUrl}/accAkunTipe`, akunTipe);
	}

	update(id: number, akunTipe: any){
		return this.http.put(`${this.apiUrl}/accAkunTipe/${id}`, akunTipe);
	}
	delete(id: number){
		return this.http.delete(`${this.apiUrl}/accAkunTipe/${id}`);
	}
}
