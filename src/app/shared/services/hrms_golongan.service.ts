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
import { HrmsGolongan } from '../models/hrms_golongan.model';

@Injectable({
	providedIn: 'root'
})

export class HrmsGolonganService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<HrmsGolongan[]>(`${this.apiUrl}/hrmsGolongan/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/hrmsGolongan/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/hrmsGolongan`, akun,

    );
	}

	update(id:any,hrmsGolongan: any) {
		return this.http.put(`${this.apiUrl}/hrmsGolongan/${id}`, hrmsGolongan);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/hrmsGolongan/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/hrmsGolongan/${id}`);
	}


}
