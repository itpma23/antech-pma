import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { SERVER_API_URL } from 'src/app/app.constants';
import { EstTaksasi } from '../models/est_taksasi.model';

@Injectable({
	providedIn: 'root'
})

export class EstTaksasiService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<EstTaksasi[]>(`${this.apiUrl}/EstTaksasi/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/EstTaksasi/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/EstTaksasi`, akun,

    );
	}

	update(id:any,EstTaksasi: any) {
		return this.http.put(`${this.apiUrl}/EstTaksasi/${id}`, EstTaksasi);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/EstTaksasi/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/EstTaksasi/${id}`);
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
	// 		return this.http.get<any>(`${this.apiUrl}/EstTaksasi/print_slip/${id}`,httpOptions);
	// }




}
