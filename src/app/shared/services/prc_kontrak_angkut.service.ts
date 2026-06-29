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
import { PrcKontrakAngkut } from '../models/prc_kontrak_angkut.model';

@Injectable({
	providedIn: 'root'
})

export class PrcKontrakAngkutService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<PrcKontrakAngkut[]>(`${this.apiUrl}/PrcKontrakAngkut/getAll`);
	}
	getAllbyCustomer(customer_id) {
		return this.http.get<PrcKontrakAngkut[]>(`${this.apiUrl}/PrcKontrakAngkut/getAllbyCustomer/${customer_id}`);
	}

	getAllBiayaAngkut(supplier_id){
		return this.http.get(`${this.apiUrl}/PrcKontrakAngkut/getAllBiayaAngkut/${supplier_id}`);
	}

	getAllBiayaAngkutDetail(id){
		return this.http.get(`${this.apiUrl}/PrcKontrakAngkut/getAllBIayaAngkutDetail/${id}`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/PrcKontrakAngkut/${id}`);
	}


  updateStatus(status:any,pengajar: any) {
    let data={status_id:status,pengajar_id:pengajar}
		return this.http.post(`${this.apiUrl}/PrcKontrakAngkut/update_status`, data,

    );
	}

  create(data: any) {
		return this.http.post(`${this.apiUrl}/PrcKontrakAngkut/create`, data);
	}
  update(id,data) {
		return this.http.post(`${this.apiUrl}/PrcKontrakAngkut/update/${id}`, data);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/PrcKontrakAngkut/${id}`);
	}


	getReportDetail(data) {
    const httpOptions = {
      'responseType' : 'blob' as 'json'
    };
		return this.http.post(`${this.apiUrl}/PrcKontrakAngkut/laporan_detail`, data,httpOptions);
	}

}
