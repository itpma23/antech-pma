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
import { PksTankiFormula1 } from '../models/pks_tanki_formula1.model';

@Injectable({
	providedIn: 'root'
})

export class PksTankiFormula1Service {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<PksTankiFormula1[]>(`${this.apiUrl}/PksTankiFormula1/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/PksTankiFormula1/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/PksTankiFormula1`, akun,

    );
	}

	update(id:any,PksTankiFormula1: any) {
		return this.http.put(`${this.apiUrl}/PksTankiFormula1/${id}`, PksTankiFormula1);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/PksTankiFormula1/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/PksTankiFormula1/${id}`);
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
			return this.http.get<any>(`${this.apiUrl}/PksTankiFormula1/print_slip/${id}`,httpOptions);
		}
}
