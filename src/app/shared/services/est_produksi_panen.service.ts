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
import { EstProduksiPanen } from '../models/est_produksi_panen.model';

@Injectable({
	providedIn: 'root'
})

export class EstProduksiPanenService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<EstProduksiPanen[]>(`${this.apiUrl}/estProduksipanen/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/estProduksipanen/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/estProduksipanen`, akun,

    );
	}

	update(id:any,estProduksipanen: any) {
		return this.http.put(`${this.apiUrl}/estProduksipanen/${id}`, estProduksipanen);
	}
  validasiTimbangan(id:any,estProduksipanen: any) {
		return this.http.put(`${this.apiUrl}/estProduksipanen/validasiTimbangan/${id}`, estProduksipanen);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/estProduksipanen/${id}`);
	}
  getLaporanDetail(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/estProduksipanen/laporan_detail`, data,httpOptions);
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
		return this.http.get<any>(`${this.apiUrl}/estProduksipanen/print_slip/${id}`,httpOptions);
	}
}
