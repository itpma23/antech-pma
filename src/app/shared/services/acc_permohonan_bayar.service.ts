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

export class AccPermohonanBayarService {

  private apiUrl = SERVER_API_URL;


  constructor(
    public router: Router,
    private http: HttpClient,

  ) {


  }
  getAll() {
    return this.http.get<AccPermohonanBayar[]>(`${this.apiUrl}/AccPermohonanBayar/getAll`);
  }
  getTraksi() {
    return this.http.get<AccPermohonanBayar[]>(`${this.apiUrl}/AccPermohonanBayar/getTraksi`);
  }
  getAllDetail(id: number) {
    return this.http.get<AccPermohonanBayar[]>(`${this.apiUrl}/AccPermohonanBayar/getAllDetail/${id}`);
  }


  getById(id: number) {
    return this.http.get(`${this.apiUrl}/AccPermohonanBayar/${id}`);
  }

  create(akun: any) {
    return this.http.post(`${this.apiUrl}/AccPermohonanBayar`, akun,);
  }
  delete(id: number) {
    let data = { "id": id.toString() };
    return this.http.delete(`${this.apiUrl}/AccPermohonanBayar/${id}`);
  }
  update(id: any, AccPermohonanBayar: any) {
    return this.http.put(`${this.apiUrl}/AccPermohonanBayar/${id}`, AccPermohonanBayar);
  }
  posting(id: any, data: any) {
    return this.http.post(`${this.apiUrl}/AccPermohonanBayar/posting/${id}`, data);
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
    return this.http.get<any>(`${this.apiUrl}/AccPermohonanBayar/print_slip/${id}`, httpOptions);
  }
  
}
