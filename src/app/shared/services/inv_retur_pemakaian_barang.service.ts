import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
// import { TranslateService } from '@ngx-translate/core';
// import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_API_URL } from 'src/app/app.constants';
import { InvReturPemakaianBarang } from '../models/inv_retur_pemakaian_barang.model';

@Injectable({
	providedIn: 'root'
})

export class InvReturPemakaianBarangService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<InvReturPemakaianBarang[]>(`${this.apiUrl}/InvReturPemakaianBarang/getAll`);
	}
	getTraksi() {
		return this.http.get<InvReturPemakaianBarang[]>(`${this.apiUrl}/InvReturPemakaianBarang/getTraksi`);
	}
	getAllDetail(id: number) {
		return this.http.get<InvReturPemakaianBarang[]>(`${this.apiUrl}/InvReturPemakaianBarang/getAllDetail/${id}`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/InvReturPemakaianBarang/${id}`);
	}
	getReturByPemakaianPosting(id: number) {
		return this.http.get(`${this.apiUrl}/InvReturPemakaianBarang/getReturByPemakaianPosting/${id}`);
	}

	create(data: any) {
		return this.http.post(`${this.apiUrl}/InvReturPemakaianBarang`, data,);
	}
	delete(id: number) {
		let data={"id":id.toString()};
			return this.http.delete(`${this.apiUrl}/InvReturPemakaianBarang/${id}`);
		}
	update(id:any,InvReturPemakaianBarang: any) {
		return this.http.put(`${this.apiUrl}/InvReturPemakaianBarang/${id}`, InvReturPemakaianBarang);
	}
  posting(id:any,data: any) {
		return this.http.post(`${this.apiUrl}/InvReturPemakaianBarang/posting/${id}`, data);
	}
	
	getPoReportDetail(data) {
		const httpOptions = {
		  // headers: new HttpHeaders({
		  //   'Content-Type':  'application/pdf',
		  //    'Accept' : 'application/pdf',
		  // }),
		  'responseType' : 'blob' as 'json'
	
		};
			return this.http.post(`${this.apiUrl}/InvReturPemakaianBarang/laporan_po_detail`, data,httpOptions);
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
			return this.http.get<any>(`${this.apiUrl}/InvReturPemakaianBarang/print_slip/${id}`,httpOptions);
		}

}
