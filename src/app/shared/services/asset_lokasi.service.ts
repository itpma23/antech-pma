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
import { AssetLokasi } from '../models/asset_lokasi.model';

@Injectable({
	providedIn: 'root'
})

export class AssetLokasiService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<AssetLokasi[]>(`${this.apiUrl}/assetLokasi/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/assetLokasi/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/assetLokasi`, akun,

    );
	}

	update(id:any,assetLokasi: any) {
		return this.http.put(`${this.apiUrl}/assetLokasi/${id}`, assetLokasi);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/assetLokasi/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/assetLokasi/${id}`);
	}


}
