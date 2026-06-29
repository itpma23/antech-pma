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
import { HrmsTipeKaryawan } from '../models/hrms_tipe_karyawan.model';

@Injectable({
	providedIn: 'root'
})

export class HrmsTipeKaryawanService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<HrmsTipeKaryawan[]>(`${this.apiUrl}/hrmsTipekaryawan/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/hrmsTipekaryawan/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/hrmsTipekaryawan`, akun,

    );
	}

	update(id:any,hrmsTipeKaryawan: any) {
		return this.http.put(`${this.apiUrl}/hrmsTipekaryawan/${id}`, hrmsTipeKaryawan);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/hrmsTipekaryawan/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/hrmsTipekaryawan/${id}`);
	}


}
