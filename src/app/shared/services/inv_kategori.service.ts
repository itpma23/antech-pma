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
import { Akun } from '../models/akun.model';
import { InvKategori } from '../models/inv_kategori.model';

@Injectable({
	providedIn: 'root'
})

export class InvKategoriService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<InvKategori[]>(`${this.apiUrl}/invKategori/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/invKategori/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/invKategori`, akun,

    );
	}

	update(id:any,invKategori: any) {
		return this.http.put(`${this.apiUrl}/invKategori/${id}`, invKategori);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/invKategori/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/invKategori/${id}`);
	}


}
