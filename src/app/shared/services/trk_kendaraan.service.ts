import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { Akun } from '../models/akun.model';
import { TrkKendaraan } from '../models/trk_kendaraan.model';

@Injectable({
	providedIn: 'root'
})

export class TrkKendaraanService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<TrkKendaraan[]>(`${this.apiUrl}/TrkKendaraan/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/TrkKendaraan/${id}`);
	}
	getByTraksiId(trk_id: number) {
		return this.http.get<TrkKendaraan[]>(`${this.apiUrl}/TrkKendaraan/getByTraksiId/${trk_id}`);
	}

	create(data: any) {
		return this.http.post(`${this.apiUrl}/TrkKendaraan`, data,

    );
	}

	update(id:any,TrkKendaraan: any) {
		return this.http.put(`${this.apiUrl}/TrkKendaraan/${id}`, TrkKendaraan);
	}
	getKendaraanByLokasi(estId) {
		return this.http.get<any>(`${this.apiUrl}/TrkKendaraan/getKendaraanByLokasi/${estId}`);
	  }


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/TrkKendaraan/${id}`);
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
	// 		return this.http.get<any>(`${this.apiUrl}/TrkKendaraan/print_slip/${id}`,httpOptions);
	// }




}
