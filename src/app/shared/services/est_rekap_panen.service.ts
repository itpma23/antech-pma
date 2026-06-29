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
import { EstRekapPanen } from '../models/est_rekap_panen.model';

@Injectable({
	providedIn: 'root'
})

export class EstRekapPanenService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<EstRekapPanen[]>(`${this.apiUrl}/estRekappanen/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/estRekappanen/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/estRekappanen`, akun,

    );
	}

	update(id:any,estRekappanen: any) {
		return this.http.put(`${this.apiUrl}/estRekappanen/${id}`, estRekappanen);
	}
  validasiTimbangan(id:any,estRekappanen: any) {
		return this.http.put(`${this.apiUrl}/estRekappanen/validasiTimbangan/${id}`, estRekappanen);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/estRekappanen/${id}`);
	}
  getLaporanSpatDetail(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/estRekappanen/laporan_spat_detail`, data,httpOptions);
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
		return this.http.get<any>(`${this.apiUrl}/estRekappanen/print_slip/${id}`,httpOptions);
	}
}
