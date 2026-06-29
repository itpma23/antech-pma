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
import { InvPenerimaanTanpaPo } from '../models/inv_penerimaan_tanpa_po.model';

@Injectable({
	providedIn: 'root'
})

export class InvPenerimaanTanpaPoService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<InvPenerimaanTanpaPo[]>(`${this.apiUrl}/InvPenerimaanTanpaPo/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/InvPenerimaanTanpaPo/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/InvPenerimaanTanpaPo`, akun,

    );
	}

	update(id:any,InvPenerimaanTanpaPo: any) {
		return this.http.put(`${this.apiUrl}/InvPenerimaanTanpaPo/${id}`, InvPenerimaanTanpaPo);
	}
  posting(id:any,data: any) {
		return this.http.post(`${this.apiUrl}/InvPenerimaanTanpaPo/posting/${id}`, data);
	}
	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/InvPenerimaanTanpaPo/${id}`);
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
			return this.http.get<any>(`${this.apiUrl}/InvPenerimaanTanpaPo/print_slip/${id}`,httpOptions);
		}


		getPoReportDetail(data) {
			const httpOptions = {
				'responseType' : 'blob' as 'json'
			};
			return this.http.post(`${this.apiUrl}/InvPenerimaanTanpaPo/laporan_po_detail`, data,httpOptions);
		}
}
