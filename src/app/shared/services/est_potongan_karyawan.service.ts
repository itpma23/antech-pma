import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { SERVER_API_URL } from 'src/app/app.constants';
import { EstPotonganKaryawan } from '../models/est_potongan_karyawan.model';

@Injectable({
	providedIn: 'root'
})

export class EstPotonganKaryawanService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<EstPotonganKaryawan[]>(`${this.apiUrl}/EstPotonganKaryawan/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/EstPotonganKaryawan/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/EstPotonganKaryawan`, akun,

    );
	}

	update(id:any,EstPotonganKaryawan: any) {
		return this.http.put(`${this.apiUrl}/EstPotonganKaryawan/${id}`, EstPotonganKaryawan);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/EstPotonganKaryawan/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/EstPotonganKaryawan/${id}`);
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
	// 		return this.http.get<any>(`${this.apiUrl}/EstPotonganKaryawan/print_slip/${id}`,httpOptions);
	// }




}
