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
import { EstSpk } from '../models/est_spk.model';

@Injectable({
	providedIn: 'root'
})

export class EstSpkBappService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<EstSpk[]>(`${this.apiUrl}/EstSpkBapp/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/EstSpkBapp/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/EstSpkBapp`, akun,

    );
	}

	update(id:any,EstSpk: any) {
		return this.http.put(`${this.apiUrl}/EstSpkBapp/${id}`, EstSpk);
	}
  posting(id:any,data: any) {
		return this.http.post(`${this.apiUrl}/EstSpkBapp/posting/${id}`, data);
	}
	hitungPremi(data: any) {
		return this.http.post(`${this.apiUrl}/EstSpkBapp/hitungPremi`, data,

    );
	}
  getLaporanRekap(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/pdf',
         'Accept' : 'application/pdf',
      }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/EstSpkBapp/laporan_rekap`, data,httpOptions);
	}






	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/EstSpkBapp/${id}`);
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
		return this.http.get<any>(`${this.apiUrl}/EstSpkBapp/print_slip/${id}`,httpOptions);
	}

	getReportDetail(data) {
		const httpOptions = {
			// headers: new HttpHeaders({
			//   'Content-Type':  'application/pdf',
			//    'Accept' : 'application/pdf',
			// }),
			'responseType' : 'blob' as 'json'
		};
		return this.http.post(`${this.apiUrl}/EstSpkBapp/laporan_detail`, data,httpOptions);
	}
}
