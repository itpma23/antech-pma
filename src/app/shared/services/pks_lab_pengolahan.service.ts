import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { Akun } from '../models/akun.model';
import { PksLabPengolahan } from '../models/pks_lab_pengolahan';

@Injectable({
	providedIn: 'root'
})

export class PksLabPengolahanService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<PksLabPengolahan[]>(`${this.apiUrl}/PksLabPengolahan/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/PksLabPengolahan/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/PksLabPengolahan`, akun,

    );
	}

	update(id:any,PksLabPengolahan: any) {
		return this.http.put(`${this.apiUrl}/PksLabPengolahan/${id}`, PksLabPengolahan);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/PksLabPengolahan/${id}`);
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
			return this.http.get<any>(`${this.apiUrl}/PksLabPengolahan/print_slip/${id}`,httpOptions);
	}




}
