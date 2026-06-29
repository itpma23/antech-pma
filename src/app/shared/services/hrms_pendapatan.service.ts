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
import { HrmsPendapatan } from '../models/hrms_pendapatan.model';

@Injectable({
	providedIn: 'root'
})

export class HrmsPendapatanService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<HrmsPendapatan[]>(`${this.apiUrl}/hrmsPendapatan/getAll`);
	}

	getById(id: number) {
		return this.http.get(`${this.apiUrl}/hrmsPendapatan/${id}`);
	}


  updateStatus(status:any,pengajar: any) {
    let data={status_id:status,pengajar_id:pengajar}
		return this.http.post(`${this.apiUrl}/hrmsPendapatan/update_status`, data,

    );
	}

  create(data: any) {
		return this.http.post(`${this.apiUrl}/hrmsPendapatan/create`, data);
	}
  update(id,data) {
		return this.http.post(`${this.apiUrl}/hrmsPendapatan/update/${id}`, data);
	}
  hitungLembur(data) {
		return this.http.post(`${this.apiUrl}/hrmsPendapatan/hitung_lembur`,data);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/hrmsPendapatan/${id}`);
	}
  getLemburKaryawan(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/hrmsPendapatan/laporan_lembur`, data,httpOptions);
	}
  import(file: any) {
		return this.http.post(`${this.apiUrl}/hrmsPendapatan/import`, file,

    );
	}

}
