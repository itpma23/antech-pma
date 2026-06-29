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
import { Akun } from '../models/akun.model';

@Injectable({
  providedIn: 'root'
})

export class AbsensiService {

  private apiUrl = SERVER_API_URL;


  constructor(
    public router: Router,
    private http: HttpClient,

  ) {


  }


  getAbsensiDigital(tanggal, kelas_id) {
    let data = { date: tanggal, kelas: kelas_id }
    return this.http.post(`${this.apiUrl}/absensi/absensiDigital`, data,

    );
  }
  getAbsensiDigitalXLS(tanggal, kelas_id) {
    let data = { MONTHX: tanggal, DEPARTMENT: kelas_id }
    var HTTPOptions = {
      headers: new HttpHeaders({
        'Accept': 'text/html, application/xhtml+xml, */*',
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      'responseType': 'blob' as 'json'
    }
    // return this.http.post<any[]>(url, body, HTTPOptions);
    return this.http.post(`${this.apiUrl}/absensi/exportAbsensiDigital`, data, HTTPOptions

    );
  }
  getAbsensiMapelXLS(tanggal, kelas_id, mapel) {
    let data = { MONTHX: tanggal, DEPARTMENT: kelas_id, MAPEL: mapel }
    var HTTPOptions = {
      headers: new HttpHeaders({
        'Accept': 'text/html, application/xhtml+xml, */*',
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      'responseType': 'blob' as 'json'
    }
    // return this.http.post<any[]>(url, body, HTTPOptions);
    return this.http.post(`${this.apiUrl}/absensi/exportAbsensiMapel`, data, HTTPOptions

    );
  }
  getAbsensiMapelDigitalXLS(tanggal, kelas_id, mapel) {
    let data = { MONTHX: tanggal, DEPARTMENT: kelas_id, MAPEL: mapel }
    var HTTPOptions = {
      headers: new HttpHeaders({
        'Accept': 'text/html, application/xhtml+xml, */*',
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      'responseType': 'blob' as 'json'
    }
    // return this.http.post<any[]>(url, body, HTTPOptions);
    return this.http.post(`${this.apiUrl}/absensi/exportAbsensiMapelDigital`, data, HTTPOptions

    );
  }
  getAbsensiQrCodeSiswaXLS(tanggal, kelas_id) {
    let data = { MONTHX: tanggal, DEPARTMENT: kelas_id }
    var HTTPOptions = {
      headers: new HttpHeaders({
        'Accept': 'text/html, application/xhtml+xml, */*',
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      'responseType': 'blob' as 'json'
    }
    // return this.http.post<any[]>(url, body, HTTPOptions);
    return this.http.post(`${this.apiUrl}/absensi/exportAbsensiScansiswa`, data, HTTPOptions

    );
  }


  getAbsensiScan(tanggal) {
    let data = { tanggal: tanggal }
    return this.http.post(`${this.apiUrl}/HrmsAbsensiScan/getAbsensi`, data,

    );
  }





}
