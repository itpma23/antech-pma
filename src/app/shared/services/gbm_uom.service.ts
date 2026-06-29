import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { Akun } from '../models/akun.model';
import { GbmUom } from '../models/gbm_uom.model';

@Injectable({
	providedIn: 'root'
})

export class GbmUomService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<GbmUom[]>(`${this.apiUrl}/GbmUom/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/GbmUom/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/GbmUom`, akun,

    );
	}

	update(id:any,GbmUom: any) {
		return this.http.put(`${this.apiUrl}/GbmUom/${id}`, GbmUom);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/GbmUom/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/GbmUom/${id}`);
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
	// 		return this.http.get<any>(`${this.apiUrl}/GbmUom/print_slip/${id}`,httpOptions);
	// }




}
