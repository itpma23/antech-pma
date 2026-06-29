import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SERVER_API_URL, SERVER_PATH_URL } from 'src/app/app.constants';
import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HrmsPeriodeGajiService } from 'src/app/shared/services/hrms_periode_gaji.service';
import { HrmsKaryawanGajiService } from 'src/app/shared/services/hrms_karyawan_gaji.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';

import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { isNullOrUndefined } from 'util';
import { formatDate } from '@angular/common';

declare var swal: any;
const MenuName = 'hrms_periode_gaji';
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
  templateUrl: 'list.component.html'
})

export class ListComponent implements OnInit {
  // dtOptions: DataTables.Settings = {};
  dtOptions: any;
  persons: any[];
  private apiUrl = SERVER_API_URL;
  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  exportAsConfig: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'mytable',
  };
  periodeGaji = [];
  //public dataTable: DataTable;

  bsModalRef: BsModalRef;
  dbName;
  pathName;
  PATH_URL;
  accessButton: any;
  dataSelectLokasi: any[];
  listForm: any;
  dataSelectAfdeling: any[];
  dataSelectPeriode: any[];
  isFormSubmitted: boolean=false;
  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private hrmsperiodeGajiService: HrmsPeriodeGajiService,
    private hrmsKaryawanGajiService: HrmsKaryawanGajiService,
    private router: Router, private builder: FormBuilder,
    private gbmOrganisasiService: GbmOrganisasiService) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;

    let toDate: Date = new Date();
    // let startdate = new Date(toDate.getFullYear(), 0, 1)// 1 Januari tahun sekarang
    let startdate = new Date()// 1 Januari tahun sekarang
    this.listForm = this.builder.group({
      lokasi: new FormControl([], Validators.required),
      afdeling: new FormControl([], Validators.required),
      periode: new FormControl([], Validators.required),
      // tanggal_mulai: new FormControl(startdate, Validators.required),
      // tanggal_akhir: new FormControl(toDate, Validators.required),
    });



  }

  ngOnInit() {
    this.authenticationService.getAccessButton(MenuName).subscribe((u) => {
      this.accessButton = u['data'];
      console.log(this.accessButton);


    });
  }
  get userControl() { return this.listForm.controls; }

  ngAfterViewInit(): void {
    this.gbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
    });
    this.listForm.controls['lokasi'].valueChanges.subscribe(x => {
      let org_id = x.id;
      // this.GbmOrganisasiService.getAfdelingByEstate(org_id).subscribe(x => {
      this.gbmOrganisasiService.getAfdelingByEstateAndUser(org_id).subscribe(x => {
        this.dataSelectAfdeling = [];
        x.forEach(d => {
          this.dataSelectAfdeling.push({ "id": d.id, "text": d.nama });
        });

      });
      this.hrmsperiodeGajiService.getByLokasiId(org_id).subscribe((x:any) => {
        this.dataSelectPeriode = [];
        x['data'].forEach(d => {
          this.dataSelectPeriode.push({ "id": d.id, "text": d.nama });
        });

      });

    });
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  getTipe(tipe) {
    let nama = ""

    return nama;
  }
  onSubmit() {
    let that = this;

    this.isFormSubmitted = true;
    if (this.listForm.invalid) {
      return;
    }
    swal({
      title: 'Yakin akan melakukan proses?',
      text: "Proses Payroll",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Ya, Lakukan Proses',
      cancelButtonText: 'Batal',

      buttonsStyling: false
    }).then(function () {
      var currentdate = new Date();
      let lokasi_id = that.listForm.get('lokasi').value.id;
      let afdeling_id = that.listForm.get('afdeling').value.id;
      let periode_id = that.listForm.get('periode').value.id;

      let parameter = {
        'lokasi_id': lokasi_id,
        'afdeling_id': afdeling_id,
        'id': periode_id,
        // 'tgl_mulai': formatDate(that.listForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
        // 'tgl_akhir': formatDate(that.listForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),

      };
      console.log(parameter)

        that.hrmsKaryawanGajiService.startProsesByAfdeling(parameter).subscribe(data => {
          console.log(data);
          var currentdate2 = new Date();
          let m = "start:" + currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds() +
            " end:" + currentdate2.getDate() + "/"
            + (currentdate2.getMonth() + 1) + "/"
            + currentdate2.getFullYear() + " @ "
            + currentdate2.getHours() + ":"
            + currentdate2.getMinutes() + ":"
            + currentdate2.getSeconds();
          swal({
            title: 'Proses!',
            text: data['data'] + "\n" + m,
            type: (data['status'] == 'OK') ? 'success' : 'warning',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          })
        })

    });
  }
  proses(id) {
    let that = this;
    swal({
      title: 'Yakin akan melakukan proses?',
      text: "Proses Payroll",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Ya, Lakukan Proses',
      cancelButtonText: 'Batal',

      buttonsStyling: false
    }).then(function () {
      var currentdate = new Date();
      that.hrmsKaryawanGajiService.startProses(id).subscribe(data => {
        // console.log(data);
        var currentdate2 = new Date();
        let m="start:"+ currentdate.getDate() + "/"
        + (currentdate.getMonth()+1)  + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds() +
        " end:"+currentdate2.getDate() + "/"
        + (currentdate2.getMonth()+1)  + "/"
        + currentdate2.getFullYear() + " @ "
        + currentdate2.getHours() + ":"
        + currentdate2.getMinutes() + ":"
        + currentdate2.getSeconds();
        swal({
          title: 'Proses!',
          text: data['data']+"\n"+m,
          type: (data['status'] == 'OK') ? 'success' : 'warning',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })


      });


    });

  }
  posting(id) {
    let that = this;
    swal({
      title: 'Yakin akan melakukan Posting?',
      text: "Posting Payroll",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Ya, Lakukan Proses',
      cancelButtonText: 'Batal',

      buttonsStyling: false
    }).then(function () {
      var currentdate = new Date();
      that.hrmsKaryawanGajiService.startPostingGaji(id).subscribe(data => {

        console.log(data);
        var currentdate2 = new Date();
        let m="start:"+ currentdate.getDate() + "/"
        + (currentdate.getMonth()+1)  + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds() +
        " end:"+currentdate2.getDate() + "/"
        + (currentdate2.getMonth()+1)  + "/"
        + currentdate2.getFullYear() + " @ "
        + currentdate2.getHours() + ":"
        + currentdate2.getMinutes() + ":"
        + currentdate2.getSeconds();

        if (data['status'] == 'OK') {

          swal({
            title: 'Posting!',
            text: data['data'] +"\n"+m,
            type: (data['status'] == 'OK') ? 'success' : 'warning',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          })
        }
        else {

          swal({
            title: 'Perhatian!',
            text: data['data']+"/n"+m,
            type: 'warning',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          })

        }


      });


    });

  }
  posting_bpjs(id) {
    let that = this;
    swal({
      title: 'Yakin akan melakukan Posting?',
      text: "Posting Payroll",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Ya, Lakukan Proses',
      cancelButtonText: 'Batal',

      buttonsStyling: false
    }).then(function () {
      that.hrmsKaryawanGajiService.startPostingJamsostek(id).subscribe(data => {
        console.log(data);
        if (data['status'] == 'OK') {

          swal({
            title: 'Posting!',
            text: data['data'],
            type: (data['status'] == 'OK') ? 'success' : 'warning',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          })
        }
        else {

          swal({
            title: 'Perhatian!',
            text: data['data'],
            type: 'warning',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          })

        }


      });


    });

  }
  posting_biaya(id) {
    let that = this;
    swal({
      title: 'Yakin akan melakukan Posting?',
      text: "Posting BPJS Kesehatan",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Ya, Lakukan Proses',
      cancelButtonText: 'Batal',

      buttonsStyling: false
    }).then(function () {
      that.hrmsKaryawanGajiService.startPostingBpjsKesehatan(id).subscribe(data => {
        console.log(data);
        if (data['status'] == 'OK') {

          swal({
            title: 'Posting!',
            text: data['data'],
            type: (data['status'] == 'OK') ? 'success' : 'warning',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          })
        }
        else {

          swal({
            title: 'Perhatian!',
            text: data['data'],
            type: 'warning',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          })

        }


      });


    });

  }
  view(id) {
    let data = {
      'format_laporan': 'view',
      'jenis': '0',
      'divisi_id': null,
      'status_id': null
    };
    this.hrmsKaryawanGajiService.getLaporanGaji(id, data).subscribe((res: any) => {
      console.log(res);
      var fileURL = URL.createObjectURL(res);
      window.open(fileURL);

    });

  }

  filter(e) {
    console.log(e)
  }
  detail(id: number) {
    this.router.navigate(['akun/detail', id.toString(), { previousUrl: this.router.url }]);

  }
}
