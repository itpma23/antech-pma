import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { EstCurahHujan } from '../models/est_curah_hujan.model';

@Injectable({
	providedIn: 'root'
})

export class EstCurahHujanService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<EstCurahHujan[]>(`${this.apiUrl}/EstCurahHujan/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/EstCurahHujan/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/EstCurahHujan`, akun,

    );
	}

	update(id:any,EstCurahHujan: any) {
		return this.http.put(`${this.apiUrl}/EstCurahHujan/${id}`, EstCurahHujan);
	}
  	updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/EstCurahHujan/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/EstCurahHujan/${id}`);
	}

	getReportDetail(data) {
		const httpOptions = {
			// headers: new HttpHeaders({
			//   'Content-Type':  'application/pdf',
			//    'Accept' : 'application/pdf',
			// }),
			'responseType' : 'blob' as 'json'
		};
		return this.http.post(`${this.apiUrl}/EstCurahHujan/laporan_curah_hujan`, data,httpOptions);
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
	// 		return this.http.get<any>(`${this.apiUrl}/EstCurahHujan/print_slip/${id}`,httpOptions);
	// }




}
