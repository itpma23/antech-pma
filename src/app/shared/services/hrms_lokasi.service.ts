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
import { HrmsLokasi } from '../models/hrms_lokasi.model';

@Injectable({
	providedIn: 'root'
})

export class HrmsLokasiService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<HrmsLokasi[]>(`${this.apiUrl}/hrmsLokasi/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/hrmsLokasi/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/hrmsLokasi`, akun,

    );
	}

	update(id:any,hrmsLokasi: any) {
		return this.http.put(`${this.apiUrl}/hrmsLokasi/${id}`, hrmsLokasi);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/hrmsLokasi/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/hrmsLokasi/${id}`);
	}


}
