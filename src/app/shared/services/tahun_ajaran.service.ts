import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
// import { TranslateService } from '@ngx-translate/core';
// import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_API_URL } from 'src/app/app.constants';
import { TahunAjaran } from '../models/tahun_ajaran.model';

@Injectable({
	providedIn: 'root'
})

export class TahunAjaranService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<TahunAjaran[]>(`${this.apiUrl}/tahunAjaran/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/tahunAjaran/${id}`);
	}

	create(tahunAjaran: any) {
		return this.http.post(`${this.apiUrl}/tahunAjaran`, tahunAjaran,

    );
	}

	update(id:any,tahunAjaran: any) {
		return this.http.put(`${this.apiUrl}/tahunAjaran/${id}`, tahunAjaran);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/tahunAjaran/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/tahunAjaran/${id}`);
	}


}
