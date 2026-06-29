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
import { PksLhp } from '../models/pks_lhp.model';

@Injectable({
	providedIn: 'root'
})

export class PksLhpService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<PksLhp[]>(`${this.apiUrl}/pksLhp/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/pksLhp/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/pksLhp`, akun,

    );
	}

	update(id:any,pksLhp: any) {
		return this.http.put(`${this.apiUrl}/pksLhp/${id}`, pksLhp);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/pksLhp/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/pksLhp/${id}`);
	}


	getPdfSlip(id) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/pdf',
        'Accept' : 'application/pdf',
      }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.get<any>(`${this.apiUrl}/pksLhp/print_slip/${id}`,httpOptions);
	}

  getLaporanRekapLhp(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
       'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/PksLhp/laporan_rekap_lhp`, data,httpOptions);
	}
  getProduksiHarian(data: any) {
		return this.http.post(`${this.apiUrl}/PksLhp/proses_hitung_lhp_perhari`, data,

    );
	}
}
