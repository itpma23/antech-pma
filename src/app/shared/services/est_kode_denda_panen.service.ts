import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { Akun } from '../models/akun.model';
import { EstKodeDendaPanen } from '../models/est_kode_denda_panen.model';

@Injectable({
	providedIn: 'root'
})

export class EstKodeDendaPanenService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<EstKodeDendaPanen[]>(`${this.apiUrl}/estKodeDendaPanen/getAll`);
	}



	getById(id: number) {
		return this.http.get(`${this.apiUrl}/estKodeDendaPanen/${id}`);
	}

	create(data: any) {
		return this.http.post(`${this.apiUrl}/estKodeDendaPanen`, data,

    );
	}

	update(id:any,KodeDendaPanen: any) {
		return this.http.put(`${this.apiUrl}/estKodeDendaPanen/${id}`, KodeDendaPanen);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/estKodeDendaPanen/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/estKodeDendaPanen/${id}`);
	}

	// getPdfSlip(id) {
	// 	const httpOptions = {
	// 	  headers: new HttpHeaders({
	// 		'Content-Type':  'application/pdf',
	// 		// 'Authorization' : this.authKey,
	// 		 'Accept' : 'application/pdf',
	// 		// 'NAMADB': 'testing',
	// 		// 'NAMAPATH': 'Testing'
	// 		//observe : 'response'
	// 	  }),
	// 	  'responseType' : 'blob' as 'json'

	// 	};
	// 		return this.http.get<any>(`${this.apiUrl}/estKodeDendaPanen/print_slip/${id}`,httpOptions);
	// }




}
