import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { BgtProduksi } from '../models/bgt_produksi.model';

@Injectable({
	providedIn: 'root'
})

export class BgtProduksiService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<BgtProduksi[]>(`${this.apiUrl}/BgtProduksi/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/BgtProduksi/${id}`);
	}

	create(BgtProduksi: any) {
		return this.http.post(`${this.apiUrl}/BgtProduksi`, BgtProduksi,

    );
	}

	update(id:any,BgtProduksi: any) {
		return this.http.put(`${this.apiUrl}/BgtProduksi/${id}`, BgtProduksi);
	}

	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/BgtProduksi/${id}`);
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
	// 		return this.http.get<any>(`${this.apiUrl}/BgtProduksi/print_slip/${id}`,httpOptions);
	// }




}
