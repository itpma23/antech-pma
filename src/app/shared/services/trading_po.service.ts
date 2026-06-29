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

export class TradingPoService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	closing(id: any, data: any) {
		return this.http.post(`${this.apiUrl}/TradingPo/closing/${id}`, data);
	}

	getAll() {
		return this.http.get<PrcPo[]>(`${this.apiUrl}/TradingPo/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/TradingPo/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/TradingPo`, akun,

		);
	}

	update(id: any, TradingPo: any) {
		return this.http.put(`${this.apiUrl}/TradingPo/${id}`, TradingPo);
	}

	revisi(id: any, TradingPo: any) {
		return this.http.put(`${this.apiUrl}/TradingPo/revisi/${id}`, TradingPo);
	}

	posting(id: any, data: any) {
		return this.http.post(`${this.apiUrl}/TradingPo/posting/${id}`, data);
	}

	delete(id: number) {
		let data = { "id": id.toString() };
		return this.http.delete(`${this.apiUrl}/TradingPo/${id}`);
	}
	getAllBySupplier(supp_id: number) {
		return this.http.get(`${this.apiUrl}/TradingPo/getAllBySupplier/${supp_id}`);
	}
	getAllPOReleaseBySupplier(supp_id: number) {
		return this.http.get(`${this.apiUrl}/TradingPo/getAllPOReleaseBySupplier/${supp_id}`);
	}
	getAllPoReleaseRecieveBySupplier(supp_id: number) {
		return this.http.get(`${this.apiUrl}/TradingPo/getAllPOReleaseRecieveBySupplier/${supp_id}`);
	}
	getAllPenerimaanPOReleaseByidPo(supp_id: number) {
		return this.http.get(`${this.apiUrl}/InvPenerimaanPo/getNoPenerimaanPOByIdPO/${supp_id}`);
	}
	getAllPOReleaseBySupplierBlmClose(supp_id: number) {
		return this.http.get(`${this.apiUrl}/TradingPo/getAllPOReleaseBySupplierBlmClose/${supp_id}`);
	}
	getAllDetailBlmTerima(po_id: number) {
		return this.http.get(`${this.apiUrl}/TradingPo/getAllDetailBlmTerima/${po_id}`);
	}
	getAllDetailSdhTerima(po_id: number) {
		return this.http.get(`${this.apiUrl}/TradingPo/getAllDetailSdhTerima/${po_id}`);
	}
	getAllDetailPoOnly(po_id: number) {
		return this.http.get(`${this.apiUrl}/TradingPo/getAllDetail/${po_id}`);
	}



	getPoReportDetail(data) {
		const httpOptions = {
			// headers: new HttpHeaders({
			//   'Content-Type':  'application/pdf',
			//    'Accept' : 'application/pdf',
			// }),
			'responseType': 'blob' as 'json'

		};
		return this.http.post(`${this.apiUrl}/TradingPo/laporan_po_detail`, data, httpOptions);
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
		return this.http.get<any>(`${this.apiUrl}/TradingPo/print_slip/${id}`, httpOptions);
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
		return this.http.get<any>(`${this.apiUrl}/TradingPo/get_quotation/${id}`, httpOptions);
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
		return this.http.get<any>(`${this.apiUrl}/TradingPo/print_slip_cek_harga/${id}`, httpOptions);
	}
	countApproveData() {
		return this.http.post(`${this.apiUrl}/TradingPo/countByUserApprove`, null

		);
	}
	countPPReadyPO() {
		return this.http.post(`${this.apiUrl}/TradingPo/countPPReadyPO`, null

		);
	}
	approve(id: any, data: any) {
		return this.http.post(`${this.apiUrl}/TradingPo/approval/${id}`, data,

		);
	}
	reject(id: any, data: any) {
		return this.http.post(`${this.apiUrl}/TradingPo/reject/${id}`, data,

		);
	}

	getDetailPo(po_hd_id) {
		return this.http.get(`${this.apiUrl}/TradingPo/getDetailPo/${po_hd_id}`);
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
		return this.http.get<any>(`${this.apiUrl}/TradingPo/download/${id}`, httpOptions);
	}
}
