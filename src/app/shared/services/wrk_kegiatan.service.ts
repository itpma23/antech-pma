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
import { WrkKegiatan } from '../models/wrk_kegiatan.model';

@Injectable({
	providedIn: 'root'
})

export class WrkKegiatanService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<WrkKegiatan[]>(`${this.apiUrl}/WrkKegiatan/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/WrkKegiatan/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/WrkKegiatan`, akun,

    );
	}

	update(id:any,WrkKegiatan: any) {
		return this.http.put(`${this.apiUrl}/WrkKegiatan/${id}`, WrkKegiatan);
	}
  posting(id:any,data: any) {
		return this.http.post(`${this.apiUrl}/WrkKegiatan/posting/${id}`, data);
	}
  posting_tanggal(data: any) {
    let lokasi_id=data['lokasi_id'];
    let t1=data['tgl_mulai'];
     let t2=data['tgl_akhir'];
		return this.http.post(`${this.apiUrl}/WrkKegiatan/posting_batch/${lokasi_id}/${t1}/${t2}`, data);
	}
  startProses(id) {
    let data={id:id}
    console.log(data);
		return this.http.post(`${this.apiUrl}/WrkKegiatan/start_proses_alokasi`,data);
	}
	hitungPremi(data: any) {
		return this.http.post(`${this.apiUrl}/WrkKegiatan/hitungPremi`, data,

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
		return this.http.post(`${this.apiUrl}/WrkKegiatan/laporan_rekap_stok`, data,httpOptions);
	}






	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/WrkKegiatan/${id}`);
	}

  getPdfSlip(id) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/pdf',
        'Accept' : 'application/pdf',
      }),
      'responseType' : 'blob' as 'json'
    };
		return this.http.get<any>(`${this.apiUrl}/WrkKegiatan/print_slip/${id}`,httpOptions);
	}
	listWrkKegiatna(data) {
		const httpOptions = {
		  'responseType' : 'blob' as 'json'
		};
			return this.http.post(`${this.apiUrl}/WrkKegiatan/listWorkshop`, data,httpOptions);
		}
	listWrkKegiatanDetail(data) {
			const httpOptions = {
			  // headers: new HttpHeaders({
			  //   'Content-Type':  'application/pdf',
			  //    'Accept' : 'application/pdf',
			  // }),
			  'responseType' : 'blob' as 'json'
			};
				return this.http.post(`${this.apiUrl}/WrkKegiatan/listWrkKegiatanDetail`, data,httpOptions);
	}


	getMaterialReportDetail(data) {
		const httpOptions = {
			// headers: new HttpHeaders({
			//   'Content-Type':  'application/pdf',
			//    'Accept' : 'application/pdf',
			// }),
			'responseType' : 'blob' as 'json'
		};
		return this.http.post(`${this.apiUrl}/WrkKegiatan/laporan_material_detail`, data,httpOptions);
	}

	getKegiatanReportDetail(data) {
		const httpOptions = {
			// headers: new HttpHeaders({
			//   'Content-Type':  'application/pdf',
			//    'Accept' : 'application/pdf',
			// }),
			'responseType' : 'blob' as 'json'
		};
		return this.http.post(`${this.apiUrl}/WrkKegiatan/laporan_kegiatan_detail`, data,httpOptions);
	}

	getFrestasiReportDetail(data) {
		const httpOptions = {
			// headers: new HttpHeaders({
			//   'Content-Type':  'application/pdf',
			//    'Accept' : 'application/pdf',
			// }),
			'responseType' : 'blob' as 'json'
		};
		return this.http.post(`${this.apiUrl}/WrkKegiatan/laporan_frestasi_detail`, data,httpOptions);
	}
}
