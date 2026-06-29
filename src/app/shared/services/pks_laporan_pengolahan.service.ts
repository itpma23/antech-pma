import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
// import { TranslateService } from '@ngx-translate/core';
// import { ToastrService } from 'ngx-toastr';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

// import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
// import { Akun } from '../models/akun.model';
// import { PksProduksi } from '../models/pks_sjpp.model';

@Injectable({
	providedIn: 'root'
})

export class PksLaporanPengolahanService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}


	getLaporanPengolahan(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
       'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/PksLaporanPengolahan/laporan_pengolahan`, data,httpOptions);
	}

	getLaporanProduksiBulanan(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
       'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/PksProduksi/laporan_produksi_bulanan`, data,httpOptions);
	}


}
