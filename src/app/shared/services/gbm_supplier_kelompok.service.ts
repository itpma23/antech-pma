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
import { GbmSupplierKelompok } from '../models/gbm_supplier_kelompok.model';

@Injectable({
	providedIn: 'root'
})

export class GbmSupplierKelompokService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<GbmSupplierKelompok[]>(`${this.apiUrl}/GbmSupplierKelompok/getAll`);
	}

	getById(id: number) {
		return this.http.get(`${this.apiUrl}/GbmSupplierKelompok/${id}`);
	}


  create(data: any) {
		return this.http.post(`${this.apiUrl}/GbmSupplierKelompok/create`, data);
	}
  update(id,data) {
		return this.http.post(`${this.apiUrl}/GbmSupplierKelompok/update/${id}`, data);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/GbmSupplierKelompok/${id}`);
	}


}
