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
import { AccJurnalService } from 'src/app/shared/services/acc_jurnal.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { isNull } from 'util';
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
  isFormSubmitted=false;
  isFormPemakaianBahanSubmitted=false;dataSelectEstate2: any[];
;
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
  pemakaianBahanForm: FormGroup;
  detailCostForm: FormGroup;
  rekapCostForm: FormGroup;
  costPerKegiatanForm: FormGroup;
  costPerbulanForm: FormGroup;
  panenWbForm:FormGroup;
  event: EventEmitter<any> = new EventEmitter();
  @ViewChild(DataTableDirective, { static: false })


  dataSelectAfdeling;
  dataSelectBlok;
  dataSelectEstate;

  bsModalRef: BsModalRef;
  dataSelectTahun: { id: string; text: string; }[];
  dataSelectBulan: { id: string; text: string; }[];
  isFormPanenPerbulanSubmitted: boolean;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private translate: TranslateService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private accJurnalService :AccJurnalService,
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


    this.costPerKegiatanForm = this.builder.group({

      // afdeling: new FormControl([],),
      estate: new FormControl([],Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),

    });
    // this.panenWbForm = this.builder.group({

    //   // afdeling: new FormControl([],),
    //   estate: new FormControl([],Validators.required),
    //   tanggal_mulai: new FormControl(toDate, Validators.required),
    //   tanggal_akhir: new FormControl(toDate, Validators.required),

    // });
    this.detailCostForm = this.builder.group({
      estate: new FormControl([],Validators.required),
      blok: new FormControl([],Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),

    });
    this.pemakaianBahanForm = this.builder.group({
      estate2: new FormControl([],Validators.required),
      afdeling: new FormControl([]),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),

    });
    this.rekapCostForm = this.builder.group({
      estate: new FormControl([],Validators.required),
      // blok: new FormControl([],Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),

    });
    this.costPerbulanForm = this.builder.group({
      estate: new FormControl([], Validators.required),
      // tipe: new FormControl([]),
      bulan: new FormControl([], Validators.required),
      tahun: new FormControl([], Validators.required),
      format_laporan: new FormControl('view', Validators.required),

    });

  }

  ngOnInit() {


  }


  ngAfterViewInit(): void {
    this.loadSelect2();

  }
  ngOnDestroy(): void {

  }

  exportFiles(type) {
    this.exportAsConfig.type = type;
    this.exportAsService.save(this.exportAsConfig, 'mapel').subscribe(() => { });
  }
  private loadSelect2(): void {

    this.gbmOrganisasiService.getAllByType('BLOK').subscribe(x => {
       this.dataSelectBlok = [];
        x.forEach(d => {
        this.dataSelectBlok.push({ "id": d.id, "text": d.nama +'-'+d.kode });

      });

    });
    this.gbmOrganisasiService.getAllByType('AFDELING').subscribe(x => {
      this.dataSelectAfdeling = [];
       x.forEach(d => {
        this.dataSelectAfdeling.push({ "id": d.id, "text": d.nama +"("+d.kode+")"});

      });

    });
    this.gbmOrganisasiService.getAllByType('ESTATE').subscribe(x => {
      this.dataSelectEstate = [];
       x.forEach(d => {
        this.dataSelectEstate.push({ "id": d.id, "text": d.nama });

      });

    });
    this.gbmOrganisasiService.getAllByType('ESTATE').subscribe(x => {
      this.dataSelectEstate2 = [];
       x.forEach(d => {
        this.dataSelectEstate2.push({ "id": d.id, "text": d.nama });

      });

    });

  }


  reportCostDetail() {
    this.isFormSubmitted = true;
    if (this.detailCostForm.invalid) {
      return;
    }

    let dataSubmit;



    let blok_id = this.detailCostForm.controls['blok'].value['id'] ? this.detailCostForm.controls['blok'].value['id'] : null;
    let estate_id = this.detailCostForm.controls['estate'].value['id'] ? this.detailCostForm.controls['estate'].value['id'] : null;
    let format_laporan = this.costPerKegiatanForm.controls['format_laporan'].value

    dataSubmit = {
      'estate_id': estate_id,
       'blok_id': blok_id,
      'tgl_mulai': formatDate(this.detailCostForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.detailCostForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'format_laporan': this.detailCostForm.controls['format_laporan'].value

    };
     console.log(dataSubmit);
    this.accJurnalService.getLaporanCostBlokDetail(dataSubmit).subscribe((res:any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'report_cost.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });

  }
  reportCostRekap() {
    this.isFormSubmitted = true;
    if (this.rekapCostForm.invalid) {
      return;
    }

    let dataSubmit;



    // let blok_id = this.rekapCostForm.controls['blok'].value['id'] ? this.rekapCostForm.controls['blok'].value['id'] : null;
    let estate_id = this.rekapCostForm.controls['estate'].value['id'] ? this.rekapCostForm.controls['estate'].value['id'] : null;
    let format_laporan = this.costPerKegiatanForm.controls['format_laporan'].value

    dataSubmit = {
      'estate_id': estate_id,
      // 'blok_id': blok_id,
      'tgl_mulai': formatDate(this.rekapCostForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.rekapCostForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'format_laporan': this.rekapCostForm.controls['format_laporan'].value

    };
     console.log(dataSubmit);
    this.accJurnalService.getLaporanCostBlokRekap(dataSubmit).subscribe((res:any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'report_cost.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }

    });

  }

  reportCostPerKegiatan() {
    this.isFormSubmitted = true;
    if (this.costPerKegiatanForm.invalid) {
      return;
    }

    let dataSubmit;

    // let blok_id = this.detailCostForm.controls['blok'].value['id'] ? this.detailCostForm.controls['blok'].value['id'] : null;
    let estate_id = this.costPerKegiatanForm.controls['estate'].value['id'] ? this.costPerKegiatanForm.controls['estate'].value['id'] : null;
    let format_laporan = this.costPerKegiatanForm.controls['format_laporan'].value
    dataSubmit = {
      'estate_id': estate_id,
      // 'blok_id': blok_id,
      'tgl_mulai': formatDate(this.costPerKegiatanForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.costPerKegiatanForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'format_laporan': this.costPerKegiatanForm.controls['format_laporan'].value

    };
     console.log(dataSubmit);
    this.accJurnalService.getLaporanCostBlokRekapKegiatan(dataSubmit).subscribe((res:any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'report_cost.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }

    });

  }
  reportCostPerbulan() {
    this.isFormPanenPerbulanSubmitted = true;
    if (this.costPerbulanForm.invalid) {
      return;
    }
    // let tipe ;
    // if (isNullOrUndefined(this.costPerbulanForm.get('tipe')) != true) {
    //   if (isNullOrUndefined(this.costPerbulanForm.get('tipe').value)) {
    //     tipe = ''
    //   } else {
    //     tipe = this.penerimaanTbsHarianForm.get('tipe').value.id;
    //   }

    // } else {
    //   tipe = ''
    // }
    let estate_id = (this.costPerbulanForm.controls['estate'].value != null) ? this.costPerbulanForm.controls['estate'].value['id'] : null;
    let periode = this.costPerbulanForm.controls['tahun'].value.id + '-' + this.costPerbulanForm.controls['bulan'].value.id;
    let format_laporan = this.costPerbulanForm.controls['format_laporan'].value

    let data = {
      estate_id: estate_id,
      periode: periode,
      'format_laporan': this.costPerbulanForm.controls['format_laporan'].value
    };
    console.log(data);
    this.accJurnalService.getLaporanCostBlokRekap(data).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'report_cost.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });

    console.log('submit');
  }

  reportPanenWB(){
    this.isFormSubmitted = true;
    if (this.panenWbForm.invalid) {
      return;
    }

    let dataSubmit;



    // let blok_id = this.detailCostForm.controls['blok'].value['id'] ? this.detailCostForm.controls['blok'].value['id'] : null;
    let estate_id = this.panenWbForm.controls['estate'].value['id'] ? this.panenWbForm.controls['estate'].value['id'] : null;

    dataSubmit = {
      'estate_id': estate_id,
      // 'blok_id': blok_id,
      'tgl_mulai': formatDate(this.panenWbForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.panenWbForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),


    };
     console.log(dataSubmit);
    // this.estSpatService.getLaporanSpatDetail(dataSubmit).subscribe((res:any) => {
    //   //console.log(res);
    //   var fileURL = URL.createObjectURL(res);
    //   window.open(fileURL);

    // });

  }
  reportPemakaianBahan() {
    this.isFormPemakaianBahanSubmitted = true;
    if (this.pemakaianBahanForm.invalid) {
      return;
    }
    console.log(this.pemakaianBahanForm.value);
    let dataSubmit;
    let afdeling_id;

    if (isNull (this.pemakaianBahanForm.controls['afdeling'].value)) {
      afdeling_id = null;
    } else {
      afdeling_id = this.pemakaianBahanForm.controls['afdeling'].value['id'] ? this.pemakaianBahanForm.controls['afdeling'].value['id'] : null;

    }
    let estate_id = this.pemakaianBahanForm.controls['estate2'].value['id'] ? this.pemakaianBahanForm.controls['estate2'].value['id'] : null;
    let format_laporan = this.pemakaianBahanForm.controls['format_laporan'].value
    dataSubmit = {
      'estate_id': estate_id,
      'afdeling_id': afdeling_id,
      'tgl_mulai': formatDate(this.pemakaianBahanForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.pemakaianBahanForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'format_laporan': this.pemakaianBahanForm.controls['format_laporan'].value

    };
    console.log(dataSubmit);
    this.accJurnalService.getLaporanPemakaianBahanEstate(dataSubmit).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'report_cost.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }


    });

  }

}
