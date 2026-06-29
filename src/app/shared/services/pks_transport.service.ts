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
import { PksTransport } from '../models/pks_transport.model';

@Injectable({
	providedIn: 'root'
})

export class PksTransportService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<PksTransport[]>(`${this.apiUrl}/PksTransport/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/PksTransport/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/PksTransport`, akun,

    );
	}

	update(id:any,PksTransport: any) {
		return this.http.put(`${this.apiUrl}/PksTransport/${id}`, PksTransport);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/PksTransport/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/PksTransport/${id}`);
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
			return this.http.get<any>(`${this.apiUrl}/PksTransport/print_slip/${id}`,httpOptions);
		}
}
