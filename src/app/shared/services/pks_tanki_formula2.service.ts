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
import { PksTankiFormula2 } from '../models/pks_tanki_formula2.model';

@Injectable({
	providedIn: 'root'
})

export class PksTankiFormula2Service {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<PksTankiFormula2[]>(`${this.apiUrl}/PksTankiFormula2/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/PksTankiFormula2/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/PksTankiFormula2`, akun,

    );
	}

	update(id:any,PksTankiFormula2: any) {
		return this.http.put(`${this.apiUrl}/PksTankiFormula2/${id}`, PksTankiFormula2);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/PksTankiFormula2/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/PksTankiFormula2/${id}`);
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
			return this.http.get<any>(`${this.apiUrl}/PksTankiFormula2/print_slip/${id}`,httpOptions);
		}
}
