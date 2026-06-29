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
import { HrmsPotongan } from '../models/hrms_potongan.model';

@Injectable({
	providedIn: 'root'
})

export class HrmsPotonganService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<HrmsPotongan[]>(`${this.apiUrl}/hrmsPotongan/getAll`);
	}

	getById(id: number) {
		return this.http.get(`${this.apiUrl}/hrmsPotongan/${id}`);
	}


  updateStatus(status:any,pengajar: any) {
    let data={status_id:status,pengajar_id:pengajar}
		return this.http.post(`${this.apiUrl}/hrmsPotongan/update_status`, data,

    );
	}

  create(data: any) {
		return this.http.post(`${this.apiUrl}/hrmsPotongan/create`, data);
	}
  update(id,data) {
		return this.http.post(`${this.apiUrl}/hrmsPotongan/update/${id}`, data);
	}
  hitungLembur(data) {
		return this.http.post(`${this.apiUrl}/hrmsPotongan/hitung_lembur`,data);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/hrmsPotongan/${id}`);
	}
  getLemburKaryawan(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/hrmsPotongan/laporan_lembur`, data,httpOptions);
	}
  import(file: any) {
		return this.http.post(`${this.apiUrl}/hrmsPotongan/import`, file,

    );
	}

}
