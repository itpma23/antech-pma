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
import { EstBkmPanenService } from 'src/app/shared/services/est_bkm_panen.service';
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
  RekapMandorKeraniPemeliharaan: FormGroup;
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
    private estateService: EstBkmPanenService,
    private EstPemeliharaanService: EstBkmPemeliharaanService,
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


    this.RekapMandorKeraniPemeliharaan = this.builder.group({

      estate: new FormControl([], Validators.required),
      afdeling: new FormControl([]),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),

    });
    this.detailPemeliharaanForm = this.builder.group({
      estate: new FormControl([], Validators.required),
      afdeling: new FormControl([]),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
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
    this.estateService.getRekapPremiMandorKerani(dataSubmit).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'laporan_rekap.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }

    });

  }

  RekapMandorKeraniPml() {
    this.isFormSubmitted = true;
    if (this.RekapMandorKeraniPemeliharaan.invalid) {
      return;
    }

    let dataSubmit;

    let estate_id = this.RekapMandorKeraniPemeliharaan.controls['estate'].value['id'] ? this.RekapMandorKeraniPemeliharaan.controls['estate'].value['id'] : null;
    let format_laporan = this.RekapMandorKeraniPemeliharaan.controls['format_laporan'].value
    let afdeling_id = this.RekapMandorKeraniPemeliharaan.controls['afdeling'].value['id'] ? this.RekapMandorKeraniPemeliharaan.controls['afdeling'].value['id'] : null;
    if (isNullOrUndefined(this.RekapMandorKeraniPemeliharaan.get('afdeling')) != true) {
      if (isNullOrUndefined(this.RekapMandorKeraniPemeliharaan.get('afdeling').value)) {
        afdeling_id = null
      } else {
        afdeling_id = this.RekapMandorKeraniPemeliharaan.get('afdeling').value.id;
      }

    } else {
      afdeling_id = null
    }
    dataSubmit = {
      'estate_id': estate_id,
      'afdeling_id': afdeling_id,
      'tgl_mulai': formatDate(this.RekapMandorKeraniPemeliharaan.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.RekapMandorKeraniPemeliharaan.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'format_laporan': format_laporan

    };
    console.log(dataSubmit);
    this.EstPemeliharaanService.getRekapMandorKeraniPml(dataSubmit).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'laporan_pemeliharaan.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }

    });

  }


  reportRekapPemeliharaan() {

  }

}
