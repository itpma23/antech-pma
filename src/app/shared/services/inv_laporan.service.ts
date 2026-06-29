import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
// import { TranslateService } from '@ngx-translate/core';
// import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'src/app/app.constants';


@Injectable({
	providedIn: 'root'
})

export class InvLaporanService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	cekStokByLokasi(lokasi_id,item_id,tanggal) {
		return this.http.get(`${this.apiUrl}/invLaporan/cek_stok_lokasi/${lokasi_id}/${item_id}/${tanggal}`);
	}
  getLaporanRekapSaldo(data) {
    const httpOptions = {

      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/invLaporan/laporan_rekap_stok_all_gudang`, data,httpOptions);
	}
  getLaporanKartuStok(data) {
    const httpOptions = {

      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/invLaporan/laporan_kartu_stok`, data,httpOptions);
	}

  getLaporanRekapSaldoHarga(data) {
    const httpOptions = {

      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/invLaporan/laporan_rekap_stok_harga_all_gudang`, data,httpOptions);
	}
  getLaporanKartuStokHarga(data) {
    const httpOptions = {

      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/invLaporan/laporan_kartu_stok_harga`, data,httpOptions);
	}

  getLaporanPemakaianHarga(data) {
    const httpOptions = {

      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/invLaporan/laporan_pemakaian_harga`, data,httpOptions);
	}



	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/invLaporan/${id}`);
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
		return this.http.get<any>(`${this.apiUrl}/invLaporan/print_slip/${id}`,httpOptions);
	}
}
