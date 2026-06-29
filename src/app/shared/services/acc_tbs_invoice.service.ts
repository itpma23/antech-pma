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
import { AccTbsInvoice } from '../models/acc_tbs_invoice.model';

@Injectable({
	providedIn: 'root'
})

export class AccTbsInvoiceService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<AccTbsInvoice[]>(`${this.apiUrl}/AccTbsInvoice/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/AccTbsInvoice/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/AccTbsInvoice`, akun,);
	}
	delete(id: number) {
		let data={"id":id.toString()};
			return this.http.delete(`${this.apiUrl}/AccTbsInvoice/${id}`);
		}
	update(id:any,AccTbsInvoice: any) {
		return this.http.put(`${this.apiUrl}/AccTbsInvoice/${id}`, AccTbsInvoice);
	}
  posting(id:any,data: any) {
		return this.http.post(`${this.apiUrl}/AccTbsInvoice/posting/${id}`, data);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/AccTbsInvoice/edit_picture/${id}`, file);
	}
  getAllOutstanding() {
    return this.http.get(`${this.apiUrl}/AccTbsInvoice/getAllOutstandingBayar`);
  }
  getTbsbySupplierId(supp_id){
    return this.http.get(`${this.apiUrl}/AccTbsInvoice/getTbsbySupplierId/${supp_id}`);
  }

  getDetailById(id){
    return this.http.get(`${this.apiUrl}/AccTbsInvoice/getTbsbyId/${id}`);
  }

  getTbsInvoiceReport(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/accTbsInvoice/laporan_tbs_invoice`, data,httpOptions);
	}

  getPdfSlipInvoice(id) {
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
		return this.http.get<any>(`${this.apiUrl}/AccTbsInvoice/print_slip_invoice/${id}`,httpOptions);
	}
  getPdfSlipBA(id) {
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
		return this.http.get<any>(`${this.apiUrl}/AccTbsInvoice/print_slip_ba/${id}`,httpOptions);
	}

    getRekapInvoicePembelianTbs(data){
        const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/AccTbsInvoice/laporan_invoice_pembelian_tbs`, data,httpOptions);

  }
}
