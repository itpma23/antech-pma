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
import { HrmsApprovallSettingPengajuanCuti } from '../models/hrms_approvall_setting_pengajuan_cuti.model';

@Injectable({
	providedIn: 'root'
})

export class HrmsApprovallSettingPengajuanCutiService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<HrmsApprovallSettingPengajuanCuti[]>(`${this.apiUrl}/HrmsApprovallSettingPengajuanCuti/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/HrmsApprovallSettingPengajuanCuti/${id}`);
	}
	getByLokasiAndKode(lokasi_id: number,kode:string) {
		return this.http.get(`${this.apiUrl}/HrmsApprovallSettingPengajuanCuti/getByLokasiAndKode/${lokasi_id}/${kode}`);
	}
  getKaryawanByLokasiAndKode(lokasi_id: number,kode:string) {

		return this.http.get(`${this.apiUrl}/HrmsApprovallSettingPengajuanCuti/getKaryawanByLokasiAndKode/${lokasi_id}/${kode}`);
	}
  getByLokasiKodeKaryawan(lokasi_id: number,kode:string,karyawan_id: number) {
    // console.log(lokasi_id)
		return this.http.get(`${this.apiUrl}/HrmsApprovallSettingPengajuanCuti/getByLokasiKodeKaryawan/${lokasi_id}/${kode}/${karyawan_id}`);
	}
	create(akun: any) {
		return this.http.post(`${this.apiUrl}/HrmsApprovallSettingPengajuanCuti`, akun,

    );
	}

	update(id:any,HrmsApprovallSettingPengajuanCuti: any) {
		return this.http.put(`${this.apiUrl}/HrmsApprovallSettingPengajuanCuti/${id}`, HrmsApprovallSettingPengajuanCuti);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/HrmsApprovallSettingPengajuanCuti/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/HrmsApprovallSettingPengajuanCuti/${id}`);
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
			return this.http.get<any>(`${this.apiUrl}/HrmsApprovallSettingPengajuanCuti/print_slip/${id}`,httpOptions);
		}
}
