import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { HrmsPeriodeGajiService } from 'src/app/shared/services/hrms_periode_gaji.service';
import { HrmsLokasiService } from 'src/app/shared/services/hrms_lokasi.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';

declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'edit-periodeGaji-cmp',
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
  hari_id;
  periodeGaji;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private translate: TranslateService,
    private karyawanService: KaryawanService,
    private hrmsPeriodeGajiService: HrmsPeriodeGajiService,
    private hrmsLokasiService: HrmsLokasiService,
    private gbmOrganisasiService: GbmOrganisasiService,
  ) {

    let toDate: Date = new Date();
    let time: Date = new Date();
    this.entryForm = this.builder.group({
     lokasi_id: new FormControl([], Validators.required),
      tgl_awal: new FormControl(toDate, Validators.required),
      tgl_akhir: new FormControl(toDate, Validators.required),
      nama: new FormControl('', []),
      status: new FormControl('0', []),
      is_close: new FormControl(0),

    });

  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {
    let date: Date = new Date();
    let strDate = formatDate(date, "yyyy-MM-dd", "en_US");
    let tgl_awal = new Date(Date.parse(this.periodeGaji['tgl_awal'] ));
    let tgl_akhir = new Date(Date.parse(this.periodeGaji['tgl_akhir'] ));
    this.entryForm.get('tgl_awal').patchValue(tgl_awal);
    this.entryForm.get('tgl_akhir').patchValue(tgl_akhir);
    this.entryForm.get('nama').patchValue(this.periodeGaji['nama']);
    this.entryForm.get('status').patchValue(this.periodeGaji['status']);
    this.entryForm.get('is_close').patchValue(this.periodeGaji.is_close == true ? 1 : 0);


  }
  public dataSelectLokasi: any[] = [];
  public dataSelectKaryawan: any[] = [];
  public options: any;

  private loadSelect2(): void {
    let selectedLokasi;
    this.gbmOrganisasiService.getAllByType('UNIT').subscribe(x=>{
      this.dataSelectLokasi=[];
      x.forEach(d => {
        this.dataSelectLokasi.push({"id":d.id,"text":d.nama});
        if (this.periodeGaji['lokasi_id'] == d.id) {
          selectedLokasi = { "id": d.id, "text": d.nama };
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectedLokasi);
    });


  }
  onSubmit() {
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    let dataSubmit = this.entryForm.value;
    dataSubmit['tgl_awal'] = formatDate(this.entryForm.get('tgl_awal').value, "yyyy-MM-dd", 'en_US');
    dataSubmit['tgl_akhir'] = formatDate(this.entryForm.get('tgl_akhir').value, "yyyy-MM-dd", 'en_US');

    this.hrmsPeriodeGajiService.update(this.periodeGaji.id, dataSubmit).subscribe(data => {
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

  }
}
