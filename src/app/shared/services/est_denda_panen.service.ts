import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
// import { TranslateService } from '@ngx-translate/core';
// import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { Akun } from '../models/akun.model';
import { EstDendaPanen } from '../models/est_denda_panen.model';

@Injectable({
	providedIn: 'root'
})

export class EstDendaPanenService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<EstDendaPanen[]>(`${this.apiUrl}/estDendaPanen/getAll`);
	}
	getDendaPanenByTanggal(lokasi_id,kode_denda_panen_id,tanggal) {
		return this.http.get<EstDendaPanen[]>(`${this.apiUrl}/estDendaPanen/getDendaPanenByTanggal/${lokasi_id}/${kode_denda_panen_id}/${tanggal}`);
	}

	getById(id: number) {
		return this.http.get(`${this.apiUrl}/estDendaPanen/${id}`);
	}

  getByKodeDendaId(id: number) {
		return this.http.get(`${this.apiUrl}/estDendaPanen/getByKodeDendaId/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/estDendaPanen`, akun,

    );
	}

	update(id:any,estDendaPanen: any) {
		return this.http.put(`${this.apiUrl}/estDendaPanen/${id}`, estDendaPanen);
	}

	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/estDendaPanen/${id}`);
	}


}
