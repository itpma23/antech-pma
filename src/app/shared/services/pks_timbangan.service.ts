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
import { PksTimbangan } from '../models/pks_timbangan.model';

@Injectable({
  providedIn: 'root'
})

export class PksTimbanganService {

  private apiUrl = SERVER_API_URL;


  constructor(
    public router: Router,
    private http: HttpClient,

  ) {


  }

  getAll() {
    return this.http.get<PksTimbangan[]>(`${this.apiUrl}/PksTimbangan/getAll`);
  }

  getTimbanganTBSInternalBelumSPB() {
    return this.http.get<PksTimbangan[]>(`${this.apiUrl}/PksTimbangan/getTimbanganInternalBlmSpb`);
  }
  getTimbanganTBSExternalBelumRekap(data) {
    return this.http.post<PksTimbangan[]>(`${this.apiUrl}/PksTimbangan/getTimbanganExternalBlmRekap`, data);
  }

  getTimbanganTBS(data: any): Observable<{ status: string, data: PksTimbangan[] }> {
    return this.http.post<{ status: string, data: PksTimbangan[] }>(
      `${this.apiUrl}/PksTimbangan/getTimbanganTbsBlmRekap`,
      data
    );
  }

  getById(id: number) {
    return this.http.get(`${this.apiUrl}/PksTimbangan/${id}`);
  }


  updateStatus(status: any, pengajar: any) {
    let data = { status_id: status, pengajar_id: pengajar }
    return this.http.post(`${this.apiUrl}/PksTimbangan/update_status`, data,

    );
  }

  create(data: any) {
    return this.http.post(`${this.apiUrl}/PksTimbangan/create`, data);
  }
  update(id, data) {
    return this.http.post(`${this.apiUrl}/PksTimbangan/update/${id}`, data);
  }


  delete(id: number) {
    let data = { "id": id.toString() };
    return this.http.delete(`${this.apiUrl}/PksTimbangan/${id}`);
  }
  getLaporanPenerimaanTbsRincian(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType': 'blob' as 'json'

    };
    return this.http.post(`${this.apiUrl}/PksTimbangan/laporan_rincian_penerimaan_tbs`, data, httpOptions);
  }
  getLaporanPenerimaanTbsRincianInt(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType': 'blob' as 'json'

    };
    return this.http.post(`${this.apiUrl}/PksTimbangan/laporan_rincian_penerimaan_tbs_int`, data, httpOptions);
  }
  getLaporanPenerimaanTbsRincianExt(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType': 'blob' as 'json'

    };
    return this.http.post(`${this.apiUrl}/PksTimbangan/laporan_rincian_penerimaan_tbs_ext`, data, httpOptions);
  }
  getLaporanPenerimaanTbsHarian(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType': 'blob' as 'json'

    };
    return this.http.post(`${this.apiUrl}/PksTimbangan/laporan_harian_penerimaan_tbs`, data, httpOptions);
  }
  getLaporanPenerimaanTbsBulanan(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType': 'blob' as 'json'

    };
    return this.http.post(`${this.apiUrl}/PksTimbangan/laporan_bulanan_penerimaan_tbs`, data, httpOptions);
  }
  getLaporanPenerimaanTbsRekap(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType': 'blob' as 'json'

    };
    return this.http.post(`${this.apiUrl}/PksTimbangan/laporan_rekap_penerimaan_tbs`, data, httpOptions);
  }
  import(file: any) {
    return this.http.post(`${this.apiUrl}/PksTimbangan/import`, file,

    );
  }

}
