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
import { PrcRekap } from '../models/prc_rekap.model';

@Injectable({
	providedIn: 'root'
})

export class PrcRekapService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<PrcRekap[]>(`${this.apiUrl}/PrcRekap/getAll`);
	}


	getById(supp_id: number) {
		return this.http.get(`${this.apiUrl}/PrcRekap/${supp_id}`);
	}
  getAllbySupplierId(id: number) {
		return this.http.get(`${this.apiUrl}/PrcRekap/getAllbySupplierId/${id}`);
	}
	getRekapBelumInvoice(supp_id: number) {
		return this.http.get(`${this.apiUrl}/PrcRekap/getRekapBelumInvoice/${supp_id}`);
	}
  getRekapPerTanggalBelumInvoice(rekap_id: number) {
		return this.http.get(`${this.apiUrl}/PrcRekap/getRekapPerTanggalBelumInvoice/${rekap_id}`);
	}
getRekapPerTanggalMulti(rekap_ids: number[]) {
  return this.http.post(`${this.apiUrl}/PrcRekap/getRekapPerTanggalMulti`, {
    rekap_ids: rekap_ids
  });
}


	create(akun: any) {
		return this.http.post(`${this.apiUrl}/PrcRekap`, akun,);
	}
	delete(id: number) {
		let data={"id":id.toString()};
			return this.http.delete(`${this.apiUrl}/PrcRekap/${id}`);
		}
	update(id:any,PrcRekap: any) {
		return this.http.put(`${this.apiUrl}/PrcRekap/${id}`, PrcRekap);
	}


  getPdfSlip(id,tipe) {
    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type':  'application/pdf',
        // // 'Authorization' : this.authKey,
        //  'Accept' : 'application/pdf',
        // // 'NAMADB': 'testing',
        // // 'NAMAPATH': 'Testing'
        // //observe : 'response'
      }),

      'responseType' : 'blob' as 'json'

    };

		return this.http.get<any>(`${this.apiUrl}/PrcRekap/print_slip/${id}/${tipe}`,httpOptions);
	}
  getPdfCover(id) {
    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type':  'application/pdf',
        // // 'Authorization' : this.authKey,
        //  'Accept' : 'application/pdf',
        // // 'NAMADB': 'testing',
        // // 'NAMAPATH': 'Testing'
        // //observe : 'response'
      }),

      'responseType' : 'blob' as 'json'

    };

		return this.http.get<any>(`${this.apiUrl}/PrcRekap/print_cover/${id}`,httpOptions);
	}
}
