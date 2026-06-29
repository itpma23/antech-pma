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
import { AccInterUnit } from '../models/acc_inter_unit.model';

@Injectable({
	providedIn: 'root'
})

export class AccInterUnitService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<AccInterUnit[]>(`${this.apiUrl}/AccInterUnit/getAll`);
	}
  getAllDetail() {
		return this.http.get<AccInterUnit[]>(`${this.apiUrl}/AccInterUnit/getAllDetail`);
	}
  getAllKasbank() {
		return this.http.get<AccInterUnit[]>(`${this.apiUrl}/AccInterUnit/getAllKasbank`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/AccInterUnit/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/AccInterUnit`, akun,

    );
	}

	update(id:any,akun: any) {
		return this.http.put(`${this.apiUrl}/AccInterUnit/${id}`, akun);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/AccInterUnit/${id}`);
	}


}
