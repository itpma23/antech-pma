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
import { EstSensusPanen } from '../models/est_sensus_panen.model';

@Injectable({
	providedIn: 'root'
})

export class EstSensusPanenService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<EstSensusPanen[]>(`${this.apiUrl}/EstSensusPanen/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/EstSensusPanen/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/EstSensusPanen`, akun,

    );
	}

	update(id:any,EstSensusPanen: any) {
		return this.http.put(`${this.apiUrl}/EstSensusPanen/${id}`, EstSensusPanen);
	}

	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/EstSensusPanen/${id}`);
	}
  getLaporanDetail(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/EstSensusPanen/laporan_detail`, data,httpOptions);
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
		return this.http.get<any>(`${this.apiUrl}/EstSensusPanen/print_slip/${id}`,httpOptions);
	}
}
