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
import { SlsIntruksi } from '../models/sls_intruksi.model';

@Injectable({
	providedIn: 'root'
})

export class TradingIntruksiService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<SlsIntruksi[]>(`${this.apiUrl}/TradingIntruksi/getAll`);
	}

	getById(id: number) {
		return this.http.get(`${this.apiUrl}/TradingIntruksi/${id}`);
	}

	getAllByKontrak(id: number) {
		return this.http.get(`${this.apiUrl}/TradingIntruksi/getAllByKontrak/${id}`);
	}

  updateStatus(status:any,pengajar: any) {
    let data={status_id:status,pengajar_id:pengajar}
		return this.http.post(`${this.apiUrl}/TradingIntruksi/update_status`, data,

    );
	}

  create(data: any) {
		return this.http.post(`${this.apiUrl}/TradingIntruksi/create`, data);
	}
  update(id,data) {
		return this.http.post(`${this.apiUrl}/TradingIntruksi/update/${id}`, data);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/TradingIntruksi/${id}`);
	}


	getReportDetail(data) {
    const httpOptions = {
      'responseType' : 'blob' as 'json'
    };
		return this.http.post(`${this.apiUrl}/TradingIntruksi/laporan_detail`, data,httpOptions);
	}
  getReportMonitoring(data) {
    const httpOptions = {
      'responseType' : 'blob' as 'json'
    };
		return this.http.post(`${this.apiUrl}/TradingIntruksi/laporan_monitoring`, data,httpOptions);
	}

}
