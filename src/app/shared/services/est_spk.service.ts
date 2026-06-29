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
import { EstSpk } from '../models/est_spk.model';

@Injectable({
	providedIn: 'root'
})

export class EstSpkService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}
	closing(id:any,data: any) {
		return this.http.post(`${this.apiUrl}/EstSpk/closing/${id}`, data);
	}
	getPrice(spk_id:any,blok_id: any,kegiatan_id) {
   let data={spk_id:spk_id,blok_id:blok_id,kegiatan_id:kegiatan_id}
   console.log(data)
		return this.http.post(`${this.apiUrl}/EstSpk/getPrice`, data);
	}

	getAll() {
		return this.http.get<EstSpk[]>(`${this.apiUrl}/EstSpk/getAll`);
	}

	getAllPosted() {
		return this.http.get<EstSpk[]>(`${this.apiUrl}/EstSpk/getAllPosted`);
	}

	getById(id: number) {
		return this.http.get(`${this.apiUrl}/EstSpk/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/EstSpk`, akun,

    );
	}

	update(id:any,EstSpk: any) {
		return this.http.put(`${this.apiUrl}/EstSpk/${id}`, EstSpk);
	}
  posting(id:any,data: any) {
		return this.http.post(`${this.apiUrl}/EstSpk/posting/${id}`, data);
	}
	hitungPremi(data: any) {
		return this.http.post(`${this.apiUrl}/EstSpk/hitungPremi`, data,

    );
	}
  getLaporanRekap(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/pdf',
         'Accept' : 'application/pdf',
      }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/EstSpk/laporan_rekap`, data,httpOptions);
	}






	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/EstSpk/${id}`);
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
		return this.http.get<any>(`${this.apiUrl}/EstSpk/print_slip/${id}`,httpOptions);
	}

	getReportDetail(data) {
		const httpOptions = {
			// headers: new HttpHeaders({
			//   'Content-Type':  'application/pdf',
			//    'Accept' : 'application/pdf',
			// }),
			'responseType' : 'blob' as 'json'
		};
		return this.http.post(`${this.apiUrl}/EstSpk/laporan_detail`, data,httpOptions);
	}

}
