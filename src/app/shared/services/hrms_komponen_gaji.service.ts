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
import { HrmsKomponenGaji } from '../models/hrms_komponen_gaji.model';

@Injectable({
	providedIn: 'root'
})

export class HrmsKomponenGajiService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<HrmsKomponenGaji[]>(`${this.apiUrl}/hrmsKomponengaji/getAll`);
	}

  getAllPotongan() {
		return this.http.get<HrmsKomponenGaji[]>(`${this.apiUrl}/hrmsKomponengaji/getAllPotongan`);
	}
  getAllPendapatan() {
		return this.http.get<HrmsKomponenGaji[]>(`${this.apiUrl}/hrmsKomponengaji/getAllPendapatan`);
	}
	getById(id: number) {
		return this.http.get(`${this.apiUrl}/hrmsKomponengaji/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/hrmsKomponengaji`, akun,

    );
	}

	update(id:any,hrmsKomponenGaji: any) {
		return this.http.put(`${this.apiUrl}/hrmsKomponengaji/${id}`, hrmsKomponenGaji);
	}



	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/hrmsKomponengaji/${id}`);
	}


}
