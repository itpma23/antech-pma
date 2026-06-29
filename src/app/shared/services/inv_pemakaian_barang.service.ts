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

@Injectable({
  providedIn: 'root'
})

export class InvPemakaianBarangService {

  private apiUrl = SERVER_API_URL;


  constructor(
    public router: Router,
    private http: HttpClient,

  ) {


  }

  getAll() {
    return this.http.get<InvPemakaianBarang[]>(`${this.apiUrl}/InvPemakaianBarang/getAll`);
  }
  getTraksi() {
    return this.http.get<InvPemakaianBarang[]>(`${this.apiUrl}/InvPemakaianBarang/getTraksi`);
  }
  getAllDetail(id: number) {
    return this.http.get<InvPemakaianBarang[]>(`${this.apiUrl}/InvPemakaianBarang/getAllDetail/${id}`);
  }
  getAllBelumPemakaianByLokasi(lokasi_id) {
    return this.http.get<InvPemakaianBarang[]>(`${this.apiUrl}/InvPemakaianBarang/getAllBelumPemakaian/${lokasi_id}`);
  }

  getKetTerakhirByItemId(item_id) {
    return this.http.get(`${this.apiUrl}/InvPemakaianBarang/getKetTerakhirByItemId/${item_id}`);
  }


  getById(id: number) {
    return this.http.get(`${this.apiUrl}/InvPemakaianBarang/${id}`);
  }

  create(data: any) {
    return this.http.post(`${this.apiUrl}/InvPemakaianBarang`, data,);
  }
  delete(id: number) {
    let data = { "id": id.toString() };
    return this.http.delete(`${this.apiUrl}/InvPemakaianBarang/${id}`);
  }
  update(id: any, InvPemakaianBarang: any) {
    return this.http.put(`${this.apiUrl}/InvPemakaianBarang/${id}`, InvPemakaianBarang);
  }
  posting(id: any, data: any) {
    return this.http.post(`${this.apiUrl}/InvPemakaianBarang/posting/${id}`, data);
  }

  getPemakaianReportDetail(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType': 'blob' as 'json'

    };
    return this.http.post(`${this.apiUrl}/InvPemakaianBarang/laporan_pemakaian_detail`, data, httpOptions);
  }
  getPemakaianReportByTanggal(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType': 'blob' as 'json'

    };
    return this.http.post(`${this.apiUrl}/InvPemakaianBarang/laporan_pemakaian_by_tanggal`, data, httpOptions);
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
    return this.http.get<any>(`${this.apiUrl}/InvPemakaianBarang/print_slip/${id}`, httpOptions);
  }

    getStokByItemAndGudang(itemId, gudangId){
     return this.http.get(`${this.apiUrl}/InvPemakaianBarangOnline/getStokItemByGudangId/${itemId}/${gudangId}`);
  }

  getBufferStok(itemId){
     return this.http.get(`${this.apiUrl}/InvPemakaianBarangOnline/getStokMinimumByIdItem/${itemId}`);
  }

}
