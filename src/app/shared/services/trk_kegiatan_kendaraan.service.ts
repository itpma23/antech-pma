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
import { TrkKegiatanKendaraan } from '../models/trk_kegiatan_kendaraan.model';

@Injectable({
	providedIn: 'root'
})

export class TrkKegiatanKendaraanService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<TrkKegiatanKendaraan[]>(`${this.apiUrl}/trkKegiatanKendaraan/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/trkKegiatanKendaraan/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/trkKegiatanKendaraan`, akun,

    );
	}

	update(id:any,TrkKegiatanKendaraan: any) {
		return this.http.put(`${this.apiUrl}/trkKegiatanKendaraan/${id}`, TrkKegiatanKendaraan);
	}
  posting(id:any,data: any) {
		return this.http.post(`${this.apiUrl}/trkKegiatanKendaraan/posting/${id}`, data);
	}
  posting_tanggal(data: any) {
    let lokasi_id=data['lokasi_id'];
    let t1=data['tgl_mulai'];
     let t2=data['tgl_akhir'];
		return this.http.post(`${this.apiUrl}/trkKegiatanKendaraan/posting_batch/${lokasi_id}/${t1}/${t2}`, data);
	}
	hitungPremi(data: any) {
		return this.http.post(`${this.apiUrl}/trkKegiatanKendaraan/hitungPremi`, data,

    );
	}
  startProses(id) {
    let data={id:id}
    console.log(data);
		return this.http.post(`${this.apiUrl}/trkKegiatanKendaraan/start_proses_alokasi`,data);
	}
  getLaporanRekap(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/pdf',
         'Accept' : 'application/pdf',
      }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/trkKegiatanKendaraan/laporan_rekap_stok`, data,httpOptions);
	}






	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/trkKegiatanKendaraan/${id}`);
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
		return this.http.get<any>(`${this.apiUrl}/trkKegiatanKendaraan/print_slip/${id}`,httpOptions);
	}
	listTrkLogKendaraan(data) {
		const httpOptions = {
		  'responseType' : 'blob' as 'json'
		};
			return this.http.post(`${this.apiUrl}/trkKegiatanKendaraan/listKegKendaraan`, data,httpOptions);
		}

		listTrkKegiatanDetail(data) {
			const httpOptions = {
			  // headers: new HttpHeaders({
			  //   'Content-Type':  'application/pdf',
			  //    'Accept' : 'application/pdf',
			  // }),
			  'responseType' : 'blob' as 'json'
			};
				return this.http.post(`${this.apiUrl}/trkKegiatanKendaraan/listTrkKegiatanDetail`, data,httpOptions);
			}

	getKegiatanReportDetail(data) {
		const httpOptions = {
			// headers: new HttpHeaders({
			//   'Content-Type':  'application/pdf',
			//    'Accept' : 'application/pdf',
			// }),
			'responseType' : 'blob' as 'json'
		};
		return this.http.post(`${this.apiUrl}/trkKegiatanKendaraan/laporan_kegiatan_detail`, data,httpOptions);
	}
	getKegiatanReportLogByTanggal(data) {
		const httpOptions = {
			// headers: new HttpHeaders({
			//   'Content-Type':  'application/pdf',
			//    'Accept' : 'application/pdf',
			// }),
			'responseType' : 'blob' as 'json'
		};
		return this.http.post(`${this.apiUrl}/trkKegiatanKendaraan/laporan_log_by_tanggal`, data,httpOptions);
	}
	getFrestasiReportDetail(data) {
		const httpOptions = {
			// headers: new HttpHeaders({
			//   'Content-Type':  'application/pdf',
			//    'Accept' : 'application/pdf',
			// }),
			'responseType' : 'blob' as 'json'
		};
		return this.http.post(`${this.apiUrl}/trkKegiatanKendaraan/laporan_frestasi_detail`, data,httpOptions);
	}
}
