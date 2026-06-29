import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
// import { TranslateService } from '@ngx-translate/core';
// import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_API_URL } from 'src/app/app.constants';
import { InvPemakaianBarang } from '../models/inv_pemakaian_barang.model';
import { FileSaverService } from 'ngx-filesaver';

@Injectable({
  providedIn: 'root'
})

export class InvPengeluaranBarangService {

  private apiUrl = SERVER_API_URL;


  constructor(
    public router: Router,
    private http: HttpClient,
    private _FileSaverService: FileSaverService

  ) {


  }

  getAll() {
    return this.http.get<InvPemakaianBarang[]>(`${this.apiUrl}/InvPemakaianBarangOnline/getAll`);
  }
  getTraksi() {
    return this.http.get<InvPemakaianBarang[]>(`${this.apiUrl}/InvPemakaianBarangOnline/getTraksi`);
  }
  getAllDetail(id: number) {
    return this.http.get<InvPemakaianBarang[]>(`${this.apiUrl}/InvPemakaianBarangOnline/getAllDetail/${id}`);
  }
  getAllBelumPemakaianByLokasi(lokasi_id) {
    return this.http.get<InvPemakaianBarang[]>(`${this.apiUrl}/InvPemakaianBarangOnline/getAllBelumPemakaian/${lokasi_id}`);
  }


  getById(id: number) {
    return this.http.get(`${this.apiUrl}/InvPemakaianBarangOnline/${id}`);
  }

  create(data: any) {
    return this.http.post(`${this.apiUrl}/InvPemakaianBarangOnline`, data,);
  }
  delete(id: number) {
    let data = { "id": id.toString() };
    return this.http.delete(`${this.apiUrl}/InvPemakaianBarangOnline/${id}`);
  }
  update(id: any, InvPemakaianBarang: any) {
    return this.http.put(`${this.apiUrl}/InvPemakaianBarangOnline/${id}`, InvPemakaianBarang);
  }
  posting(id: any, data: any) {
    return this.http.post(`${this.apiUrl}/InvPemakaianBarangOnline/posting/${id}`, data);
  }

  reset(id: any, data: any) {
    return this.http.post(`${this.apiUrl}/InvPemakaianBarangOnline/reset/${id}`, data);
  }

  getPemakaianReportDetail(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType': 'blob' as 'json'

    };
    return this.http.post(`${this.apiUrl}/InvPemakaianBarangOnline/laporan_pemakaian_detail`, data, httpOptions);
  }
  getPemakaianReportByTanggal(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType': 'blob' as 'json'

    };
    return this.http.post(`${this.apiUrl}/InvPemakaianBarangOnline/laporan_pemakaian_by_tanggal`, data, httpOptions);
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
    return this.http.get<any>(`${this.apiUrl}/InvPemakaianBarangOnline/print_slip/${id}`, httpOptions);
  }

  approve(id: any, data: any) {
    return this.http.post(`${this.apiUrl}/InvPemakaianBarangOnline/approval/${id}`, data,

    );
  }

  reject(id: any, data: any) {
    return this.http.post(`${this.apiUrl}/InvPemakaianBarangOnline/reject/${id}`, data,

    );
  }
  proses(id: any, data: any) {
    return this.http.post(`${this.apiUrl}/InvPengeluaranBarang/proses/${id}`, data,

    );
  }


  getEvidence(id: any): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/InvPengeluaranBarang/getFile/${id}`, {
      responseType: 'blob'
    });
  }


  uploadEvidence(id: any, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/InvPengeluaranBarang/uploadFile/${id}`, formData);
  }


  countApproveData() {
    return this.http.post(`${this.apiUrl}/InvPemakaianBarangOnline/countByUserApprove`, null

    );
  }

  download(id, fileName) {
    // const fileName ='file_Download';
    // if (fromRemote) {
    this.http.get(`${this.apiUrl}/InvPemakaianBarangOnline/download/${id}`, {
      observe: 'response',
      responseType: 'blob'
    }).subscribe(res => {
      this._FileSaverService.save(res.body, fileName);
    });
    return;
  }

}
