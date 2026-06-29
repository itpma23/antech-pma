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

export class AccAkunNewService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<Akun[]>(`${this.apiUrl}/accAkunNew/getAll`);
	}
  getAllByLokasiId(lokasi_id) {
		return this.http.get<Akun[]>(`${this.apiUrl}/accAkunNew/getAllByLokasiId/${lokasi_id}`);
	}
  getAllDetail() {
		return this.http.get<Akun[]>(`${this.apiUrl}/accAkunNew/getAllDetail`);
	}
  getAllKasbank() {
		return this.http.get<Akun[]>(`${this.apiUrl}/accAkunNew/getAllKasbank`);
	}
  getAllSupplier() {
		return this.http.get<Akun[]>(`${this.apiUrl}/accAkunNew/getAllSupplier`);
	}
  getAllKasbankByAccess() {
		return this.http.get<Akun[]>(`${this.apiUrl}/accAkunNew/getAllKasbankByAccess`);
	}
  getAllKasbankByLokasiId(lokasi_id) {
		return this.http.get<Akun[]>(`${this.apiUrl}/accAkunNew/getAllKasbankByLokasiId/${lokasi_id}`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/accAkunNew/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/accAkunNew`, akun,

    );
	}

	update(id:any,akun: any) {
		return this.http.put(`${this.apiUrl}/accAkunNew/${id}`, akun);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/accAkunNew/${id}`);
	}

	getPdfExportAll() {
		const httpOptions = {
		  headers: new HttpHeaders({
			'Content-Type':  'application/pdf',
			// 'Authorization' : this.authKey,
			 'Accept' : 'application/pdf',
			// 'NAMADB': 'testing',
			// 'NAMAPATH': 'Testing'
			//observe : 'response'
		  }),
		  'responseType' : 'blob' as 'json'

		};
			return this.http.get<any>(`${this.apiUrl}/accAkunNew/export_all`,httpOptions);
		}
}
