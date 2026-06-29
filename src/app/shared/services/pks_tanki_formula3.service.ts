import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { Akun } from '../models/akun.model';
import { PksTankiFormula3 } from '../models/pks_tanki_formula3.model';

@Injectable({
	providedIn: 'root'
})

export class PksTankiFormula3Service {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<PksTankiFormula3[]>(`${this.apiUrl}/PksTankiFormula3/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/PksTankiFormula3/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/PksTankiFormula3`, akun,

    );
	}

	update(id:any,PksTankiFormula3: any) {
		return this.http.put(`${this.apiUrl}/PksTankiFormula3/${id}`, PksTankiFormula3);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/PksTankiFormula3/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/PksTankiFormula3/${id}`);
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
			return this.http.get<any>(`${this.apiUrl}/PksTankiFormula3/print_slip/${id}`,httpOptions);
	}




}
