import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
// import { TranslateService } from '@ngx-translate/core';
// import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_API_URL } from 'src/app/app.constants';
import { InvPenerimaanPindahGudang } from '../models/inv_penerimaan_pindah_gudang.model';

@Injectable({
	providedIn: 'root'
})

export class InvPenerimaanPindahGudangService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<InvPenerimaanPindahGudang[]>(`${this.apiUrl}/InvPenerimaanPindahGudang/getAll`);
	}
	getTraksi() {
		return this.http.get<InvPenerimaanPindahGudang[]>(`${this.apiUrl}/InvPenerimaanPindahGudang/getTraksi`);
	}
	getAllDetail(id: number) {
		return this.http.get<InvPenerimaanPindahGudang[]>(`${this.apiUrl}/InvPenerimaanPindahGudang/getAllDetail/${id}`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/InvPenerimaanPindahGudang/${id}`);
	}

	create(data: any) {
		return this.http.post(`${this.apiUrl}/InvPenerimaanPindahGudang`, data,);
	}
	delete(id: number) {
		let data={"id":id.toString()};
			return this.http.delete(`${this.apiUrl}/InvPenerimaanPindahGudang/${id}`);
		}
	update(id:any,InvPenerimaanPindahGudang: any) {
		return this.http.put(`${this.apiUrl}/InvPenerimaanPindahGudang/${id}`, InvPenerimaanPindahGudang);
	}
  	posting(id:any,data: any) {
		return this.http.post(`${this.apiUrl}/InvPenerimaanPindahGudang/posting/${id}`, data);
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
			return this.http.get<any>(`${this.apiUrl}/InvPenerimaanPindahGudang/print_slip/${id}`,httpOptions);
		}

		getPoReportDetail(data) {
			const httpOptions = {
				// headers: new HttpHeaders({
				//   'Content-Type':  'application/pdf',
				//    'Accept' : 'application/pdf',
				// }),
				'responseType' : 'blob' as 'json'
			};
			return this.http.post(`${this.apiUrl}/InvPenerimaanPindahGudang/laporan_po_detail`, data,httpOptions);
		}

}
