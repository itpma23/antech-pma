import { Component, OnInit, ViewChild } from '@angular/core';

import { SERVER_API_URL, SERVER_PATH_URL } from 'src/app/app.constants';
import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import PerfectScrollbar from 'perfect-scrollbar';
import { AccJurnalService } from 'src/app/shared/services/acc_jurnal.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
declare var swal: any;
const MenuName = 'acc_kegiatan';
export class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'list-cmp',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.css']
})

export class ListComponent implements OnInit {
  // dtOptions: DataTables.Settings = {};
  dtOptions: any;
  private apiUrl = SERVER_API_URL;
  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();

  datepickerConfig = {
    dateInputFormat: 'YYYY-MM-DD', // format tampilannya
    containerClass: 'theme-default', // bisa ubah jadi theme-dark-blue, theme-green, dst
    showWeekNumbers: false
  };

  datepickerConfigAtas = {
    ...this.datepickerConfig,
    containerClass: 'theme-red',
    adaptivePosition: true
  };

  dbName;
  pathName;
  PATH_URL;
  status = '1';
  isChecked = false;
  checkedList: any;
  accessButton: any;
  entryForm: FormGroup;
  isFormSubmitted: boolean = false;
  dataSelectLokasi: any[];
  entryFormTanggal: FormGroup;
  dataSelectModul: any[] = [];

  isFormSubmittedTanggal: boolean;
  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private accJurnalService: AccJurnalService, private GbmOrganisasiService: GbmOrganisasiService,
    private builder: FormBuilder,) {
    // this.dbName = this.authenticationService.getUserDB();
    // this.pathName = this.authenticationService.getUserPath();
    // this.PATH_URL = SERVER_PATH_URL;

    // const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
    // const elemSidebar = <HTMLElement>document.querySelector('.sidebar-wrapper');
    // setTimeout(() => {
    //   let ps = new PerfectScrollbar(elemMainPanel);
    //   ps.update();
    //   let ps2 = new PerfectScrollbar(elemSidebar);
    //   ps2.update();

    // }, 1000);
    this.entryForm = this.builder.group({
      no_transaksi: new FormControl('', Validators.required),
      modul: new FormControl('', Validators.required),
      lokasi_id: new FormControl([], Validators.required),
    });

    this.entryFormTanggal = this.builder.group({
      tanggal_awal: new FormControl('', Validators.required),
      tanggal_akhir: new FormControl('', Validators.required),
      modul: new FormControl('', Validators.required),
      lokasi_id: new FormControl([], Validators.required),
    });

  }

  get userControl() { return this.entryForm.controls; }
  get userControlTanggal() { return this.entryFormTanggal.controls; }
  ngOnInit() {
    const today = new Date();
    const last30Days = new Date();
    last30Days.setDate(today.getDate() - 30);

    this.entryFormTanggal.patchValue({
      tanggal_akhir: today
    });

      this.http.get<any>(this.apiUrl + '/AdmUnpostingModul/list')
    .subscribe(res => {
      this.dataSelectModul = res.data; // <-- simpan hasilnya
    });

  }


  ngAfterViewInit(): void {
    this.GbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
    });

  }
  ngOnDestroy(): void {

  }
  changeStatus(status) {


  }


  onSubmitByNo() {
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let dataSubmit = this.entryForm.value;
    dataSubmit['lokasi_id'] = this.entryForm.value['lokasi_id']['id'];
    console.log(dataSubmit);
    this.accJurnalService.unposting(dataSubmit).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Unpost berhasil',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
      } else {
        swal({
          title: 'Perhatian!',
          text: 'Proses Unpost Gagal: ' + data['data'],
          type: 'warning',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
      }
    });
  }

  onSubmitByTanggal() {
    this.isFormSubmittedTanggal = true;

    if (this.entryFormTanggal.invalid) {
      return;
    }

    let dataSubmit = this.entryFormTanggal.value;

    // ambil id lokasi dari objek select2
    dataSubmit['lokasi_id'] = this.entryFormTanggal.value['lokasi_id']['id'];

    console.log(dataSubmit);

    // panggil service untuk unposting by tanggal
    this.accJurnalService.unpostingByTanggal(dataSubmit).subscribe(data => {
      console.log(data);

      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Unpost by tanggal berhasil',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        });
      } else {
        swal({
          title: 'Perhatian!',
          text: 'Proses Unpost Gagal: ' + data['data'],
          type: 'warning',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        });
        return;
      }
    });
  }





}
