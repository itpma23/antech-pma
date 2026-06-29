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
import { Mahasiswa } from '../models/mahasiswa.model';

@Injectable({
	providedIn: 'root'
})

export class MahasiswaService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<Mahasiswa[]>(`${this.apiUrl}/mahasiswa/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/mahasiswa/${id}`);
	}

	create(data: any) {
		return this.http.post(`${this.apiUrl}/mahasiswa`, data,

    );
	}

	update(id:any,data: any) {
		return this.http.put(`${this.apiUrl}/mahasiswa/${id}`, data);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/mahasiswa/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/mahasiswa/${id}`);
	}


}
