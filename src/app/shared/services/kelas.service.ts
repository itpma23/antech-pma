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
import { Kelas } from '../models/kelas.model';

@Injectable({
	providedIn: 'root'
})

export class KelasService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAllHirarki() {
		return this.http.get<any>(`${this.apiUrl}/kelas/kelas_all_hirarki`);
	}
  getAllChild() {
		return this.http.get<Kelas[]>(`${this.apiUrl}/kelas/getKelasAllChild`);
	}
  getAllParent() {
		return this.http.get<Kelas[]>(`${this.apiUrl}/kelas/getKelasAllParent`);
	}

  getMapelKelas(kelas_id) {
		return this.http.get<Kelas[]>(`${this.apiUrl}/kelas/get_mapel_kelas/${kelas_id}`);
	}
  getMapelKelasOnly(kelas_id) {
		return this.http.get<Kelas[]>(`${this.apiUrl}/kelas/get_mapel_kelas_only/${kelas_id}`);
	}

  updateMapelKelas(kelas_id,mapel_id,aktif) {
    let data:any={'kelas_id':kelas_id,'mapel_id':mapel_id,'aktif':aktif};
    console.log(data);
		return this.http.post<any>(`${this.apiUrl}/kelas/update_mapel_kelas`,data);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/kelas/${id}`);
	}

	create(kelas: any) {
		return this.http.post(`${this.apiUrl}/kelas`, kelas,

    );
	}

	update(id:any,kelas: any) {
		return this.http.put(`${this.apiUrl}/kelas/${id}`, kelas);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/kelas/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/kelas/${id}`);
	}


}
