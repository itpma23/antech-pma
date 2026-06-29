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

@Injectable({
	providedIn: 'root'
})

export class PengajarService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<Pengajar[]>(`${this.apiUrl}/pengajar/getAll`);
	}

	getById(id: number) {
		return this.http.get(`${this.apiUrl}/pengajar/${id}`);
	}

  getJadwal(pengajar_id,hari_id) {
		return this.http.get(`${this.apiUrl}/pengajar/jadwal/${pengajar_id}/${hari_id}`);
	}

  getJadwalById(id) {
		return this.http.get(`${this.apiUrl}/pengajar/get_jadwal_by_id/${id}`);
	}

  updateStatus(status:any,pengajar: any) {
    let data={status_id:status,pengajar_id:pengajar}
		return this.http.post(`${this.apiUrl}/pengajar/update_status`, data,

    );
	}
	create(pengajar: any) {
		return this.http.post(`${this.apiUrl}/pengajar`, pengajar,

    );
	}

	update(id:any,pengajar: any) {
		return this.http.put(`${this.apiUrl}/pengajar/${id}`, pengajar);
	}
  updateJadwal(id:any,jadwal: any) {
		return this.http.post(`${this.apiUrl}/pengajar/update_jadwal/${id}`, jadwal);
	}
  createJadwal(jadwal) {
		return this.http.post(`${this.apiUrl}/pengajar/simpan_jadwal`, jadwal);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/pengajar/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/pengajar/${id}`);
	}


}
