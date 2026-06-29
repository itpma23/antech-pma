import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { Akun } from '../models/akun.model';
import { AccUangMuka } from '../models/acc_uang_muka.model';

@Injectable({
	providedIn: 'root'
})

export class AccUangMukaService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<AccUangMuka[]>(`${this.apiUrl}/AccUangMuka/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/AccUangMuka/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/AccUangMuka`, akun,

    );
	}

	posting(id:any,data: any) {
		return this.http.post(`${this.apiUrl}/AccUangMuka/posting/${id}`, data);
	}

	update(id:any,AccUangMuka: any) {
		return this.http.put(`${this.apiUrl}/AccUangMuka/${id}`, AccUangMuka);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/AccUangMuka/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/AccUangMuka/${id}`);
	}
	getAllAkunUangMuka() {
		return this.http.get(`${this.apiUrl}/AccUangMuka/getAkunUangMuka`);
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
			return this.http.get<any>(`${this.apiUrl}/AccUangMuka/print_slip/${id}`,httpOptions);
		}

	getLaporan(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/AccUangMuka/laporan`, data,httpOptions);
	}
  getLaporanRinci(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/AccUangMuka/laporan_rinci`, data,httpOptions);
	}

	getUangMuka(){
		return this.http.get(`${this.apiUrl}/AccUangMuka/getUangMuka`);
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
	// 		return this.http.get<any>(`${this.apiUrl}/AccUangMuka/print_slip/${id}`,httpOptions);
	// }




}
