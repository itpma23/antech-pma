import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';


import { isNullOrUndefined, isNumber, isString } from 'util';
import { formatDate, formatNumber } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { AccKegiatanService } from 'src/app/shared/services/acc_kegiatan.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
// import { TrkKendaraanService } from 'src/app/shared/services/trk_kendaraan.service';
import { EstSpkBappService } from 'src/app/shared/services/est_spk_bapp-old.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';

declare var $: any;
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'add-cmp',
  templateUrl: 'add.component.html',
  styleUrls: ['add.component.css'],
})

export class AddComponent implements OnInit, AfterViewInit {
  editor_modules: any;
  isFormSubmitted = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  EstSpkDetail;
  entryForm: FormGroup;

  event: EventEmitter<any> = new EventEmitter();

  dataKegiatan;
  dataSelectSupplier;
  dataSelectRayon;
  dataSelectBlok;
  dataSelectKegiatan;
  dataSelectLokasi: any[];

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    // private trkKendaraanService: TrkKendaraanService,
    private GbmSupplierService: GbmSupplierService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private KaryawanService: KaryawanService,
    private accKegiatanService: AccKegiatanService,
    private estSpkBappService: EstSpkBappService,
    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();

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
    console.log(this.EstSpkDetail)
    this.entryForm.get('real_harga').patchValue(this.EstSpkDetail.harga);
    this.entryForm.get('real_volume').patchValue(this.EstSpkDetail.volume);
    this.entryForm.get('real_hk').patchValue(this.EstSpkDetail.hk);
    this.entryForm.get('jumlah').patchValue(this.EstSpkDetail.total);
    this.entryForm.get('blok').patchValue(this.EstSpkDetail.blok);
    this.entryForm.get('kegiatan').patchValue(this.EstSpkDetail.kegiatan);
    this.entryForm.get('keterangan').patchValue(this.EstSpkDetail.keterangan);


  }
  public options: any;

  private loadSelect2(): void {

    // this.accKegiatanService.getAll().subscribe(x => {
    //   this.dataKegiatan = x['data'];
    //   this.dataSelectKegiatan = [];
    //   x['data'].forEach(d => {
    //     this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama });
    //   });
    // });

    // this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
    //   this.dataSelectLokasi = [];
    //   x.forEach(d => {
    //     this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
    //   });

    //   this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {
    //     let lokasi_id = x.id;
    //     this.GbmOrganisasiService.getAllByType('RAYON').subscribe(x => {
    //       this.dataSelectRayon = [];
    //       x.forEach(d => {
    //         if (lokasi_id==d.parent_id) {
    //           this.dataSelectRayon.push({ "id": d.id, "text": d.nama + "("+ d.kode +")" });
    //         }
    //       });
    //     });

    //   });

    //   this.entryForm.controls['rayon_id'].valueChanges.subscribe(x => {
    //     let rayon_id = x.id;

    //     let afdeling_id=[];
    //     this.GbmOrganisasiService.getAllByType('AFDELING').subscribe(x => {
    //       x.forEach(d=> {
    //         if (rayon_id==d.parent_id) {
    //           afdeling_id.push(d.id);
    //         }
    //       });
    //     });

    //     console.log(afdeling_id);

    //     this.GbmOrganisasiService.getAllByType('BLOK').subscribe(x => {
    //       this.dataSelectBlok = [];
    //       x.forEach(d => {
    //         if (afdeling_id.includes(String(d.parent_id))) {
    //           this.dataSelectBlok.push({ "id": d.id, "text": d.nama + "("+ d.kode +")" });
    //         }
    //       });
    //     });
    //   });

    // });



    // this.GbmSupplierService.getAll().subscribe(x => {
    //   this.dataSelectSupplier = [];
    //   let i = x['data'];
    //   i.forEach(d => {
    //     this.dataSelectSupplier.push({ "id": d.id, "text": d.nama_supplier });
    //   });
    // });

  }
  onSubmit() {
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
    frmData['spk_dt_id'] = this.EstSpkDetail.id;
    frmData['real_harga'] =real_harga;
    frmData['real_volume'] = real_volume;

    console.log(frmData);
    this.estSpkBappService.create(frmData).subscribe(data => {
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

  getSatuan(form) {
    let uom;
    let kegiatan_id = form.get('kegiatan_id').value.id;

    this.dataKegiatan.forEach(x => {
      if (x.id == kegiatan_id) {
        uom = x.uom;
      }
    });

    form.get('satuan').patchValue(uom);
  }

  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };
  get details_kegiatan(): FormArray {
    return this.entryForm.get('details_kegiatan') as FormArray;
  };
  // get details_kegiatan(): FormArray {
  //   return this.entryForm.get('details_kegiatan') as FormArray;
  // };




  updateForm(data) {


  }
  recalculate() {

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

  let jumlah=real_harga*real_volume;
  this.entryForm.get('real_volume').patchValue(formatNumber(real_volume, 'en_US', '1.2-2'));
  this.entryForm.get('real_harga').patchValue(formatNumber(real_harga, 'en_US', '1.2-2'));
  this.entryForm.get('jumlah').patchValue(formatNumber(jumlah, 'en_US', '1.2-2'));

}
  // numberFormatDetail(form) {
  //   let hk = form.get('hk').value;
  //   if (isString(hk)) {
  //     hk = parseFloat(hk.replace(/[^\d\.\-]/g, ""));
  //   }
  //   form.get('hk').patchValue(formatNumber(hk, 'en_US', '1.2-2'));

  //   let real_volume = form.get('real_volume').value;
  //   if (isString(real_volume)) {
  //     real_volume = parseFloat(real_volume.replace(/[^\d\.\-]/g, ""));
  //   }
  //   form.get('real_volume').patchValue(formatNumber(real_volume, 'en_US', '1.2-2'));

  //   let total = form.get('total').value;
  //   if (isString(total)) {
  //     total = parseFloat(total.replace(/[^\d\.\-]/g, ""));
  //   }
  //   form.get('total').patchValue(formatNumber(total, 'en_US', '1.2-2'));

  //   let real_harga = total / real_volume;
  //   form.get('real_harga').patchValue(formatNumber(real_harga, 'en_US', '1.2-2'));
  // }

  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();
    // this.valueChange();

  }



}
