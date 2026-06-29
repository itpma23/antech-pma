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
import { EstBibit } from '../models/est_bibit.model';

@Injectable({
	providedIn: 'root'
})

export class EstBibitService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<EstBibit[]>(`${this.apiUrl}/estBibit/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/estBibit/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/estBibit`, akun,

    );
	}

	update(id:any,estBibit: any) {
		return this.http.put(`${this.apiUrl}/estBibit/${id}`, estBibit);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/estBibit/${id}`);
	}


}
