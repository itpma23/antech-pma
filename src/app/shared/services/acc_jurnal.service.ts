import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
// import { TranslateService } from '@ngx-translate/core';
// import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_API_URL } from 'src/app/app.constants';
import { AccJurnal } from '../models/acc_jurnal.model';

@Injectable({
	providedIn: 'root'
})

export class AccJurnalService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<AccJurnal[]>(`${this.apiUrl}/accJurnal/getAll`);
	}
	getTraksi() {
		return this.http.get<AccJurnal[]>(`${this.apiUrl}/accJurnal/getTraksi`);
	}
	getAllDetail(id: number) {
		return this.http.get<AccJurnal[]>(`${this.apiUrl}/accJurnal/getAllDetail/${id}`);
	}


	getById(id: number) {
		return this.http.get(`${this.apiUrl}/accJurnal/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/accJurnal`, akun,);
	}
	delete(id: number) {
		let data={"id":id.toString()};
			return this.http.delete(`${this.apiUrl}/accJurnal/${id}`);
		}
	update(id:any,accJurnal: any) {
		return this.http.put(`${this.apiUrl}/accJurnal/${id}`, accJurnal);
	}
  posting(id:any,data: any) {
		return this.http.post(`${this.apiUrl}/accJurnal/posting/${id}`, data);
	}
  unposting(data: any) {
		return this.http.post(`${this.apiUrl}/accJurnalUnpost/unpost`, data);
	}

  getLaporanNeracaSaldo(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/accJurnal/laporan_neraca_saldo`, data,httpOptions);
	}

  getLaporanNeracaSaldoMutasi(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/accJurnal/laporan_neraca_saldo_mutasi`, data,httpOptions);
	}
  getLaporanNeracaSaldoInti(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/accJurnal/laporan_neraca_saldo_inti`, data,httpOptions);
	}
  getLaporanNeracaSaldoAllUnit(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/accJurnal/laporan_neraca_saldo_all_unit`, data,httpOptions);
	}
  getLaporanNeracaSaldoAllUnitInti(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/accJurnal/laporan_neraca_saldo_all_unit_inti`, data,httpOptions);
	}
  getLaporanNeraca(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/accJurnal/laporan_neraca`, data,httpOptions);
	}
  getLaporanNeracaInti(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/accJurnal/laporan_neraca_inti`, data,httpOptions);
	}
  getLaporanEquitas(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/accJurnal/laporan_equitas`, data,httpOptions);
	}
  getLaporanLabaRugi(data) {
    const httpOptions = {

      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/accJurnal/laporan_laba_rugi`, data,httpOptions);
	}
  getLaporanLabaRugiInti(data) {
    const httpOptions = {

      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/accJurnal/laporan_laba_rugi_inti`, data,httpOptions);
	}
  getLaporanCashflow(data) {
    const httpOptions = {

      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/accJurnal/laporan_cashflow`, data,httpOptions);
	}
  getLaporanBukuBesar(data) {
    const httpOptions = {

      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/accJurnal/laporan_buku_besar`, data,httpOptions);
	}
  getLaporanJurnal(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType' : 'blob' as 'json'

    };
		return this.http.post(`${this.apiUrl}/accJurnal/laporan_jurnal`, data,httpOptions);
	}
  getExportJurnal(data) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type':  'application/pdf',
      //    'Accept' : 'application/pdf',
      // }),
      'responseType': 'blob' as 'json'

    };
    return this.http.post(`${this.apiUrl}/accJurnal/export_jurnal_excel`, data, httpOptions);
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
			return this.http.get<any>(`${this.apiUrl}/accJurnal/print_slip/${id}`,httpOptions);
		}
    getLaporanCostBlokDetail(data) {
      const httpOptions = {
        // headers: new HttpHeaders({
        //   'Content-Type':  'application/pdf',
        //    'Accept' : 'application/pdf',
        // }),
        'responseType' : 'blob' as 'json'

      };
      return this.http.post(`${this.apiUrl}/accJurnal/laporan_cost_blok_detail`, data,httpOptions);
    }
    getLaporanCostAfdeling(data) {
      const httpOptions = {
            'responseType' : 'blob' as 'json'

      };
      return this.http.post(`${this.apiUrl}/accJurnal/laporan_cost_afdeling`, data,httpOptions);
    }
    getLaporanCostStasiun(data) {
      const httpOptions = {
            'responseType' : 'blob' as 'json'

      };
      return this.http.post(`${this.apiUrl}/accJurnal/laporan_cost_stasiun`, data,httpOptions);
    }
    getLaporanCostAfdelingBgt(data) {
      const httpOptions = {
            'responseType' : 'blob' as 'json'

      };
      return this.http.post(`${this.apiUrl}/accJurnal/laporan_cost_afdeling_bgt`, data,httpOptions);
    }
    getLaporanCostBlokRekap(data) {
      const httpOptions = {
          'responseType' : 'blob' as 'json'

      };
      return this.http.post(`${this.apiUrl}/accJurnal/laporan_cost_blok_rekap`, data,httpOptions);
    }
    getLaporanCostAfdelingRekap(data) {
      const httpOptions = {
          'responseType' : 'blob' as 'json'

      };
      return this.http.post(`${this.apiUrl}/accJurnal/laporan_cost_afdeling_rekap`, data,httpOptions);
    }

    getLaporanCostAfdelingRekapBgt(data) {
      const httpOptions = {
          'responseType' : 'blob' as 'json'

      };
      return this.http.post(`${this.apiUrl}/accJurnal/laporan_cost_afdeling_rekap_bgt`, data,httpOptions);
    }
    getLaporanCostBlokRekapKegiatan(data) {
      const httpOptions = {
        'responseType' : 'blob' as 'json'
      };
      return this.http.post(`${this.apiUrl}/accJurnal/laporan_cost_blok_rekap_kegiatan`, data,httpOptions);
    }
    getLaporanCostAfdelingRekapKegiatan(data) {
      const httpOptions = {
        'responseType' : 'blob' as 'json'
      };
      return this.http.post(`${this.apiUrl}/accJurnal/laporan_cost_Afdeling_rekap_kegiatan`, data,httpOptions);
    }
    getLaporanBiayaUmum(data) {
      const httpOptions = {
          'responseType' : 'blob' as 'json'

      };
      return this.http.post(`${this.apiUrl}/accJurnal/laporan_biaya_umum`, data,httpOptions);
    }
    getLaporanCostPriceByEstate(data) {
      const httpOptions = {
          'responseType' : 'blob' as 'json'

      };
      return this.http.post(`${this.apiUrl}/accJurnal/laporan_cost_price_by_estate`, data,httpOptions);
    }
    getLaporanBiayaUmumMill(data) {
      const httpOptions = {
          'responseType' : 'blob' as 'json'

      };
      return this.http.post(`${this.apiUrl}/accJurnal/laporan_biaya_umum_mill`, data,httpOptions);
    }
    getLaporanBiayaUmumBgt(data) {
      const httpOptions = {
          'responseType' : 'blob' as 'json'

      };
      return this.http.post(`${this.apiUrl}/accJurnal/laporan_biaya_umum_bgt`, data,httpOptions);
    }
    getLaporanCostStasiunDetail(data) {
      const httpOptions = {
        // headers: new HttpHeaders({
        //   'Content-Type':  'application/pdf',
        //    'Accept' : 'application/pdf',
        // }),
        'responseType' : 'blob' as 'json'

      };
      return this.http.post(`${this.apiUrl}/accJurnal/laporan_cost_stasiun_detail`, data,httpOptions);
    }
    getLaporanCostStasiunRekap(data) {
      const httpOptions = {
        // headers: new HttpHeaders({
        //   'Content-Type':  'application/pdf',
        //    'Accept' : 'application/pdf',
        // }),
        'responseType' : 'blob' as 'json'

      };
      return this.http.post(`${this.apiUrl}/accJurnal/laporan_biaya_rekap_mill`, data,httpOptions);
    }
    getLaporanPemakaianBahanStasiun(data) {
      const httpOptions = {
      'responseType' : 'blob' as 'json'

      };
      return this.http.post(`${this.apiUrl}/accJurnal/laporan_pemakaian_bahan_stasiun`, data,httpOptions);
    }
    getLaporanPemakaianBahanEstate(data) {
      const httpOptions = {
      'responseType' : 'blob' as 'json'

      };
      return this.http.post(`${this.apiUrl}/accJurnal/laporan_pemakaian_bahan_estate`, data,httpOptions);
    }
    getLaporanCostStasiunRekapKegiatan(data) {
      const httpOptions = {
        // headers: new HttpHeaders({
        //   'Content-Type':  'application/pdf',
        //    'Accept' : 'application/pdf',
        // }),
        'responseType' : 'blob' as 'json'

      };
      return this.http.post(`${this.apiUrl}/accJurnal/laporan_cost_stasiun_rekap_kegiatan`, data,httpOptions);
    }
    getLaporanCostTraksiDetail(data) {
      const httpOptions = {
        // headers: new HttpHeaders({
        //   'Content-Type':  'application/pdf',
        //    'Accept' : 'application/pdf',
        // }),
        'responseType' : 'blob' as 'json'

      };
      return this.http.post(`${this.apiUrl}/accJurnal/laporan_cost_traksi_detail`, data,httpOptions);
    }
    getLaporanCostTraksiRekap(data) {
      const httpOptions = {
        'responseType' : 'blob' as 'json'

      };
      return this.http.post(`${this.apiUrl}/accJurnal/laporan_cost_traksi_rekap`, data,httpOptions);
    }
    getLaporanCostTraksiRasio(data) {
      const httpOptions = {
        'responseType' : 'blob' as 'json'

      };
      return this.http.post(`${this.apiUrl}/accJurnal/laporan_traksi_rasio_pemakaian_bbm`, data,httpOptions);
    }
    getLaporanRekapCostPemakaianBBM(data) {
      const httpOptions = {
        'responseType' : 'blob' as 'json'

      };
      return this.http.post(`${this.apiUrl}/accJurnal/laporan_traksi_rekap_pemakaian_bbm`, data,httpOptions);
    }
    getLaporanPemakaianBahanTraksi(data) {
      const httpOptions = {
      'responseType' : 'blob' as 'json'

      };
      return this.http.post(`${this.apiUrl}/accJurnal/laporan_pemakaian_bahan_traksi`, data,httpOptions);
    }
    getLaporanCostWorkshopRekap(data) {
      const httpOptions = {
        'responseType' : 'blob' as 'json'

      };
      return this.http.post(`${this.apiUrl}/accJurnal/laporan_cost_workshop_rekap`, data,httpOptions);
    }
      unpostingByTanggal(data: any) {
		return this.http.post(`${this.apiUrl}/accJurnalUnpost/unpostByTanggal`, data);
	}
}
