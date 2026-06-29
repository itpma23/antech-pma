import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
// import { TranslateService } from '@ngx-translate/core';
// import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_API_URL } from 'src/app/app.constants';
import { HrmsRealisasiPerjalananDinas } from '../models/hrms_realisasi_perjalanan_dinas.model';

@Injectable({
	providedIn: 'root'
})

export class HrmsRealisasiPerjalananDinasService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}
  getAllBelumPemakaianByLokasi(lokasi_id) {
		return this.http.get<HrmsRealisasiPerjalananDinas[]>(`${this.apiUrl}/HrmsRealisasiPerjalananDinas/getAllBelumPemakaian/${lokasi_id}`);
	}
	getAll() {
		return this.http.get<HrmsRealisasiPerjalananDinas[]>(`${this.apiUrl}/HrmsRealisasiPerjalananDinas/getAll`);
	}
	getTraksi() {
		return this.http.get<HrmsRealisasiPerjalananDinas[]>(`${this.apiUrl}/HrmsRealisasiPerjalananDinas/getTraksi`);
	}
	getAllDetail(id: number) {
		return this.http.get<HrmsRealisasiPerjalananDinas[]>(`${this.apiUrl}/HrmsRealisasiPerjalananDinas/getAllDetail/${id}`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/HrmsRealisasiPerjalananDinas/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/HrmsRealisasiPerjalananDinas`, akun,);
	}
	delete(id: number) {
		let data={"id":id.toString()};
			return this.http.delete(`${this.apiUrl}/HrmsRealisasiPerjalananDinas/${id}`);
		}
	update(id:any,HrmsRealisasiPerjalananDinas: any) {
		return this.http.put(`${this.apiUrl}/HrmsRealisasiPerjalananDinas/${id}`, HrmsRealisasiPerjalananDinas);
	}
  posting(id:any,data: any) {
		return this.http.post(`${this.apiUrl}/HrmsRealisasiPerjalananDinas/posting/${id}`, data);
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
			return this.http.get<any>(`${this.apiUrl}/HrmsRealisasiPerjalananDinas/print_slip/${id}`,httpOptions);
		}

	getPoReportDetail(data) {
		const httpOptions = {
			// headers: new HttpHeaders({
			//   'Content-Type':  'application/pdf',
			//    'Accept' : 'application/pdf',
			// }),
			'responseType' : 'blob' as 'json'
		};
		return this.http.post(`${this.apiUrl}/HrmsRealisasiPerjalananDinas/laporan_po_detail`, data,httpOptions);
	}
}
