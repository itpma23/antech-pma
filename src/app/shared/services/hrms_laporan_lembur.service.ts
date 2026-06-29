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
// import { HrmsLaporanLembur } from '../models/pks_sjpp.model';

@Injectable({
	providedIn: 'root'
})

export class HrmsLaporanLemburService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	// getAll() {
	// 	return this.http.get<HrmsLaporanLembur[]>(`${this.apiUrl}/HrmsLaporanLembur/getAll`);
	// }


	// getById(id: number) {
	// 	return this.http.get(`${this.apiUrl}/HrmsLaporanLembur/${id}`);
	// }

	// create(akun: any) {
	// 	return this.http.post(`${this.apiUrl}/HrmsLaporanLembur`, akun,
  //   );
	// }

	// update(id:any,HrmsLaporanLembur: any) {
	// 	return this.http.put(`${this.apiUrl}/HrmsLaporanLembur/${id}`, HrmsLaporanLembur);
	// }
  // updatePhoto(id:any,file: any) {
	// 	return this.http.post(`${this.apiUrl}/HrmsLaporanLembur/edit_picture/${id}`, file);
	// }


	// delete(id: number) {
  //   let data={"id":id.toString()};
	// 	return this.http.delete(`${this.apiUrl}/HrmsLaporanLembur/${id}`);
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
	// 		return this.http.get<any>(`${this.apiUrl}/HrmsLaporanLembur/print_slip/${id}`,httpOptions);
	// }

	getLaporanLembur(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
       'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/HrmsLaporanLembur/laporan_lembur`, data,httpOptions);
	}

	getLaporanLemburBulanan(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
       'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/HrmsLaporanLembur/laporan_lembur_bulanan`, data,httpOptions);
	}


}
