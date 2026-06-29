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
import { PiutangSetting } from '../models/piutang_setting.model';

@Injectable({
	providedIn: 'root'
})

export class PiutangSettingService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<PiutangSetting[]>(`${this.apiUrl}/piutang/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/piutang/piutang_setting/${id}`);
	}

	create(piutang: any) {
		return this.http.post(`${this.apiUrl}/piutang/add_piutang_setting`, piutang,

    );
	}

	update(id:any,piutang: any) {
		return this.http.post(`${this.apiUrl}/piutang/update_piutang_setting/${id}`, piutang);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/piutang/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/piutang/delete_piutang_setting/${id}`);
	}


}
