import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
// import { TranslateService } from '@ngx-translate/core';
// import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_API_URL } from 'src/app/app.constants';
import { AccAngkutInvoice } from '../models/acc_angkut_invoice.model';

@Injectable({
	providedIn: 'root'
})

export class AccAngkutInvoiceService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<AccAngkutInvoice[]>(`${this.apiUrl}/AccAngkutInvoice/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/AccAngkutInvoice/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/AccAngkutInvoice`, akun,);
	}
	delete(id: number) {
		let data={"id":id.toString()};
			return this.http.delete(`${this.apiUrl}/AccAngkutInvoice/${id}`);
		}
	update(id:any,AccAngkutInvoice: any) {
		return this.http.put(`${this.apiUrl}/AccAngkutInvoice/${id}`, AccAngkutInvoice);
	}
  posting(id:any,data: any) {
		return this.http.post(`${this.apiUrl}/AccAngkutInvoice/posting/${id}`, data);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/AccAngkutInvoice/edit_picture/${id}`, file);
	}
  getAllOutstanding() {
    return this.http.get(`${this.apiUrl}/AccAngkutInvoice/getAllOutstandingBayar`);
  }

  getLaporanRekapSaldo(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/pdf',
         'Accept' : 'application/pdf',
      }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/AccAngkutInvoice/laporan_rekap_stok`, data,httpOptions);
	}
  getLaporanKartuStok(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/pdf',
         'Accept' : 'application/pdf',
      }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/AccAngkutInvoice/laporan_kartu_stok`, data,httpOptions);
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
		return this.http.get<any>(`${this.apiUrl}/AccAngkutInvoice/print_slip_invoice/${id}`,httpOptions);
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
		return this.http.get<any>(`${this.apiUrl}/AccAngkutInvoice/print_slip_ba/${id}`,httpOptions);
	}
  getPdfSlipBASusut(id) {
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
		return this.http.get<any>(`${this.apiUrl}/AccAngkutInvoice/print_slip_ba_susut/${id}`,httpOptions);
	}

getSlipBASusutExcel(id: number) {
  return this.http.get(
    `${this.apiUrl}/AccAngkutInvoice/print_slip_ba_susut_excel/${id}`,
    {
      responseType: 'blob',
      observe: 'response'
    }
  );
}
}
