import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { Akun } from '../models/akun.model';
import { HrmsCutiSaldo } from '../models/hrms_cuti_saldo.model';

@Injectable({
	providedIn: 'root'
})

export class HrmsCutiSaldoService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<HrmsCutiSaldo[]>(`${this.apiUrl}/HrmsCutiSaldo/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/HrmsCutiSaldo/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/HrmsCutiSaldo`, akun,

    );
	}

	update(id:any,HrmsCutiSaldo: any) {
		return this.http.put(`${this.apiUrl}/HrmsCutiSaldo/${id}`, HrmsCutiSaldo);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/HrmsCutiSaldo/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/HrmsCutiSaldo/${id}`);
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
			return this.http.get<any>(`${this.apiUrl}/HrmsCutiSaldo/print_slip/${id}`,httpOptions);
	}




}
