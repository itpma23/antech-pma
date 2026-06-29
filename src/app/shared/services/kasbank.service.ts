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
import { KasBank } from '../models/kasbank.model';

@Injectable({
	providedIn: 'root'
})

export class KasBankService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<KasBank[]>(`${this.apiUrl}/kasbank/getAll`);
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
		return this.http.get<any>(`${this.apiUrl}/kasbank/print_slip/${id}`,httpOptions);
	}

  getLaporanKasbankTransaksi(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/pdf',
         'Accept' : 'application/pdf',
      }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/kasbank/laporan_kasbank`, data,httpOptions);
	}
  getLaporanKasbankSaldo(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/pdf',
         'Accept' : 'application/pdf',
      }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/kasbank/laporan_kasbank_saldo`, data,httpOptions);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/kasbank/${id}`);
	}

  getBySiswaId(siswa_id: number) {
		return this.http.get(`${this.apiUrl}/kasbank/kasbank_list_by_siswa/${siswa_id}`);
	}

	create(kasbank: any) {
		return this.http.post(`${this.apiUrl}/kasbank`, kasbank,

    );
	}

	update(id:any,kasbank: any) {
		return this.http.put(`${this.apiUrl}/kasbank/${id}`, kasbank);
	}



	delete(id: number) {
		return this.http.delete(`${this.apiUrl}/kasbank/${id}`);
	}


}
