import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
// import { TranslateService } from '@ngx-translate/core';
// import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user.model';
import { SERVER_API_URL } from '../../app.constants';
import { Pilihan } from '../models/pilihan.model';


@Injectable({
	providedIn: 'root'
})

export class PilihanService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<Pilihan[]>(`${this.apiUrl}/pilihan`);
	}

	getById(id: number) {
		return this.http.get(`${this.apiUrl}/tugas/pilihan/${id}`);
	}

	create(pilihan: any) {
		return this.http.post(`${this.apiUrl}/tugas/pilihan`, pilihan,
    // { headers: new HttpHeaders({
    //   'Content-Type': 'multipart/form-data',
    //   'NAMADB': 'testing',
    //   'NAMAPATH':'Testing',
    //   'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT, DELETE',
    //   'Access-Control-Allow-Headers' : 'Content-Type, Origin, Authorization'
    // })}
    );
	}

	update(id:any,pilihan: any) {
		return this.http.put(`${this.apiUrl}/tugas/pilihan/${id}`, pilihan);
	}

  kunci_pilihan(pilihan: any) {
		return this.http.put(`${this.apiUrl}/tugas/kunci_pilihan`, pilihan);
	}



	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/tugas/pilihan/${id}`);
	}


}
