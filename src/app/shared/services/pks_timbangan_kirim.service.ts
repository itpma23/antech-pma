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
import { PksTimbanganKirim } from '../models/pks_timbangan_kirim.model';

@Injectable({
	providedIn: 'root'
})

export class PksTimbanganKirimService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<PksTimbanganKirim[]>(`${this.apiUrl}/PksTimbanganKirim/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/PksTimbanganKirim/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/PksTimbanganKirim`, akun,

    );
	}

	update(id:any,PksTimbanganKirim: any) {
		return this.http.put(`${this.apiUrl}/PksTimbanganKirim/${id}`, PksTimbanganKirim);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/PksTimbanganKirim/${id}`);
	}
  getLaporanKirimDetail(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/PksTimbanganKirim/laporan_rincian_kirim`, data,httpOptions);
	}
  getLaporanKirimDetailCustomer(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/PksTimbanganKirim/laporan_rincian_kirim_customer`, data,httpOptions);
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
			return this.http.get<any>(`${this.apiUrl}/PksTimbanganKirim/print_slip/${id}`,httpOptions);
		}
}
