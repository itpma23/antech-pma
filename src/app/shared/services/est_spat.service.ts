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
import { EstSpat } from '../models/est_spat.model';

@Injectable({
	providedIn: 'root'
})

export class EstSpatService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<EstSpat[]>(`${this.apiUrl}/estSpat/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/estSpat/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/estSpat`, akun,

    );
	}

	update(id:any,estSpat: any) {
		return this.http.put(`${this.apiUrl}/estSpat/${id}`, estSpat);
	}
  validasiTimbangan(id:any,estSpat: any) {
		return this.http.put(`${this.apiUrl}/estSpat/validasiTimbangan/${id}`, estSpat);
	}


	clearValidasiTimbangan(id: number) {
    let data={"id":id.toString()};
		return this.http.post(`${this.apiUrl}/estSpat/clearValidasiTimbangan/${id}`,null);
	}
  delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/estSpat/${id}`);
	}
  getLaporanSpatDetail(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/estSpat/laporan_spat_detail`, data,httpOptions);
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
		return this.http.get<any>(`${this.apiUrl}/estSpat/print_slip/${id}`,httpOptions);
	}
  getPdfSlipValidasi(id) {
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
		return this.http.get<any>(`${this.apiUrl}/estSpat/print_slip_validasi/${id}`,httpOptions);
	}
}
