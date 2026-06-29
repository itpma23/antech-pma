import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { Akun } from '../models/akun.model';
import { PksProduksiHarian } from '../models/pks_produksi_harian.model';

@Injectable({
	providedIn: 'root'
})

export class PksProduksiHarianService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<PksProduksiHarian[]>(`${this.apiUrl}/PksProduksiHarian/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/PksProduksiHarian/${id}`);
	}

	create(data: any) {
		return this.http.post(`${this.apiUrl}/PksProduksiHarian`, data,

    );
	}
	getProduksiHarian(data: any) {
		return this.http.post(`${this.apiUrl}/pksProduksiHarian/proses_hitung_produksi_perhari`, data,

    );
	}

	update(id:any,PksProduksiHarian: any) {
		return this.http.put(`${this.apiUrl}/PksProduksiHarian/${id}`, PksProduksiHarian);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/PksProduksiHarian/${id}`);
	}

  proses(data: any) {
		return this.http.post(`${this.apiUrl}/PksProduksiHarian/proses_hitung_produksi`, data,

    );
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
			return this.http.get<any>(`${this.apiUrl}/PksProduksiHarian/print_slip/${id}`,httpOptions);
	}




}
