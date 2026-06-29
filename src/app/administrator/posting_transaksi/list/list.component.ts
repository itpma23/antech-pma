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
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { isNullOrUndefined } from 'util';
import { EstBkmPanenService } from 'src/app/shared/services/est_bkm_panen.service';
import { EstBkmPemeliharaanService } from 'src/app/shared/services/est_bkm_pemeliharaan.service';
import { EstBkmUmumService } from 'src/app/shared/services/est_bkm_umum.service';
import { TrkKegiatanKendaraanService } from 'src/app/shared/services/trk_kegiatan_kendaraan.service';
import { WrkKegiatanService } from 'src/app/shared/services/wrk_kegiatan.service';
import { formatDate } from '@angular/common';
declare var swal: any;
const MenuName = 'administrator_posting';
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
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
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
  listForm: FormGroup;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private hrmsperiodeGajiService: HrmsPeriodeGajiService,
    private hrmsKaryawanGajiService: HrmsKaryawanGajiService,
    private router: Router, private builder: FormBuilder,
    private gbmOrganisasiService: GbmOrganisasiService,
    private estBkmPanenService: EstBkmPanenService,
    private estBkmPemeliharaanService: EstBkmPemeliharaanService,
    private estBkmUmumService: EstBkmUmumService,
    private trkKegiatanKendaraanService: TrkKegiatanKendaraanService,
    private wrkKegiatanService: WrkKegiatanService,

  ) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;

    let toDate: Date = new Date();
    // let startdate = new Date(toDate.getFullYear(), 0, 1)// 1 Januari tahun sekarang
    let startdate = new Date()// 1 Januari tahun sekarang
    this.listForm = this.builder.group({
      lokasi: new FormControl([], Validators.required),
      modul: new FormControl([], Validators.required),
      tanggal_mulai: new FormControl(startdate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
    });



  }

  ngOnInit() {
    this.authenticationService.getAccessButton(MenuName).subscribe((u) => {
      this.accessButton = u['data'];
      console.log(this.accessButton);


    });


  }


  ngAfterViewInit(): void {
    this.gbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
    });
    this.listForm.controls['lokasi'].valueChanges.subscribe(x => {
      // console.log(x);
      let org_id = x.id;


    });
    this.dtTrigger.next();
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

    // this.isFormSubmitted = true;
    if (this.listForm.invalid) {
      return;
    }
    swal({
      title: 'Yakin akan melakukan proses?',
      text: "Proses Posting",
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
      let modul = that.listForm.get('modul').value;

      let parameter = {
        'lokasi_id': lokasi_id,
        'modul': modul,
        'tgl_mulai': formatDate(that.listForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
        'tgl_akhir': formatDate(that.listForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),

      };
      console.log(parameter)
      if (modul == 'PANEN') {
        that.estBkmPanenService.posting_tanggal(parameter).subscribe(data => {
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
      } else if (modul == 'PEMELIHARAAN') {
        that.estBkmPemeliharaanService.posting_tanggal(parameter).subscribe(data => {
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
      } else if (modul == 'UMUM') {
        that.estBkmUmumService.posting_tanggal(parameter).subscribe(data => {
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
      } else if (modul == 'TRAKSI') {
        that.trkKegiatanKendaraanService.posting_tanggal(parameter).subscribe(data => {
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
      } else if (modul == 'WORKSHOP') {
        that.wrkKegiatanService.posting_tanggal(parameter).subscribe(data => {
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
      }
    });
  }


}
