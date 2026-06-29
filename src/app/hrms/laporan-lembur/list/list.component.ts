import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SERVER_API_URL } from 'src/app/app.constants';

import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { formatDate } from '@angular/common';

import { HrmsLaporanLemburService } from 'src/app/shared/services/hrms_laporan_lembur.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { SlsKontrakService } from 'src/app/shared/services/sls_kontrak.service';
import { PksSjppService } from 'src/app/shared/services/pks_sjpp.service';

import { saveAs } from 'file-saver';
declare var swal: any;

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'list-cmp',
  templateUrl: 'list.component.html',
  styleUrls: ['list.css'],
})

export class ListComponent implements OnInit {
  isFormKaryawanSubmitted=false;
  isFormLemburSubmitted=false;
  isFormProduksiSubmitted=false;
  listKelas;
  dataSelectBulan;
  dataSelectTahun;

  dtOptions: any;
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

  LemburForm: FormGroup;
  LemburBulananForm: FormGroup;
  // lemburForm: FormGroup;
  // karyawanForm: FormGroup;
  // lemburForm: FormGroup;

  event: EventEmitter<any> = new EventEmitter();
  @ViewChild(DataTableDirective, { static: false })



  dataSelectKontrak;
  dataSelectOrganisasi;
  dataSelectKaryawan;


  bsModalRef: BsModalRef;
  dataSelectPeriode: any[];

  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,


    private translate: TranslateService,
    private SlsKontrakService: SlsKontrakService,
    private PksSjppService: PksSjppService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private HrmsLaporanLemburService: HrmsLaporanLemburService,
    private KaryawanService: KaryawanService,

    private builder: FormBuilder) {
    let toDate: Date = new Date();

    this.dataSelectBulan=[
      { "id": "01", "text": "Januari" },
      { "id": "02", "text": "Februari" },
      { "id": "03", "text": "Maret" },
      { "id": "04", "text": "April" },
      { "id": "05", "text": "Mei" },
      { "id": "06", "text": "Juni" },
      { "id": "07", "text": "Juli" },
      { "id": "08", "text": "Agustus" },
      { "id": "09", "text": "September" },
      { "id": "10", "text": "Oktober" },
      { "id": "11", "text": "November" },
      { "id": "12", "text": "Desember" },
    ];

    this.dataSelectTahun=[
      { "id": "2020", "text": "2020" },
      { "id": "2021", "text": "2021" },
      { "id": "2022", "text": "2022" },
      { "id": "2023", "text": "2023" },
      { "id": "2024", "text": "2024" },
      { "id": "2025", "text": "2025" },

    ];



    this.LemburForm = this.builder.group({
      lokasi: new FormControl([], Validators.required),
      karyawan: new FormControl([], Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),
    });
    this.LemburBulananForm = this.builder.group({
      lokasi: new FormControl([], Validators.required),
      bulan: new FormControl([], Validators.required),
      tahun: new FormControl([], Validators.required),
      format_laporan: new FormControl('view', Validators.required),
    });

    // this.karyawanForm = this.builder.group({
    //   departemen: new FormControl([],[]),
    //   jenis: new FormControl('0', []),
    // });

    // this.lemburForm = this.builder.group({
    //   karyawanLembur: new FormControl([],Validators.required),
    //   tanggal_mulai: new FormControl(toDate, Validators.required),
    //   tanggal_akhir: new FormControl(toDate, Validators.required),
    // });

    // this.lemburForm = this.builder.group({
    //   karyawanLembur: new FormControl([],Validators.required),
    //   tanggal_mulai: new FormControl(toDate, Validators.required),
    //   tanggal_akhir: new FormControl(toDate, Validators.required),
    // });



  }

  ngOnInit() {
    this.loadSelect2();

  }


  ngAfterViewInit(): void {

  }
  ngOnDestroy(): void {

  }

  exportFiles(type) {
    this.exportAsConfig.type = type;
    this.exportAsService.save(this.exportAsConfig, 'mapel').subscribe(() => { });
  }

  private loadSelect2(): void {

    // this.hrmsDepartemenService.getAll().subscribe(x=>{
    //   this.dataSelectDepartemen=[];
    //  let  p=x['data'];
    //   p.forEach(d => {
    //     this.dataSelectDepartemen.push({"id":d.id,"text":d.nama});
    //   });
    // });

    this.SlsKontrakService.getAll().subscribe(x=>{
      this.dataSelectKontrak=[];
      console.log(x);
      let  p=x['data'];
      p.forEach(d => {
        this.dataSelectKontrak.push({"id":d.id,"text":d.no_spk+' -- '+d.customer});
      });
    });

    this.GbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x=>{
      this.dataSelectOrganisasi=[];
      x.forEach(d => {
        this.dataSelectOrganisasi.push({"id":d.id,"text":d.nama});
      });
    });

    this.KaryawanService.getAll().subscribe(x=>{
      this.dataSelectKaryawan=[];
      x['data'].forEach(d => {
        this.dataSelectKaryawan.push({"id":d.id,"text":d.nama});
      });
    });

    // this.karyawanService.getAll().subscribe(x=>{
    //   this.dataSelectKaryawanLembur=[];
    //   this.dataSelectKaryawanLembur=[];
    //  let  peng=x['data'];
    //   peng.forEach(d => {
    //     this.dataSelectKaryawanLembur.push({"id":d.id,"text":d.nama});
    //     this.dataSelectKaryawanLembur.push({"id":d.id,"text":d.nama});

    //   });

    // });

    // this.dataSelectBulan=[
    //   { "id": "01", "text": "Januari" },
    //   { "id": "02", "text": "Februari" },
    //   { "id": "03", "text": "Maret" },
    //   { "id": "04", "text": "April" },
    //   { "id": "05", "text": "Mei" },
    //   { "id": "06", "text": "Juni" },
    //   { "id": "07", "text": "Juli" },
    //   { "id": "08", "text": "Agustus" },
    //   { "id": "09", "text": "September" },
    //   { "id": "10", "text": "Oktober" },
    //   { "id": "11", "text": "November" },
    //   { "id": "12", "text": "Desember" },
    // ];

    // this.dataSelectTahun=[
    //   { "id": "2020", "text": "2020" },
    //   { "id": "2021", "text": "2021" },
    //   { "id": "2022", "text": "2022" },
    //   { "id": "2023", "text": "2023" },
    //   { "id": "2024", "text": "2024" },
    //   { "id": "2025", "text": "2025" },
    // ];




  }





  reportLembur() {
    this.isFormLemburSubmitted = true;
    if (this.LemburForm.invalid) {
      return;
    }

    let lokasi_id = (this.LemburForm.controls['lokasi'].value!=null)?this.LemburForm.controls['lokasi'].value['id']:null ;
    let karyawan_id = (this.LemburForm.controls['karyawan'].value!=null)?this.LemburForm.controls['karyawan'].value['id']:null ;
    let format_laporan=this.LemburForm.controls['format_laporan'].value;
    let data={
      'format_laporan': format_laporan,
      lokasi_id: lokasi_id,
      karyawan_id: karyawan_id,
      tgl_mulai: formatDate(this.LemburForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      tgl_akhir: formatDate(this.LemburForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };

    console.log(data);

    this.HrmsLaporanLemburService.getLaporanLembur(data).subscribe((res:any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'report_lembur.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });

    console.log('submit');
  }



  reportLemburBulanan() {
    this.isFormLemburSubmitted = true;

    if (this.LemburBulananForm.invalid) {
      return;
    }

    let lokasi_id = (this.LemburBulananForm.controls['lokasi'].value!=null)?this.LemburBulananForm.controls['lokasi'].value['id']:null ;
    let format_laporan=this.LemburBulananForm.controls['format_laporan'].value;
    let data={
      'format_laporan': format_laporan,
      lokasi_id: lokasi_id,
      bulan: this.LemburBulananForm.controls['bulan'].value.id,
      tahun: this.LemburBulananForm.controls['tahun'].value.id,
      // tgl_mulai: formatDate(this.LemburBulananForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      // tgl_akhir: formatDate(this.LemburBulananForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };

    console.log(data);

    this.HrmsLaporanLemburService.getLaporanLemburBulanan(data).subscribe((res:any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'report_lembur_bulanan.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });
  }



  // reportKaryawan() {
  //   this.isFormKaryawanSubmitted = true;
  //   if (this.karyawanForm.invalid) {
  //     return;
  //   }
  //   let departemen_id = (this.karyawanForm.controls['departemen'].value!=null)?this.karyawanForm.controls['departemen'].value['id']:null ;
  //   // let jenis=this.karyawanForm.controls['jenis'].value;
  //   let data={departemen_id:departemen_id};
  //   this.karyawanService.getLaporanKaryawan(data).subscribe(res => {
  //     //console.log(res);
  //     var fileURL = URL.createObjectURL(res);
  //     window.open(fileURL);
  //   });
  // }



  // reportLembur() {
  //   this.isFormLemburSubmitted = true;
  //   if (this.lemburForm.invalid) {
  //     return;
  //   }
  //   let dataSubmit;
  //   let karyawan_id = this.lemburForm.controls['karyawanLembur'].value['id'] ? this.lemburForm.controls['karyawanLembur'].value['id'] : null;
  //   dataSubmit = {
  //     'karyawan_id': karyawan_id,
  //     'tgl_mulai': formatDate(this.lemburForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
  //     'tgl_akhir': formatDate(this.lemburForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
  //   };
  //   this.lemburService.getLemburKaryawan(dataSubmit).subscribe(res => {
  //     //console.log(res);
  //     var fileURL = URL.createObjectURL(res);
  //     window.open(fileURL);
  //   });
  // }


  // reportLembur() {
  //   this.isFormLemburSubmitted = true;
  //   if (this.lemburForm.invalid) {
  //     return;
  //   }
  //   let dataSubmit;
  //   let karyawan_id = this.lemburForm.controls['karyawanLembur'].value['id'] ? this.lemburForm.controls['karyawanLembur'].value['id'] : null;
  //   dataSubmit = {
  //     'karyawan_id': karyawan_id,
  //     'tgl_mulai': formatDate(this.lemburForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
  //     'tgl_akhir': formatDate(this.lemburForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
  //   };
  //   this.lemburService.getLemburKaryawan(dataSubmit).subscribe(res => {
  //     //console.log(res);
  //     var fileURL = URL.createObjectURL(res);
  //     window.open(fileURL);
  //   });
  // }




}
