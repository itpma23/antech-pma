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
import { Pengumuman } from '../models/pengumuman.model';

@Injectable({
	providedIn: 'root'
})

export class PengumumanService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<Pengumuman[]>(`${this.apiUrl}/pengumuman`);
	}

	getById(id: number) {
		return this.http.get(`${this.apiUrl}/pengumuman/${id}`);
	}

	create(pengumuman: any) {
		return this.http.post(`${this.apiUrl}/pengumuman`, pengumuman,
			// {
			// 	headers: new HttpHeaders({
			// 		'Content-Type': 'multipart/form-data',
			// 		'NAMADB': 'testing',
			// 		'NAMAPATH': 'Testing',
			// 		'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
			// 		'Access-Control-Allow-Headers': 'Content-Type, Origin, Authorization'
			// 	})
			// }
		);
	}

	update(id: any, pengumuman: any) {
		return this.http.put(`${this.apiUrl}/pengumuman/${id}`, pengumuman);
	}
	updatePhoto(id: any, file: any) {
		return this.http.post(`${this.apiUrl}/pengumuman/sampul/${id}`, file);
	}


	delete(id: number) {
		let data = { "id": id.toString() };
		return this.http.delete(`${this.apiUrl}/pengumuman/${id}`);
	}


}
