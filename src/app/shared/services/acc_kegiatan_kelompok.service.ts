import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { Akun } from '../models/akun.model';
import { AccKegiatanKelompok } from '../models/acc_kegiatan_kelompok.model';

@Injectable({
	providedIn: 'root'
})

export class AccKegiatanKelompokService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<AccKegiatanKelompok[]>(`${this.apiUrl}/AccKegiatanKelompok/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/AccKegiatanKelompok/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/AccKegiatanKelompok`, akun,

    );
	}

	update(id:any,AccKegiatanKelompok: any) {
		return this.http.put(`${this.apiUrl}/AccKegiatanKelompok/${id}`, AccKegiatanKelompok);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/AccKegiatanKelompok/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/AccKegiatanKelompok/${id}`);
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
	// 		return this.http.get<any>(`${this.apiUrl}/AccKegiatanKelompok/print_slip/${id}`,httpOptions);
	// }




}
