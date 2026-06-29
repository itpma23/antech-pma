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
import { HrmsPengajuanCuti } from '../models/hrms_pengajuan_cuti.model';
import { FileSaverService } from 'ngx-filesaver';

@Injectable({
	providedIn: 'root'
})

export class HrmsPengajuanCutiService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,
		private _FileSaverService: FileSaverService,
	) {


	}

	closing(id:any,data: any) {
		return this.http.post(`${this.apiUrl}/HrmsPengajuanCuti/closing/${id}`, data);
	}

	getAll() {
		return this.http.get<HrmsPengajuanCuti[]>(`${this.apiUrl}/HrmsPengajuanCuti/getAll`);
	}

	getRincianCuti() {
		return this.http.get<any[]>(`${this.apiUrl}/HrmsPengajuanCuti/RincianPengajuanCuti`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/HrmsPengajuanCuti/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/HrmsPengajuanCuti`, akun,

    );
	}

	update(id:any,HrmsPengajuanCuti: any) {
		return this.http.put(`${this.apiUrl}/HrmsPengajuanCuti/${id}`, HrmsPengajuanCuti);
	}
	upload(id:any,HrmsPengajuanCuti: any) {
		return this.http.post(`${this.apiUrl}/HrmsPengajuanCuti/upload/${id}`, HrmsPengajuanCuti);
	}
	download(id,fileName){
		// const fileName ='file_Download';
		 // if (fromRemote) {
		   this.http.get(`${this.apiUrl}/HrmsPengajuanCuti/download/${id}`, {
			 observe: 'response',
			 responseType: 'blob'
		   }).subscribe(res => {
			 this._FileSaverService.save(res.body, fileName);
		   });
		   return;
	   }
	revisi(id:any,HrmsPengajuanCuti: any) {
		return this.http.put(`${this.apiUrl}/HrmsPengajuanCuti/revisi/${id}`, HrmsPengajuanCuti);
	}

 	posting(id:any,data: any) {
		return this.http.post(`${this.apiUrl}/HrmsPengajuanCuti/posting/${id}`, data);
	}

	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/HrmsPengajuanCuti/${id}`);
	}
  getAllBySupplier(supp_id: number) {
		return this.http.get(`${this.apiUrl}/HrmsPengajuanCuti/getAllBySupplier/${supp_id}`);
	}
  getAllPOReleaseBySupplier(supp_id: number) {
		return this.http.get(`${this.apiUrl}/HrmsPengajuanCuti/getAllPOReleaseBySupplier/${supp_id}`);
	}
	getAllDetailBlmTerima(po_id: number) {
		return this.http.get(`${this.apiUrl}/HrmsPengajuanCuti/getAllDetailBlmTerima/${po_id}`);
	}
	getAllDetailSdhTerima(po_id: number) {
		return this.http.get(`${this.apiUrl}/HrmsPengajuanCuti/getAllDetailSdhTerima/${po_id}`);
	}
  getAllDetailPoOnly(po_id: number) {
		return this.http.get(`${this.apiUrl}/HrmsPengajuanCuti/getAllDetail/${po_id}`);
	}



  getPoReportDetail(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/HrmsPengajuanCuti/laporan_po_detail`, data,httpOptions);
	}
	getPdfSlip(id) {
		const httpOptions = {
		  headers: new HttpHeaders({
			'Content-Type':  'application/pdf',
			// 'Authorization' : this.authKey,
			 'Accept' : 'application/pdf',
			// 'NAMADB': 'testing',
			// 'NAMAPATH': 'Testing'
			//observe : 'response'
		  }),
		  'responseType' : 'blob' as 'json'

		};
			return this.http.get<any>(`${this.apiUrl}/HrmsPengajuanCuti/print_slip/${id}`,httpOptions);
		}
    getPdfSlipCekHarga(id) {
      const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/pdf',
        // 'Authorization' : this.authKey,
         'Accept' : 'application/pdf',
        // 'NAMADB': 'testing',
        // 'NAMAPATH': 'Testing'
        //observe : 'response'
        }),
        'responseType' : 'blob' as 'json'

      };
        return this.http.get<any>(`${this.apiUrl}/HrmsPengajuanCuti/print_slip_cek_harga/${id}`,httpOptions);
      }
    countApproveData() {
      return this.http.post(`${this.apiUrl}/HrmsPengajuanCuti/countByUserApprove`,null

      );
    }
    countPPReadyPO() {
      return this.http.post(`${this.apiUrl}/HrmsPengajuanCuti/countPPReadyPO`,null

      );
    }
    approve(id: any, data: any) {
      return this.http.post(`${this.apiUrl}/HrmsPengajuanCuti/approval/${id}`, data,

      );
    }
    reject(id: any, data: any) {
      return this.http.post(`${this.apiUrl}/HrmsPengajuanCuti/reject/${id}`, data,

      );
    }
}
