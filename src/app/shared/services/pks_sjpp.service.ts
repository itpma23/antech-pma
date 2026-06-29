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
import { PksSjpp } from '../models/pks_sjpp.model';

@Injectable({
	providedIn: 'root'
})

export class PksSjppService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<PksSjpp[]>(`${this.apiUrl}/PksSjpp/getAll`);
	}
	getAllbyIdSpk() {
		return this.http.get<PksSjpp[]>(`${this.apiUrl}/PksSjpp/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/PksSjpp/${id}`);
	}
	getSjCustomerById(id: number) {
		return this.http.get(`${this.apiUrl}/PksSjpp/getSJCustomer/${id}`);
	}

  getRekapKirim(spk_id: number,periode_kt_dari,periode_kt_sd) {
		return this.http.get(`${this.apiUrl}/PksSjpp/getRekapKirim/${spk_id}/${periode_kt_dari}/${periode_kt_sd}`);
	}

  getRekapAngkut(spk_id: number,periode_kt_dari,periode_kt_sd,sls_kontrak_id) {
		return this.http.get(`${this.apiUrl}/PksSjpp/getRekapAngkut/${spk_id}/${periode_kt_dari}/${periode_kt_sd}/${sls_kontrak_id}`);
	}
  getRekapAngkutInternal(spk_id: number,periode_kt_dari,periode_kt_sd,sls_kontrak_id) {
		return this.http.get(`${this.apiUrl}/PksSjpp/getRekapAngkutInternal/${spk_id}/${periode_kt_dari}/${periode_kt_sd}/${sls_kontrak_id}`);
	}
	getRekapById(id: number) {
		return this.http.get(`${this.apiUrl}/PksSjpp/getRekapById/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/PksSjpp`, akun,

    );
	}

	update(id:any,PksSjpp: any) {
		return this.http.post(`${this.apiUrl}/PksSjpp/update_sjpp_customer/${id}`, PksSjpp);
	}
	updateSjpp(id:any,PksSjpp: any) {
		return this.http.put(`${this.apiUrl}/PksSjpp/update/${id}`, PksSjpp);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/PksSjpp/${id}`);
	}

	getPdfSlip(id) {
		const httpOptions = {
		  headers: new HttpHeaders({
				'Content-Type':  'application/pdf',
				'Accept' : 'application/pdf',
			}),
		  'responseType' : 'blob' as 'json'

		};
			return this.http.get<any>(`${this.apiUrl}/PksSjpp/print_slip/${id}`,httpOptions);
	}
	getPdfCpo(id) {
		const httpOptions = {
		  headers: new HttpHeaders({
				'Content-Type':  'application/pdf',
				'Accept' : 'application/pdf',
			}),
		  'responseType' : 'blob' as 'json'

		};
			return this.http.get<any>(`${this.apiUrl}/PksSjpp/print_cpo/${id}`,httpOptions);
	}
	getPdfKernel(id) {
		const httpOptions = {
		  headers: new HttpHeaders({
				'Content-Type':  'application/pdf',
				'Accept' : 'application/pdf',
			}),
		  'responseType' : 'blob' as 'json'

		};
			return this.http.get<any>(`${this.apiUrl}/PksSjpp/print_kernel/${id}`,httpOptions);
	}

	getLaporanRekapPengiriman(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
       'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/PksSjpp/laporan_rekap_pengiriman`, data,httpOptions);
	}

	
	getPdfValidasiTimbanganSlip(id){
		const httpOptions = {
			headers: new HttpHeaders({
				 'Content-Type':  'application/pdf',
				 'Accept' : 'application/pdf',
			 }),
			'responseType' : 'blob' as 'json'

		 };
		return this.http.get<any>(`${this.apiUrl}/PksSjpp/print_validasi_timbangan_slip/${id}`,httpOptions);
	}


}
