import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
// import { TranslateService } from '@ngx-translate/core';
// import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_API_URL } from 'src/app/app.constants';
import { WrkKegiatanMill } from '../models/wrk_kegiatan_mill.model';

@Injectable({
	providedIn: 'root'
})

export class WrkKegiatanMillService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<WrkKegiatanMill[]>(`${this.apiUrl}/WrkKegiatanMill/getAll`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/WrkKegiatanMill/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/WrkKegiatanMill`, akun,

    );
	}

	update(id:any,WrkKegiatan: any) {
		return this.http.put(`${this.apiUrl}/WrkKegiatanMill/${id}`, WrkKegiatan);
	}
  posting(id:any,data: any) {
		return this.http.post(`${this.apiUrl}/WrkKegiatanMill/posting/${id}`, data);
	}
  startProses(id) {
    let data={id:id}
    console.log(data);
		return this.http.post(`${this.apiUrl}/WrkKegiatanMill/start_proses_alokasi`,data);
	}
	hitungPremi(data: any) {
		return this.http.post(`${this.apiUrl}/WrkKegiatanMill/hitungPremi`, data,

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
		return this.http.post(`${this.apiUrl}/WrkKegiatanMill/laporan_rekap_stok`, data,httpOptions);
	}






	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/WrkKegiatanMill/${id}`);
	}

  getPdfSlip(id) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/pdf',
        'Accept' : 'application/pdf',
      }),
      'responseType' : 'blob' as 'json'
    };
		return this.http.get<any>(`${this.apiUrl}/WrkKegiatanMill/print_slip/${id}`,httpOptions);
	}


	getMaterialReportDetail(data) {
		const httpOptions = {
			// headers: new HttpHeaders({
			//   'Content-Type':  'application/pdf',
			//    'Accept' : 'application/pdf',
			// }),
			'responseType' : 'blob' as 'json'
		};
		return this.http.post(`${this.apiUrl}/WrkKegiatanMill/laporan_material_detail`, data,httpOptions);
	}

	getFrestasiReportDetail(data) {
		const httpOptions = {
			// headers: new HttpHeaders({
			//   'Content-Type':  'application/pdf',
			//    'Accept' : 'application/pdf',
			// }),
			'responseType' : 'blob' as 'json'
		};
		return this.http.post(`${this.apiUrl}/WrkKegiatanMill/laporan_frestasi_detail`, data,httpOptions);
	}
}
