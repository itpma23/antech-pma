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
import { HrmsJabatan } from '../models/hrms_jabatan.model';

@Injectable({
	providedIn: 'root'
})

export class HrmsJabatanService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<HrmsJabatan[]>(`${this.apiUrl}/hrmsJabatan/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/hrmsJabatan/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/hrmsJabatan`, akun,

    );
	}

	update(id:any,hrmsJabatan: any) {
		return this.http.put(`${this.apiUrl}/hrmsJabatan/${id}`, hrmsJabatan);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/hrmsJabatan/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/hrmsJabatan/${id}`);
	}


}
