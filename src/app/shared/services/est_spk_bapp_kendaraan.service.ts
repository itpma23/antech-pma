import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
// import { TranslateService } from '@ngx-translate/core';
// import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_API_URL } from 'src/app/app.constants';
import { EstSpkBappKendaraan } from '../models/est_spk_bapp_kendaraan.model';

@Injectable({
  providedIn: 'root'
})

export class EstSpkBappKendaraanService {

  private apiUrl = SERVER_API_URL;


  constructor(
    public router: Router,
    private http: HttpClient,

  ) {


  }
  getAllBelumPemakaianByLokasi(lokasi_id) {
    return this.http.get<EstSpkBappKendaraan[]>(`${this.apiUrl}/EstSpkBappKendaraan/getAllBelumPemakaian/${lokasi_id}`);
  }
  getAllOutstanding() {
    return this.http.get<EstSpkBappKendaraan[]>(`${this.apiUrl}/EstSpkBappKendaraan/getAllOutstandingBayar`);
  }
  getAll() {
    return this.http.get<EstSpkBappKendaraan[]>(`${this.apiUrl}/EstSpkBappKendaraan/getAll`);
  }
  getTraksi() {
    return this.http.get<EstSpkBappKendaraan[]>(`${this.apiUrl}/EstSpkBappKendaraan/getTraksi`);
  }
  getAllDetail(id: number) {
    return this.http.get<EstSpkBappKendaraan[]>(`${this.apiUrl}/EstSpkBappKendaraan/getAllDetail/${id}`);
  }


  getById(id: number) {
    return this.http.get(`${this.apiUrl}/EstSpkBappKendaraan/${id}`);
  }

  create(akun: any) {
    return this.http.post(`${this.apiUrl}/EstSpkBappKendaraan`, akun,);
  }
  delete(id: number) {
    let data = { "id": id.toString() };
    return this.http.delete(`${this.apiUrl}/EstSpkBappKendaraan/${id}`);
  }
  update(id: any, EstSpkBappKendaraan: any) {
    return this.http.put(`${this.apiUrl}/EstSpkBappKendaraan/${id}`, EstSpkBappKendaraan);
  }
  posting(id: any, data: any) {
    return this.http.post(`${this.apiUrl}/EstSpkBappKendaraan/posting/${id}`, data);
  }
  getPdfSlip(id) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/pdf',
        // 'Authorization' : this.authKey,
        'Accept': 'application/pdf',
        // 'NAMADB': 'testing',
        // 'NAMAPATH': 'Testing'
        //observe : 'response'
      }),
      'responseType': 'blob' as 'json'

    };
    return this.http.get<any>(`${this.apiUrl}/EstSpkBappKendaraan/print_slip/${id}`, httpOptions);
  }
  getPdfSlipRekap(id) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/pdf',
        // 'Authorization' : this.authKey,
        'Accept': 'application/pdf',
        // 'NAMADB': 'testing',
        // 'NAMAPATH': 'Testing'
        //observe : 'response'
      }),
      'responseType': 'blob' as 'json'

    };
    return this.http.get<any>(`${this.apiUrl}/EstSpkBappKendaraan/print_slip_rekap/${id}`, httpOptions);
  }
  getPdfSlipInvoice(id) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/pdf',
        // 'Authorization' : this.authKey,
        'Accept': 'application/pdf',
        // 'NAMADB': 'testing',
        // 'NAMAPATH': 'Testing'
        //observe : 'response'
      }),
      'responseType': 'blob' as 'json'

    };
    return this.http.get<any>(`${this.apiUrl}/EstSpkBappKendaraan/print_slip_invoice/${id}`, httpOptions);
  }

  getReportDetail(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType': 'blob' as 'json'
    };
    return this.http.post(`${this.apiUrl}/EstSpkBappKendaraan/laporan_detail`, data, httpOptions);
  }
  getAllAkunPph() {
		return this.http.get(`${this.apiUrl}/EstSpkBappKendaraan/getAllAkunPPH`);
	}
}
