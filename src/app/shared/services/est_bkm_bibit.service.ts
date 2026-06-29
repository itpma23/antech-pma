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
import { EstBkmBibit } from '../models/est_bkm_pemeliharaan.model';

@Injectable({
	providedIn: 'root'
})

export class EstBkmBibitService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<EstBkmBibit[]>(`${this.apiUrl}/EstBkmBibit/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/EstBkmBibit/${id}`);
	}

	create(data: any) {
		return this.http.post(`${this.apiUrl}/EstBkmBibit`, data,

    );
	}

	update(id:any,EstBkmBibit: any) {
		return this.http.put(`${this.apiUrl}/EstBkmBibit/${id}`, EstBkmBibit);
	}
	hitungPremi(data: any) {
		return this.http.post(`${this.apiUrl}/EstBkmBibit/hitungPremi`, data,

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
		return this.http.post(`${this.apiUrl}/EstBkmBibit/laporan_rekap_stok`, data,httpOptions);
	}

	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/EstBkmBibit/${id}`);
	}
  posting(id:any,data: any) {
		return this.http.post(`${this.apiUrl}/EstBkmBibit/posting/${id}`, data);
	}
  posting_tanggal(data: any) {
    let lokasi_id=data['lokasi_id'];
    let t1=data['tgl_mulai'];
     let t2=data['tgl_akhir'];
		return this.http.post(`${this.apiUrl}/EstBkmBibit/posting_batch/${lokasi_id}/${t1}/${t2}`, data);
	}
  listBkmPemeliharaan(data: any) {
    if (data['format_laporan']=='xls'){
      const httpOptions = {
        'responseType' : 'blob' as 'json'
      };
      return this.http.post(`${this.apiUrl}/EstBkmBibit/listBkmPemeliharaan`, data, httpOptions );
    }

	}
  listBkmPemeliharaanDetail(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'
    };
		return this.http.post(`${this.apiUrl}/EstBkmBibit/listBkmPemeliharaanDetail`, data,httpOptions);
	}
  getLaporanPemeliharaandetail(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/EstBkmBibit/laporan_bibitan_detail`, data,httpOptions);
	}
  getLaporanPemeliharaanPerbulan(data) {
    const httpOptions = {

      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/EstBkmBibit/laporan_bibitan_perbulan`, data,httpOptions);
    // return this.http.post(`${this.apiUrl}/EstBkmBibit/laporan_pemeliharaan_perbulan`, data);
	}

  getRekapMandorKeraniPml(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/EstBkmBibit/rekap_mandor_kerani_pemeliharaan`, data,httpOptions);
	}

  getLaporanBahan(data) {
		const httpOptions = {
		  // headers: new HttpHeaders({
		  //   'Content-Type':  'application/pdf',
		  //    'Accept' : 'application/pdf',
		  // }),
		  'responseType' : 'blob' as 'json'

		};
			return this.http.post(`${this.apiUrl}/EstBkmBibit/laporan_bahan`, data,httpOptions);
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
		return this.http.get<any>(`${this.apiUrl}/EstBkmBibit/print_slip/${id}`,httpOptions);
	}

    calculateHk(id: number){
      return this.http.post(`${this.apiUrl}/EstBkmBibit/recalculate_hk_pemeliharaan/${id}`, {});
  }
}
