import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { Akun } from '../models/akun.model';
import { AccAsset } from '../models/acc_asset.model';

@Injectable({
	providedIn: 'root'
})

export class AccAssetService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<AccAsset[]>(`${this.apiUrl}/AccAsset/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/AccAsset/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/AccAsset`, akun,

    );
	}

	update(id:any,AccAsset: any) {
		return this.http.put(`${this.apiUrl}/AccAsset/${id}`, AccAsset);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/AccAsset/edit_picture/${id}`, file);
	}

	getPoReportDetail(data) {
		const httpOptions = {
		  // headers: new HttpHeaders({
		  //   'Content-Type':  'application/pdf',
		  //    'Accept' : 'application/pdf',
		  // }),
		  'responseType' : 'blob' as 'json'
	
		};
			return this.http.post(`${this.apiUrl}/AccAsset/laporan_po_detail`, data,httpOptions);
		}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/AccAsset/${id}`);
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
	// 		return this.http.get<any>(`${this.apiUrl}/AccAsset/print_slip/${id}`,httpOptions);
	// }




}
