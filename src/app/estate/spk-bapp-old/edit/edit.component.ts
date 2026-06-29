import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';


import { isNullOrUndefined, isNumber, isString } from 'util';
import { formatDate, formatNumber } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { AccKegiatanService } from 'src/app/shared/services/acc_kegiatan.service';
// import { TrkKendaraanService } from 'src/app/shared/services/trk_kendaraan.service';
import { EstSpkBappService } from 'src/app/shared/services/est_spk_bapp-old.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { EstSpkBapp } from 'src/app/shared/models/est_spk_bapp.model';
import { EstSpk } from 'src/app/shared/models/est_spk.model';

declare var $: any;
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'edit-cmp',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.css'],
})

export class EditComponent implements OnInit, AfterViewInit {
  editor_modules: any;
  isFormSubmitted = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  awalanHeading = "heading_";
  awalanCollapse = "collapse_";

  entryForm: FormGroup;

  event: EventEmitter<any> = new EventEmitter();

  EstSpkBapp: EstSpkBapp;
  EstSpk: EstSpk;
  dataSelectSupplier;
  dataSelectRayon;
  dataSelectBlok;
  dataSelectKegiatan;
  dataSelectLokasi: any[];

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    // private trkKendaraanService: TrkKendaraanService,
    private GbmSupplierService: GbmSupplierService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private KaryawanService: KaryawanService,
    private accKegiatanService: AccKegiatanService,
    private EstSpkBappService: EstSpkBappService,
    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();
    let time: Date = new Date();

    this.entryForm = this.builder.group({
      real_harga: new FormControl(0, Validators.required),
      blok: new FormControl('', Validators.required),
      kegiatan: new FormControl('', Validators.required),
      real_volume: new FormControl(0, Validators.required),
      keterangan: new FormControl(''),
      jumlah: new FormControl('', Validators.required),
      real_hk: new FormControl('', Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
    });
  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    let date: Date = new Date();
    let strDate = formatDate(date, "yyyy-MM-dd", "en_US");
    console.log(this.EstSpkBapp)
    this.entryForm.get('real_harga').patchValue(formatNumber(this.EstSpkBapp.real_harga,'en_US', '1.2-2'));
    this.entryForm.get('real_volume').patchValue(formatNumber(this.EstSpkBapp.real_volume,'en_US', '1.2-2'));
    this.entryForm.get('real_hk').patchValue(formatNumber(this.EstSpkBapp.real_hk,'en_US', '1.2-2'));
    this.entryForm.get('jumlah').patchValue(formatNumber((this.EstSpkBapp.real_harga * this.EstSpkBapp.real_volume),'en_US', '1.2-2'));
    this.entryForm.get('blok').patchValue(this.EstSpkBapp.blok);
    this.entryForm.get('kegiatan').patchValue(this.EstSpkBapp.kegiatan);

  }
  public options: any;

  private loadSelect2(): void {


    // let selectedRayon;
    // this.gbmOrganisasiService.getAllByType('RAYON').subscribe(x => {
    //   this.dataSelectRayon = [];
    //   x.forEach(d => {
    //     this.dataSelectRayon.push({ "id":d.id, "text":d.nama, "parent_id":d.parent_id });
    //   });
    // });

    // this.gbmOrganisasiService.getAllByType('BLOK').subscribe(x => {
    //   this.dataSelectBlok = [];
    //   x.forEach(d => {
    //     this.dataSelectBlok.push({ "id":d.id, "text":d.nama, "parent_id":d.parent_id });
    //   });
    // });

    // let selectedLokasi;
    // this.gbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
    //   this.dataSelectLokasi = [];
    //   x.forEach(d => {
    //     this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
    //     if (this.EstSpkBapp.lokasi_id == d.id) {
    //       selectedLokasi = { "id": d.id, "text": d.nama };
    //     }
    //   });
    //   this.entryForm.get('lokasi_id').patchValue(selectedLokasi);

    //   let rayon_id;
    //   this.dataSelectRayon.forEach( d=> {
    //     if (d.parent_id == this.EstSpkBapp.lokasi_id) {
    //       rayon_id = d.id;
    //       selectedRayon = { "id": d.id, "text": d.nama };
    //     }
    //   });
    //   this.entryForm.get('rayon_id').patchValue(selectedRayon);

    //   this.dataSelectBlok.forEach( d=> {
    //     if (d.parent_id == rayon_id) {
    //       this.dataSelectBlok.push({ "id":d.id, "text":d.nama });
    //     }
    //   });

    //   this.accKegiatanService.getAll().subscribe(x => {
    //     this.dataSelectKegiatan = [];
    //     x['data'].forEach(d => {
    //       this.dataSelectKegiatan.push({ "id":d.id, "text":d.nama });
    //     });

    //     let dtl: EstSpkBapp[];
    //     dtl = this.EstSpkBapp.detail;
    //     console.log(dtl);
    //     for (let index = 0; index < dtl.length; index++) {
    //       const d = dtl[index];
    //       this.addDetail(d.blok_id, d.kegiatan_id, d.hk, d.volume, d.total, d.harga);
    //     }
    //   });

    // });


    // let selectedSupplier;
    // this.GbmSupplierService.getAll().subscribe(x => {
    //   this.dataSelectSupplier = [];
    //   x['data'].forEach(d => {
    //     this.dataSelectSupplier.push({ "id":d.id, "text":d.nama_supplier });
    //     if (this.EstSpkBapp.supplier_id == d.id) {
    //       selectedSupplier = {"id":d.id, "text":d.nama_supplier};
    //     }
    //   });
    //   this.entryForm.get('supplier_id').patchValue(selectedSupplier);
    // });
  }
  onSubmit() {
    // // console.log(this.entryForm.value);

    this.isFormSubmitted = true;

    if (this.entryForm.invalid) {
      swal({
        title: 'Perhatian!',
        text: 'Data belum lengkap!',
        type: 'warning',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      })
      return;
    }


    let frmData = this.entryForm.value;
    let real_volume = this.entryForm.get('real_volume').value;
    let real_harga = this.entryForm.get('real_harga').value;
    if (isString(real_volume)) {
      real_volume = parseFloat(real_volume.replace(/[^\d\.\-]/g, ""));
    }
    if (isString(real_harga)) {
      real_harga = parseFloat(real_harga.replace(/[^\d\.\-]/g, ""));
    }
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    frmData['spk_dt_id'] = this.EstSpkBapp.spk_dt_id;
    frmData['real_harga'] = real_harga;
    frmData['real_volume'] = real_volume;
    console.log(frmData);
    this.EstSpkBappService.update(this.EstSpkBapp.id, frmData).subscribe(data => {
      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          // text: 'Data berhasil diSimpan dengan Nomor:'+data['data'],
          text: 'Data berhasil di simpan',
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

  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };

  get details_kegiatan(): FormArray {
    return this.entryForm.get('details_kegiatan') as FormArray;
  };



  updateForm(data) {

  }
  recalculate() {

  }
  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();
    // this.valueChange();
  }
  valueChange(event, blok) {

  }



  numberFormat() {
    let real_volume = this.entryForm.get('real_volume').value;
    let real_harga = this.entryForm.get('real_harga').value;
    if (isString(real_volume)) {
      real_volume = parseFloat(real_volume.replace(/[^\d\.\-]/g, ""));
    }
    if (isString(real_harga)) {
      real_harga = parseFloat(real_harga.replace(/[^\d\.\-]/g, ""));
    }

    let jumlah = real_harga * real_volume;
    this.entryForm.get('real_volume').patchValue(formatNumber(real_volume, 'en_US', '1.2-2'));
    this.entryForm.get('real_harga').patchValue(formatNumber(real_harga, 'en_US', '1.2-2'));
    this.entryForm.get('jumlah').patchValue(formatNumber(jumlah, 'en_US', '1.2-2'));
  }
  numberFormatDetail(form) {
    //   let hk = form.get('hk').value;
    //   if (isString(hk)) {
    //     hk = parseFloat(hk.replace(/[^\d\.\-]/g, ""));
    //   }
    //   form.get('hk').patchValue(formatNumber(hk, 'en_US', '1.2-2'));

    //   let volume = form.get('volume').value;
    //   if (isString(volume)) {
    //     volume = parseFloat(volume.replace(/[^\d\.\-]/g, ""));
    //   }
    //   form.get('volume').patchValue(formatNumber(volume, 'en_US', '1.2-2'));

    //   let total = form.get('total').value;
    //   if (isString(total)) {
    //     total = parseFloat(total.replace(/[^\d\.\-]/g, ""));
    //   }
    //   form.get('total').patchValue(formatNumber(total, 'en_US', '1.2-2'));

    //   let harga = total / volume;
    //   form.get('harga').patchValue(formatNumber(harga, 'en_US', '1.2-2'));
    //
  }


}
