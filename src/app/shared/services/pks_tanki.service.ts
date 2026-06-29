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
import { PksTanki } from '../models/pks_tanki.model';

@Injectable({
	providedIn: 'root'
})

export class PksTankiService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<PksTanki[]>(`${this.apiUrl}/pksTanki/getAll`);
	}
	getAllDetail(id: number) {
		return this.http.get<PksTanki[]>(`${this.apiUrl}/pksTanki/getAllDetail/${id}`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/pksTanki/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/pksTanki`, akun,);
	}
	delete(id: number) {
		let data={"id":id.toString()};
			return this.http.delete(`${this.apiUrl}/pksTanki/${id}`);
		}
	update(id:any,pksTanki: any) {
		return this.http.put(`${this.apiUrl}/pksTanki/${id}`, pksTanki);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/pksTanki/edit_picture/${id}`, file);
	}
  getLaporanRekapSaldo(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/pdf',
         'Accept' : 'application/pdf',
      }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/pksTanki/laporan_rekap_stok`, data,httpOptions);
	}
  getLaporanKartuStok(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/pdf',
         'Accept' : 'application/pdf',
      }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/pksTanki/laporan_kartu_stok`, data,httpOptions);
	}





	

  getPdfSlip(id) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/pdf',
        // 'Authorization' : this.authKey,
         'Accept' : 'application/pdf',
        // 'NAMADB': 'testing',
        // 'NAMAPATH': 'Testing'
        //observe : 'response'
      }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.get<any>(`${this.apiUrl}/pksTanki/print_slip/${id}`,httpOptions);
	}
}
