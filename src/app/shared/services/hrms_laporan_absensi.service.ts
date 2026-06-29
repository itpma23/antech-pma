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
// import { HrmsLaporanAbsensi } from '../models/pks_sjpp.model';

@Injectable({
	providedIn: 'root'
})

export class HrmsLaporanAbsensiService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	// getAll() {
	// 	return this.http.get<HrmsLaporanAbsensi[]>(`${this.apiUrl}/HrmsLaporanAbsensi/getAll`);
	// }


	// getById(id: number) {
	// 	return this.http.get(`${this.apiUrl}/HrmsLaporanAbsensi/${id}`);
	// }

	// create(akun: any) {
	// 	return this.http.post(`${this.apiUrl}/HrmsLaporanAbsensi`, akun,
  //   );
	// }

	// update(id:any,HrmsLaporanAbsensi: any) {
	// 	return this.http.put(`${this.apiUrl}/HrmsLaporanAbsensi/${id}`, HrmsLaporanAbsensi);
	// }
  // updatePhoto(id:any,file: any) {
	// 	return this.http.post(`${this.apiUrl}/HrmsLaporanAbsensi/edit_picture/${id}`, file);
	// }


	// delete(id: number) {
  //   let data={"id":id.toString()};
	// 	return this.http.delete(`${this.apiUrl}/HrmsLaporanAbsensi/${id}`);
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
	// 		return this.http.get<any>(`${this.apiUrl}/HrmsLaporanAbsensi/print_slip/${id}`,httpOptions);
	// }

	getLaporanAbsensi(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
       'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/HrmsLaporanAbsensi/laporan_absensi`, data,httpOptions);
	}

	getLaporanAbsensiBulanan(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
       'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/HrmsLaporanAbsensi/laporan_absensi_bulanan`, data,httpOptions);
	}


}
