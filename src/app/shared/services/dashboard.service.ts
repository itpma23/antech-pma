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

@Injectable({
	providedIn: 'root'
})

export class DashboardService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	// getDataSiswa(id) {
	// 	return this.http.get<any[]>(`${this.apiUrl}/dashboard/siswa/${id}`);
	// }
  // getDataPengajar() {
	// 	return this.http.get<any[]>(`${this.apiUrl}/dashboard/pengajar`);
	// }
  getDashboardSetting(){
    return this.http.get<any[]>(`${this.apiUrl}/dashboard/getDashboardSetting`);
  }
  updateDashboardSetting(data){
    return this.http.post(`${this.apiUrl}/dashboard/updateDashboardSetting`, data,);
  }
  getDataAdmin() {
    // return []
		return this.http.get<any[]>(`${this.apiUrl}/dashboard/admin`);
	}
  getPksStokTangki() {
    // return []
		return this.http.get<any[]>(`${this.apiUrl}/dashboard/pks_stok_tangki`);
	}
  getPksPenerimaanTBSHarian(param) {
    // return []
		return this.http.get<any[]>(`${this.apiUrl}/dashboard/pks_pemerimaan_tbs_harian/${param}`);
	}
  getPksPengirimanCPOSHarian(param) {
    // return []
		return this.http.get<any[]>(`${this.apiUrl}/dashboard/pks_pengiriman_cpo_harian/${param}`);
	}
  geJumlahKaryawan() {
    // return []
		return this.http.get<any[]>(`${this.apiUrl}/dashboard/hrms_jumlah_karyawan`);
	}

  getPanenHarian(param) {
    // return []
		return this.http.get<any[]>(`${this.apiUrl}/dashboard/estate_panen_afdeling_harian/${param}`);
	}
  getCurahHujanHarian(param) {
		return this.http.get<any[]>(`${this.apiUrl}/dashboard/estate_curah_hujan_harian/${param}`);
	}
  getPanenPerbulan(param) {
    // return []
		return this.http.get<any[]>(`${this.apiUrl}/dashboard/estate_panen_perbulan/${param}`);
	}
  getHkPanenPerbulan(param) {
    // return []
		return this.http.get<any[]>(`${this.apiUrl}/dashboard/estate_hk_panen_perbulan/${param}`);
	}
  getHkPemeliharaanPerbulan(param) {
    // return []
		return this.http.get<any[]>(`${this.apiUrl}/dashboard/estate_hk_pemeliharaan_perbulan/${param}`);
	}
  getHkAllAfdelingPerbulan(param) {
    // return []
		return this.http.get<any[]>(`${this.apiUrl}/dashboard/estate_hk_all_afdeling_perbulan/${param}`);
	}
  getPemakaianSolarPerbulan(param) {
    // return []
		return this.http.get<any[]>(`${this.apiUrl}/dashboard/trk_pemakaian_solar_perbulan/${param}`);
	}
  getTbsOlah(param) {
    // return []
		return this.http.get<any[]>(`${this.apiUrl}/dashboard/pks_tbs_olah/${param}`);
	}
  getPenerimaanTbsBySupp(param) {
    // return []
		return this.http.get<any[]>(`${this.apiUrl}/dashboard/pks_pemerimaan_tbs_harian_by_supp/${param}`);
	}
}
