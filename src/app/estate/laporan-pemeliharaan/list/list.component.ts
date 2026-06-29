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
import { EstBkmPemeliharaanService } from 'src/app/shared/services/est_bkm_pemeliharaan.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { AccKegiatanService } from 'src/app/shared/services/acc_kegiatan.service';

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
  isFormSubmitted = false;
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

  detailPemeliharaanForm: FormGroup;
  pemeliharaanPerkaryawanForm: FormGroup;
  pemeliharaanPerbulanForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();
  @ViewChild(DataTableDirective, { static: false })


  dataSelectAfdeling;
  dataSelectBlok;
  dataSelectEstate;




  bsModalRef: BsModalRef;
  dataSelectTahun: { id: string; text: string; }[];
  dataSelectBulan: { id: string; text: string; }[];
  isFormPemeliharaanPerbulanSubmitted: boolean;
  dataSelectKegiatan: any[];

  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,


    private translate: TranslateService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private estateService: EstBkmPemeliharaanService,
    private kegiatanService: AccKegiatanService,
    private builder: FormBuilder) {
    let toDate: Date = new Date();

    this.dataSelectBulan = [
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

    this.dataSelectTahun = [
      { "id": "2022", "text": "2022" },
      { "id": "2023", "text": "2023" },
      { "id": "2024", "text": "2024" },
      { "id": "2025", "text": "2025" },
      { "id": "2026", "text": "2026" },
    ];


    this.pemeliharaanPerkaryawanForm = this.builder.group({

      // afdeling: new FormControl([],),
      estate: new FormControl([], Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),
      afdeling: new FormControl([]),

    });
    this.detailPemeliharaanForm = this.builder.group({
      estate: new FormControl([], Validators.required),
      afdeling: new FormControl([]),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),

    });
    this.pemeliharaanPerbulanForm = this.builder.group({
      estate: new FormControl([], Validators.required),
      kegiatan: new FormControl([]),
      afdeling: new FormControl([]),
      bulan: new FormControl([], Validators.required),
      tahun: new FormControl([], Validators.required),
      format_laporan: new FormControl('view', Validators.required),

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
    this.exportAsService.save(this.exportAsConfig, 'report').subscribe(() => { });
  }
  private loadSelect2(): void {

    // this.gbmOrganisasiService.getAllByType('BLOK').subscribe(x => {
    //   this.dataSelectBlok = [];
    //   x.forEach(d => {
    //     this.dataSelectBlok.push({ "id": d.id, "text": d.nama + '-' + d.kode });

    //   });

    // });
    this.gbmOrganisasiService.getAllByType('AFDELING').subscribe(x => {
      this.dataSelectAfdeling = [];
      x.forEach(d => {
        this.dataSelectAfdeling.push({ "id": d.id, "text": d.nama });

      });

    });
    this.kegiatanService.getAll().subscribe(x => {
      this.dataSelectKegiatan = [];
      x['data'].forEach(d => {
        this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama + " - " + d.kode });

      });

    });
    this.gbmOrganisasiService.getAllByType('ESTATE').subscribe(x => {
      this.dataSelectEstate = [];
      x.forEach(d => {
        this.dataSelectEstate.push({ "id": d.id, "text": d.nama });

      });

    });

  }


  reportPemeliharaanDetail() {
    this.isFormSubmitted = true;
    if (this.detailPemeliharaanForm.invalid) {
      return;
    }

    let dataSubmit;

    let estate_id = this.detailPemeliharaanForm.controls['estate'].value['id'] ? this.detailPemeliharaanForm.controls['estate'].value['id'] : null;
    let format_laporan = this.detailPemeliharaanForm.controls['format_laporan'].value
    let afdeling_id;//= this.pemeliharaanPerkaryawanForm.controls['afdeling'].value['id'] ? this.pemeliharaanPerkaryawanForm.controls['afdeling'].value['id'] : null;
    if (isNullOrUndefined(this.detailPemeliharaanForm.get('afdeling')) != true) {
      if (isNullOrUndefined(this.detailPemeliharaanForm.get('afdeling').value)) {
        afdeling_id = null
      } else {
        afdeling_id = this.detailPemeliharaanForm.get('afdeling').value.id;
      }

    } else {
      afdeling_id = null
    }
    dataSubmit = {
      'estate_id': estate_id,
      'afdeling_id': afdeling_id,
      'tgl_mulai': formatDate(this.detailPemeliharaanForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.detailPemeliharaanForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'format_laporan': format_laporan

    };
    console.log(dataSubmit);
    this.estateService.getLaporanPemeliharaandetail(dataSubmit).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'laporan_pemeliharaan.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }

    });

  }
  reportPemeliharaanPerbulan() {
    this.isFormPemeliharaanPerbulanSubmitted = true;
    if (this.pemeliharaanPerbulanForm.invalid) {
      return;
    }
    let kegiatan_id;
    let afdeling_id;// = this.pemeliharaanPerkaryawanForm.controls['afdeling'].value['id'] ? this.pemeliharaanPerkaryawanForm.controls['afdeling'].value['id'] : null;

    if (isNullOrUndefined(this.pemeliharaanPerbulanForm.get('kegiatan')) != true) {
      if (isNullOrUndefined(this.pemeliharaanPerbulanForm.get('kegiatan').value)) {
        kegiatan_id = null
      } else {
        kegiatan_id = this.pemeliharaanPerbulanForm.get('kegiatan').value.id;
      }

    } else {
      kegiatan_id = null
    }

    if (isNullOrUndefined(this.pemeliharaanPerbulanForm.get('afdeling')) != true) {
      if (isNullOrUndefined(this.pemeliharaanPerbulanForm.get('afdeling').value)) {
        afdeling_id = null
      } else {
        afdeling_id = this.pemeliharaanPerbulanForm.get('afdeling').value.id;
      }

    } else {
      afdeling_id = null
    }
    // let kegiatan_id = (this.pemeliharaanPerbulanForm.controls['kegiatan'].value != null) ? this.pemeliharaanPerbulanForm.controls['kegiatan'].value['id'] : null;
    let estate_id = (this.pemeliharaanPerbulanForm.controls['estate'].value != null) ? this.pemeliharaanPerbulanForm.controls['estate'].value['id'] : null;
    let format_laporan = this.pemeliharaanPerbulanForm.controls['format_laporan'].value

    let periode = this.pemeliharaanPerbulanForm.controls['tahun'].value.id + '-' + this.pemeliharaanPerbulanForm.controls['bulan'].value.id;
    let data = {
      estate_id: estate_id,
      kegiatan_id: kegiatan_id,
      afdeling_id: afdeling_id,
      periode: periode,
      format_laporan: format_laporan
    };
    console.log(data);
    this.estateService.getLaporanPemeliharaanPerbulan(data).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'laporan_pemeliharaan.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });

    console.log('submit');
  }

  reportRekapPemeliharaan() {

  }

}
