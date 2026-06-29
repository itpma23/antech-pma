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
import { Tugas } from '../models/tugas.model';

@Injectable({
	providedIn: 'root'
})

export class BankSoalService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<Tugas[]>(`${this.apiUrl}/tugas`);
	}

	getById(id: number) {
		return this.http.get(`${this.apiUrl}/tugas/${id}`);
	}

  getByTypeId(id: number) {
		return this.http.get(`${this.apiUrl}/tugas/get_by_type/${id}`);
	}

	create(tugas: any) {
		return this.http.post(`${this.apiUrl}/tugas`, tugas,
    // { headers: new HttpHeaders({
    //   'Content-Type': 'multipart/form-data',
    //   'NAMADB': 'testing',
    //   'NAMAPATH':'Testing',
    //   'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT, DELETE',
    //   'Access-Control-Allow-Headers' : 'Content-Type, Origin, Authorization'
    // })}
    );
	}

	update(id:any,tugas: any) {
		return this.http.post(`${this.apiUrl}/tugas/update/${id}`, tugas);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/tugas/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/tugas/${id}`);
	}

  ujianOnline(tugas_id,siswa_id,ip,agent) {
    let data:any={"tugas_id":tugas_id,"siswa_id":siswa_id,"ip":ip,"agent":agent}
		return this.http.post(`${this.apiUrl}/tugas/kerjakan`, data);
	}

  updateGanda(tugas_id,siswa_id, pertanyaan_id, pilihan_id){
    let data:any={"tugas_id":tugas_id,"siswa_id":siswa_id,"pertanyaan_id":pertanyaan_id,"pilihan_id":pilihan_id}
		return this.http.post(`${this.apiUrl}/tugas/updateJawabanGanda`, data);

  }
  updateGandaGabungan(tugas_id,siswa_id, pertanyaan_id, pilihan_id){
    let data:any={"tugas_id":tugas_id,"siswa_id":siswa_id,"pertanyaan_id":pertanyaan_id,"pilihan_id":pilihan_id}
		return this.http.post(`${this.apiUrl}/tugas/updateJawabanGandaGabungan`, data);

  }
  simpanJawaban(tugas_id,siswa_id, pertanyaan_id, jawaban){
    let data:any={"tugas_id":tugas_id,"siswa_id":siswa_id,"pertanyaan_id":pertanyaan_id,"jawaban":jawaban}
		return this.http.post(`${this.apiUrl}/tugas/updateJawabanEssay`, data);

  }
  simpanJawabanGabungan(tugas_id,siswa_id, pertanyaan_id, jawaban){
    let data:any={"tugas_id":tugas_id,"siswa_id":siswa_id,"pertanyaan_id":pertanyaan_id,"jawaban":jawaban}
		return this.http.post(`${this.apiUrl}/tugas/updateJawabanEssayGabungan`, data);

  }

  submitGanda(tugas_id,unix_id,siswa_id){
    let data:any={"tugas_id":tugas_id,"unix_id":unix_id,"siswa_id":siswa_id}
    return this.http.post(`${this.apiUrl}/tugas/finish`, data);

  }
  submitEssay(tugas_id,unix_id,siswa_id,jawaban){
    let data:any={"tugas_id":tugas_id,"unix_id":unix_id,"siswa_id":siswa_id,"jawaban":jawaban}
		return this.http.post(`${this.apiUrl}/tugas/submit_essay`, data);

  }
  submitUpload2(tugas_id,siswa_id, pertanyaan_id, jawaban){
    let data:any={"tugas_id":tugas_id,"siswa_id":siswa_id,"pertanyaan_id":pertanyaan_id,"jawaban":jawaban}
		return this.http.post(`${this.apiUrl}/tugas/updateJawabanEssay`, data);

  }
  submitUpload(formdata){
    //let data:any={"tugas_id":tugas_id,"siswa_id":siswa_id,"pertanyaan_id":pertanyaan_id,"jawaban":jawaban}
		return this.http.post(`${this.apiUrl}/tugas/submit_upload`, formdata);

  }
  koreksi(tugas_id,kelas="",siswa="",mode=null){
    let data:any={"tugas_id":tugas_id,kelas:kelas,siswa:siswa,"mode":mode}
		return this.http.post(`${this.apiUrl}/tugas/koreksi`, data);

  }

  nilai(tugas_id,kelas="",siswa="",mode=null, tampil_jawaban=1, kelas_id=null){
    let data:any={"tugas_id":tugas_id,"mode":mode,"tampil_jawaban":tampil_jawaban,
    "kelas_id":kelas_id,"siswa":siswa,"kelas":kelas}
		return this.http.post(`${this.apiUrl}/tugas/nilai`, data);


  }
 nilaiPdf(tugas_id,kelas="",siswa="",mode=null, tampil_jawaban=1, kelas_id=null) {
  let data:any={"tugas_id":tugas_id,"mode":mode,"tampil_jawaban":tampil_jawaban,
  "kelas_id":kelas_id,"siswa":siswa,"kelas":kelas}
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
		return this.http.post<any>(`${this.apiUrl}/tugas/nilai`, data,httpOptions);
	}
  nilaiPdfEssay(tugas_id,kelas="",siswa="",mode=null, tampil_jawaban=1, kelas_id=null) {
    let data:any={"tugas_id":tugas_id,"mode":mode,"tampil_jawaban":tampil_jawaban,
    "kelas_id":kelas_id,"siswa":siswa,"kelas":kelas}
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
      return this.http.post<any>(`${this.apiUrl}/tugas/koreksi`, data,httpOptions);
    }

  detailJawaban(tugas_id, siswa_id,nilai=null,catatan=null){
   let data:any={"nilai":nilai,"catatan":catatan};
		return this.http.post(`${this.apiUrl}/tugas/detail_jawaban/${siswa_id}/${tugas_id}`, data);

  }
  pantau(tugas_id, aksi='list',param=''){

     return this.http.post(`${this.apiUrl}/tugas/pantau/${tugas_id}/${aksi}/${param}`,null);

   }
   nilaiSiswa(tugas_id, siswa_id){
     let data:any={"tugas_id":tugas_id,"siswa_id":siswa_id}

    return this.http.post(`${this.apiUrl}/tugas/nilai_siswa`,data);

  }
   terbitkan(tugas_id){

    return this.http.post(`${this.apiUrl}/tugas/terbitkan/${tugas_id}`,null);

  }
  tutup(tugas_id){

    return this.http.post(`${this.apiUrl}/tugas/tutup/${tugas_id}`,null);

  }
  resetJawaban(tugas_id,siswa_id){

    return this.http.post(`${this.apiUrl}/tugas/reset_jawaban/${tugas_id}/${siswa_id}`,null);

  }

}
