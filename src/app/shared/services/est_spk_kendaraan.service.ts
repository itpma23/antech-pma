import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { EstSpkKendaraan } from '../models/est_spk_kendaraan.model';

@Injectable({
	providedIn: 'root'
})

export class EstSpkKendaraanService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<EstSpkKendaraan[]>(`${this.apiUrl}/EstSpkKendaraan/getAll`);
	}

	getAllByEstateId(id: number) {
		return this.http.get(`${this.apiUrl}/EstSpkKendaraan/getAllbyEstate/${id}`);
	}

	getById(id: number) {
		return this.http.get(`${this.apiUrl}/EstSpkKendaraan/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/EstSpkKendaraan`, akun,

    );
	}

	update(id:any,EstSpkKendaraan: any) {
		return this.http.put(`${this.apiUrl}/EstSpkKendaraan/${id}`, EstSpkKendaraan);
	}
  	updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/EstSpkKendaraan/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/EstSpkKendaraan/${id}`);
	}
	getAllAkunPph() {
		return this.http.get(`${this.apiUrl}/EstSpkKendaraan/getAkunPph`);
	}
  getReportDetail(data) {
		const httpOptions = {
			// headers: new HttpHeaders({
			//   'Content-Type':  'application/pdf',
			//    'Accept' : 'application/pdf',
			// }),
			'responseType' : 'blob' as 'json'
		};
		return this.http.post(`${this.apiUrl}/EstSpkKendaraan/laporan_detail`, data,httpOptions);
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
	// 		return this.http.get<any>(`${this.apiUrl}/EstSpkKendaraan/print_slip/${id}`,httpOptions);
	// }




}
