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
import { PrcFranco } from '../models/prc_franco.model';

@Injectable({
	providedIn: 'root'
})

export class PrcFrancoService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<PrcFranco[]>(`${this.apiUrl}/PrcFranco/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/PrcFranco/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/PrcFranco`, akun,

    );
	}

	update(id:any,PrcFranco: any) {
		return this.http.put(`${this.apiUrl}/PrcFranco/${id}`, PrcFranco);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/PrcFranco/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/PrcFranco/${id}`);
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
			return this.http.get<any>(`${this.apiUrl}/PrcFranco/print_slip/${id}`,httpOptions);
		}
}
