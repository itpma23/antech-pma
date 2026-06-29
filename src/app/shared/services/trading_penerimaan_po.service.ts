import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
// import { TranslateService } from '@ngx-translate/core';
// import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_API_URL } from 'src/app/app.constants';
import { FileSaverService } from 'ngx-filesaver';
import { InvPenerimaanPo } from '../models/inv_penerimaan_po.model';

@Injectable({
	providedIn: 'root'
})

export class TradingPenerimaanPoService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,
		private _FileSaverService: FileSaverService,

	) {


	}

	getAll() {
		return this.http.get<InvPenerimaanPo[]>(`${this.apiUrl}/InvPenerimaanPoTrading/getAll`);
	}
	getTraksi() {
		return this.http.get<InvPenerimaanPo[]>(`${this.apiUrl}/InvPenerimaanPoTrading/getTraksi`);
	}
	getAllDetail(id: number) {
		return this.http.get<InvPenerimaanPo[]>(`${this.apiUrl}/InvPenerimaanPoTrading/getAllDetail/${id}`);
	}

	updatePhoto(id: any, file: any) {
		return this.http.post(`${this.apiUrl}/InvPenerimaanPoTrading/edit_picture/${id}`, file);
	}

	getById(id: number) {
		return this.http.get(`${this.apiUrl}/InvPenerimaanPoTrading/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/InvPenerimaanPoTrading`, akun,);
	}
	delete(id: number) {
		let data = { "id": id.toString() };
		return this.http.delete(`${this.apiUrl}/InvPenerimaanPoTrading/${id}`);
	}
	update(id: any, InvPenerimaanPoTrading: any) {
		return this.http.put(`${this.apiUrl}/InvPenerimaanPoTrading/${id}`, InvPenerimaanPoTrading);
	}

	upload(id: any, InvPenerimaanPoTrading: any) {
		return this.http.post(`${this.apiUrl}/InvPenerimaanPoTrading/upload/${id}`, InvPenerimaanPoTrading);
	}

	getPoReportDetail(data) {
		const httpOptions = {
			// headers: new HttpHeaders({
			//   'Content-Type':  'application/pdf',
			//    'Accept' : 'application/pdf',
			// }),
			'responseType': 'blob' as 'json'

		};
		return this.http.post(`${this.apiUrl}/InvPenerimaanPoTrading/laporan_po_detail`, data, httpOptions);
	}

	download(id, fileName) {
		// const fileName ='file_Download';
		// if (fromRemote) {
		this.http.get(`${this.apiUrl}/InvPenerimaanPoTrading/download/${id}`, {
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
		return this.http.get<any>(`${this.apiUrl}/InvPenerimaanPoTrading/print_slip/${id}`, httpOptions);
	}

		getPdfSlipByPoId(po_id) {
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
		return this.http.get<any>(`${this.apiUrl}/InvPenerimaanPoTrading/print_slip_by_po/${po_id}`, httpOptions);
	}


	posting(id: any, data: any) {
		return this.http.post(`${this.apiUrl}/InvPenerimaanPoTrading/posting/${id}`, data);
	}

	previewHpp(payload: any) {
		return this.http.post<any>(
			`${this.apiUrl}/InvPenerimaanPoTrading/preview_hpp`,
			payload
		);
	}
}
