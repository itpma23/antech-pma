import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { HrmsPendapatanService } from 'src/app/shared/services/hrms_pendapatan.service';
import { HrmsKaryawanGajiService } from 'src/app/shared/services/hrms_karyawan_gaji.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { isNull } from 'util';
import { HrmsKomponenGajiService } from 'src/app/shared/services/hrms_komponen_gaji.service';

declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'edit-Pendapatan-cmp',
  templateUrl: 'edit.component.html'
})

export class EditComponent implements OnInit, AfterViewInit {
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
  pengajar_id;
  hari_id;
  pendapatan;
  gapok = 0;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private karyawanService: KaryawanService,
    private hrmsPendapatanService: HrmsPendapatanService,
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
    let date: Date = new Date();
    let strDate = formatDate(date, "yyyy-MM-dd", "en_US");
    let tanggal = new Date(Date.parse(this.pendapatan['tanggal']));

;
    this.entryForm.get('tanggal').patchValue(tanggal);
    this.entryForm.get('nilai_pendapatan').patchValue(this.pendapatan['nilai']);
    this.entryForm.get('keterangan').patchValue(this.pendapatan['keterangan']);
    // this.entryForm.get('Pendapatan_perjam').patchValue(this.Pendapatan['Pendapatan_perjam']);


  }
  public dataSelectLokasi: any[] = [];
  public dataSelectKaryawan: any[] = [];
  public dataSelectTipePendapatan: any[] = [];
  public dataSelectBasisPendapatan: any[] = [];
  public dataPendapatan: any[] = [];
  public dataGapok: any[] = [];
  public nilaiPendapatan;
  public basisPendapatan;


  private loadSelect2(): void {
    console.log(this.pendapatan)
    let selectedKaryawan;
    this.karyawanService.getAll().subscribe(x => {
      this.dataSelectKaryawan = [];
      let kary = x['data'];
      kary.forEach(d => {
        this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama });
        if (d.id == this.pendapatan['karyawan_id']) {
          selectedKaryawan = { "id": d.id, "text": d.nama };
        }

      });
      this.entryForm.get('karyawan_id').patchValue(selectedKaryawan);
    });
    // let gapok;
    this.entryForm.controls['karyawan_id'].valueChanges.subscribe(x => {
      let karyawan_id = x.id;
      // this.dataGapok.forEach(x => {
      //   if (x.id == karyawan_id) {
      //     this.gapok = x.text;

      //   }
      //   this.calculateTime();
      // });
    });


    let selectedMill;
    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
        if (this.pendapatan.lokasi_id == d.id) {
          selectedMill = { "id": d.id, "text": d.nama };
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectedMill);
    });


    let selectedTipePendapatan;
    this.hrmsKomponenGajiService.getAllPendapatan().subscribe(x => {
      this.dataSelectTipePendapatan = [];
      x['data'].forEach(d => {
        this.dataSelectTipePendapatan.push({ "id": d.id, "text": d.nama });
        if (this.pendapatan.tipe_gaji_id == d.id) {
          selectedTipePendapatan = { "id": d.id, "text": d.nama };
        }
      });
      this.entryForm.get('tipe_gaji').patchValue(selectedTipePendapatan);
    });






  }
  onSubmit() {
    this.isFormSubmitted = true;
    console.log(this.entryForm);

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

    this.hrmsPendapatanService.update(this.pendapatan.id, frmData).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        console.log('ok');
        this.event.emit('OK');
        this.bsModalRef.hide();
      }
    });
  }

  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.entryForm.patchValue({
      img: file
    });
    this.entryForm.get('img').updateValueAndValidity()
    console.log(file);
  }
  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();

  }

  valueChange(event) {
    //this.getPendapatanPerjam(event.id);


  }
  valueTimeChange(event) {
    console.log(event);

  }
}
