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

import { HrmsTipeKaryawanService } from 'src/app/shared/services/hrms_tipe_karyawan.service';
import { HrmsKaryawanGajiService } from 'src/app/shared/services/hrms_karyawan_gaji.service';
import { HrmsPeriodeGajiService } from 'src/app/shared/services/hrms_periode_gaji.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { HrmsAbsensiService } from 'src/app/shared/services/hrms_absensi.service';
import { HrmsLemburService } from 'src/app/shared/services/hrms_lembur.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
declare var swal: any;

declare var $: any;
import { saveAs } from 'file-saver';
import { isNullOrUndefined } from 'util';

@Component({
  moduleId: module.id,
  selector: 'list-cmp',
  templateUrl: 'list.component.html',
  styleUrls: ['list.css'],
})

export class ListComponent implements OnInit {
  isFormGajiSubmitted=false;
  isFormAbsensiSubmitted=false;
  isFormLemburSubmitted=false;
  listKelas;
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

  absensiForm: FormGroup;
  gajiForm: FormGroup;
  lemburForm: FormGroup;

  event: EventEmitter<any> = new EventEmitter();
  @ViewChild(DataTableDirective, { static: false })


  dataSelectKaryawanAbsensi;
  dataSelectKaryawanLembur;
  dataSelectBulan;
  dataSelectTahun;

  bsModalRef: BsModalRef;
  dataSelectPeriode: any[];
  dataSelectLokasi: any[];
  dataSelectLokasiAfd: any[];
  dataSelectStatus: any[];

  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,


    private translate: TranslateService,
    private karyawanGajiService :HrmsKaryawanGajiService,
    private absensiService :HrmsAbsensiService,
    private lemburService :HrmsLemburService,
    private hrmsTipeKaryawanService :HrmsTipeKaryawanService,
    private karyawanService :KaryawanService,
    private periodeGajiService :HrmsPeriodeGajiService,
    private gbmOrganisasiService: GbmOrganisasiService,

    private builder: FormBuilder) {
    let toDate: Date = new Date();

    this.gajiForm = this.builder.group({
      lokasi_id: new FormControl([], Validators.required),
      lokasi_afd_id: new FormControl([]),
      status_id: new FormControl([]),
      periode: new FormControl([],Validators.required),
      jenis: new FormControl('0', Validators.required),
      format_laporan: new FormControl('view', Validators.required),
    });


    this.absensiForm = this.builder.group({
      karyawanAbsensi: new FormControl([],Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),

    });
    this.lemburForm = this.builder.group({
      karyawanLembur: new FormControl([],Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),

    });

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
    this.gajiForm.controls['lokasi_id'].valueChanges.subscribe(x => {
      console.log(x);
      let org_id = x.id;
      this.periodeGajiService.getByLokasiId(org_id).subscribe(x=>{
        this.dataSelectPeriode=[];
        console.log(x);
       let  p=x['data'];
        p.forEach(d => {
          this.dataSelectPeriode.push({"id":d.id,"text":d.nama});
        });
      });
      // this.karyawanService.getByLokasiTugas(org_id).subscribe(x => {
      //   this.dataSelectKaryawan = [];

      //   let kary = x['data'];
      //   kary.forEach(d => {
      //     // beforeDataSelectKaryawan.push({ "id": d.id, "text": d.nama+" - "+d.nik_ktp+" - "+d.sub_bagian_nama });
      //     if (d.lokasi_tugas_id == org_id) {
      //       this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama+" - "+d.nip+" - "+d.sub_bagian_nama });
      //     }

      //   });
      // });
    });

    this.gbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x=>{
      this.dataSelectLokasi=[];
      x.forEach(d => {
        this.dataSelectLokasi.push({"id":d.id,"text":d.nama});
      });
    });
    this.gajiForm.controls['lokasi_id'].valueChanges.subscribe(x => {
      let org_id = x.id;
      let afdst_id = x.id;
      this.gbmOrganisasiService.getAfdelingByEstateAndUser(afdst_id).subscribe(x => {
        this.dataSelectLokasiAfd = [];
        // console.log(x);
        x.forEach(d => {
          this.dataSelectLokasiAfd.push({ "id": d.id, "text": d.nama });
        });

      });

    });
  this.hrmsTipeKaryawanService.getAll().subscribe(x=>{
      this.dataSelectStatus=[];
      x['data'].forEach(d => {
        this.dataSelectStatus.push({"id":d.id,"text":d.nama});

      });

    });

    // this.karyawanService.getAll().subscribe(x=>{
    //   this.dataSelectKaryawanAbsensi=[];
    //   this.dataSelectKaryawanLembur=[];
    //  let  peng=x['data'];
    //   peng.forEach(d => {
    //     this.dataSelectKaryawanAbsensi.push({"id":d.id,"text":d.nama});
    //     this.dataSelectKaryawanLembur.push({"id":d.id,"text":d.nama});

    //   });

    // });

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




  }

  reportGaji() {
    this.isFormGajiSubmitted = true;
    if (this.gajiForm.invalid) {
      return;
    }
    let dataSubmit;

    let periode_id = this.gajiForm.controls['periode'].value['id'] ;
    let jenis=this.gajiForm.controls['jenis'].value;
    let format_laporan=this.gajiForm.controls['format_laporan'].value;
    let divisi_id;
    if (isNullOrUndefined(this.gajiForm.get('lokasi_afd_id').value) != true) {
      if (isNullOrUndefined(this.gajiForm.get('lokasi_afd_id').value!.id)) {
        divisi_id = null
      } else {
        divisi_id = this.gajiForm.get('lokasi_afd_id').value.id;
      }
    } else {
      divisi_id = null
    }
    let status_id;
    if (isNullOrUndefined(this.gajiForm.get('status_id').value) != true) {
      if (isNullOrUndefined(this.gajiForm.get('status_id').value!.id)) {
        status_id = null
      } else {
        status_id = this.gajiForm.get('status_id').value.id;
      }
    } else {
      status_id = null
    }
    dataSubmit = {
      'format_laporan': format_laporan,
      'jenis': jenis,
      'divisi_id':divisi_id,
      'status_id':status_id
    };
    console.log(dataSubmit)
    this.karyawanGajiService.getLaporanGaji(periode_id,dataSubmit).subscribe((res:any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'gaji.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });

  }
  reportAbsensi() {
    this.isFormAbsensiSubmitted = true;
    if (this.absensiForm.invalid) {
      return;
    }

    let dataSubmit;
    let karyawan_id = this.absensiForm.controls['karyawanAbsensi'].value['id'] ? this.absensiForm.controls['karyawanAbsensi'].value['id'] : null;

    dataSubmit = {
      'karyawan_id': karyawan_id,
      'tgl_mulai': formatDate(this.absensiForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.absensiForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };
    this.absensiService.getAbsensiKaryawan(dataSubmit).subscribe((res:any) => {
      //console.log(res);
      var fileURL = URL.createObjectURL(res);
      window.open(fileURL);

    });

  }

  reportLembur() {
    this.isFormLemburSubmitted = true;
    if (this.lemburForm.invalid) {
      return;
    }

    let dataSubmit;
    let karyawan_id = this.lemburForm.controls['karyawanLembur'].value['id'] ? this.lemburForm.controls['karyawanLembur'].value['id'] : null;

    dataSubmit = {
      'karyawan_id': karyawan_id,
      'tgl_mulai': formatDate(this.lemburForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.lemburForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };

    this.lemburService.getLemburKaryawan(dataSubmit).subscribe((res:any) => {
      //console.log(res);
      var fileURL = URL.createObjectURL(res);
      window.open(fileURL);

    });

  }




}
