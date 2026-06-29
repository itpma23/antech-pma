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
import { EstBkmUmum } from '../models/est_bkm_umum.model';

@Injectable({
	providedIn: 'root'
})

export class EstBkmUmumService {

	private apiUrl = SERVER_API_URL;
	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<EstBkmUmum[]>(`${this.apiUrl}/estBkmUmum/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/estBkmUmum/${id}`);
	}

	create(data: any) {
		return this.http.post(`${this.apiUrl}/estBkmUmum`, data,

    );
	}
	hitungPremiMandorKerani(data: any) {
		return this.http.post(`${this.apiUrl}/estBkmUmum/hitungPremiMandorKerani`, data,

    );
	}

	update(id:any,estBkmpanen: any) {
		return this.http.put(`${this.apiUrl}/estBkmUmum/${id}`, estBkmpanen);
	}
  posting(id:any,data: any) {
		return this.http.post(`${this.apiUrl}/estBkmUmum/posting/${id}`, data);
	}
  posting_tanggal(data: any) {
    let lokasi_id=data['lokasi_id'];
    let t1=data['tgl_mulai'];
     let t2=data['tgl_akhir'];
		return this.http.post(`${this.apiUrl}/estBkmUmum/posting_batch/${lokasi_id}/${t1}/${t2}`, data);
	}
	hitungPremi(data: any) {
		return this.http.post(`${this.apiUrl}/estBkmUmum/hitungPremi`, data,

    );
	}
  listBkmUmum(data: any) {
    if (data['format_laporan']=='xls'){
      const httpOptions = {
        'responseType' : 'blob' as 'json'
      };
      return this.http.post(`${this.apiUrl}/estBkmUmum/listBkmUmum`, data, httpOptions );
    }

	}
  listBkmUmumDetail(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'
    };
		return this.http.post(`${this.apiUrl}/estBkmUmum/listBkmUmumDetail`, data,httpOptions);
	}

 getLaporanUmumdetail(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/estBkmUmum/laporan_umum`, data,httpOptions);
	}
  getLaporanPanenPerkaryawan(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/estBkmUmum/laporan_panen_perkaryawan`, data,httpOptions);
	}
  getLaporanPanenPerbulan(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/estBkmUmum/laporan_panen_perbulan`, data,httpOptions);
	}
  getLaporanRekap(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/pdf',
         'Accept' : 'application/pdf',
      }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/estBkmUmum/laporan_rekap_stok`, data,httpOptions);
	}






	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/estBkmUmum/${id}`);
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
		return this.http.get<any>(`${this.apiUrl}/estBkmUmum/print_slip/${id}`,httpOptions);
	}
      calculateHk(id: number){
      return this.http.post(`${this.apiUrl}/estBkmUmum/recalculate_hk_umum/${id}`, {});
  }
}
