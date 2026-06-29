import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SERVER_API_URL } from 'src/app/app.constants';

import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { formatDate } from '@angular/common';
import { AccJurnalService } from 'src/app/shared/services/acc_jurnal.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { AccPeriodeAkuntingService } from 'src/app/shared/services/acc_periode_akunting.service';
import { isNull, isNullOrUndefined } from 'util';
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
  isFormSubmitted = false;
  isFormPemakaianBahanSubmitted = false; dataSelectEstate2: any[];
  biayaUmumForm: FormGroup;
  dataSelectPeriode: any;
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
  panenWbForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();
  @ViewChild(DataTableDirective, { static: false })


  dataSelectAfdeling;
  dataSelectEstate;

  bsModalRef: BsModalRef;
  dataSelectTahun: { id: string; text: string; }[];
  dataSelectBulan: { id: string; text: string; }[];
  isFormPanenPerbulanSubmitted: boolean;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private translate: TranslateService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private accJurnalService: AccJurnalService,
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
      estate: new FormControl([], Validators.required),
      bulan: new FormControl([], Validators.required),
      tahun: new FormControl([], Validators.required),
      format_laporan: new FormControl('view', Validators.required),

    });
    this.biayaUmumForm = this.builder.group({
      // afdeling: new FormControl([],),
      estate: new FormControl([], Validators.required),
      bulan: new FormControl([], Validators.required),
      tahun: new FormControl([], Validators.required),
      format_laporan: new FormControl('view', Validators.required),


    });
    this.detailCostForm = this.builder.group({
      estate: new FormControl([], Validators.required),
      afdeling: new FormControl([]),
      bulan: new FormControl([], Validators.required),
      tahun: new FormControl([], Validators.required),
      format_laporan: new FormControl('view', Validators.required),

    });

    this.rekapCostForm = this.builder.group({
      estate: new FormControl([], Validators.required),
      // afdeling: new FormControl([],Validators.required),
      bulan: new FormControl([], Validators.required),
      tahun: new FormControl([], Validators.required),
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

    // this.gbmOrganisasiService.getAllByType('afdeling').subscribe(x => {
    //    this.dataSelectAfdeling = [];
    //     x.forEach(d => {
    //     this.dataSelectAfdeling.push({ "id": d.id, "text": d.nama +'-'+d.kode });

    //   });

    // });
    this.gbmOrganisasiService.getAllByType('AFDELING').subscribe(x => {
      this.dataSelectAfdeling = [];
      x.forEach(d => {
        this.dataSelectAfdeling.push({ "id": d.id, "text": d.nama + "(" + d.kode + ")" });

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
    this.isFormSubmitted = true;
    let errors: any = [];
    let fieldError;
    this.isFormPanenPerbulanSubmitted = true;
    if (this.detailCostForm.invalid) {

      Object.keys(this.detailCostForm.controls).forEach(key => {
        console.log(key);

        const controlErrors: ValidationErrors = this.detailCostForm.get(key).errors;
        console.log(this.detailCostForm.get(key).errors);
        errors = [];
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            const showMessage = key + " is " + keyError
            errors.push(showMessage)
            fieldError = errors[0]
          });
        }
      });

      swal({
        title: 'Perhatian!',
        text: 'Form belum lengkap/Tidak Valid.' + errors,
        type: 'warning',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      })
      return;
    }
    // if (this.detailCostForm.invalid) {
    //   return;
    // }

    let dataSubmit;

    let afdeling_id;
    if (isNullOrUndefined(this.detailCostForm.get('afdeling')) != true) {
      if (isNullOrUndefined(this.detailCostForm.get('afdeling').value)) {
        afdeling_id = ''
      } else {
        afdeling_id = this.detailCostForm.get('afdeling').value.id;
      }

    } else {
      afdeling_id = ''
    }

    // let afdeling_id = this.detailCostForm.controls['afdeling'].value['id'] ? this.detailCostForm.controls['afdeling'].value['id'] : null;
    let estate_id = this.detailCostForm.controls['estate'].value['id'] ? this.detailCostForm.controls['estate'].value['id'] : null;
    let format_laporan = this.detailCostForm.controls['format_laporan'].value
    let periode = this.detailCostForm.controls['tahun'].value.id + '-' + this.detailCostForm.controls['bulan'].value.id;
    let nama_bulan = this.detailCostForm.controls['bulan'].value.text ;
    let bulan = this.detailCostForm.controls['bulan'].value.id ;
    let tahun = this.detailCostForm.controls['tahun'].value.id;
    dataSubmit = {
      'estate_id': estate_id,
      'afdeling_id': afdeling_id,
      'periode': periode,
      'format_laporan': this.detailCostForm.controls['format_laporan'].value,
      'tahun': tahun,
      'bulan': bulan,
      'nama_bulan': nama_bulan,

    };
    console.log(dataSubmit);
    this.accJurnalService.getLaporanCostAfdelingBgt(dataSubmit).subscribe((res: any) => {
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
    let errors: any = [];
    let fieldError;
    this.isFormPanenPerbulanSubmitted = true;
    if (this.rekapCostForm.invalid) {

      Object.keys(this.rekapCostForm.controls).forEach(key => {
        console.log(key);

        const controlErrors: ValidationErrors = this.rekapCostForm.get(key).errors;
        console.log(this.rekapCostForm.get(key).errors);
        errors = [];
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            const showMessage = key + " is " + keyError
            errors.push(showMessage)
            fieldError = errors[0]
          });
        }
      });

      swal({
        title: 'Perhatian!',
        text: 'Form belum lengkap/Tidak Valid.' + errors,
        type: 'warning',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      })
      return;
    }
    // if (this.rekapCostForm.invalid) {
    //   return;
    // }

    let dataSubmit;

    // let afdeling_id = this.rekapCostForm.controls['afdeling'].value['id'] ? this.rekapCostForm.controls['afdeling'].value['id'] : null;
    let estate_id = this.rekapCostForm.controls['estate'].value['id'] ? this.rekapCostForm.controls['estate'].value['id'] : null;
    let format_laporan = this.rekapCostForm.controls['format_laporan'].value
    let periode = this.rekapCostForm.controls['tahun'].value.id + '-' + this.rekapCostForm.controls['bulan'].value.id;
    let nama_bulan = this.rekapCostForm.controls['bulan'].value.text ;
    let bulan = this.rekapCostForm.controls['bulan'].value.id ;
    let tahun = this.rekapCostForm.controls['tahun'].value.id;
    dataSubmit = {
      'estate_id': estate_id,
      // 'afdeling_id': afdeling_id,
      'periode': periode,
      'format_laporan': this.rekapCostForm.controls['format_laporan'].value,
      'tahun': tahun,
      'bulan': bulan,
      'nama_bulan': nama_bulan,
    };
    console.log(dataSubmit);
    this.accJurnalService.getLaporanCostAfdelingRekapBgt(dataSubmit).subscribe((res: any) => {
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
    let errors: any = [];
    let fieldError;
    this.isFormPanenPerbulanSubmitted = true;
    if (this.costPerKegiatanForm.invalid) {

      Object.keys(this.costPerKegiatanForm.controls).forEach(key => {
        console.log(key);

        const controlErrors: ValidationErrors = this.costPerKegiatanForm.get(key).errors;
        console.log(this.costPerKegiatanForm.get(key).errors);
        errors = [];
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            const showMessage = key + " is " + keyError
            errors.push(showMessage)
            fieldError = errors[0]
          });
        }
      });

      swal({
        title: 'Perhatian!',
        text: 'Form belum lengkap/Tidak Valid.' + errors,
        type: 'warning',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      })
      return;
    }
    // if (this.costPerKegiatanForm.invalid) {
    //   return;
    // }

    let dataSubmit;

    // let afdeling_id = this.detailCostForm.controls['afdeling'].value['id'] ? this.detailCostForm.controls['afdeling'].value['id'] : null;
    let estate_id = this.costPerKegiatanForm.controls['estate'].value['id'] ? this.costPerKegiatanForm.controls['estate'].value['id'] : null;
    let format_laporan = this.costPerKegiatanForm.controls['format_laporan'].value
    let periode = this.costPerKegiatanForm.controls['tahun'].value.id + '-' + this.costPerKegiatanForm.controls['bulan'].value.id;
    let nama_bulan = this.costPerKegiatanForm.controls['bulan'].value.text ;
    let bulan = this.costPerKegiatanForm.controls['bulan'].value.id ;
    let tahun = this.costPerKegiatanForm.controls['tahun'].value.id;

    dataSubmit = {
      'estate_id': estate_id,
      // 'afdeling_id': afdeling_id,
      'periode': periode,
      'tahun': tahun,
      'bulan': bulan,
      'nama_bulan': nama_bulan,
      'format_laporan': this.costPerKegiatanForm.controls['format_laporan'].value

    };
    console.log(dataSubmit);
    this.accJurnalService.getLaporanCostAfdelingRekapKegiatan(dataSubmit).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'report_cost.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }

    });

  }
  // reportCostPerbulan() {
  //   let errors: any = [];
  //   let fieldError;
  //   this.isFormPanenPerbulanSubmitted = true;
  //   if (this.costPerbulanForm.invalid) {

  //     Object.keys(this.costPerbulanForm.controls).forEach(key => {
  //       console.log(key);

  //       const controlErrors: ValidationErrors = this.costPerbulanForm.get(key).errors;
  //       console.log(this.costPerbulanForm.get(key).errors);
  //       errors = [];
  //       if (controlErrors != null) {
  //         Object.keys(controlErrors).forEach(keyError => {
  //           const showMessage = key + " is " + keyError
  //           errors.push(showMessage)
  //           fieldError = errors[0]
  //         });
  //       }
  //     });

  //     swal({
  //       title: 'Perhatian!',
  //       text: 'Form belum lengkap/Tidak Valid.' + errors,
  //       type: 'warning',
  //       confirmButtonClass: "btn btn-success",
  //       buttonsStyling: false
  //     })
  //     return;
  //   }
  //   console.log(this.costPerbulanForm.value);
  //   // if (this.costPerbulanForm.invalid) {
  //   //   return;
  //   // }
  //   // let tipe ;
  //   // if (isNullOrUndefined(this.costPerbulanForm.get('tipe')) != true) {
  //   //   if (isNullOrUndefined(this.costPerbulanForm.get('tipe').value)) {
  //   //     tipe = ''
  //   //   } else {
  //   //     tipe = this.penerimaanTbsHarianForm.get('tipe').value.id;
  //   //   }

  //   // } else {
  //   //   tipe = ''
  //   // }
  //   let estate_id = (this.costPerbulanForm.controls['estate'].value != null) ? this.costPerbulanForm.controls['estate'].value['id'] : null;
  //   let periode = this.costPerbulanForm.controls['tahun'].value.id + '-' + this.costPerbulanForm.controls['bulan'].value.id;
  //   let format_laporan = this.costPerbulanForm.controls['format_laporan'].value

  //   let data = {
  //     estate_id: estate_id,
  //     periode: periode,
  //     'format_laporan': this.costPerbulanForm.controls['format_laporan'].value
  //   };
  //   console.log('data:'+ data);
  //   this.accJurnalService.getLaporanCostAfdelingRekapBgt(data).subscribe((res: any) => {

  //     if (format_laporan == 'xls') {
  //       let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
  //       saveAs(blob, 'report_cost.xls')

  //     } else {
  //       var fileURL = URL.createObjectURL(res);
  //       window.open(fileURL);
  //     }
  //   });

  //   console.log('submit');
  // }
  reportBiayaUmum() {
    this.isFormPanenPerbulanSubmitted = true;
    this.isFormSubmitted = true;
    this.isFormSubmitted = true;
    let errors: any = [];
    let fieldError;
    this.isFormPanenPerbulanSubmitted = true;
    if (this.biayaUmumForm.invalid) {

      Object.keys(this.biayaUmumForm.controls).forEach(key => {
        console.log(key);

        const controlErrors: ValidationErrors = this.biayaUmumForm.get(key).errors;
        console.log(this.biayaUmumForm.get(key).errors);
        errors = [];
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            const showMessage = key + " is " + keyError
            errors.push(showMessage)
            fieldError = errors[0]
          });
        }
      });

      swal({
        title: 'Perhatian!',
        text: 'Form belum lengkap/Tidak Valid.' + errors,
        type: 'warning',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      })
      return;
    }
    // if (this.biayaUmumForm.invalid) {
    //   return;
    // }
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
    let estate_id = (this.biayaUmumForm.controls['estate'].value != null) ? this.biayaUmumForm.controls['estate'].value['id'] : null;
    let format_laporan = this.biayaUmumForm.controls['format_laporan'].value
    let periode = this.biayaUmumForm.controls['tahun'].value.id + '-' + this.biayaUmumForm.controls['bulan'].value.id;
    let bulan = this.biayaUmumForm.controls['bulan'].value.id ;
    let tahun = this.biayaUmumForm.controls['tahun'].value.id;
    let nama_bulan = this.biayaUmumForm.controls['bulan'].value.text ;
    let data = {
      'estate_id': estate_id,
      'periode': periode,
      'format_laporan': this.biayaUmumForm.controls['format_laporan'].value,
      'tahun': tahun,
      'bulan': bulan,
      'nama_bulan': nama_bulan,
    };
    console.log(data);
    this.accJurnalService.getLaporanBiayaUmumBgt(data).subscribe((res: any) => {
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



}
