import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SERVER_API_URL, SERVER_PATH_URL } from 'src/app/app.constants';

import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { saveAs } from 'file-saver';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { HrmsKaryawanGaji } from 'src/app/shared/models/hrms_karyawan_gaji.model';
import { HrmsKaryawanGajiService } from 'src/app/shared/services/hrms_karyawan_gaji.service';
import { isNullOrUndefined } from 'util';
declare var swal: any;

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
  isFormSubmitted = false;
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
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  absensi = [];
  //public dataTable: DataTable;

  bsModalRef: BsModalRef;
  dbName;
  pathName;
  PATH_URL;
  Kelas: any;
  public dataSelectLokasi: any[] = [];
  public dataSelectAfdeling: any[] = [];
  entryForm: FormGroup;


  dataSelectGudang;
  dataSelectItem;
  html_data: "";


  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private hrmsKaryawanGajiService: HrmsKaryawanGajiService,
    private router: Router, private builder: FormBuilder,) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;
    let toDate: Date = new Date();
    this.entryForm = this.builder.group({
      lokasi_id: new FormControl([], Validators.required),
      afdeling_id: new FormControl([]),
      tgl_awal: new FormControl(toDate, Validators.required),
      tgl_akhir: new FormControl(toDate, Validators.required),
      tipe: new FormControl("kehadiran",),


    });

  }
  get userControl() { return this.entryForm.controls; }
  ngOnInit() {
    // this.loadDatatable();
    this.loadSelect2();
    this.loadDatatable();


  }
  private loadSelect2(): void {


    this.GbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });

      });
      this.Kelas = {};
      this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {
        console.log(x);
        let org_id = x.id;
          this.GbmOrganisasiService.getAfdelingByEstateAndUser(org_id).subscribe(x => {
          this.dataSelectAfdeling = [];
          x.forEach(d => {
            this.dataSelectAfdeling.push({ "id": d.id, "text": d.nama });
          });

        });

      });
    });
    // this.GbmOrganisasiService.getAllByType('SUBBAGIAN').subscribe(x => {
    //   this.dataSelectAfdeling = [];
    //   x.forEach(d => {
    //     this.dataSelectAfdeling.push({ "id": d.id, "text": d.nama });

    //   });
    //   this.Kelas = {};
    // });
  }
  KelasChange($e) {
    // this.piutangService.getViewProses(this.Kelas.id).subscribe(d => {
    //   this.absensi = d['data'];
    //   this.rerender();
    //  // console.log(this.absensi);
    // });


  }
  loadDatatable() {
    this.dtOptions = {
      paging: false,
      search: false,
      searching: false
      //pagingType: 'full_numbers',
      //pageLength: 2
    };
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload(null, false);
      setTimeout(() => {
        //this.dtTrigger.next();

        if (this.absensi.length > 0) {
          $('.tfoot_dt').addClass('d-none');
        } else {
          $('.tfoot_dt').removeClass('d-none');
        }
      });
    });
  }

  exportFiles(type) {
    this.exportAsConfig.type = type;
    this.exportAsService.save(this.exportAsConfig, 'akun').subscribe(() => { });
  }

  onSubmit() {
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    let tgl_awal = formatDate(this.entryForm.get('tgl_awal').value, "yyyy-MM-dd", 'en_US');
    let tgl_akhir = formatDate(this.entryForm.get('tgl_akhir').value, "yyyy-MM-dd", 'en_US');
    let tipe = this.entryForm.get('tipe').value;
    let lokasi_id = this.entryForm.get('lokasi_id').value['id'];
    let afdeling_id;
    if (isNullOrUndefined(this.entryForm.get('afdeling_id')) != true) {
      if (isNullOrUndefined(this.entryForm.get('afdeling_id').value)) {
        afdeling_id = null
      } else {
        afdeling_id = this.entryForm.get('afdeling_id').value.id;
      }

    } else {
      afdeling_id = null
    }
    let format_laporan = '';
    let data = { format_laporan: format_laporan, tgl_awal: tgl_awal, tgl_akhir: tgl_akhir, lokasi_id: lokasi_id, tipe: tipe, afdeling_id: afdeling_id }
    this.hrmsKaryawanGajiService.getRekapAbsensiKebun(data).subscribe(
      d => {
        // console.log(d);
        this.html_data = d['data'];
        // this.absensi = d['data'];
        // this.rerender();
      })

  }
  exportExcel() {
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    let tgl_awal = formatDate(this.entryForm.get('tgl_awal').value, "yyyy-MM-dd", 'en_US');
    let tgl_akhir = formatDate(this.entryForm.get('tgl_akhir').value, "yyyy-MM-dd", 'en_US');
    let tipe = this.entryForm.get('tipe').value;
    let lokasi_id = this.entryForm.get('lokasi_id').value['id'];
    let afdeling_id;
    if (isNullOrUndefined(this.entryForm.get('afdeling_id')) != true) {
      if (isNullOrUndefined(this.entryForm.get('afdeling_id').value)) {
        afdeling_id = null
      } else {
        afdeling_id = this.entryForm.get('afdeling_id').value.id;
      }

    } else {
      afdeling_id = null
    }
    let format_laporan = 'xls';
    let data = { format_laporan: format_laporan, tgl_awal: tgl_awal, tgl_akhir: tgl_akhir, lokasi_id: lokasi_id, tipe: tipe, afdeling_id: afdeling_id }
    this.hrmsKaryawanGajiService.getRekapAbsensiKebun(data).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        console.log(res);
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'laporan_absen.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });

  }
  proses(kelas_id: number) {
    let that = this;
    swal({
      title: 'Yakin akan melakukan proses?',
      text: "Proses piutang",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Ya, Lakukan Proses',
      cancelButtonText: 'Batal',

      buttonsStyling: false
    }).then(function () {
      // that.piutangService.startProses(that.Kelas.id, kelas_id).subscribe(data => {
      //   console.log(data);
      //   swal({
      //     title: 'Proses!',
      //     text: data['data'],
      //     type: (data['status'] == 'OK') ? 'success' : 'warning',
      //     confirmButtonClass: "btn btn-success",
      //     buttonsStyling: false
      //   })
      //   that.piutangService.getViewProses(that.Kelas.id).subscribe(d => {
      //     that.absensi = d['data'];
      //     that.rerender();
      //    // console.log(this.absensi);
      //   });

      // });


    });

  }
  exportXLS() {
    let tanggal = formatDate(this.entryForm.get('tgl').value, "yyyy-MM-dd", 'en_US');
    let kelas_id = this.entryForm.get('kelas_id').value['id'];
    let mapel_id = this.entryForm.get('mapel_id').value['id'];


    // var mediaType = 'application/pdf';
    // this.absensiService.getAbsensiMapelXLS(tanggal, kelas_id, mapel_id).subscribe(
    //   (response: any) => {

    //     let blob = new Blob([response], { type: 'application/vnd.ms-excel' })
    //     saveAs(blob, 'absensi_mapel.xls')
    //   }
    // );

  }

  detail(id: number) {
    this.router.navigate(['akun/detail', id.toString(), { previousUrl: this.router.url }]);

  }
}
