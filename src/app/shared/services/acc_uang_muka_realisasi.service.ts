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
import { AccUangMukaRealisasi } from '../models/acc_uang_muka_realisasi.model';
import { FileSaverService } from 'ngx-filesaver';

@Injectable({
	providedIn: 'root'
})

export class AccUangMukaRealisasiService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,
		private _FileSaverService: FileSaverService,

	) {


	}

	getAll() {
		return this.http.get<AccUangMukaRealisasi[]>(`${this.apiUrl}/accUangMukaRealisasi/getAll`);
	}
	getAllUangMukaBlmRealisasi() {
		return this.http.get(`${this.apiUrl}/accUangMukaRealisasi/getAllUangMukaBlmRealisasi`);
	}

	getAllPermintaanDanaBlmRealisasi() {
		return this.http.get(`${this.apiUrl}/accUangMukaRealisasi/getAllPermintaanDanaBlmRealisasi`)
	}

	getById(id: number) {
		return this.http.get(`${this.apiUrl}/accUangMukaRealisasi/${id}`);
	}

	getByRealisasi(id: number) {
		return this.http.get(`${this.apiUrl}/accUangMukaRealisasi/${id}`);
	}
	getAllAkunSalesInvoice() {
		return this.http.get(`${this.apiUrl}/accUangMukaRealisasi/getAkunSalesInvoice`);
	}
	create(akun: any) {
		return this.http.post(`${this.apiUrl}/accUangMukaRealisasi/create`, akun,

		);
	}

	update(id: any, SlsInvoice: any) {
		return this.http.post(`${this.apiUrl}/accUangMukaRealisasi/update/${id}`, SlsInvoice);
	}

	updatePhoto(id: any, file: any) {
		return this.http.post(`${this.apiUrl}/accUangMukaRealisasi/edit_picture/${id}`, file);
	}


	delete(id: number) {
		let data = { "id": id.toString() };
		return this.http.delete(`${this.apiUrl}/accUangMukaRealisasi/${id}`);
	}
	posting(id: any, data: any) {
		return this.http.post(`${this.apiUrl}/accUangMukaRealisasi/posting/${id}`, data);
	}

	getAllOutstandingInvoice() {
		return this.http.get<any[]>(`${this.apiUrl}/accUangMukaRealisasi/getAllOutstandingInvoice`);
	}

	getLaporan(data) {
		const httpOptions = {
			// headers: new HttpHeaders({
			//   'Content-Type':  'application/pdf',
			//    'Accept' : 'application/pdf',
			// }),
			'responseType': 'blob' as 'json'

		};
		return this.http.post(`${this.apiUrl}/accUangMukaRealisasi/laporan`, data, httpOptions);
	}
	getLaporanRinci(data) {
		const httpOptions = {
			// headers: new HttpHeaders({
			//   'Content-Type':  'application/pdf',
			//    'Accept' : 'application/pdf',
			// }),
			'responseType': 'blob' as 'json'

		};
		return this.http.post(`${this.apiUrl}/accUangMukaRealisasi/laporan_rinci`, data, httpOptions);
	}

	getArReportDetail(data) {
		const httpOptions = {
			// headers: new HttpHeaders({
			//   'Content-Type':  'application/pdf',
			//    'Accept' : 'application/pdf',
			// }),
			'responseType': 'blob' as 'json'

		};
		return this.http.post(`${this.apiUrl}/accUangMukaRealisasi/laporan_ar_detail`, data, httpOptions);
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
		return this.http.get<any>(`${this.apiUrl}/accUangMukaRealisasi/print_slip/${id}`, httpOptions);
	}

	upload(id: any, accKasbank: any) {
		return this.http.post(`${this.apiUrl}/accUangMukaRealisasi/upload/${id}`, accKasbank);
	}



	deleteUpload(id: any) {
		return this.http.delete(
			`${this.apiUrl}/accUangMukaRealisasi/delete_upload/${id}`
		);
	}


	download(id, fileName) {
		// const fileName ='file_Download';
		// if (fromRemote) {
		this.http.get(`${this.apiUrl}/accUangMukaRealisasi/download/${id}`, {
			observe: 'response',
			responseType: 'blob'
		}).subscribe(res => {
			this._FileSaverService.save(res.body, fileName);
		});
		return;
		//}
		// const fileType = this._FileSaverService.genType(fileName);
		// const txtBlob = new Blob([this.text], { type: fileType });
		// this._FileSaverService.save(txtBlob, fileName);
	}
}
