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
import { EstSpk } from '../models/est_spk.model';
import { EstSpkBA } from '../models/est_spk_ba.model';

@Injectable({
	providedIn: 'root'
})

export class EstSpkBAService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<EstSpkBA[]>(`${this.apiUrl}/EstSpkBA/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/EstSpkBA/${id}`);
	}

	create(data: any) {
		return this.http.post(`${this.apiUrl}/EstSpkBA`, data,

    );
	}

	update(id:any,EstSpkBA: any) {
		return this.http.put(`${this.apiUrl}/EstSpkBA/${id}`, EstSpkBA);
	}
  posting(id:any,data: any) {
		return this.http.post(`${this.apiUrl}/EstSpkBA/posting/${id}`, data);
	}
	hitungPremi(data: any) {
		return this.http.post(`${this.apiUrl}/EstSpkBA/hitungPremi`, data,

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
		return this.http.post(`${this.apiUrl}/EstSpkBA/laporan_rekap`, data,httpOptions);
	}



	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/EstSpkBA/${id}`);
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
		return this.http.get<any>(`${this.apiUrl}/EstSpkBA/print_slip/${id}`,httpOptions);
	}

	getReportDetail(data) {
		const httpOptions = {
			// headers: new HttpHeaders({
			//   'Content-Type':  'application/pdf',
			//    'Accept' : 'application/pdf',
			// }),
			'responseType' : 'blob' as 'json'
		};
		return this.http.post(`${this.apiUrl}/EstSpkBA/laporan_detail`, data,httpOptions);
	}
  getAllOutstanding() {
    return this.http.get<EstSpkBA[]>(`${this.apiUrl}/EstSpkBA/getAllOutstandingBayar`);
  }
  getAllAkunPph() {
	return this.http.get(`${this.apiUrl}/EstSpkBA/getAllAkunPPH`);
}
}
