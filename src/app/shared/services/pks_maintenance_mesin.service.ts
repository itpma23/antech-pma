import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { Akun } from '../models/akun.model';
import { PksMaintenanceMesin } from '../models/pks_maintenance_mesin';

@Injectable({
	providedIn: 'root'
})

export class PksMaintenanceMesinService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<PksMaintenanceMesin[]>(`${this.apiUrl}/PksMaintenanceMesin/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/PksMaintenanceMesin/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/PksMaintenanceMesin`, akun,

    );
	}

	update(id:any,PksMaintenanceMesin: any) {
		return this.http.put(`${this.apiUrl}/PksMaintenanceMesin/${id}`, PksMaintenanceMesin);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/PksMaintenanceMesin/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/PksMaintenanceMesin/${id}`);
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
	// 		return this.http.get<any>(`${this.apiUrl}/PksMaintenanceMesin/print_slip/${id}`,httpOptions);
	// }




}
