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
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { EstSpatService } from 'src/app/shared/services/est_spat.service';

declare var swal: any;

declare var $: any;
import { saveAs } from 'file-saver';
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

  detailPanenForm: FormGroup;
  panenPerkaryawanForm: FormGroup;
  panenPerbulanForm: FormGroup;
  panenWbForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();
  @ViewChild(DataTableDirective, { static: false })


  dataSelectAfdeling;
  dataSelectBlok;
  dataSelectEstate;




  bsModalRef: BsModalRef;
  dataSelectTahun: { id: string; text: string; }[];
  dataSelectBulan: { id: string; text: string; }[];
  isFormPanenPerbulanSubmitted: boolean = false;
  isFormPanenSensusSubmitted: boolean = false;
  panenSensusForm: FormGroup;
  panenTaksasiForm: FormGroup;
  isFormPanenTaksasiSubmitted: boolean;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,


    private translate: TranslateService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private estateService: EstBkmPanenService,
    private estSpatService: EstSpatService,
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
  { id: "2022", text: "2022" },
  { id: "2023", text: "2023" },
  { id: "2024", text: "2024" },
  { id: "2025", text: "2025" },
  { id: "2026", text: "2026" },
  { id: "2027", text: "2027" },
  { id: "2028", text: "2028" },
  { id: "2029", text: "2029" },
  { id: "2030", text: "2030" }
];

    this.panenPerkaryawanForm = this.builder.group({

      // afdeling: new FormControl([],),
      estate: new FormControl([], Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),
      tipe_laporan: new FormControl('v1', Validators.required),

    });
    this.panenWbForm = this.builder.group({

      // afdeling: new FormControl([],),
      estate: new FormControl([], Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),

    });
    this.detailPanenForm = this.builder.group({
      estate: new FormControl([], Validators.required),
      // blok: new FormControl([],Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),

    });
    this.panenPerbulanForm = this.builder.group({
      estate: new FormControl([], Validators.required),
      // tipe: new FormControl([]),
      bulan: new FormControl([], Validators.required),
      tahun: new FormControl([], Validators.required),
      format_laporan: new FormControl('view', Validators.required),
      jenis_laporan: new FormControl('panen', Validators.required),

    });
    this.panenSensusForm = this.builder.group({
      estate: new FormControl([], Validators.required),
      // tipe: new FormControl([]),
      bulan_mulai: new FormControl([], Validators.required),
      bulan_akhir: new FormControl([], Validators.required),
      tahun: new FormControl([], Validators.required),
      format_laporan: new FormControl('view', Validators.required),
      jenis_laporan: new FormControl('panen', Validators.required),

    });
    this.panenTaksasiForm = this.builder.group({
      estate: new FormControl([], Validators.required),
      // tipe: new FormControl([]),
      bulan: new FormControl([], Validators.required),
      // bulan_akhir: new FormControl([], Validators.required),
      tahun: new FormControl([], Validators.required),
      format_laporan: new FormControl('view', Validators.required),
      jenis_laporan: new FormControl('panen', Validators.required),

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
    this.exportAsService.save(this.exportAsConfig, 'panen').subscribe(() => { });
  }
  private loadSelect2(): void {

    this.gbmOrganisasiService.getAllByType('BLOK').subscribe(x => {
      this.dataSelectBlok = [];
      x.forEach(d => {
        this.dataSelectBlok.push({ "id": d.id, "text": d.nama + '-' + d.kode });

      });

    });
    this.gbmOrganisasiService.getAllByType('AFDELING').subscribe(x => {
      this.dataSelectAfdeling = [];
      x.forEach(d => {
        this.dataSelectAfdeling.push({ "id": d.id, "text": d.nama });

      });

    });
    this.gbmOrganisasiService.getAllByType('ESTATE').subscribe(x => {
      this.dataSelectEstate = [];
      x.forEach(d => {
        this.dataSelectEstate.push({ "id": d.id, "text": d.nama });

      });

    });

  }

  reportRekapStok() {
    this.isFormSubmitted = true;
    if (this.panenPerkaryawanForm.invalid) {
      return;
    }

    let dataSubmit;



    let afdeling_id = this.panenPerkaryawanForm.controls['afdeling'].value['id'] ? this.panenPerkaryawanForm.controls['afdeling'].value['id'] : null;
    let estate_id = this.panenPerkaryawanForm.controls['estate'].value['id'] ? this.panenPerkaryawanForm.controls['estate'].value['id'] : null;

    dataSubmit = {
      'estate_id': estate_id,
      'afdeling_id': afdeling_id,
      'tgl_mulai': formatDate(this.panenPerkaryawanForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.panenPerkaryawanForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),


    };
    console.log(dataSubmit);
    this.estateService.create(dataSubmit).subscribe((res: any) => {
      //console.log(res);
      var fileURL = URL.createObjectURL(res);
      window.open(fileURL);

    });

  }
  reportPanenDetail() {
    this.isFormSubmitted = true;
    if (this.detailPanenForm.invalid) {
      return;
    }

    let dataSubmit;



    // let blok_id = this.detailPanenForm.controls['blok'].value['id'] ? this.detailPanenForm.controls['blok'].value['id'] : null;
    let estate_id = this.detailPanenForm.controls['estate'].value['id'] ? this.detailPanenForm.controls['estate'].value['id'] : null;
    let format_laporan = this.detailPanenForm.controls['format_laporan'].value

    dataSubmit = {
      'estate_id': estate_id,
      // 'blok_id': blok_id,
      'tgl_mulai': formatDate(this.detailPanenForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.detailPanenForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'format_laporan': format_laporan


    };
    console.log(dataSubmit);
    this.estateService.getLaporanPanendetail(dataSubmit).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'laporan_panen.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }

    });

  }
  reportPanenPerkaryawan() {
    this.isFormSubmitted = true;
    if (this.panenPerkaryawanForm.invalid) {
      return;
    }

    let dataSubmit;

    // let blok_id = this.detailPanenForm.controls['blok'].value['id'] ? this.detailPanenForm.controls['blok'].value['id'] : null;
    let estate_id = this.panenPerkaryawanForm.controls['estate'].value['id'] ? this.panenPerkaryawanForm.controls['estate'].value['id'] : null;

    let format_laporan = this.panenPerkaryawanForm.controls['format_laporan'].value;
    let tipe_laporan = this.panenPerkaryawanForm.controls['tipe_laporan'].value;

    dataSubmit = {
      'estate_id': estate_id,
      // 'blok_id': blok_id,
      'tgl_mulai': formatDate(this.panenPerkaryawanForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.panenPerkaryawanForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'format_laporan': format_laporan,
      'tipe_laporan': tipe_laporan,

    };
    console.log(dataSubmit);
    this.estateService.getLaporanPanenPerkaryawan(dataSubmit).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'laporan_panen.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }

    });

  }
  reportPanenPerbulan() {
    this.isFormPanenPerbulanSubmitted = true;
    if (this.panenPerbulanForm.invalid) {
      return;
    }
    // let tipe ;
    // if (isNullOrUndefined(this.panenPerbulanForm.get('tipe')) != true) {
    //   if (isNullOrUndefined(this.panenPerbulanForm.get('tipe').value)) {
    //     tipe = ''
    //   } else {
    //     tipe = this.penerimaanTbsHarianForm.get('tipe').value.id;
    //   }

    // } else {
    //   tipe = ''
    // }
    let estate_id = (this.panenPerbulanForm.controls['estate'].value != null) ? this.panenPerbulanForm.controls['estate'].value['id'] : null;
    let periode = this.panenPerbulanForm.controls['tahun'].value.id + '-' + this.panenPerbulanForm.controls['bulan'].value.id;
    let format_laporan = this.panenPerbulanForm.controls['format_laporan'].value
    let jenis_laporan = this.panenPerbulanForm.controls['jenis_laporan'].value
    let data = {
      estate_id: estate_id,
      periode: periode,
      format_laporan: format_laporan
    };
    console.log(data);
    if (jenis_laporan == 'panen') {
      this.estateService.getLaporanPanenPerbulan(data).subscribe((res: any) => {
        if (format_laporan == 'xls') {
          let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          saveAs(blob, 'laporan_panen.xls')

        } else {
          var fileURL = URL.createObjectURL(res);
          window.open(fileURL);
        }
      });

    } else if (jenis_laporan == 'denda_panen') {

      this.estateService.getLaporanDendaPanenPerbulan(data).subscribe((res: any) => {
        if (format_laporan == 'xls') {
          let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          saveAs(blob, 'laporan_panen.xls')

        } else {
          var fileURL = URL.createObjectURL(res);
          window.open(fileURL);
        }
      });


    }

    console.log('submit');
  }
  reportPanenSensus() {
    this.isFormPanenSensusSubmitted = true;
    if (this.panenSensusForm.invalid) {
      return;
    }
    // let tipe ;
    // if (isNullOrUndefined(this.panenPerbulanForm.get('tipe')) != true) {
    //   if (isNullOrUndefined(this.panenPerbulanForm.get('tipe').value)) {
    //     tipe = ''
    //   } else {
    //     tipe = this.penerimaanTbsHarianForm.get('tipe').value.id;
    //   }

    // } else {
    //   tipe = ''
    // }
    let estate_id = (this.panenSensusForm.controls['estate'].value != null) ? this.panenSensusForm.controls['estate'].value['id'] : null;
    let periode_awal = this.panenSensusForm.controls['tahun'].value.id + '-' + this.panenSensusForm.controls['bulan_mulai'].value.id;
    let periode_akhir = this.panenSensusForm.controls['tahun'].value.id + '-' + this.panenSensusForm.controls['bulan_akhir'].value.id;
    let bulan_awal = this.panenSensusForm.controls['bulan_mulai'].value.id;
    let bulan_akhir = this.panenSensusForm.controls['bulan_akhir'].value.id;
    let tahun = this.panenSensusForm.controls['tahun'].value.id;
    let format_laporan = this.panenSensusForm.controls['format_laporan'].value

    let data = {
      estate_id: estate_id,
      periode_awal: periode_awal,
      periode_akhir: periode_akhir,
      bulan_awal: bulan_awal,
      bulan_akhir: bulan_akhir,
      tahun: tahun,
      format_laporan: format_laporan
    };
    console.log(data);

    this.estateService.getLaporanPanenSensus(data).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'laporan_panen.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });

    console.log('submit');
  }

  reportPanenTaksasi() {
    this.isFormPanenTaksasiSubmitted = true;
    if (this.panenTaksasiForm.invalid) {
      return;
    }
    // let tipe ;
    // if (isNullOrUndefined(this.panenPerbulanForm.get('tipe')) != true) {
    //   if (isNullOrUndefined(this.panenPerbulanForm.get('tipe').value)) {
    //     tipe = ''
    //   } else {
    //     tipe = this.penerimaanTbsHarianForm.get('tipe').value.id;
    //   }

    // } else {
    //   tipe = ''
    // }
    let estate_id = (this.panenTaksasiForm.controls['estate'].value != null) ? this.panenTaksasiForm.controls['estate'].value['id'] : null;
    // let periode_awal = this.panenTaksasiForm.controls['tahun'].value.id + '-' + this.panenTaksasiForm.controls['bulan_mulai'].value.id;
    // let periode_akhir = this.panenTaksasiForm.controls['tahun'].value.id + '-' + this.panenTaksasiForm.controls['bulan_akhir'].value.id;
    // let bulan_awal = this.panenTaksasiForm.controls['bulan_mulai'].value.id;
    // let bulan_akhir = this.panenTaksasiForm.controls['bulan_akhir'].value.id;
    let bulan = this.panenTaksasiForm.controls['bulan'].value.id;
    let bulan_nama = this.panenTaksasiForm.controls['bulan'].value['text'];
    let tahun = this.panenTaksasiForm.controls['tahun'].value.id;
    let format_laporan = this.panenTaksasiForm.controls['format_laporan'].value

    let data = {
      estate_id: estate_id,
      // periode_awal: periode_awal,
      // periode_akhir: periode_akhir,
      // bulan_awal: bulan_awal,
      // bulan_akhir: bulan_akhir,
      bulan_nama: bulan_nama,
      bulan: bulan,
      tahun: tahun,
      format_laporan: format_laporan
    };
    console.log(data);

    this.estateService.getLaporanPanenTaksasi(data).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'laporan_panen.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });

    console.log('submit');
  }
  reportPanenWB() {
    this.isFormSubmitted = true;
    if (this.panenWbForm.invalid) {
      return;
    }

    let dataSubmit;



    // let blok_id = this.detailPanenForm.controls['blok'].value['id'] ? this.detailPanenForm.controls['blok'].value['id'] : null;
    let estate_id = this.panenWbForm.controls['estate'].value['id'] ? this.panenWbForm.controls['estate'].value['id'] : null;
    let format_laporan = this.panenWbForm.controls['format_laporan'].value

    dataSubmit = {
      'estate_id': estate_id,
      // 'blok_id': blok_id,
      'tgl_mulai': formatDate(this.panenWbForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.panenWbForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'format_laporan': format_laporan

    };
    console.log(dataSubmit);
    this.estSpatService.getLaporanSpatDetail(dataSubmit).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'laporan_panen.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }

    });

  }

}
