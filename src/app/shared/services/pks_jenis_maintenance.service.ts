import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { Akun } from '../models/akun.model';
import { PksJenisMaintenance } from '../models/pks_jenis_maintenance';

@Injectable({
	providedIn: 'root'
})

export class PksJenisMaintenanceService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<PksJenisMaintenance[]>(`${this.apiUrl}/PksJenisMaintenance/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/PksJenisMaintenance/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/PksJenisMaintenance`, akun,

    );
	}

	update(id:any,PksJenisMaintenance: any) {
		return this.http.put(`${this.apiUrl}/PksJenisMaintenance/${id}`, PksJenisMaintenance);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/PksJenisMaintenance/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/PksJenisMaintenance/${id}`);
	}

	// getPdfSlip(id) {
	// 	const httpOptions = {
	// 	  headers: new HttpHeaders({
	// 		// 'Content-Type':  'application/pdf',
	// 		// // 'Authorization' : this.authKey,
	// 		//  'Accept' : 'application/pdf',
	// 		// // 'NAMADB': 'testing',
	// 		// // 'NAMAPATH': 'Testing'
	// 		// //observe : 'response'
	// 	  }),
	// 	  'responseType' : 'blob' as 'json'
	
	// 	};
	// 		return this.http.get<any>(`${this.apiUrl}/PksJenisMaintenance/print_slip/${id}`,httpOptions);
	// }




}
