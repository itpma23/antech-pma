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
import { PksShift } from '../models/pks_shift.model';

@Injectable({
	providedIn: 'root'
})

export class PksShiftService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<PksShift[]>(`${this.apiUrl}/pksShift/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/pksShift/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/pksShift`, akun,

    );
	}

	update(id:any,pksShift: any) {
		return this.http.put(`${this.apiUrl}/pksShift/${id}`, pksShift);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/pksShift/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/pksShift/${id}`);
	}


}
