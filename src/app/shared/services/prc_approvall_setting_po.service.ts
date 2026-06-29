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
import { PrcApprovallSettingPo } from '../models/prc_approvall_setting_po.model';

@Injectable({
	providedIn: 'root'
})

export class PrcApprovallSettingPoService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<PrcApprovallSettingPo[]>(`${this.apiUrl}/PrcApprovallSettingPo/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/PrcApprovallSettingPo/${id}`);
	}
	getByLokasiAndKode(lokasi_id: number,kode:string) {
		return this.http.get(`${this.apiUrl}/PrcApprovallSettingPo/getByLokasiAndKode/${lokasi_id}/${kode}`);
	}
  getKaryawanByLokasiAndKode(lokasi_id: number,kode:string,amount:number) {
		return this.http.get(`${this.apiUrl}/PrcApprovallSettingPo/getKaryawanByLokasiAndKode/${lokasi_id}/${kode}/${amount}`);
	}
  getByLokasiKodeKaryawan(lokasi_id: number,kode:string,karyawan_id: number,amount:number) {
		return this.http.get(`${this.apiUrl}/PrcApprovallSettingPo/getByLokasiKodeKaryawan/${lokasi_id}/${kode}/${karyawan_id}/${amount}`);
	}
	create(akun: any) {
		return this.http.post(`${this.apiUrl}/PrcApprovallSettingPo`, akun,

    );
	}

	update(id:any,PrcApprovallSettingPo: any) {
		return this.http.put(`${this.apiUrl}/PrcApprovallSettingPo/${id}`, PrcApprovallSettingPo);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/PrcApprovallSettingPo/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/PrcApprovallSettingPo/${id}`);
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
			return this.http.get<any>(`${this.apiUrl}/PrcApprovallSettingPo/print_slip/${id}`,httpOptions);
		}
}
