import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { Akun } from '../models/akun.model';
import { PksHargaAngkut } from '../models/pks_harga_angkut.model';

@Injectable({
	providedIn: 'root'
})

export class PksHargaAngkutService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<PksHargaAngkut[]>(`${this.apiUrl}/PksHargaAngkut/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/PksHargaAngkut/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/PksHargaAngkut`, akun,

    );
	}

	update(id:any,PksHargaAngkut: any) {
		return this.http.put(`${this.apiUrl}/PksHargaAngkut/${id}`, PksHargaAngkut);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/PksHargaAngkut/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/PksHargaAngkut/${id}`);
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
			return this.http.get<any>(`${this.apiUrl}/PksHargaAngkut/print_slip/${id}`,httpOptions);
	}




}
