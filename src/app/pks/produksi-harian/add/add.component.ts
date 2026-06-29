import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { PksProduksiHarianService } from 'src/app/shared/services/pks_produksi_harian.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { SlsKontrak } from 'src/app/shared/models/sls_kontrak.model';
import { formatDate, formatNumber } from '@angular/common';

import { isNullOrUndefined, isNumber, isString } from 'util';

declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'add-cmp',
  templateUrl: 'add.component.html',
  styleUrls: ['add.component.css'],
})

export class AddComponent implements OnInit, AfterViewInit {
  isFormSubmitted = false;
  mass = 0;
  height = 0;
  get bmi() {
    return this.mass * this.height;
  }

  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red',


  }
  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();

  public dataSelectMill: any[] = [];


  public options: any;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private pksProduksiHarianService: PksProduksiHarianService,
    private GbmOrganisasiService: GbmOrganisasiService


  ) {
    let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      no_transaksi: new FormControl('(Auto Generate)'),
      tanggal: new FormControl(toDate, Validators.required),
      mill_id: new FormControl([], Validators.required),

      tbs_olah: new FormControl(0, Validators.required),
      tbs_kemarin: new FormControl(0, Validators.required),
      tbs_masuk: new FormControl(0, Validators.required),
      tbs_sisa: new FormControl(0, Validators.required),
      cpo_kg: new FormControl(0, Validators.required),
      kirim_cpo_kg: new FormControl(0, Validators.required),
      produksi_cpo_kg: new FormControl(0, Validators.required),
      kernel_kg: new FormControl(0, Validators.required),
      kirim_kernel_kg: new FormControl(0, Validators.required),
      produksi_kernel_kg: new FormControl(0, Validators.required)


    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }


  private loadSelect2(): void {

    this.GbmOrganisasiService.getAllByType('MILL').subscribe(x => {
      console.log(x);
      this.dataSelectMill = [];
      x.forEach(d => {
        this.dataSelectMill.push({ "id": d.id, "text": d.nama });
      });

    });



  }
  onSubmit() {
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    let dataSubmit = this.entryForm.value;
    dataSubmit['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');

    const cleanNumber = (val: any): number => {
      
      if (val === null || val === undefined || val === '') return 0;
      
      const num = parseFloat(String(val).replace(/[^\d\.\-]/g, ""));
      return isNaN(num) ? 0 : num;
    };

    dataSubmit['tbs_olah'] = cleanNumber(this.entryForm.get('tbs_olah').value);
    dataSubmit['tbs_kemarin'] = cleanNumber(this.entryForm.get('tbs_kemarin').value);
    dataSubmit['tbs_masuk'] = cleanNumber(this.entryForm.get('tbs_masuk').value);
    dataSubmit['tbs_sisa'] = cleanNumber(this.entryForm.get('tbs_sisa').value);
    dataSubmit['cpo_kg'] = cleanNumber(this.entryForm.get('cpo_kg').value);
    dataSubmit['kirim_cpo_kg'] = cleanNumber(this.entryForm.get('kirim_cpo_kg').value);
    dataSubmit['produksi_cpo_kg'] = cleanNumber(this.entryForm.get('produksi_cpo_kg').value);
    dataSubmit['kernel_kg'] = cleanNumber(this.entryForm.get('kernel_kg').value);
    dataSubmit['kirim_kernel_kg'] = cleanNumber(this.entryForm.get('kirim_kernel_kg').value);
    dataSubmit['produksi_kernel_kg'] = cleanNumber(this.entryForm.get('produksi_kernel_kg').value);



    this.pksProduksiHarianService.create(dataSubmit).subscribe(data => {
      // console.log(data);
      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Simpan berhasil',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })

        this.event.emit('OK');
        this.bsModalRef.hide();
      } else {
        swal({
          title: 'Perhatian!',
          text: 'Proses Simpan Gagal',
          type: 'warning',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
      }
    });
  }


  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {

    this.loadSelect2();

  }
  valueChange($event) {
    console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
  processSounding() {

    let tgl = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US'); ''
    let data = { tanggal: tgl, mill_id: this.entryForm.get('mill_id').value['id'] }
    this.pksProduksiHarianService.getProduksiHarian(data).subscribe(d => {
      let res = d['data'];
      this.entryForm.controls['tbs_olah'].patchValue(res['tbs_olah_hari_ini']);
      this.entryForm.controls['tbs_kemarin'].patchValue(res['tbs_sisa_kemarin']);
      this.entryForm.controls['tbs_masuk'].patchValue(res['tbs_masuk']);
      this.entryForm.controls['tbs_sisa'].patchValue(res['tbs_sisa']);
      this.entryForm.controls['cpo_kg'].patchValue(res['cpo_kg_akhir']);
      this.entryForm.controls['kernel_kg'].patchValue(res['kernel_kg_akhir']);
      this.entryForm.controls['kirim_cpo_kg'].patchValue(res['cpo_kg_kirim']);
      this.entryForm.controls['kirim_kernel_kg'].patchValue(res['kernel_kg_kirim']);
      this.entryForm.controls['produksi_cpo_kg'].patchValue(res['cpo_kg_olah']);
      this.entryForm.controls['produksi_kernel_kg'].patchValue(res['kernel_kg_olah']);


    });


  }



  formatNumber(event) {
    // console.log(event.srcElement.getAttribute('formControlName'));
    let form = this.entryForm.get(event.srcElement.getAttribute('formControlName'));
    let value = this.entryForm.get(event.srcElement.getAttribute('formControlName')).value;
    if (isString(value)) {
      value = parseFloat(value.replace(/[^\d\.\-]/g, ""));
    }
    form.patchValue(formatNumber(value, 'en_US', '1.2-2'));
  }
}
