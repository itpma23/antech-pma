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
import { MataUang } from '../models/acc_matauang.model';

@Injectable({
	providedIn: 'root'
})

export class AccMatauangService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<MataUang[]>(`${this.apiUrl}/accMatauang/getAll`);
	}
  getAllDetail() {
		return this.http.get<MataUang[]>(`${this.apiUrl}/accMatauang/getAllDetail`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/accMatauang/${id}`);
	}

	create(MataUang: any) {
		return this.http.post(`${this.apiUrl}/accMatauang`, MataUang,

    );
	}

	update(id:any,MataUang: any) {
		return this.http.put(`${this.apiUrl}/accMatauang/${id}`, MataUang);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/accMatauang/${id}`);
	}


}
