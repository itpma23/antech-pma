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
import { PrcPoTTD } from '../models/prc_po_ttd.model';

@Injectable({
	providedIn: 'root'
})

export class PrcPoTTDService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<PrcPoTTD[]>(`${this.apiUrl}/PrcPoTtd/getAll`);
	}
  getAllbyType(tipe) {
		return this.http.get<PrcPoTTD[]>(`${this.apiUrl}/PrcPoTtd/getAllbyType//${tipe}`);
	}
  getAllDetail() {
		return this.http.get<PrcPoTTD[]>(`${this.apiUrl}/PrcPoTtd/getAllDetail`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/PrcPoTtd/${id}`);
	}

	create(PrcPoTTD: any) {
		return this.http.post(`${this.apiUrl}/PrcPoTTD`, PrcPoTTD,

    );
	}

	update(id:any,PrcPoTTD: any) {
		return this.http.put(`${this.apiUrl}/PrcPoTTD/${id}`, PrcPoTTD);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/PrcPoTTD/${id}`);
	}


}
