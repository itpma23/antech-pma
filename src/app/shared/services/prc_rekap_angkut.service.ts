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
import { PrcRekapAngkut } from '../models/prc_rekap_angkut.model';

@Injectable({
	providedIn: 'root'
})

export class PrcRekapAngkutService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<PrcRekapAngkut[]>(`${this.apiUrl}/PrcRekapAngkut/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/PrcRekapAngkut/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/PrcRekapAngkut`, akun,);
	}
	delete(id: number) {
		let data={"id":id.toString()};
			return this.http.delete(`${this.apiUrl}/PrcRekapAngkut/${id}`);
		}
	update(id:any,PrcRekapAngkut: any) {
		return this.http.put(`${this.apiUrl}/PrcRekapAngkut/${id}`, PrcRekapAngkut);
	}

  getAllbySupplierId(id: number) {
		return this.http.get(`${this.apiUrl}/PrcRekapAngkut/getAllbySupplierId/${id}`);
	}
	getRekapBelumInvoice(supp_id: number) {
		return this.http.get(`${this.apiUrl}/PrcRekapAngkut/getRekapBelumInvoice/${supp_id}`);
	}
  getRekapPerTanggalBelumInvoice(rekap_id: number) {
		return this.http.get(`${this.apiUrl}/PrcRekapAngkut/getRekapPerTanggalBelumInvoice/${rekap_id}`);
	}






	getReportDetail(data) {
    const httpOptions = {
      'responseType' : 'blob' as 'json'
    };
		return this.http.post(`${this.apiUrl}/PrcRekapAngkut/laporan_detail`, data,httpOptions);
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
		return this.http.get<any>(`${this.apiUrl}/PrcRekapAngkut/print_slip/${id}`,httpOptions);
	}
  getPdfCover(id) {
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
		return this.http.get<any>(`${this.apiUrl}/PrcRekapAngkut/print_cover/${id}`,httpOptions);
	}
}
