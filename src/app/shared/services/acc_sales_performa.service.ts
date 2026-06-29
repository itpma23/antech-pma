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
import { AccSalesPerforma } from '../models/acc_sales_performa.model';

@Injectable({
	providedIn: 'root'
})

export class AccSalesPerformaService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<AccSalesPerforma[]>(`${this.apiUrl}/accSalesPerforma/getAll`);
	}

getBank() {
  return this.http.get(`${this.apiUrl}/accSalesPerforma/getAllBank`);
}

getPerforma() {
  return this.http.get(`${this.apiUrl}/accSalesPerforma/getProformaBelumInvoice`);
}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/accSalesPerforma/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/accSalesPerforma/create`, akun,

    );
	}

	update(id:any,SlsPerforma: any) {
		return this.http.put(`${this.apiUrl}/accSalesPerforma/update/${id}`, SlsPerforma);
	}

  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/accSalesPerforma/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/accSalesPerforma/${id}`);
	}
  posting(id:any,data: any) {
		return this.http.post(`${this.apiUrl}/accSalesPerforma/posting/${id}`, data);
	}

  getAllOutstandingPerforma() {
		return this.http.get<any[]>(`${this.apiUrl}/accSalesPerforma/getAllOutstandingPerforma`);
	}

  getArReportDetail(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/accSalesPerforma/laporan_ar_detail`, data,httpOptions);
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
			return this.http.get<any>(`${this.apiUrl}/accSalesPerforma/print_slip/${id}`,httpOptions);
		}
}
