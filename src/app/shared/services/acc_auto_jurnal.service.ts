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
import { AccAutoJurnal } from '../models/acc_auto_jurnal.model';

@Injectable({
	providedIn: 'root'
})

export class AccAutoJurnalService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<AccAutoJurnal[]>(`${this.apiUrl}/AccAutoJurnal/getAll`);
	}
  getAllDetail() {
		return this.http.get<AccAutoJurnal[]>(`${this.apiUrl}/AccAutoJurnal/getAllDetail`);
	}
  getAllKasbank() {
		return this.http.get<AccAutoJurnal[]>(`${this.apiUrl}/AccAutoJurnal/getAllKasbank`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/AccAutoJurnal/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/AccAutoJurnal`, akun,

    );
	}

	update(id:any,akun: any) {
		return this.http.put(`${this.apiUrl}/AccAutoJurnal/${id}`, akun);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/AccAutoJurnal/${id}`);
	}


}
