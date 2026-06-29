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
import { PrcSyaratBayar } from '../models/prc_syarat_bayar.model';

@Injectable({
	providedIn: 'root'
})

export class PrcSyaratBayarService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<PrcSyaratBayar[]>(`${this.apiUrl}/PrcSyaratBayar/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/PrcSyaratBayar/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/PrcSyaratBayar`, akun,

    );
	}

	update(id:any,PrcSyaratBayar: any) {
		return this.http.put(`${this.apiUrl}/PrcSyaratBayar/${id}`, PrcSyaratBayar);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/PrcSyaratBayar/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/PrcSyaratBayar/${id}`);
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
			return this.http.get<any>(`${this.apiUrl}/PrcSyaratBayar/print_slip/${id}`,httpOptions);
		}
}
