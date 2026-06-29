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
import { PrcKontrak } from '../models/prc_kontrak.model';

@Injectable({
	providedIn: 'root'
})

export class PrcKontrakService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<PrcKontrak[]>(`${this.apiUrl}/PrcKontrak/getAll`);
	}
	getAllbyCustomer(customer_id) {
		return this.http.get<PrcKontrak[]>(`${this.apiUrl}/PrcKontrak/getAllbyCustomer/${customer_id}`);
	}

	getById(id: number) {
		return this.http.get(`${this.apiUrl}/PrcKontrak/${id}`);
	}


  updateStatus(status:any,pengajar: any) {
    let data={status_id:status,pengajar_id:pengajar}
		return this.http.post(`${this.apiUrl}/PrcKontrak/update_status`, data,

    );
	}

  create(data: any) {
		return this.http.post(`${this.apiUrl}/PrcKontrak/create`, data);
	}
  update(id,data) {
		return this.http.post(`${this.apiUrl}/PrcKontrak/update/${id}`, data);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/PrcKontrak/${id}`);
	}

}
