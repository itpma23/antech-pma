import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
// import { TranslateService } from '@ngx-translate/core';
// import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_API_URL } from 'src/app/app.constants';
import { AccPermohonanBayar } from '../models/acc_permohonan_bayar.model';

@Injectable({
  providedIn: 'root'
})



export class AccPermohonanBayarV2Service {

  private apiUrl = SERVER_API_URL;


  constructor(
    public router: Router,
    private http: HttpClient,

  ) {


  }
  getAll() {
    return this.http.get<AccPermohonanBayar[]>(`${this.apiUrl}/AccPermohonanBayarV2/getAll`);
  }

    getAllByUnit(lokasi_id) {
      return this.http.get<AccPermohonanBayar[]>(`${this.apiUrl}/AccPermohonanBayarV2/getAllByUnit/${lokasi_id}`);
    }

    getAllBySupplier(supplier_id) {
      return this.http.get<AccPermohonanBayar[]>(`${this.apiUrl}/AccPermohonanBayarV2/getAllBySupplier/${supplier_id}`);
    }


  
  getTraksi() {
    return this.http.get<AccPermohonanBayar[]>(`${this.apiUrl}/AccPermohonanBayarV2/getTraksi`);
  }
  getAllDetail(id: number) {
    return this.http.get<AccPermohonanBayar[]>(`${this.apiUrl}/AccPermohonanBayarV2/getAllDetail/${id}`);
  }


  getById(id: number) {
    return this.http.get(`${this.apiUrl}/AccPermohonanBayarV2/${id}`);
  }

  create(akun: any) {
    return this.http.post(`${this.apiUrl}/AccPermohonanBayarV2`, akun,);
  }
  delete(id: number) {
    let data = { "id": id.toString() };
    return this.http.delete(`${this.apiUrl}/AccPermohonanBayarV2/${id}`);
  }
  update(id: any, AccPermohonanBayar: any) {
    return this.http.put(`${this.apiUrl}/AccPermohonanBayarV2/${id}`, AccPermohonanBayar);
  }
  posting(id: any, data: any) {
    return this.http.post(`${this.apiUrl}/AccPermohonanBayarV2/posting/${id}`, data);
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
    return this.http.get<any>(`${this.apiUrl}/AccPermohonanBayarV2/print_slip/${id}`, httpOptions);
  }
  getPdfSlipV2(id) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/pdf',
        'Accept': 'application/pdf',
      }),
      responseType: 'blob' as 'json'
    };

    return this.http.get<any>(
      `${this.apiUrl}/AccPermohonanBayarV2/print_slip_v2/${id}`,
      httpOptions
    );
  }
  	  updateApprove(id: any, AccPermohonanBayar: any) {
    return this.http.put(`${this.apiUrl}/AccPermohonanBayarV2/updateApprove/${id}`, AccPermohonanBayar);
  }
  

  getJurnalPermohonan(id: number) {
  return this.http.get<JurnalPermohonanResponse>(
    `${this.apiUrl}/AccPermohonanBayarV2/getJurnalPermohonan/${id}`
  );
}
}


export interface JurnalPermohonanResponse {
  status: string;
  data: {
    permohonan_id: number;
    no_permohonan: string;
    jenis_invoice: string;
    lokasi_id: number;
    akun_supplier_id: number;
    nilai: number;
    referensi: string;
    ref_id: number;
  };
}