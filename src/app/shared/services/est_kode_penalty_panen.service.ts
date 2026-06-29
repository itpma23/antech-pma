import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { Akun } from '../models/akun.model';
import { EstKodePenaltyPanen } from '../models/est_kode_penalty_panen.model';

@Injectable({
	providedIn: 'root'
})

export class EstKodePenaltyPanenService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<EstKodePenaltyPanen[]>(`${this.apiUrl}/EstPenaltyPanen/getAll`);
	}



	getById(id: number) {
		return this.http.get(`${this.apiUrl}/EstPenaltyPanen/${id}`);
	}

	create(data: any) {
		return this.http.post(`${this.apiUrl}/EstPenaltyPanen`, data,

		);
	}

	view_laporan(type: any) {
    const httpOptions = {
      responseType: "blob" as "json",
    };
    return this.http.get<any>(
      `${this.apiUrl}/EstPenaltyPanen/view_laporan/${type}`,
      httpOptions
    );
  }

	update(id: any, KodeDendaPanen: any) {
		return this.http.put(`${this.apiUrl}/EstPenaltyPanen/${id}`, KodeDendaPanen);
	}
	updatePhoto(id: any, file: any) {
		return this.http.post(`${this.apiUrl}/EstPenaltyPanen/edit_picture/${id}`, file);
	}


	delete(id: number) {
		let data = { "id": id.toString() };
		return this.http.delete(`${this.apiUrl}/EstPenaltyPanen/${id}`);
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
	// 		return this.http.get<any>(`${this.apiUrl}/estKodePenaltyPanen/print_slip/${id}`,httpOptions);
	// }



}
