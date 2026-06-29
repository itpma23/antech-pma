import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { Akun } from '../models/akun.model';
import { AccKegiatan } from '../models/acc_kegiatan.model';

@Injectable({
	providedIn: 'root'
})

export class AccKegiatanService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<AccKegiatan[]>(`${this.apiUrl}/AccKegiatan/getAll`);
	}

	getAllbyTipe(tipe) {
		return this.http.get<AccKegiatan[]>(`${this.apiUrl}/AccKegiatan/getAllByTipe/${tipe}`);
	}

	getAllByStatusBlokTipe( tipe, statusblok) {
		return this.http.get<AccKegiatan[]>(`${this.apiUrl}/AccKegiatan/getAllByTipeStatus/${tipe}/${statusblok}`);
	}

	getAllByTipeItem(tipeKelompok: any) {
	return this.http.get<any>(`${this.apiUrl}/AccKegiatan/getAllByKelompok/${tipeKelompok}`);
	}

	getById(id: number) {
		return this.http.get(`${this.apiUrl}/AccKegiatan/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/AccKegiatan`, akun,

    );
	}

	update(id:any,AccKegiatan: any) {
		return this.http.put(`${this.apiUrl}/AccKegiatan/${id}`, AccKegiatan);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/AccKegiatan/${id}`);
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
	// 		return this.http.get<any>(`${this.apiUrl}/AccKegiatan/print_slip/${id}`,httpOptions);
	// }




}
