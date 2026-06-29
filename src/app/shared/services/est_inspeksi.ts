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

export class EstInspeksiService {

  private apiUrl = SERVER_API_URL;


  constructor(
    public router: Router,
    private http: HttpClient,

  ) {


  }


  updateStatus(id,catatan, status) {
    let data = {id:id, catatan:catatan, status: status }
console.log(data);
    return this.http.post(`${this.apiUrl}/EstInspeksi/UpdateStatus`, data,

    );
  }

  getInspeksiByTanggal(tanggal1,tanggal2) {
    let data = { tanggal_mulai: tanggal1,tanggal_sd: tanggal2 }
    return this.http.post(`${this.apiUrl}/EstInspeksi/getInspeksiByTanggal`, data,

    );
  }





}
