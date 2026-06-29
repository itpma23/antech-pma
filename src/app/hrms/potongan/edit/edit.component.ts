import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { HrmsPotonganService } from 'src/app/shared/services/hrms_potongan.service';
import { HrmsKaryawanGajiService } from 'src/app/shared/services/hrms_karyawan_gaji.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { isNull } from 'util';
import { HrmsKomponenGajiService } from 'src/app/shared/services/hrms_komponen_gaji.service';

declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'edit-potongan-cmp',
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
  potongan;
  gapok = 0;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private karyawanService: KaryawanService,
    private hrmsPotonganService: HrmsPotonganService,
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
      nilai_potongan: new FormControl(0, Validators.required),
      tipe_gaji: new FormControl([], Validators.required),
      keterangan: new FormControl(""),

    });

  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {
    let date: Date = new Date();
    let strDate = formatDate(date, "yyyy-MM-dd", "en_US");
    let tanggal = new Date(Date.parse(this.potongan['tanggal']));

;
    this.entryForm.get('tanggal').patchValue(tanggal);
    this.entryForm.get('nilai_potongan').patchValue(this.potongan['nilai']);
    this.entryForm.get('keterangan').patchValue(this.potongan['keterangan']);
    // this.entryForm.get('potongan_perjam').patchValue(this.potongan['potongan_perjam']);


  }
  public dataSelectLokasi: any[] = [];
  public dataSelectKaryawan: any[] = [];
  public dataSelectTipePotongan: any[] = [];
  public dataSelectBasispotongan: any[] = [];
  public datapotongan: any[] = [];
  public dataGapok: any[] = [];
  public nilaipotongan;
  public basispotongan;


  private loadSelect2(): void {
    console.log(this.potongan)
    let selectedKaryawan;
    this.karyawanService.getAll().subscribe(x => {
      this.dataSelectKaryawan = [];
      let kary = x['data'];
      kary.forEach(d => {
        this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama });
        if (d.id == this.potongan['karyawan_id']) {
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
        if (this.potongan.lokasi_id == d.id) {
          selectedMill = { "id": d.id, "text": d.nama };
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectedMill);
    });


    let selectedTipePotongan;
    this.hrmsKomponenGajiService.getAllPotongan().subscribe(x => {
      this.dataSelectTipePotongan = [];
      x['data'].forEach(d => {
        this.dataSelectTipePotongan.push({ "id": d.id, "text": d.nama });
        if (this.potongan.tipe_gaji_id == d.id) {
          selectedTipePotongan = { "id": d.id, "text": d.nama };
        }
      });
      this.entryForm.get('tipe_gaji').patchValue(selectedTipePotongan);
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
    frmData.append('nilai_potongan', this.entryForm.get('nilai_potongan').value);
    frmData.append('keterangan', this.entryForm.get('keterangan').value);

    this.hrmsPotonganService.update(this.potongan.id, frmData).subscribe(data => {
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
    //this.getpotonganPerjam(event.id);


  }
  valueTimeChange(event) {
    console.log(event);

  }
}
