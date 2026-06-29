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
import { EstBkmPanen } from '../models/est_bkm_panen.model';

@Injectable({
	providedIn: 'root'
})

export class EstBkmPanenService {

	private apiUrl = SERVER_API_URL;
	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<EstBkmPanen[]>(`${this.apiUrl}/estBkmPanen/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/estBkmPanen/${id}`);
	}

	create(data: any) {
		return this.http.post(`${this.apiUrl}/estBkmPanen`, data,

    );
	}
	hitungPremiMandorKerani(data: any) {
		return this.http.post(`${this.apiUrl}/estBkmPanen/hitungPremiMandorKerani`, data,

    );
	}

	update(id:any,estBkmpanen: any) {
		return this.http.put(`${this.apiUrl}/estBkmPanen/${id}`, estBkmpanen);
	}
  posting(id:any,data: any) {
		return this.http.post(`${this.apiUrl}/estBkmPanen/posting/${id}`, data);
	}
  posting_tanggal(data: any) {
    let lokasi_id=data['lokasi_id'];
    let t1=data['tgl_mulai'];
     let t2=data['tgl_akhir'];
		return this.http.post(`${this.apiUrl}/estBkmPanen/posting_batch/${lokasi_id}/${t1}/${t2}`, data);
	}
	hitungPremi(data: any) {
		return this.http.post(`${this.apiUrl}/estBkmPanen/hitungPremi`, data,

    );
	}
  listBkmPanen(data: any) {
    if (data['format_laporan']=='xls'){
      const httpOptions = {
        'responseType' : 'blob' as 'json'
      };
      return this.http.post(`${this.apiUrl}/estBkmPanen/listBkmPanen`, data, httpOptions );
    }

	}
  listBkmPanenDetail(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'
    };
		return this.http.post(`${this.apiUrl}/estBkmPanen/listBkmPanenDetail`, data,httpOptions);
	}

 getLaporanPanendetail(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/estBkmPanen/laporan_panen_detail`, data,httpOptions);
	}
  getLaporanPanenPerkaryawan(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/estBkmPanen/laporan_panenkaryawan`, data,httpOptions);
	}
  getLaporanPanenPerbulan(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/estBkmPanen/laporan_panen_perbulan`, data,httpOptions);
	}
  getLaporanPanenSensus(data) {
    const httpOptions = {
          'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/estBkmPanen/laporan_panen_sensus`, data,httpOptions);
	}
  getLaporanPanenTaksasi(data) {
    const httpOptions = {
          'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/estBkmPanen/laporan_panen_taksasi`, data,httpOptions);
	}
  getLaporanDendaPanenPerbulan(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/estBkmPanen/laporan_denda_panen_perbulan`, data,httpOptions);
	}
  getLaporanRekap(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/pdf',
         'Accept' : 'application/pdf',
      }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/estBkmPanen/laporan_rekap_stok`, data,httpOptions);
	}
  getRekapPremiMandorKerani(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/estBkmPanen/rekap_mandor_kerani`, data,httpOptions);
	}






	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/estBkmPanen/${id}`);
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
		return this.http.get<any>(`${this.apiUrl}/estBkmPanen/print_slip/${id}`,httpOptions);
	}
    calculateHk(id: number){
      return this.http.post(`${this.apiUrl}/estBkmPanen/recalculate_premi_pemanen/${id}`, {});
  }
}
