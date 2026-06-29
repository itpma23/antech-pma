import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { BgtKegiatanCost } from '../models/bgt_kegiatan_cost.model';

@Injectable({
	providedIn: 'root'
})

export class BgtKegiatanCostService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<BgtKegiatanCost[]>(`${this.apiUrl}/BgtKegiatanCost/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/BgtKegiatanCost/${id}`);
	}

	create(BgtKegiatanCost: any) {
		return this.http.post(`${this.apiUrl}/BgtKegiatanCost`, BgtKegiatanCost,

    );
	}

	update(id:any,BgtKegiatanCost: any) {
		return this.http.put(`${this.apiUrl}/BgtKegiatanCost/${id}`, BgtKegiatanCost);
	}

	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/BgtKegiatanCost/${id}`);
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
	// 		return this.http.get<any>(`${this.apiUrl}/BgtKegiatanCost/print_slip/${id}`,httpOptions);
	// }




}
