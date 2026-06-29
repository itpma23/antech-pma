import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { BgtProduksi } from '../models/bgt_produksi.model';
import { BgtCapexModel } from '../models/bgt_capex_model.model';

@Injectable({
	providedIn: 'root'
})

export class BgtCapexService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {
	}

	getAll(){
		return this.http.get<BgtCapexModel[]>(`${this.apiUrl}/BgtCapex/getAll`);
	}

	getById(id: number){
		return this.http.get(`${this.apiUrl}/BgtCapex/${id}`);
	}

	create(data: any){
		return this.http.post(`${this.apiUrl}/BgtCapex`, data);
	}

	update(id:any, data:any){
		return this.http.put(`${this.apiUrl}/BgtCapex/${id}`, data);
	}

	delete(id: number){
		let data = {"id": id.toString()};
		return this.http.delete(`${this.apiUrl}/BgtCapex/${id}`);
	}
}
