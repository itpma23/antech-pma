import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { Akun } from '../models/akun.model';
import { PksHargaTbs } from '../models/pks_harga_tbs.model';

@Injectable({
	providedIn: 'root'
})

export class PksHargaTbsService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<PksHargaTbs[]>(`${this.apiUrl}/PksHargaTbs/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/PksHargaTbs/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/PksHargaTbs`, akun,

		);
	}

	update(id: any, PksHargaTbs: any) {
		return this.http.put(`${this.apiUrl}/PksHargaTbs/${id}`, PksHargaTbs);
	}
	updatePhoto(id: any, file: any) {
		return this.http.post(`${this.apiUrl}/PksHargaTbs/edit_picture/${id}`, file);
	}


	delete(id: number) {
		let data = { "id": id.toString() };
		return this.http.delete(`${this.apiUrl}/PksHargaTbs/${id}`);
	}

	getPdfSlip(id) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/pdf',
				// 'Authorization' : this.authKey,
				'Accept': 'application/pdf',
				// 'NAMADB': 'testing',
				// 'NAMAPATH': 'Testing'
				//observe : 'response'
			}),
			'responseType': 'blob' as 'json'

		};
		return this.http.get<any>(`${this.apiUrl}/PksHargaTbs/print_slip/${id}`, httpOptions);
	}

	getHargaTbs(tanggal: any, supplier_id: number) {
		const params = new HttpParams()
			.set('tanggal', tanggal)
			.set('supplier_id', supplier_id.toString());

		return this.http.get<any>(`${this.apiUrl}/PksHargaTbs/getHargaTbs`, { params });
	}



}
