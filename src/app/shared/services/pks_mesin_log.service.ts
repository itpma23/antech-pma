import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { Akun } from '../models/akun.model';
import { PksMesinLog } from '../models/pks_mesin_log.model';

@Injectable({
	providedIn: 'root'
})

export class PksMesinLogService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<PksMesinLog[]>(`${this.apiUrl}/PksMesinLog/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/PksMesinLog/${id}`);
	}
	getKm(id: number) {
		return this.http.get(`${this.apiUrl}/PksMesinLog/getKm/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/PksMesinLog`, akun,

    );
	}

	update(id:any,PksMesinLog: any) {
		return this.http.put(`${this.apiUrl}/PksMesinLog/${id}`, PksMesinLog);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/PksMesinLog/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/PksMesinLog/${id}`);
	}

	getPdfSlip(id) {
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
			return this.http.get<any>(`${this.apiUrl}/PksMesinLog/print_slip/${id}`,httpOptions);
	}




}
