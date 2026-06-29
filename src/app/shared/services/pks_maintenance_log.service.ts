import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { Akun } from '../models/akun.model';
import { PksMaintenanceLog } from '../models/pks_maintenance_log';

@Injectable({
	providedIn: 'root'
})

export class PksMaintenanceLogService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<PksMaintenanceLog[]>(`${this.apiUrl}/PksMaintenanceLog/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/PksMaintenanceLog/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/PksMaintenanceLog`, akun,

    );
	}

	update(id:any,PksMaintenanceLog: any) {
		return this.http.put(`${this.apiUrl}/PksMaintenanceLog/${id}`, PksMaintenanceLog);
	}

	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/PksMaintenanceLog/${id}`);
	}
  getLaporanDetail(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
       'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/PksMaintenanceLog/laporan_detail_maintenance`, data,httpOptions);
	}
  getLaporanByMesin(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
       'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/PksMaintenanceLog/laporan_by_mesin`, data,httpOptions);
	}
  getLaporanMaintenceRutin(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
       'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/PksMaintenanceLog/laporan_status_service_rutin`, data,httpOptions);
	}
	// getPdfSlip(id) {
	// 	const httpOptions = {
	// 	  headers: new HttpHeaders({
	// 		// 'Content-Type':  'application/pdf',
	// 		// // 'Authorization' : this.authKey,
	// 		//  'Accept' : 'application/pdf',
	// 		// // 'NAMADB': 'testing',
	// 		// // 'NAMAPATH': 'Testing'
	// 		// //observe : 'response'
	// 	  }),
	// 	  'responseType' : 'blob' as 'json'

	// 	};
	// 		return this.http.get<any>(`${this.apiUrl}/PksMaintenanceLog/print_slip/${id}`,httpOptions);
	// }




}
