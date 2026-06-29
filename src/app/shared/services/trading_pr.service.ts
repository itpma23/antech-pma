import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
// import { TranslateService } from '@ngx-translate/core';
// import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_API_URL } from 'src/app/app.constants';
import { FileSaverService } from 'ngx-filesaver';
import { TradingPr } from '../models/trading_pr.model';

@Injectable({
  providedIn: 'root'
})

export class TradingPrService {

  private apiUrl = SERVER_API_URL;


  constructor(
    public router: Router,
    private http: HttpClient,
    private _FileSaverService: FileSaverService,

  ) {


  }


  closing(id: any, data: any) {
    return this.http.post(`${this.apiUrl}/TradingPr/closing/${id}`, data);
  }

  getAll() {
    return this.http.get<TradingPr[]>(`${this.apiUrl}/TradingPr/getAll`);
  }
  getAllDetail() {
    return this.http.get<TradingPr[]>(`${this.apiUrl}/TradingPr/getAllDetail`);
  }
  getAllDetailByStatus() {
    return this.http.get<TradingPr[]>(`${this.apiUrl}/TradingPr/getAllDetailByStatus`);
  }
  getAllDetailLokasiByStatus(lokasi_id) {
    return this.http.get<TradingPr[]>(`${this.apiUrl}/TradingPr/getAllDetailLokasiByStatus/${lokasi_id}`);
  }

  getById(id: number) {
    return this.http.get(`${this.apiUrl}/TradingPr/${id}`);
  }

  create(data: any) {
    return this.http.post(`${this.apiUrl}/TradingPr`, data,

    );
  }

  update(id: any, TradingPr: any) {
    return this.http.put(`${this.apiUrl}/TradingPr/${id}`, TradingPr);
  }
  upload(id: any, TradingPr: any) {
    return this.http.post(`${this.apiUrl}/TradingPr/upload/${id}`, TradingPr);
  }

  delete(id: number) {
    let data = { "id": id.toString() };
    return this.http.delete(`${this.apiUrl}/TradingPr/${id}`);
  }
  countApproveData() {
    return this.http.post(`${this.apiUrl}/TradingPr/countByUserApprove`, null

    );
  }
  countPPReadyPO() {
    return this.http.post(`${this.apiUrl}/TradingPr/countPPReadyPO`, null

    );
  }
  approve(id: any, data: any) {
    return this.http.post(`${this.apiUrl}/TradingPr/approval/${id}`, data,

    );
  }
  reject(id: any, data: any) {
    return this.http.post(`${this.apiUrl}/TradingPr/reject/${id}`, data,

    );
  }
  getPPReportStatus(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType': 'blob' as 'json'

    };
    return this.http.post(`${this.apiUrl}/TradingPr/laporan_pp_status`, data, httpOptions);
  }
  getPPReportStatus2(id) {
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
    return this.http.get<any>(`${this.apiUrl}/TradingPr/print_slip/${id}`, httpOptions);
  }
  download(id, fileName) {
    // const fileName ='file_Download';
    // if (fromRemote) {
    this.http.get(`${this.apiUrl}/TradingPr/download/${id}`, {
      observe: 'response',
      responseType: 'blob'
    }).subscribe(res => {
      this._FileSaverService.save(res.body, fileName);
    });
    return;
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
    return this.http.get<any>(`${this.apiUrl}/TradingPr/print_slip/${id}`, httpOptions);
  }

  getPdfSlipMulti(ids: number[]) {
    const params = ids.join(',');

    return this.http.get(
      `${this.apiUrl}/TradingPr/print_slip_multi?ids=${params}`,
      {
        responseType: 'blob'
      }
    );
  }

}
