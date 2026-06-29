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
import { InvTransaksi } from '../models/inv_transaksi.model';

@Injectable({
	providedIn: 'root'
})

export class InvTransaksiService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<InvTransaksi[]>(`${this.apiUrl}/invTransaksi/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/invTransaksi/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/invTransaksi`, akun,

    );
	}

	update(id:any,invTransaksi: any) {
		return this.http.put(`${this.apiUrl}/invTransaksi/${id}`, invTransaksi);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/invTransaksi/edit_picture/${id}`, file);
	}
  getLaporanRekapSaldo(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/pdf',
         'Accept' : 'application/pdf',
      }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/invTransaksi/laporan_rekap_stok`, data,httpOptions);
	}
  getLaporanKartuStok(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/pdf',
         'Accept' : 'application/pdf',
      }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/invTransaksi/laporan_kartu_stok`, data,httpOptions);
	}





	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/invTransaksi/${id}`);
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
		return this.http.get<any>(`${this.apiUrl}/invTransaksi/print_slip/${id}`,httpOptions);
	}
}
