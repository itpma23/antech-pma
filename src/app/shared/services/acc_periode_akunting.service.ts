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
import { AccPeriodeAkunting } from '../models/acc_periode_akunting.model';

@Injectable({
	providedIn: 'root'
})

export class AccPeriodeAkuntingService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<AccPeriodeAkunting[]>(`${this.apiUrl}/accPeriodeAkunting/getAll`);
	}

	getById(id: number) {
		return this.http.get(`${this.apiUrl}/accPeriodeAkunting/${id}`);
	}

  getByLokasiId(lok_id: number) {
		return this.http.get(`${this.apiUrl}/accPeriodeAkunting/get_by_lokasi_id/${lok_id}`);
	}


  updateStatus(status:any,pengajar: any) {
    let data={status_id:status,pengajar_id:pengajar}
		return this.http.post(`${this.apiUrl}/accPeriodeAkunting/update_status`, data,

    );
	}
  startProses(id) {
		return this.http.post(`${this.apiUrl}/accPeriodeAkunting/startProcess/${id}`, null);
	}
  checkClosing(id) {
		return this.http.post(`${this.apiUrl}/accPeriodeAkunting/check_closing/${id}`, null);
	}
  create(data: any) {
		return this.http.post(`${this.apiUrl}/accPeriodeAkunting/create`, data);
	}
  update(id,data) {
		return this.http.post(`${this.apiUrl}/accPeriodeAkunting/update/${id}`, data);
	}



	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/accPeriodeAkunting/${id}`);
	}


}
