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
import { AccKuitansiPembelianTbs } from '../models/acc_tbs_invoice.model';

@Injectable({
	providedIn: 'root'
})

export class AccKuitansiPembelianTbsService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/AccKuitansiPembelianTbs`, akun,);
	}

	getAll() {
		return this.http.get<AccKuitansiPembelianTbs[]>(`${this.apiUrl}/AccKuitansiPembelianTbs/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/AccKuitansiPembelianTbs/${id}`);
	}

	delete(id: number) {
		let data={"id":id.toString()};
			return this.http.delete(`${this.apiUrl}/AccKuitansiPembelianTbs/${id}`);
		}
	update(id:any,AccKuitansiPembelianTbs: any) {
		return this.http.put(`${this.apiUrl}/AccKuitansiPembelianTbs/${id}`, AccKuitansiPembelianTbs);
	}
  posting(id:any,data: any) {
		return this.http.post(`${this.apiUrl}/AccKuitansiPembelianTbs/posting/${id}`, data);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/AccKuitansiPembelianTbs/edit_picture/${id}`, file);
	}
  getAllKuitansiPosting() {
    return this.http.get(`${this.apiUrl}/AccKuitansiPembelianTbs/getAllKuitansiPosting`);
  }
  getTbsbySupplierId(supp_id){
    return this.http.get(`${this.apiUrl}/AccKuitansiPembelianTbs/getTbsbySupplierId/${supp_id}`);
  }

  getDetailById(id){
    return this.http.get(`${this.apiUrl}/AccKuitansiPembelianTbs/getTbsbyId/${id}`);
  }

  getTbsInvoiceReport(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/AccKuitansiPembelianTbs/laporan_tbs_invoice`, data,httpOptions);
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
		return this.http.get<any>(`${this.apiUrl}/AccKuitansiPembelianTbs/print_slip_kuitansi_pembayaran/${id}`,httpOptions);
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
		return this.http.get<any>(`${this.apiUrl}/AccKuitansiPembelianTbs/print_slip_kuitansi/${id}`,httpOptions);
	}

  getRekapKwitansiPembelianTbs(data){
        const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/AccKuitansiPembelianTbs/laporan_kwitansi_pembelian_tbs`, data,httpOptions);

  }

}
