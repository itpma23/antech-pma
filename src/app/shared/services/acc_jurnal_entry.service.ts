import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
// import { TranslateService } from '@ngx-translate/core';
// import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_API_URL } from 'src/app/app.constants';
import { AccJurnalEntry } from '../models/acc_jurnal_entry.model';

@Injectable({
	providedIn: 'root'
})

export class AccJurnalEntryService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<AccJurnalEntry[]>(`${this.apiUrl}/accJurnalEntry/getAll`);
	}
	getTraksi() {
		return this.http.get<AccJurnalEntry[]>(`${this.apiUrl}/accJurnalEntry/getTraksi`);
	}
	getAllDetail(id: number) {
		return this.http.get<AccJurnalEntry[]>(`${this.apiUrl}/accJurnalEntry/getAllDetail/${id}`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/accJurnalEntry/${id}`);
	}

	create(data: any) {
		return this.http.post(`${this.apiUrl}/accJurnalEntry`, data,);
	}
	delete(id: number) {
		let data = { "id": id.toString() };
		return this.http.delete(`${this.apiUrl}/accJurnalEntry/${id}`);
	}
	update(id: any, accJurnal: any) {
		return this.http.put(`${this.apiUrl}/accJurnalEntry/${id}`, accJurnal);
	}
	posting(id: any, data: any) {
		return this.http.post(`${this.apiUrl}/accJurnalEntry/posting/${id}`, data);
	}
	import(file: any) {
		return this.http.post(`${this.apiUrl}/accJurnalEntry/import_detail`, file,

		);
	}
	generateJurnalLR(data: any) {
		return this.http.post(`${this.apiUrl}/accJurnalEntry/generate_jurnal_LR`, data,);
	}
	getLaporanNeracaSaldo(data) {
		const httpOptions = {
			// headers: new HttpHeaders({
			//   'Content-Type':  'application/pdf',
			//    'Accept' : 'application/pdf',
			// }),
			'responseType': 'blob' as 'json'

		};
		return this.http.post(`${this.apiUrl}/accJurnalEntry/laporan_neraca_saldo`, data, httpOptions);
	}
	getLaporanBukuBesar(data) {
		const httpOptions = {
			// headers: new HttpHeaders({
			//   'Content-Type':  'application/pdf',
			//    'Accept' : 'application/pdf',
			// }),
			'responseType': 'blob' as 'json'

		};
		return this.http.post(`${this.apiUrl}/accJurnalEntry/laporan_buku_besar`, data, httpOptions);
	}
	getLaporanJurnal(data) {
		const httpOptions = {
			// headers: new HttpHeaders({
			//   'Content-Type':  'application/pdf',
			//    'Accept' : 'application/pdf',
			// }),
			'responseType': 'blob' as 'json'

		};
		return this.http.post(`${this.apiUrl}/accJurnalEntry/laporan_jurnal`, data, httpOptions);
	}
	getPdfSlip(id) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/pdf',
				// 'Authorization' : this.authKey,
				'Accept': 'application/pdf',
				// 'NAMADB': 'testing',
				// 'NAMAPATH': 'Testing'
				//observe : 'response'
			}),
			'responseType': 'blob' as 'json'

		};
		return this.http.get<any>(`${this.apiUrl}/accJurnalEntry/print_slip/${id}`, httpOptions);
	}

}
