import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { Akun } from '../models/akun.model';
import { HrmsBasisLembur } from '../models/hrms_basis_lembur.model';

@Injectable({
	providedIn: 'root'
})

export class HrmsBasisLemburService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<HrmsBasisLembur[]>(`${this.apiUrl}/HrmsBasisLembur/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/HrmsBasisLembur/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/HrmsBasisLembur`, akun,

    );
	}

	update(id:any,HrmsBasisLembur: any) {
		return this.http.put(`${this.apiUrl}/HrmsBasisLembur/${id}`, HrmsBasisLembur);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/HrmsBasisLembur/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/HrmsBasisLembur/${id}`);
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
			return this.http.get<any>(`${this.apiUrl}/HrmsBasisLembur/print_slip/${id}`,httpOptions);
	}




}
