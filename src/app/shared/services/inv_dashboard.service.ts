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
import { InvGudang } from '../models/inv_gudang.model';
import { InvDashboard } from '../models/inv_dashboard.model';

@Injectable({
	providedIn: 'root'
})

export class InvDashboardService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getCountInvTransaksi(data: InvDashboard) {
		return this.http.post<any>(`${this.apiUrl}/InvDashboard/getCountInvTransaksi`, data);
	}



}
