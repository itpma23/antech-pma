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
import { AccApInvoice } from '../models/acc_ap_invoice.model';

@Injectable({
	providedIn: 'root'
})

export class AccApInvoiceService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<AccApInvoice[]>(`${this.apiUrl}/accApInvoice/getAll`);
	}
	getAllOutstandingInvoice() {
		return this.http.get<any[]>(`${this.apiUrl}/accApInvoice/getAllOutstandingInvoice`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/accApInvoice/${id}`);
	}

	getHutangByIdSupplier(supplier_id) {
		return this.http.get(`${this.apiUrl}/accApInvoice/getHutangByIdSupplier/${supplier_id}`);
	}

	getHutangPoById(id) {
		return this.http.get(`${this.apiUrl}/accApInvoice/getHutangPoById/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/accApInvoice/create`, akun,

		);
	}

	update(id: any, SlsInvoice: any) {
		return this.http.put(`${this.apiUrl}/accApInvoice/${id}`, SlsInvoice);
	}
	updateFaktur(id: any, SlsInvoice: any) {
		return this.http.put(`${this.apiUrl}/accApInvoice/faktur/${id}`, SlsInvoice);
	}

	updatePhoto(id: any, file: any) {
		return this.http.post(`${this.apiUrl}/accApInvoice/edit_picture/${id}`, file);
	}


	delete(id: number) {
		let data = { "id": id.toString() };
		return this.http.delete(`${this.apiUrl}/accApInvoice/${id}`);
	}
	posting(id: any, data: any) {
		return this.http.post(`${this.apiUrl}/accApInvoice/posting/${id}`, data);
	}
	getApReportAP(data) {
		const httpOptions = {
			// headers: new HttpHeaders({
			//   'Content-Type':  'application/pdf',
			//    'Accept' : 'application/pdf',
			// }),
			'responseType': 'blob' as 'json'

		};
		return this.http.post(`${this.apiUrl}/accApInvoice/laporan_ap`, data, httpOptions);
	}
	OutStandingFakturPajak() {
		const httpOptions = {

			'responseType': 'blob' as 'json'

		};
		return this.http.get<any>(`${this.apiUrl}/accApInvoice/laporan_faktur_pajak_outstanding`, httpOptions);
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
		return this.http.get<any>(`${this.apiUrl}/accApInvoice/print_slip/${id}`, httpOptions);
	}

	getPdfSlip2(id) {
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
		return this.http.get<any>(`${this.apiUrl}/accApInvoice/print_slip_2/${id}`, httpOptions);
	}



	upload(id: number, formData: FormData) {
		return this.http.post(`${this.apiUrl}/AccApInvoice/upload/${id}`, formData);
	}

	deleteFile(id: number, body: any) {
		return this.http.post(`${this.apiUrl}/AccApInvoice/delete_file/${id}`, body);
	}

	openFile(id: number, type: string, fileName: string) {

		this.http.get(`${this.apiUrl}/accApInvoice/download/${id}/${type}`, {
			observe: 'response',
			responseType: 'blob'
		}).subscribe(res => {

			const parts = fileName.split('.');
			const ext = parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';

			let mimeType = 'application/octet-stream';

			if (ext === 'pdf') mimeType = 'application/pdf';
			else if (['jpg', 'jpeg', 'png'].includes(ext))
				mimeType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
			else if (ext === 'txt') mimeType = 'text/plain';

			const blob = new Blob([res.body], { type: mimeType });
			const url = window.URL.createObjectURL(blob);

			// preview
			if (['pdf', 'jpg', 'jpeg', 'png'].includes(ext)) {
				window.open(url, '_blank');
			}
			// download fallback
			else {
				const a = document.createElement('a');
				a.href = url;
				a.download = fileName;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
			}

			window.URL.revokeObjectURL(url);
		});
	}

	  getAllAkunKreditSalesInvoice() {
		return this.http.get(`${this.apiUrl}/accSalesInvoice/getAkunKreditSalesInvoice`);
	}
}
