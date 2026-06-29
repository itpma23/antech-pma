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
import { HrmsDepartemen } from '../models/hrms_departemen.model';

@Injectable({
	providedIn: 'root'
})

export class HrmsDepartemenService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<HrmsDepartemen[]>(`${this.apiUrl}/hrmsDepartemen/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/hrmsDepartemen/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/hrmsDepartemen`, akun,

    );
	}

	update(id:any,hrmsDepartemen: any) {
		return this.http.put(`${this.apiUrl}/hrmsDepartemen/${id}`, hrmsDepartemen);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/hrmsDepartemen/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/hrmsDepartemen/${id}`);
	}


}
