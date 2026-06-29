import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { formatDate } from '@angular/common';
import ImageResize from 'quill-image-resize-module';
import { TranslateService } from '@ngx-translate/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { HrmsPendapatanService } from 'src/app/shared/services/hrms_pendapatan.service';
import { HrmsLokasiService } from 'src/app/shared/services/hrms_lokasi.service';
import { HrmsKomponenGajiService } from 'src/app/shared/services/hrms_komponen_gaji.service';
import { HrmsKaryawanGajiService } from 'src/app/shared/services/hrms_karyawan_gaji.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { isEmpty } from 'rxjs/operators';
import { isNull } from 'util';

declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'add-absensi-cmp',
  templateUrl: 'add.component.html'
})

export class AddComponent implements OnInit, AfterViewInit {
  bsConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'YYYY-MM-DD',

    containerClass: 'theme-dark-blue'
  };
  editor_modules: any;
  isFormSubmitted = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }

  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();
  karyawan_id;
  hari_id;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private karyawanService: KaryawanService,
    private HrmsPendapatanService: HrmsPendapatanService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private translate: TranslateService,
    private hrmsKaryawanGajiService: HrmsKaryawanGajiService,
    private hrmsKomponenGajiService: HrmsKomponenGajiService,

  ) {
    let toDate: Date = new Date();
    let time: Date = new Date();
    this.entryForm = this.builder.group({
      karyawan_id: new FormControl([], Validators.required),
      lokasi_id: new FormControl([], Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
     nilai_pendapatan: new FormControl(0, Validators.required),
      tipe_gaji: new FormControl([], Validators.required),
      keterangan: new FormControl(""),


    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    this.loadSelect2();
  }
  public dataSelectLokasi: any[] = [];
  public dataSelectKaryawan: any[] = [];
  public dataSelectTipePendapatan: any[] = [];
  public dataSelectBasisLembur: any[] = [];
  public dataLembur: any[] = [];
  public dataGapok: any[] = [];

  public nilaiLembur;

  public options: any;

  private loadSelect2(): void {
    let m = this.translate.instant('holidays.messages.update');

    this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {
      let lok_id = x.id;
      this.karyawanService.getByLokasiTugas(lok_id).subscribe(x => {
        this.dataSelectKaryawan = [];
        console.log(x);
        let kary = x['data'];
        kary.forEach(d => {
          // beforeDataSelectKaryawan.push({ "id": d.id, "text": d.nama+" - "+d.nik_ktp+" - "+d.sub_bagian_nama });
          if (d.lokasi_tugas_id == lok_id) {
            this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama + " - " + d.nip + " - " + d.sub_bagian_nama });
            this.dataGapok.push({ "id": d.id, "text": d.gapok });
          }
        });
      });
    });

    // let gapok;
    // this.entryForm.controls['karyawan_id'].valueChanges.subscribe(x => {
    //   let karyawan_id = x.id;
    //   this.dataGapok.forEach(x => {
    //     if (x.id == karyawan_id) {
    //       gapok = x.text;
    //     }
    //     this.calculateTime();
    //   });
    // });

    this.GbmOrganisasiService.getAllByType("UNIT").subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
    });


    this.hrmsKomponenGajiService.getAllPendapatan().subscribe(x=>{
      this.dataSelectTipePendapatan=[];
      x['data'].forEach(d => {
        this.dataSelectTipePendapatan.push({"id":d.id,"text":d.nama});
      });
    });



  }

  onSubmit() {
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    let frmData = new FormData();
    frmData.append('tanggal', formatDate(this.entryForm.get('tanggal').value, "yyy-MM-dd", "en_US"));
    frmData.append('karyawan_id', this.entryForm.get('karyawan_id').value['id']);
    frmData.append('tipe_gaji_id', this.entryForm.get('tipe_gaji').value['id']);
    frmData.append('lokasi_id', this.entryForm.get('lokasi_id').value['id']);
    frmData.append('nilai_pendapatan', this.entryForm.get('nilai_pendapatan').value);
    frmData.append('keterangan', this.entryForm.get('keterangan').value);


    this.HrmsPendapatanService.create(frmData).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        console.log('ok');
        this.event.emit('OK');
        this.bsModalRef.hide();
      }
    });
  }


  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();

  }

  valueChange(event) {


  }
  valueTimeChange(event) {
    console.log(event);



  }
}
