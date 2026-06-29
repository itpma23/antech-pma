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
import { MonitoringHarian } from '../models/monitoring_harian.model';

@Injectable({
	providedIn: 'root'
})

export class MonitoringHarianService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<MonitoringHarian[]>(`${this.apiUrl}/MonitoringHarian/getAll`);
	}
	getAllbyCustomer(customer_id) {
		return this.http.get<MonitoringHarian[]>(`${this.apiUrl}/MonitoringHarian/getAllbyCustomer/${customer_id}`);
	}

	getById(id: number) {
		return this.http.get(`${this.apiUrl}/MonitoringHarian/${id}`);
	}


  updateStatus(status:any,pengajar: any) {
    let data={status_id:status,pengajar_id:pengajar}
		return this.http.post(`${this.apiUrl}/MonitoringHarian/update_status`, data,

    );
	}

  create(data: any) {
		return this.http.post(`${this.apiUrl}/MonitoringHarian/create`, data);
	}
  update(id,data) {
		return this.http.post(`${this.apiUrl}/MonitoringHarian/update/${id}`, data);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/MonitoringHarian/${id}`);
	}


	getReportDetail(data) {
    const httpOptions = {
      'responseType' : 'blob' as 'json'
    };
		return this.http.post(`${this.apiUrl}/MonitoringHarian/laporan_detail`, data,httpOptions);
	}

	getReportNonPosting(data) {
    const httpOptions = {
      'responseType' : 'blob' as 'json'
    };
		return this.http.post(`${this.apiUrl}/MonitoringHarian/laporan_detail_non_posting`, data,httpOptions);
	}

}
