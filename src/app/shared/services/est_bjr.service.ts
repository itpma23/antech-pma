import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { Akun } from '../models/akun.model';
import { EstBjr } from '../models/est_bjr.model';

@Injectable({
	providedIn: 'root'
})

export class EstBjrService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<EstBjr[]>(`${this.apiUrl}/EstBjr/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/EstBjr/${id}`);
	}
  getByBlokId(id: number) {
		return this.http.get(`${this.apiUrl}/EstBjr/get_by_blok/${id}`);
	}


	create(akun: any) {
		return this.http.post(`${this.apiUrl}/EstBjr`, akun,

    );
	}

	update(id:any,EstBjr: any) {
		return this.http.put(`${this.apiUrl}/EstBjr/${id}`, EstBjr);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/EstBjr/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/EstBjr/${id}`);
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
	// 		return this.http.get<any>(`${this.apiUrl}/EstBjr/print_slip/${id}`,httpOptions);
	// }




}
