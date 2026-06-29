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
import { Piutang } from '../models/piutang.model';

@Injectable({
	providedIn: 'root'
})

export class PiutangService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<Piutang[]>(`${this.apiUrl}/piutang/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/piutang/piutang_siswa/${id}`);
	}

  getBySiswaId(siswa_id: number) {
		return this.http.get(`${this.apiUrl}/piutang/piutang_list_by_siswa/${siswa_id}`);
	}
	getLaporanPiutang(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/pdf',
         'Accept' : 'application/pdf',
      }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/piutang/laporan_piutang`, data,httpOptions);
	}
  getLaporanPiutangJatuhTempo(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/pdf',
         'Accept' : 'application/pdf',
      }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/piutang/laporan_piutang_jatuhtempo`, data,httpOptions);
	}
  getViewProses(id_tahun_ajaran: number) {
    // console.log(id_tahun_ajaran);
		return this.http.get(`${this.apiUrl}/piutang/view_process_piutang/${id_tahun_ajaran}`);
	}
  startProses(id_tahun_ajaran: number,kelas_id:number) {
    let data={id_tahun_ajaran:id_tahun_ajaran,kelas_id:kelas_id}
    console.log(data);
		return this.http.post(`${this.apiUrl}/piutang/start_proses_piutang`,data);
	}

	create(piutang: any) {
		return this.http.post(`${this.apiUrl}/piutang/add_piutang_siswa`, piutang,

    );
	}


	update(id:any,piutang: any) {
		return this.http.post(`${this.apiUrl}/piutang/update_piutang_siswa/${id}`, piutang);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/piutang/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/piutang/delete_piutang_siswa/${id}`);
	}


}
