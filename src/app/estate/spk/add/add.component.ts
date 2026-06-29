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
import { EstSpkService } from 'src/app/shared/services/est_spk.service';
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
    private EstSpkService: EstSpkService,
    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      lokasi_id: new FormControl([], Validators.required),
      // rayon_id: new FormControl([], Validators.required),
      supplier_id: new FormControl([], Validators.required),

      no_spk: new FormControl(''),
      estimasi: new FormControl(0),

      tanggal: new FormControl(toDate, Validators.required),
      tgl_mulai: new FormControl(toDate, Validators.required),
      tgl_akhir: new FormControl(toDate, Validators.required),

      details: this.builder.array([]),
      // details_kegiatan: this.builder.array([]),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    // this.addDetail('mesin');
    // this.addDetail();
  }
  public options: any;

  private loadSelect2(): void {

    this.accKegiatanService.getAllbyTipe('PEMELIHARAAN').subscribe(x => {
      this.dataKegiatan = x['data'];
      this.dataSelectKegiatan = [];
      x['data'].forEach(d => {
        this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama });
      });
    });






    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });

      this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {
        let lokasi_id = x.id;
        this.GbmOrganisasiService.getAfdStnByMillEstate(lokasi_id).subscribe(x => {
          this.dataSelectBlok = [];
          x.forEach(d => {
            this.dataSelectBlok.push({ "id": d.id, "text": d.nama + "(" + d.kode + ")" });
          });
        });

        //   this.GbmOrganisasiService.getAllByType('RAYON').subscribe(x => {
        //     this.dataSelectRayon = [];
        //     x.forEach(d => {
        //       if (lokasi_id==d.parent_id) {
        //         this.dataSelectRayon.push({ "id": d.id, "text": d.nama + "("+ d.kode +")" });
        //       }
        //     });
        //   });
        //   // this.dataSelectRayon.forEach(d=> {
        //   //   if (lokasi_id == d.parent_id) {
        //   //     this.dataSelectRayon.push({ "id": d.id, "text": d.nama + "("+ d.kode +")" });
        //   //   }
        //   // });
        // });

        // this.entryForm.controls['rayon_id'].valueChanges.subscribe(x => {
        //   let rayon_id = x.id;

        //   let afdeling_id=[];
        //   this.GbmOrganisasiService.getAllByType('AFDELING').subscribe(x => {
        //     x.forEach(d=> {
        //       if (rayon_id==d.parent_id) {
        //         afdeling_id.push(d.id);
        //       }
        //     });
        //   });

        //   console.log(afdeling_id);

        //   this.GbmOrganisasiService.getAllByType('BLOK').subscribe(x => {
        //     this.dataSelectBlok = [];
        //     x.forEach(d => {
        //       if (afdeling_id.includes(String(d.parent_id))) {
        //         this.dataSelectBlok.push({ "id": d.id, "text": d.nama + "("+ d.kode +")" });
        //       }
        //     });
        //   });
      });

    });


    this.GbmSupplierService.getKontraktor().subscribe(x => {
      this.dataSelectSupplier = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectSupplier.push({ "id": d.id, "text": d.nama_supplier });
      });
    });

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
    this.entryForm.get('details').value.forEach(x => {
      if (!isNumber(x.harga)) {
        x.harga = parseFloat(x.harga.replace(/[^\d\.\-]/g, ""));

      }
      if (!isNumber(x.total)) {
        x.total = parseFloat(x.total.replace(/[^\d\.\-]/g, ""));

      }
      if (!isNumber(x.volume)) {
        x.volume = parseFloat(x.volume.replace(/[^\d\.\-]/g, ""));

      }
      if (!isNumber(x.hk)) {
        x.hk = parseFloat(x.hk.replace(/[^\d\.\-]/g, ""));

      }

    });
    let estimasi = this.entryForm.get('estimasi').value;
    if (!isNumber(estimasi)) {
      estimasi = parseFloat(estimasi.replace(/[^\d\.\-]/g, ""));

    }

    let frmData = this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    frmData['tgl_mulai'] = formatDate(this.entryForm.get('tgl_mulai').value, "yyyy-MM-dd", 'en_US');
    frmData['tgl_akhir'] = formatDate(this.entryForm.get('tgl_akhir').value, "yyyy-MM-dd", 'en_US');
    frmData['estimasi'] = estimasi;

    console.log(frmData);
    this.EstSpkService.create(frmData).subscribe(data => {
      console.log(data);
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


  addDetail() {
    let fb = (this.builder.group({
      blok_id: new FormControl([], Validators.required),
      kegiatan_id: new FormControl([], Validators.required),
      satuan: new FormControl(''),
      hk: new FormControl(0, Validators.required),
      volume: new FormControl(0, Validators.required),
      total: new FormControl(0, Validators.required),
      harga: new FormControl(0, Validators.required),
    }));

    this.details.push(fb)
    this.numberFormatDetail(fb)

  }
  // addKegiatan() {
  //   this.details_kegiatan.push(this.builder.group({
  //     km_hm_mulai: new FormControl(0, Validators.required),
  //     km_hm_akhir: new FormControl(0, Validators.required),
  //     km_hm_jumlah: new FormControl(0, Validators.required),
  //     blok_id: new FormControl([], Validators.required),
  //     kegiatan_id: new FormControl([], Validators.required),
  //     // hasil_kerja: new FormControl(0, Validators.required),
  //     volume: new FormControl(1, Validators.required),
  //   }));
  //   // this.valueChange();
  // }

  removeDetail(dtl) {
    let i = this.details.controls.indexOf(dtl);
    if (i != -1) {
      //  let x=	this.details.controls.splice(i, 1);
      let dtls = this.entryForm.get('details') as FormArray;
      dtls.removeAt(i);
      let data = { details: dtls.value };
      this.updateForm(data);
    }

    this.hitungNilai()
    this.numberFormat()
  }
  removeKegiatan(Kegiatan) {
    let i = this.details_kegiatan.controls.indexOf(Kegiatan);
    if (i != -1) {
      //  let x=	this.details.controls.splice(i, 1);
      let Kegiatans = this.entryForm.get('details_kegiatan') as FormArray;
      Kegiatans.removeAt(i);
      let data = { details_kegiatan: Kegiatans.value };
      this.updateForm(data);
    }

    // this.valueChange();
  }
  // removeBlokKegiatan( blok ) {
  //   let i = this.details_kegiatan.controls.indexOf(blok);
  //   if(i != -1) {
  //     let detail = this.entryForm.get('details_kegiatan') as FormArray;
  //     detail.removeAt(i);
  //     let data = {details_kegiatan: detail.value};
  //     this.updateForm(data);
  //   }
  // }


  updateForm(data) {
    // const bloks = data.details;
    // let sub = 0;
    // for(let i of bloks){
    //   sub=sub+ parseFloat( i.jumlah_janjang);
    // }
    // // console.log(sub);
    //this.entryForm.get('total').patchValue( sub);

  }
  recalculate() {
    // let bloks = this.entryForm.get('details') as FormArray;
    // let data = { details: bloks.value };
    // this.updateForm(data);


  }
  hitungNilai() {

    let tot = 0;

    // console.log(this.entryForm.get('details').value);
    this.entryForm.get('details').value.forEach(x => {
      // console.log(x);
      if (isNumber(x.total)) {
        tot += x.total;
      } else {
        tot += parseFloat(x.total.replace(/[^\d\.\-]/g, ""));
      }


    });

    this.entryForm.get('estimasi').patchValue(formatNumber(tot, 'en_US', '1.2-2'));

  }
  numberFormat() {
    let estimasi = this.entryForm.get('estimasi').value;
    if (isString(estimasi)) {
      estimasi = parseFloat(estimasi.replace(/[^\d\.\-]/g, ""));
    }
    this.entryForm.get('estimasi').patchValue(formatNumber(estimasi, 'en_US', '1.2-2'));
  }
  numberFormatDetail(form) {
    let hk = form.get('hk').value;
    if (isString(hk)) {
      hk = parseFloat(hk.replace(/[^\d\.\-]/g, ""));
    }
    form.get('hk').patchValue(formatNumber(hk, 'en_US', '1.2-2'));

    let volume = form.get('volume').value;
    if (isString(volume)) {
      volume = parseFloat(volume.replace(/[^\d\.\-]/g, ""));
    }
    form.get('volume').patchValue(formatNumber(volume, 'en_US', '1.2-2'));

    let total = form.get('total').value;
    if (isString(total)) {
      total = parseFloat(total.replace(/[^\d\.\-]/g, ""));
    }
    form.get('total').patchValue(formatNumber(total, 'en_US', '1.2-2'));

    let harga = total / volume;
    form.get('harga').patchValue(formatNumber(harga, 'en_US', '1.2-2'));

    this.hitungNilai()
    this.numberFormat()
  }

  onClose() {
    this.bsModalRef.hide();
    console.log('close')
  }

  ngOnInit() {
    this.loadSelect2();
    // this.valueChange();

  }

  // valueChange(event, blok) {
  //   // console.log(event);
  //   // console.log(blok);
  //   this.hitungPremi(blok);
  // }

  // hitungPremi(blok) {
  //   let data = blok.value
  //   data['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
  //   console.log(data);
  //   this.EstSpkService.hitungPremi(data).subscribe(res => {
  //     console.log(res)
  //     if (res['status'] == 'OK') {
  //       let hasil = res['data']
  //       let volume = parseFloat(blok.get('jumlah_hk').value)
  //       let rp_hk = parseFloat(hasil['rp_hk'])
  //       blok.get('rupiah_hk').patchValue(volume*rp_hk);
  //     }
  //   });
  // }

}
