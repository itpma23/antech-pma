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
import { HrmsPangkat } from '../models/hrms_pangkat.model';

@Injectable({
	providedIn: 'root'
})

export class HrmsPangkatService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<HrmsPangkat[]>(`${this.apiUrl}/hrmsPangkat/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/hrmsPangkat/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/hrmsPangkat`, akun,

    );
	}

	update(id:any,hrmspangkat: any) {
		return this.http.put(`${this.apiUrl}/hrmsPangkat/${id}`, hrmspangkat);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/hrmsPangkat/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/hrmsPangkat/${id}`);
	}


}
