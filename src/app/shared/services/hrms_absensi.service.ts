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
import { Pengajar } from '../models/pengajar.model';
import { HrmsAbsensi } from '../models/hrms_absensi.model';

@Injectable({
	providedIn: 'root'
})

export class HrmsAbsensiService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<HrmsAbsensi[]>(`${this.apiUrl}/hrmsAbsensi/getAll`);
	}

	getById(id: number) {
		return this.http.get(`${this.apiUrl}/hrmsAbsensi/${id}`);
	}


  updateStatus(status:any,pengajar: any) {
    let data={status_id:status,pengajar_id:pengajar}
		return this.http.post(`${this.apiUrl}/hrmsAbsensi/update_status`, data,

    );
	}

  create(data: any) {
		return this.http.post(`${this.apiUrl}/hrmsAbsensi/create`, data);
	}
  update(id,data) {
		return this.http.post(`${this.apiUrl}/hrmsAbsensi/update/${id}`, data);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/hrmsAbsensi/${id}`);
	}

  getAbsensiKaryawan(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
       'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/hrmsAbsensi/laporan_absensi`, data,httpOptions);
	}
  import(file: any) {
		return this.http.post(`${this.apiUrl}/hrmsAbsensi/import`, file,

    );
	}
}
