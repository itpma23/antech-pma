import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { SERVER_API_URL } from 'src/app/app.constants';
import { EstParamPremiMandorKerani } from '../models/est_param_premi_mandor_kerani.model';

@Injectable({
	providedIn: 'root'
})

export class EstParamPremiMandorKeraniService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<EstParamPremiMandorKerani[]>(`${this.apiUrl}/EstParamPremiMandorKerani/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/EstParamPremiMandorKerani/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/EstParamPremiMandorKerani`, akun,

    );
	}

	update(id:any,EstParamPremiMandorKerani: any) {
		return this.http.put(`${this.apiUrl}/EstParamPremiMandorKerani/${id}`, EstParamPremiMandorKerani);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/EstParamPremiMandorKerani/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/EstParamPremiMandorKerani/${id}`);
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
	// 		return this.http.get<any>(`${this.apiUrl}/EstParamPremiMandorKerani/print_slip/${id}`,httpOptions);
	// }




}
