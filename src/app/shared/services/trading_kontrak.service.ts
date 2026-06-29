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
import { SlsKontrak } from '../models/sls_kontrak.model';

@Injectable({
	providedIn: 'root'
})

export class TradingKontrakService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<SlsKontrak[]>(`${this.apiUrl}/TradingKontrak/getAll`);
	}
	getAllBelumBAAngkut() {
		return this.http.get<SlsKontrak[]>(`${this.apiUrl}/TradingKontrak/getAllBelumBAAngkut`);
	}
	getAllbyCustomer(customer_id) {
		return this.http.get<SlsKontrak[]>(`${this.apiUrl}/TradingKontrak/getAllbyCustomer/${customer_id}`);
	}

	getById(id: number) {
		return this.http.get(`${this.apiUrl}/TradingKontrak/${id}`);
	}


	updateStatus(status: any, pengajar: any) {
		let data = { status_id: status, pengajar_id: pengajar }
		return this.http.post(`${this.apiUrl}/TradingKontrak/update_status`, data,

		);
	}

	create(data: any) {
		return this.http.post(`${this.apiUrl}/TradingKontrak/create`, data);
	}
	update(id, data) {
		return this.http.post(`${this.apiUrl}/TradingKontrak/update/${id}`, data);
	}
	posting(id: any, data: any) {
		return this.http.post(`${this.apiUrl}/TradingKontrak/posting/${id}`, data);
	}
	delete(id: number) {
		let data = { "id": id.toString() };
		return this.http.delete(`${this.apiUrl}/TradingKontrak/${id}`);
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
		return this.http.get<any>(`${this.apiUrl}/TradingKontrak/print_slip/${id}`, httpOptions);
	}


	getReportDetail(data) {
		const httpOptions = {
			'responseType': 'blob' as 'json'
		};
		return this.http.post(`${this.apiUrl}/TradingKontrak/laporan_detail`, data, httpOptions);
	}

	getOnlyOfficeConfig() {
		return this.http.get(`${this.apiUrl}/TradingKontrak/onlyoffice_config`);
	}

downloadWord(id: number) {

  return this.http.get(
    `${this.apiUrl}/TradingKontrak/download_word/${id}`,
    {
      observe: 'response',
      responseType: 'blob'
    }
  );

}

uploadWord(id: number, file: File) {

  const formData = new FormData();

  formData.append('file', file);

  return this.http.post(
    `${this.apiUrl}/TradingKontrak/upload_word/${id}`,
    formData
  );

}

closing(id: number) {

  return this.http.post(
    `${this.apiUrl}/TradingKontrak/closing/${id}`,
    {}
  );

}

}
