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
import { AccSalesInvoice } from '../models/acc_sales_invoice.model';

@Injectable({
	providedIn: 'root'
})

export class AccSalesInvoiceService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<AccSalesInvoice[]>(`${this.apiUrl}/accSalesInvoice/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/accSalesInvoice/${id}`);
	}
	getAllAkunSalesInvoice() {
		return this.http.get(`${this.apiUrl}/accSalesInvoice/getAkunSalesInvoice`);
	}
  getAllAkunDebetSalesInvoice() {
		return this.http.get(`${this.apiUrl}/accSalesInvoice/getAkunDebetSalesInvoice`);
	}
  getAllAkunKreditSalesInvoice() {
		return this.http.get(`${this.apiUrl}/accSalesInvoice/getAkunKreditSalesInvoice`);
	}
	create(akun: any) {
		return this.http.post(`${this.apiUrl}/accSalesInvoice/create`, akun,

    );
	}

	update(id:any,SlsInvoice: any) {
		return this.http.post(`${this.apiUrl}/accSalesInvoice/update/${id}`, SlsInvoice);
	}

  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/accSalesInvoice/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/accSalesInvoice/${id}`);
	}
  posting(id:any,data: any) {
		return this.http.post(`${this.apiUrl}/accSalesInvoice/posting/${id}`, data);
	}

  getAllOutstandingInvoice() {
		return this.http.get<any[]>(`${this.apiUrl}/accSalesInvoice/getAllOutstandingInvoice`);
	}

  getArReportDetail(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/accSalesInvoice/laporan_ar_detail`, data,httpOptions);
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
			return this.http.get<any>(`${this.apiUrl}/accSalesInvoice/print_slip/${id}`,httpOptions);
		}
}
