import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { Akun } from '../models/akun.model';
import { HrmsLibur } from '../models/hrms_libur.model';

@Injectable({
	providedIn: 'root'
})

export class HrmsLiburService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<HrmsLibur[]>(`${this.apiUrl}/HrmsLibur/getAll`);
	}
	
	getAllDetail(id: number) {
		return this.http.get<HrmsLibur[]>(`${this.apiUrl}/HrmsLibur/getAllDetail/${id}`);
	}

	getById(id: number) {
		return this.http.get(`${this.apiUrl}/HrmsLibur/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/HrmsLibur`, akun,

    );
	}

	update(id:any,HrmsLibur: any) {
		return this.http.put(`${this.apiUrl}/HrmsLibur/${id}`, HrmsLibur);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/HrmsLibur/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/HrmsLibur/${id}`);
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
			return this.http.get<any>(`${this.apiUrl}/HrmsLibur/print_slip/${id}`,httpOptions);
	}




}
