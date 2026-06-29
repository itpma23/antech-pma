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
import { Karyawan } from '../models/karyawan.model';

@Injectable({
	providedIn: 'root'
})

export class KaryawanService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<Karyawan[]>(`${this.apiUrl}/karyawan/getAll`);
	}
	getAllAktif() {
		return this.http.get<Karyawan[]>(`${this.apiUrl}/karyawan/getAllAktif`);
	}
  getAllAktifEstate() {
		return this.http.get<Karyawan[]>(`${this.apiUrl}/karyawan/getAllAktifEstate`);
	}
  getByLokasiTugas(orgId) {
		return this.http.get<Karyawan[]>(`${this.apiUrl}/karyawan/getByLokasiTugas/${orgId}`);
	}
  getAllAktifByDivisi(orgId,tgl) {
		return this.http.get<Karyawan[]>(`${this.apiUrl}/karyawan/getAllAktifKaryawanByDivisi/${orgId}/${tgl}`);
	}
	getById(id: number) {
		return this.http.get(`${this.apiUrl}/karyawan/${id}`);
	}




  updateStatus(status:any,karyawan: any) {
    let data={status_id:status,karyawan_id:karyawan}
		return this.http.post(`${this.apiUrl}/karyawan/update_status`, data,

    );
	}
	create(karyawan: any) {
		return this.http.post(`${this.apiUrl}/karyawan`, karyawan,

    );
	}

	update(id:any,karyawan: any) {
		return this.http.put(`${this.apiUrl}/karyawan/${id}`, karyawan);
	}
  update_riwayat_keluarga(id:any,karyawan: any) {
		return this.http.post(`${this.apiUrl}/karyawan/simpan_riwayat_keluarga/${id}`, karyawan);
	}
  update_riwayat_bahasa(id:any,karyawan: any) {
		return this.http.post(`${this.apiUrl}/karyawan/simpan_riwayat_bahasa/${id}`, karyawan);
	}
  update_riwayat_jabatan(id:any,karyawan: any) {
		return this.http.post(`${this.apiUrl}/karyawan/simpan_riwayat_jabatan/${id}`, karyawan);
	}
  update_riwayat_pangkat(id:any,karyawan: any) {
		return this.http.post(`${this.apiUrl}/karyawan/simpan_riwayat_pangkat/${id}`, karyawan);
	}
  update_riwayat_penghargaan(id:any,karyawan: any) {
		return this.http.post(`${this.apiUrl}/karyawan/simpan_riwayat_penghargaan/${id}`, karyawan);
	}
  update_riwayat_hukuman(id:any,karyawan: any) {
		return this.http.post(`${this.apiUrl}/karyawan/simpan_riwayat_hukuman/${id}`, karyawan);
	}
  update_riwayat_pendidikan(id:any,karyawan: any) {
		return this.http.post(`${this.apiUrl}/karyawan/simpan_riwayat_pendidikan/${id}`, karyawan);
	}
  update_riwayat_keahlian(id:any,karyawan: any) {
		return this.http.post(`${this.apiUrl}/karyawan/simpan_riwayat_keahlian/${id}`, karyawan);
	}
  update_riwayat_pengalaman(id:any,karyawan: any) {
		return this.http.post(`${this.apiUrl}/karyawan/simpan_riwayat_pengalaman/${id}`, karyawan);
	}
  update_riwayat_pelatihan(id:any,karyawan: any) {
		return this.http.post(`${this.apiUrl}/karyawan/simpan_riwayat_pelatihan/${id}`, karyawan);
	}
  updateJadwal(id:any,jadwal: any) {
		return this.http.post(`${this.apiUrl}/karyawan/update_jadwal/${id}`, jadwal);
	}
  createJadwal(jadwal) {
		return this.http.post(`${this.apiUrl}/karyawan/simpan_jadwal`, jadwal);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/karyawan/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/karyawan/${id}`);
	}
  getDetailPdf(id) {
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
		return this.http.get<any>(`${this.apiUrl}/karyawan/printDetail/${id}`,httpOptions);
	}
	SaldoCuti(data) {
		const httpOptions = {
		  // headers: new HttpHeaders({
		  //   'Content-Type':  'application/pdf',
		  //    'Accept' : 'application/pdf',
		  // }),
		  'responseType' : 'blob' as 'json'
		};
			return this.http.post(`${this.apiUrl}/karyawan/SaldoCuti`, data,httpOptions);
		}

  getLaporanKaryawan(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
       'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/karyawan/laporan_karyawan`, data,httpOptions);
	}

}
