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
import { HrmsKaryawanGaji } from '../models/hrms_karyawan_gaji.model';

@Injectable({
	providedIn: 'root'
})

export class HrmsKaryawanGajiService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<HrmsKaryawanGaji[]>(`${this.apiUrl}/hrmsKaryawan/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/hrmsKaryawangaji/${id}`);
	}

	create(data: any) {
		return this.http.post(`${this.apiUrl}/hrmsKaryawangaji`, data,

    );
	}

	update(id:any,hrmsKaryawan: any) {
		return this.http.put(`${this.apiUrl}/hrmsKaryawangaji/${id}`, hrmsKaryawan);
	}
  getGajiPerhari(karyawan_id, tanggal) {
    // console.log(id_tahun_ajaran);
		return this.http.get(`${this.apiUrl}/hrmsKaryawangaji/getGajiPerHariHke/${karyawan_id}/${tanggal}`);
	}
  getViewProses(tahun: number) {
    // console.log(id_tahun_ajaran);
		return this.http.get(`${this.apiUrl}/hrmsKaryawangaji/view_proses/${tahun}`);
	}
  startProses(id) {
    let data={id:id}

    console.log(data);
		return this.http.post(`${this.apiUrl}/hrmsKaryawangaji/start_proses_payroll`,data);
	}
  startProsesByAfdeling(data) {

    console.log(data);
		return this.http.post(`${this.apiUrl}/hrmsKaryawangaji/start_proses_payroll`,data);
	}
  startPostingGaji(id) {
    let data={id:id}
    console.log(data);
		return this.http.post(`${this.apiUrl}/hrmsKaryawangaji/start_posting_payroll`,data);
	}
  startPostingBpjsKesehatan(id) {
    let data={id:id}
    console.log(data);
		return this.http.post(`${this.apiUrl}/hrmsKaryawangaji/start_posting_payroll_bpjs_kesehatan`,data);
	}
  startPostingJamsostek(id) {
    let data={id:id}
    console.log(data);
		return this.http.post(`${this.apiUrl}/hrmsKaryawangaji/start_posting_payroll_jamsostek`,data);
	}
  startPostingCatuBeras(id) {
    let data={id:id}
    console.log(data);
		return this.http.post(`${this.apiUrl}/hrmsKaryawangaji/start_posting_payroll_catu_beras`,data);
	}
  startUnPostingGaji(id) {
    let data={id:id}
    console.log(data);
		return this.http.post(`${this.apiUrl}/hrmsKaryawangaji/start_unposting_payroll`,data);
	}
  startUnPostingBpjsKesehatan(id) {
    let data={id:id}
    console.log(data);
		return this.http.post(`${this.apiUrl}/hrmsKaryawangaji/start_unposting_payroll_bpjs_kesehatan`,data);
	}
  startUnPostingJamsostek(id) {
    let data={id:id}
    console.log(data);
		return this.http.post(`${this.apiUrl}/hrmsKaryawangaji/start_unposting_payroll_jamsostek`,data);
	}
  startUnPostingCatuBeras(id) {
    let data={id:id}
    console.log(data);
		return this.http.post(`${this.apiUrl}/hrmsKaryawangaji/start_unposting_payroll_catu_beras`,data);
	}
  getRekapAbsensiKebun(data: any) {
    if (data['format_laporan']=='xls'){
      const httpOptions = {
        'responseType' : 'blob' as 'json'
      };
      return this.http.post(`${this.apiUrl}/hrmsKaryawangaji/getRekapAbsensiKebun`, data, httpOptions );
    }else{
      return this.http.post(`${this.apiUrl}/hrmsKaryawangaji/getRekapAbsensiKebun`, data );
    }

	}
  getLaporanGaji(id,jenis) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		// return this.http.post(`${this.apiUrl}/hrmsKaryawangaji/laporan_gaji/${id}/${jenis}`, null,httpOptions);
		return this.http.post(`${this.apiUrl}/hrmsKaryawangaji/laporan_gaji/${id}`, jenis, httpOptions);
	}
  getLaporanKartuStok(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/pdf',
         'Accept' : 'application/pdf',
      }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/invTransaksi/laporan_kartu_stok`, data,httpOptions);
	}

	delete(id: number) {
		return this.http.delete(`${this.apiUrl}/hrmsKaryawangaji/${id}`);
	}


}
