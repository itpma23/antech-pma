import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { Akun } from '../models/akun.model';
import { HrmsCatuBeras } from '../models/hrms_catu_beras.model';

@Injectable({
	providedIn: 'root'
})

export class HrmsCatuBerasService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<HrmsCatuBeras[]>(`${this.apiUrl}/HrmsCatuBeras/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/HrmsCatuBeras/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/HrmsCatuBeras`, akun,

    );
	}

	update(id:any,HrmsCatuBeras: any) {
		return this.http.put(`${this.apiUrl}/HrmsCatuBeras/${id}`, HrmsCatuBeras);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/HrmsCatuBeras/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/HrmsCatuBeras/${id}`);
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
			return this.http.get<any>(`${this.apiUrl}/HrmsCatuBeras/print_slip/${id}`,httpOptions);
	}




}
