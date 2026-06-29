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
import { Piutang } from '../models/piutang.model';
import { BayarPiutang } from '../models/bayar-piutang.model';

@Injectable({
	providedIn: 'root'
})

export class BayarPiutangService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<BayarPiutang[]>(`${this.apiUrl}/piutang/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/piutang/bayar_piutang/${id}`);
	}

  getBySiswaId(siswa_id: number) {
		return this.http.get(`${this.apiUrl}/piutang/bayar_piutang_list_by_siswa/${siswa_id}`);
	}

	create(bayar_piutang: any) {
		return this.http.post(`${this.apiUrl}/piutang/add_bayar_piutang`, bayar_piutang,

    );
	}

	update(id:any,bayar_piutang: any) {
		return this.http.post(`${this.apiUrl}/piutang/update_bayar_piutang/${id}`, bayar_piutang);
	}



	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/piutang/delete_bayar_piutang/${id}`);
	}
  getLaporanPembayaran(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/pdf',
         'Accept' : 'application/pdf',
      }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/piutang/laporan_pembayaran`, data,httpOptions);
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
		return this.http.get<any>(`${this.apiUrl}/piutang/print_bayar_slip/${id}`,httpOptions);
	}

}
