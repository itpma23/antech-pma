import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
// import { TranslateService } from '@ngx-translate/core';
// import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_API_URL } from 'src/app/app.constants';
import { InvPermintaanPindahGudang } from '../models/inv_permintaan_pindah_gudang.model';

@Injectable({
	providedIn: 'root'
})

export class InvPermintaanPindahGudangService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<InvPermintaanPindahGudang[]>(`${this.apiUrl}/InvPermintaanPindahGudang/getAll`);
	}
  getAllGudangDiminta(gudang_id) {
		return this.http.get<InvPermintaanPindahGudang[]>(`${this.apiUrl}/InvPermintaanPindahGudang/getAllGudangDiminta/${gudang_id}`);
	}
	getTraksi() {
		return this.http.get<InvPermintaanPindahGudang[]>(`${this.apiUrl}/InvPermintaanPindahGudang/getTraksi`);
	}
	getAllDetail(id: number) {
		return this.http.get<InvPermintaanPindahGudang[]>(`${this.apiUrl}/InvPermintaanPindahGudang/getAllDetail/${id}`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/InvPermintaanPindahGudang/${id}`);
	}

	create(data: any) {
		return this.http.post(`${this.apiUrl}/InvPermintaanPindahGudang`, data,);
	}
	delete(id: number) {
		let data={"id":id.toString()};
			return this.http.delete(`${this.apiUrl}/InvPermintaanPindahGudang/${id}`);
		}
	update(id:any,InvPermintaanPindahGudang: any) {
		return this.http.put(`${this.apiUrl}/InvPermintaanPindahGudang/${id}`, InvPermintaanPindahGudang);
	}
  posting(id:any,data: any) {
		return this.http.post(`${this.apiUrl}/InvPermintaanPindahGudang/posting/${id}`, data);
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
			return this.http.get<any>(`${this.apiUrl}/InvPermintaanPindahGudang/print_slip/${id}`,httpOptions);
		}

	getPoReportDetail(data) {
		const httpOptions = {
			// headers: new HttpHeaders({
			//   'Content-Type':  'application/pdf',
			//    'Accept' : 'application/pdf',
			// }),
			'responseType' : 'blob' as 'json'
		};
		return this.http.post(`${this.apiUrl}/InvPermintaanPindahGudang/laporan_po_detail`, data,httpOptions);
	}
}
