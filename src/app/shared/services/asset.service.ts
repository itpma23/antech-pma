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
import { Asset } from '../models/asset.model';

@Injectable({
	providedIn: 'root'
})

export class AssetService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<Asset[]>(`${this.apiUrl}/asset/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/asset/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/asset`, akun,

    );
	}

	update(id:any,asset: any) {
		return this.http.put(`${this.apiUrl}/asset/${id}`, asset);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/asset/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/asset/${id}`);
	}


}
