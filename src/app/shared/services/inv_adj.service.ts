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
import { InvAdj } from '../models/inv_adj.model';

@Injectable({
	providedIn: 'root'
})

export class InvAdjService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<InvAdj[]>(`${this.apiUrl}/InvAdj/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/InvAdj/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/InvAdj`, akun,

    );
	}

	update(id:any,InvAdj: any) {
		return this.http.put(`${this.apiUrl}/InvAdj/${id}`, InvAdj);
	}
  posting(id:any,data: any) {
		return this.http.post(`${this.apiUrl}/InvAdj/posting/${id}`, data);
	}
	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/InvAdj/${id}`);
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
			return this.http.get<any>(`${this.apiUrl}/InvAdj/print_slip/${id}`,httpOptions);
		}


		getPoReportDetail(data) {
			const httpOptions = {
				'responseType' : 'blob' as 'json'
			};
			return this.http.post(`${this.apiUrl}/InvAdj/laporan_po_detail`, data,httpOptions);
		}

			import(file: any) {
		return this.http.post(`${this.apiUrl}/InvAdj/import_detail_inv_adj`, file,

		);
	}
}
