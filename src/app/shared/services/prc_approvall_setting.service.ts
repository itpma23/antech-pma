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
import { Akun } from '../models/akun.model';
import { PrcApprovallSetting } from '../models/prc_approvall_setting.model';

@Injectable({
	providedIn: 'root'
})

export class PrcApprovallSettingService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<PrcApprovallSetting[]>(`${this.apiUrl}/PrcApprovallSetting/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/PrcApprovallSetting/${id}`);
	}
	getByLokasiAndKode(lokasi_id: number,kode:string) {
		return this.http.get(`${this.apiUrl}/PrcApprovallSetting/getByLokasiAndKode/${lokasi_id}/${kode}`);
	}
  getKaryawanByLokasiAndKode(lokasi_id: number,kode:string) {
		return this.http.get(`${this.apiUrl}/PrcApprovallSetting/getKaryawanByLokasiAndKode/${lokasi_id}/${kode}`);
	}
  getByLokasiKodeKaryawan(lokasi_id: number,kode:string,karyawan_id: number) {
		return this.http.get(`${this.apiUrl}/PrcApprovallSetting/getByLokasiKodeKaryawan/${lokasi_id}/${kode}/${karyawan_id}`);
	}
	create(akun: any) {
		return this.http.post(`${this.apiUrl}/PrcApprovallSetting`, akun,

    );
	}

	update(id:any,PrcApprovallSetting: any) {
		return this.http.put(`${this.apiUrl}/PrcApprovallSetting/${id}`, PrcApprovallSetting);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/PrcApprovallSetting/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/PrcApprovallSetting/${id}`);
	}

	getPdfSlip(id) {
		const httpOptions = {
		  headers: new HttpHeaders({
			'Content-Type':  'application/pdf',
			// 'Authorization' : this.authKey,
			 'Accept' : 'application/pdf',
			// 'NAMADB': 'testing',
			// 'NAMAPATH': 'Testing'
			//observe : 'response'
		  }),
		  'responseType' : 'blob' as 'json'

		};
			return this.http.get<any>(`${this.apiUrl}/PrcApprovallSetting/print_slip/${id}`,httpOptions);
		}
}
