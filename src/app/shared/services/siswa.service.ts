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
import { Siswa } from '../models/siswa.model';

@Injectable({
	providedIn: 'root'
})

export class SiswaService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<any[]>(`${this.apiUrl}/siswa/getAll`);
	}

	getById(id: number) {
		return this.http.get(`${this.apiUrl}/siswa/${id}`);
	}

  updateStatus(status:any,siswa: any) {
    let data={status_id:status,siswa_id:siswa}
		return this.http.post(`${this.apiUrl}/siswa/update_status`, data,

    );
	}
	create(siswa: any) {
		return this.http.post(`${this.apiUrl}/siswa`, siswa,
    // { headers: new HttpHeaders({
    //   'Content-Type': 'multipart/form-data',
    //   'NAMADB': 'testing',
    //   'NAMAPATH':'Testing',
    //   'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT, DELETE',
    //   'Access-Control-Allow-Headers' : 'Content-Type, Origin, Authorization'
    // })}
    );
	}

	update(id:any,siswa: any) {
		return this.http.put(`${this.apiUrl}/siswa/${id}`, siswa);
	}
  pindahKelas(siswa_id:any,kelas_id: any) {
    let data={"siswa_id":siswa_id,"kelas_id":kelas_id}
		return this.http.post(`${this.apiUrl}/siswa/pindah_kelas`, data);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/siswa/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/siswa/${id}`);
	}

	import(file: any) {
		return this.http.post(`${this.apiUrl}/siswa/import`, file,

    );
	}
}
