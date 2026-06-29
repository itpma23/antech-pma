import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { Akun } from '../models/akun.model';
import { AccAssetTipe } from '../models/acc_asset_tipe.model';

@Injectable({
	providedIn: 'root'
})

export class AccAssetTipeService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<AccAssetTipe[]>(`${this.apiUrl}/AccAssetTipe/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/AccAssetTipe/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/AccAssetTipe/create`, akun,

    );
	}

	update(id:any,AccAssetTipe: any) {
		return this.http.put(`${this.apiUrl}/AccAssetTipe/${id}`, AccAssetTipe);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/AccAssetTipe/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/AccAssetTipe/${id}`);
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
	// 		return this.http.get<any>(`${this.apiUrl}/AccAssetTipe/print_slip/${id}`,httpOptions);
	// }




}
