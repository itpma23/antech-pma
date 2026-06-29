import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
// import { TranslateService } from '@ngx-translate/core';
// import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_API_URL } from 'src/app/app.constants';
import { PrcPp } from '../models/prc_pp.model';
import { FileSaverService } from 'ngx-filesaver';

@Injectable({
  providedIn: 'root'
})

export class PrcPpService {

  private apiUrl = SERVER_API_URL;


  constructor(
    public router: Router,
    private http: HttpClient,
    private _FileSaverService: FileSaverService,

  ) {


  }


  closing(id: any, data: any) {
    return this.http.post(`${this.apiUrl}/PrcPp/closing/${id}`, data);
  }

  getAll() {
    return this.http.get<PrcPp[]>(`${this.apiUrl}/PrcPp/getAll`);
  }
  getAllDetail() {
    return this.http.get<PrcPp[]>(`${this.apiUrl}/PrcPp/getAllDetail`);
  }
  getAllDetailByStatus() {
    return this.http.get<PrcPp[]>(`${this.apiUrl}/PrcPp/getAllDetailByStatus`);
  }
  getAllDetailLokasiByStatus(lokasi_id) {
    return this.http.get<PrcPp[]>(`${this.apiUrl}/PrcPp/getAllDetailLokasiByStatus/${lokasi_id}`);
  }

  getById(id: number) {
    return this.http.get(`${this.apiUrl}/PrcPp/${id}`);
  }

  create(data: any) {
    return this.http.post(`${this.apiUrl}/PrcPp`, data,

    );
  }

  update(id: any, PrcPp: any) {
    return this.http.put(`${this.apiUrl}/PrcPp/${id}`, PrcPp);
  }
  upload(id: any, PrcPp: any) {
    return this.http.post(`${this.apiUrl}/PrcPp/upload/${id}`, PrcPp);
  }

  delete(id: number) {
    let data = { "id": id.toString() };
    return this.http.delete(`${this.apiUrl}/PrcPp/${id}`);
  }
  countApproveData() {
    return this.http.post(`${this.apiUrl}/PrcPp/countByUserApprove`, null

    );
  }
  countPPReadyPO() {
    return this.http.post(`${this.apiUrl}/PrcPp/countPPReadyPO`, null

    );
  }
  approve(id: any, data: any) {
    return this.http.post(`${this.apiUrl}/PrcPp/approval/${id}`, data,

    );
  }
  reject(id: any, data: any) {
    return this.http.post(`${this.apiUrl}/PrcPp/reject/${id}`, data,

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
    return this.http.post(`${this.apiUrl}/PrcPp/laporan_pp_status`, data, httpOptions);
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
    return this.http.get<any>(`${this.apiUrl}/PrcPp/print_slip/${id}`, httpOptions);
  }
  download(id, fileName) {
    // const fileName ='file_Download';
    // if (fromRemote) {
    this.http.get(`${this.apiUrl}/PrcPp/download/${id}`, {
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
    return this.http.get<any>(`${this.apiUrl}/PrcPp/print_slip/${id}`, httpOptions);
  }

  getPdfSlipMulti(ids: number[]) {
    const params = ids.join(',');

    return this.http.get(
      `${this.apiUrl}/PrcPp/print_slip_multi?ids=${params}`,
      {
        responseType: 'blob'
      }
    );
  }

  	downloadKontrak(id) {
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
		return this.http.get<any>(`${this.apiUrl}/PrcPo/download/${id}`, httpOptions);
	}

}
