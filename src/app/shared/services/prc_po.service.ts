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
import { PrcPo } from '../models/prc_po.model';

@Injectable({
	providedIn: 'root'
})

export class PrcPoService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	closing(id: any, data: any) {
		return this.http.post(`${this.apiUrl}/PrcPo/closing/${id}`, data);
	}

	getAll() {
		return this.http.get<PrcPo[]>(`${this.apiUrl}/PrcPo/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/PrcPo/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/PrcPo`, akun,

		);
	}

	update(id: any, PrcPo: any) {
		return this.http.put(`${this.apiUrl}/PrcPo/${id}`, PrcPo);
	}

	revisi(id: any, PrcPo: any) {
		return this.http.put(`${this.apiUrl}/PrcPo/revisi/${id}`, PrcPo);
	}

	posting(id: any, data: any) {
		return this.http.post(`${this.apiUrl}/PrcPo/posting/${id}`, data);
	}

	delete(id: number) {
		let data = { "id": id.toString() };
		return this.http.delete(`${this.apiUrl}/PrcPo/${id}`);
	}
	getAllBySupplier(supp_id: number) {
		return this.http.get(`${this.apiUrl}/PrcPo/getAllBySupplier/${supp_id}`);
	}
	getAllPOReleaseBySupplier(supp_id: number) {
		return this.http.get(`${this.apiUrl}/PrcPo/getAllPOReleaseBySupplier/${supp_id}`);
	}
	getAllPoReleaseRecieveBySupplier(supp_id: number) {
		return this.http.get(`${this.apiUrl}/PrcPo/getAllPOReleaseRecieveBySupplier/${supp_id}`);
	}
	getAllPenerimaanPOReleaseByidPo(supp_id: number) {
		return this.http.get(`${this.apiUrl}/InvPenerimaanPo/getNoPenerimaanPOByIdPO/${supp_id}`);
	}
	getAllPOReleaseBySupplierBlmClose(supp_id: number) {
		return this.http.get(`${this.apiUrl}/PrcPo/getAllPOReleaseBySupplierBlmClose/${supp_id}`);
	}
	getAllDetailBlmTerima(po_id: number) {
		return this.http.get(`${this.apiUrl}/PrcPo/getAllDetailBlmTerima/${po_id}`);
	}
	getAllDetailSdhTerima(po_id: number) {
		return this.http.get(`${this.apiUrl}/PrcPo/getAllDetailSdhTerima/${po_id}`);
	}
	getAllDetailPoOnly(po_id: number) {
		return this.http.get(`${this.apiUrl}/PrcPo/getAllDetail/${po_id}`);
	}



	getPoReportDetail(data) {
		const httpOptions = {
			// headers: new HttpHeaders({
			//   'Content-Type':  'application/pdf',
			//    'Accept' : 'application/pdf',
			// }),
			'responseType': 'blob' as 'json'

		};
		return this.http.post(`${this.apiUrl}/PrcPo/laporan_po_detail`, data, httpOptions);
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
		return this.http.get<any>(`${this.apiUrl}/PrcPo/print_slip/${id}`, httpOptions);
	}
	getQuotationFile(id) {
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
		return this.http.get<any>(`${this.apiUrl}/PrcPo/get_quotation/${id}`, httpOptions);
	}
	getPdfSlipCekHarga(id) {
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
		return this.http.get<any>(`${this.apiUrl}/PrcPo/print_slip_cek_harga/${id}`, httpOptions);
	}
	countApproveData() {
		return this.http.post(`${this.apiUrl}/PrcPo/countByUserApprove`, null

		);
	}
	countPPReadyPO() {
		return this.http.post(`${this.apiUrl}/PrcPo/countPPReadyPO`, null

		);
	}
	approve(id: any, data: any) {
		return this.http.post(`${this.apiUrl}/PrcPo/approval/${id}`, data,

		);
	}
	reject(id: any, data: any) {
		return this.http.post(`${this.apiUrl}/PrcPo/reject/${id}`, data,

		);
	}

	getDetailPo(po_hd_id) {
		return this.http.get(`${this.apiUrl}/PrcPo/getDetailPo/${po_hd_id}`);
	}
		downloadKontrak(id) {
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
		return this.http.get<any>(`${this.apiUrl}/PrcPo/download/${id}`, httpOptions);
	}
}
