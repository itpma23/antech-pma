import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { Akun } from '../models/akun.model';
import { AccPermintaanDana } from '../models/acc_permintan_dana.model';
import { FileSaverService } from 'ngx-filesaver';
@Injectable({
	providedIn: 'root'
})

export class AccPermintaanDanaService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,
    private _FileSaverService: FileSaverService,

	) {


	}

	getAll() {
		return this.http.get<AccPermintaanDana[]>(`${this.apiUrl}/AccPermintaanDana/getAll`);
	}
	getAllByUnit(lokasi_id) {
		return this.http.get<AccPermintaanDana[]>(`${this.apiUrl}/AccPermintaanDana/getAllByUnit/${lokasi_id}`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/AccPermintaanDana/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/AccPermintaanDana`, akun,

    );
	}

	posting(id:any,data: any) {
		return this.http.post(`${this.apiUrl}/AccPermintaanDana/posting/${id}`, data);
	}

	update(id:any,AccPermintaanDana: any) {
		return this.http.put(`${this.apiUrl}/AccPermintaanDana/${id}`, AccPermintaanDana);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/AccPermintaanDana/${id}`);
	}
	getAllAkunUangMuka() {
		return this.http.get(`${this.apiUrl}/AccPermintaanDana/getAkunUangMuka`);
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
			return this.http.get<any>(`${this.apiUrl}/AccPermintaanDana/print_slip/${id}`,httpOptions);
		}

	getLaporan(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/AccPermintaanDana/laporan`, data,httpOptions);
	}
  getLaporanPermintaanDana(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/AccPermintaanDana/laporan_permintaan_dana`, data,httpOptions);
	}
  getLaporanPermintaanDanaRealisasi(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/AccPermintaanDana/laporan_permintaan_dana_realisasi`, data,httpOptions);
	}
  upload(id:any,accKasbank: any) {
		return this.http.post(`${this.apiUrl}/AccPermintaanDana/upload/${id}`, accKasbank);
	}


	getPermintaanDana(){
		return this.http.get(`${this.apiUrl}/AccPermintaanDana/getPermintaanDanaPosting`);
	}

  download(id,fileName){
    // const fileName ='file_Download';
     // if (fromRemote) {
       this.http.get(`${this.apiUrl}/AccPermintaanDana/download/${id}`, {
         observe: 'response',
         responseType: 'blob'
       }).subscribe(res => {
         this._FileSaverService.save(res.body, fileName);
       });
       return;
     //}
     // const fileType = this._FileSaverService.genType(fileName);
     // const txtBlob = new Blob([this.text], { type: fileType });
     // this._FileSaverService.save(txtBlob, fileName);
   }
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
	// 		return this.http.get<any>(`${this.apiUrl}/AccPermintaanDana/print_slip/${id}`,httpOptions);
	// }




}
