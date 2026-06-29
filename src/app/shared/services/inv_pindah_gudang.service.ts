import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
// import { TranslateService } from '@ngx-translate/core';
// import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_API_URL } from 'src/app/app.constants';
import { InvPindahGudang } from '../models/inv_pindah_gudang.model';

@Injectable({
	providedIn: 'root'
})

export class InvPindahGudangService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<InvPindahGudang[]>(`${this.apiUrl}/InvPindahGudang/getAll`);
	}
  getAllBlmTerima(gd_id) {
		return this.http.get<InvPindahGudang[]>(`${this.apiUrl}/InvPindahGudang/getAllBlmTerima/${gd_id}`);
	}
	getTraksi() {
		return this.http.get<InvPindahGudang[]>(`${this.apiUrl}/InvPindahGudang/getTraksi`);
	}
	getAllDetail(id: number) {
		return this.http.get<InvPindahGudang[]>(`${this.apiUrl}/InvPindahGudang/getAllDetail/${id}`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/InvPindahGudang/${id}`);
	}

	create(data: any) {
		return this.http.post(`${this.apiUrl}/InvPindahGudang`, data,);
	}
	delete(id: number) {
		let data={"id":id.toString()};
			return this.http.delete(`${this.apiUrl}/InvPindahGudang/${id}`);
		}
	update(id:any,InvPindahGudang: any) {
		return this.http.put(`${this.apiUrl}/InvPindahGudang/${id}`, InvPindahGudang);
	}
  	posting(id:any,data: any) {
		return this.http.post(`${this.apiUrl}/InvPindahGudang/posting/${id}`, data);
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
			return this.http.get<any>(`${this.apiUrl}/InvPindahGudang/print_slip/${id}`,httpOptions);
		}

	getPoReportDetail(data) {
		const httpOptions = {
			// headers: new HttpHeaders({
			//   'Content-Type':  'application/pdf',
			//    'Accept' : 'application/pdf',
			// }),
			'responseType' : 'blob' as 'json'
		};
		return this.http.post(`${this.apiUrl}/InvPindahGudang/laporan_po_detail`, data,httpOptions);
	}
}
