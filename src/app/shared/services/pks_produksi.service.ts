import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
// import { TranslateService } from '@ngx-translate/core';
// import { ToastrService } from 'ngx-toastr';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

// import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
// import { Akun } from '../models/akun.model';
// import { PksProduksi } from '../models/pks_sjpp.model';

@Injectable({
	providedIn: 'root'
})

export class PksProduksiService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	// getAll() {
	// 	return this.http.get<PksProduksi[]>(`${this.apiUrl}/PksProduksi/getAll`);
	// }


	// getById(id: number) {
	// 	return this.http.get(`${this.apiUrl}/PksProduksi/${id}`);
	// }

	// create(akun: any) {
	// 	return this.http.post(`${this.apiUrl}/PksProduksi`, akun,
  //   );
	// }

	// update(id:any,PksProduksi: any) {
	// 	return this.http.put(`${this.apiUrl}/PksProduksi/${id}`, PksProduksi);
	// }
  // updatePhoto(id:any,file: any) {
	// 	return this.http.post(`${this.apiUrl}/PksProduksi/edit_picture/${id}`, file);
	// }


	// delete(id: number) {
  //   let data={"id":id.toString()};
	// 	return this.http.delete(`${this.apiUrl}/PksProduksi/${id}`);
	// }

	// getPdfSlip(id) {
	// 	const httpOptions = {
	// 	  headers: new HttpHeaders({
	// 		'Content-Type':  'application/pdf',
	// 		// 'Authorization' : this.authKey,
	// 		 'Accept' : 'application/pdf',
	// 		// 'NAMADB': 'testing',
	// 		// 'NAMAPATH': 'Testing'
	// 		//observe : 'response'
	// 	  }),
	// 	  'responseType' : 'blob' as 'json'

	// 	};
	// 		return this.http.get<any>(`${this.apiUrl}/PksProduksi/print_slip/${id}`,httpOptions);
	// }

	getLaporanProduksiHarian(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
       'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/PksProduksi/laporan_produksi_harian`, data,httpOptions);
	}

	getLaporanProduksiBulanan(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
       'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/PksProduksi/laporan_produksi_bulanan`, data,httpOptions);
	}

	getLaporanProduksiRekap(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
       'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/PksProduksi/laporan_produksi`, data,httpOptions);
	}
	getLaporanLhp(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
       'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/PksLhp/laporan_rekap_lhp`, data,httpOptions);
	}

}
