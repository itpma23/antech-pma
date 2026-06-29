import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { Akun } from '../models/akun.model';
import { EstPremiBasisPanen } from '../models/est_premi_basis_panen.model';

@Injectable({
	providedIn: 'root'
})

export class EstPremiBasisPanenService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<EstPremiBasisPanen[]>(`${this.apiUrl}/EstPremiBasisPanen/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/EstPremiBasisPanen/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/EstPremiBasisPanen`, akun,

    );
	}

	update(id:any,EstPremiBasisPanen: any) {
		return this.http.put(`${this.apiUrl}/EstPremiBasisPanen/${id}`, EstPremiBasisPanen);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/EstPremiBasisPanen/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/EstPremiBasisPanen/${id}`);
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
	// 		return this.http.get<any>(`${this.apiUrl}/EstPremiBasisPanen/print_slip/${id}`,httpOptions);
	// }




}
