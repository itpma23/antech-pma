import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
// import { TranslateService } from '@ngx-translate/core';
// import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_API_URL } from 'src/app/app.constants';
import { AccKasbank } from '../models/acc_kasbank.model';
import { FileSaverService } from 'ngx-filesaver';

@Injectable({
  providedIn: 'root'
})

export class AccKasbankService {

  private apiUrl = SERVER_API_URL;


  constructor(
    public router: Router,
    private http: HttpClient,
    private _FileSaverService: FileSaverService,

  ) {


  }

  getAll() {
    return this.http.get<AccKasbank[]>(`${this.apiUrl}/accKasbank/getAll`);
  }
  getTraksi() {
    return this.http.get<AccKasbank[]>(`${this.apiUrl}/accKasbank/getTraksi`);
  }
  getAllDetail(id: number) {
    return this.http.get<AccKasbank[]>(`${this.apiUrl}/accKasbank/getAllDetail/${id}`);
  }


  getById(id: number) {
    return this.http.get(`${this.apiUrl}/accKasbank/${id}`);
  }

  create(akun: any) {
    return this.http.post(`${this.apiUrl}/accKasbank`, akun,);
  }
  delete(id: number) {
    let data = { "id": id.toString() };
    return this.http.delete(`${this.apiUrl}/accKasbank/${id}`);
  }
  update(id: any, accKasbank: any) {
    return this.http.put(`${this.apiUrl}/accKasbank/${id}`, accKasbank);
  }
  posting(id: any, data: any) {
    return this.http.post(`${this.apiUrl}/accKasbank/posting/${id}`, data);
  }
  getLaporanSaldo(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType': 'blob' as 'json'

    };
    return this.http.post(`${this.apiUrl}/accKasbank/laporan_saldo`, data, httpOptions);
  }
  getLaporanSaldoRinci(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType': 'blob' as 'json'

    };
    return this.http.post(`${this.apiUrl}/accKasbank/laporan_saldo_rinci`, data, httpOptions);
  }
  getLaporanTransaksiKasbank(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType': 'blob' as 'json'

    };
    return this.http.post(`${this.apiUrl}/accKasbank/laporan_transaksi_kasbank`, data, httpOptions);
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
    return this.http.get<any>(`${this.apiUrl}/accKasbank/print_slip/${id}`, httpOptions);
  }
  getPdfSlipttdV2(id) {
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
    return this.http.get<any>(`${this.apiUrl}/accKasbank/print_slip_ttd/${id}`, httpOptions);
  }

    getPdfSlipKasBank(id) {
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
    return this.http.get<any>(`${this.apiUrl}/accKasbank/print_slip_kas_bank_report/${id}`, httpOptions);
  }

  upload(id:any,accKasbank: any) {
		return this.http.post(`${this.apiUrl}/accKasbank/upload/${id}`, accKasbank);
	}


  download(id,fileName){
    // const fileName ='file_Download';
     // if (fromRemote) {
       this.http.get(`${this.apiUrl}/accKasbank/download/${id}`, {
         observe: 'response',
         responseType: 'blob'
       }).subscribe(res => {
         this._FileSaverService.save(res.body, fileName);
       });
       return;
     //}
     // const fileType = this._FileSaverService.genType(fileName);
     // const txtBlob = new Blob([this.text], { type: fileType });
     // this._FileSaverService.save(txtBlob, fileName);
   }

          openFile(id: number, fileName: string) {
    this.http.get(`${this.apiUrl}/accKasbank/download/${id}`, {
      observe: 'response',
      responseType: 'blob'
    }).subscribe(res => {
      const parts = fileName.split('.');
      const ext = parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
      let mimeType = 'application/octet-stream';

      // Deteksi MIME type
      if (ext === 'pdf') mimeType = 'application/pdf';
      else if (['jpg', 'jpeg', 'png'].includes(ext))
        mimeType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
      else if (ext === 'txt') mimeType = 'text/plain';

      const blob = new Blob([res.body], { type: mimeType });
      const url = window.URL.createObjectURL(blob);

      // Buka langsung kalau bisa
      if (['pdf', 'jpg', 'jpeg', 'png', 'txt'].includes(ext)) {
        window.open(url, '_blank');
      }
      // File office & arsip → download saja
      else {
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      // Bersihkan blob langsung setelah dipakai
      window.URL.revokeObjectURL(url);
    });
  }

  getLaporanSaldoNew(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType': 'blob' as 'json'
    };

    return this.http.post(`${this.apiUrl}/accKasbank/laporan_saldo_new`, data, httpOptions);
  }
  

    getLaporanSaldoRinciNew(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType': 'blob' as 'json'

    };
    return this.http.post(`${this.apiUrl}/accKasbank/laporan_saldo_rinci_new`, data, httpOptions);
  }
    getLaporanTransaksiKasbankNew(data){
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType': 'blob' as 'json'

    };

    return this.http.post(`${this.apiUrl}/accKasbank/laporan_transaksi_kasbank_new`, data, httpOptions);
  }
}
