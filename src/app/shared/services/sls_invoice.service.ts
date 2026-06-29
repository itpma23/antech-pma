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
import { SlsInvoice } from '../models/sls_invoice.model';

@Injectable({
	providedIn: 'root'
})

export class SlsInvoiceService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<SlsInvoice[]>(`${this.apiUrl}/SlsInvoice/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/SlsInvoice/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/SlsInvoice/create`, akun,

    );
	}

	update(id:any,SlsInvoice: any) {
		return this.http.post(`${this.apiUrl}/SlsInvoice/update/${id}`, SlsInvoice);
	}
	
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/SlsInvoice/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/SlsInvoice/${id}`);
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
			return this.http.get<any>(`${this.apiUrl}/SlsInvoice/print_slip/${id}`,httpOptions);
		}
}
