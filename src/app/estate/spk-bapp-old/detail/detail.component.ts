import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


import { isNullOrUndefined, isNumber, isString } from 'util';
import { formatDate, formatNumber } from '@angular/common';

import { LookupComponent } from '../lookup/lookup.component';

import { TranslateService } from '@ngx-translate/core';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { AccKegiatanService } from 'src/app/shared/services/acc_kegiatan.service';
// import { TrkKendaraanService } from 'src/app/shared/services/trk_kendaraan.service';
import { EstSpkService } from 'src/app/shared/services/est_spk.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { EstSpk, EstSpkDetail, EstSpkLog } from 'src/app/shared/models/est_spk.model';

import { ActivatedRoute, Router } from '@angular/router';
import { AddComponent } from '../add/add.component';
import { EditComponent } from '../edit/edit.component';
import { EstSpkBappService } from 'src/app/shared/services/est_spk_bapp-old.service';

declare var $: any;
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'detail-cmp',
  templateUrl: 'detail.component.html',
  styleUrls: ['detail.component.css'],
})

export class DetailComponent implements OnInit, AfterViewInit {
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

  EstSpk: EstSpk;
  spk_id;
  lastUrl;

  dataSelectSupplier;
  dataSelectRayon;
  dataSelectBlok;
  dataSelectKegiatan;
  dataSelectLokasi: any[];
  bsModalRef: BsModalRef;
  constructor(private builder: FormBuilder,
    private bsModalService: BsModalService,
    // private bsModalRef: BsModalRef,
    private estSpkBappService: EstSpkBappService,
    private GbmSupplierService: GbmSupplierService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private KaryawanService: KaryawanService,
    private accKegiatanService: AccKegiatanService,
    private EstSpkService: EstSpkService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,

  ) {
    this.spk_id = this.route.snapshot.params.spk_id;
    this.lastUrl = this.route.snapshot.paramMap.get('previousUrl');

    // let toDate: Date = new Date();
    // let time: Date = new Date();

    this.entryForm = this.builder.group({
    //   lokasi_id: new FormControl([], Validators.required),
    //   rayon_id: new FormControl([], Validators.required),
    //   supplier_id: new FormControl([], Validators.required),
    //   no_spk: new FormControl(''),
    //   estimasi: new FormControl(0),
    //   tanggal: new FormControl(toDate, Validators.required),
    //   tgl_mulai: new FormControl(toDate, Validators.required),
    //   tgl_akhir: new FormControl(toDate, Validators.required),
      details: this.builder.array([]),
    });
  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

    // let date: Date = new Date();
    // let strDate = formatDate(date, "yyyy-MM-dd", "en_US");

    // this.entryForm.get('no_spk').patchValue(this.EstSpk.no_spk);
    // this.entryForm.get('estimasi').patchValue(this.EstSpk.estimasi);
    // this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.EstSpk.tanggal)));
    // this.entryForm.get('tgl_mulai').patchValue(new Date(Date.parse(this.EstSpk.tgl_mulai)));
    // this.entryForm.get('tgl_akhir').patchValue(new Date(Date.parse(this.EstSpk.tgl_akhir)));
  }
  public options: any;

  private loadData() {
    this.EstSpkService.getById(this.spk_id).subscribe(m => {
      this.EstSpk = m['data'];
      console.log(this.EstSpk);
      // this.entryForm.controls['details'].value.push(this.EstSpk.detail);

      this.EstSpk.detail.forEach( x => {

        //this.addDetail(x);

      });


      console.log(this.entryForm);


    });


  }

  kembali() {
    this.router.navigate([this.lastUrl]);
  }

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
    //     if (this.EstSpk.lokasi_id == d.id) {
    //       selectedLokasi = { "id": d.id, "text": d.nama };
    //     }
    //   });
    //   this.entryForm.get('lokasi_id').patchValue(selectedLokasi);

    //   let rayon_id;
    //   this.dataSelectRayon.forEach( d=> {
    //     if (d.parent_id == this.EstSpk.lokasi_id) {
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
    //     let dtl: EstSpkDetail[];
    //     dtl = this.EstSpk.detail;
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
    //     if (this.EstSpk.supplier_id == d.id) {
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
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    frmData['tgl_mulai'] = formatDate(this.entryForm.get('tgl_mulai').value, "yyyy-MM-dd", 'en_US');
    frmData['tgl_akhir'] = formatDate(this.entryForm.get('tgl_akhir').value, "yyyy-MM-dd", 'en_US');

    // console.log(frmData);
    this.EstSpkService.update(this.EstSpk.id, frmData).subscribe(data => {
      if( data['status']=='OK'){
        // console.log('ok');
        swal({
          title: 'Info!',
          // text: 'Data berhasil diSimpan dengan Nomor:'+data['data'],
          text: 'Data berhasil di simpan',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })

        this.event.emit('OK');
        // this.bsModalRef.hide();
      }else{
        swal({
          title: 'Perhatian!',
          text: 'Proses Simpan Gagal' ,
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

  // get details_kegiatan(): FormArray {
  //   return this.entryForm.get('details_kegiatan') as FormArray;
  // };


  addDetail(x) {

    let selectedBlok = [];
    // this.dataSelectBlok.forEach(a => {
    //   if (blok_id == a.id) {
    //     selectedBlok = a;
    //   }
    // });

    let selectedKegiatan = [];
    // // console.log(this.dataSelectKegiatan);
    // this.dataSelectKegiatan.forEach(a => {
    //   if (kegiatan_id == a.id) {
    //     selectedKegiatan = a;
    //   }
    // });

    let fb = this.builder.group({
      blok: new FormControl(x.blok),
      blok_id: new FormControl(x.blok_id),
      kegiatan: new FormControl(x.kegiatan),
      kegiatan_id: new FormControl(x.kegiatan_id),
      satuan: new FormControl(x.satuan),
      hk: new FormControl(x.hk),
      volume: new FormControl(x.volume),
      total: new FormControl(x.total),
      harga: new FormControl(x.harga),
      bapp: this.builder.array([]),
    });

    let bapp = fb.get('bapp') as FormArray;
    x.bapp.forEach(xx => {
      // let selectedDenda;
      // this.dataSelectKodeDenda.forEach(a => {
      //   if (denda['kode_denda_panen_id'] == a.id) {
      //     selectedDenda = a;
      //   }
      // });
      bapp.push(this.builder.group({
          blok_id: new FormControl([], Validators.required),
          kegiatan_id: new FormControl([], Validators.required),
          real_hk: new FormControl(xx.real_hk, Validators.required),
          real_volume: new FormControl(xx.real_volume, Validators.required),
          real_harga: new FormControl(xx.real_harga, Validators.required),
      }));
    });

    this.details.push(fb);

    // let fb = this.builder.group({
    //   blok_id: new FormControl([], Validators.required),
    //   kegiatan_id: new FormControl([], Validators.required),
    //   satuan: new FormControl(''),
    //   hk: new FormControl(0, Validators.required),
    //   volume: new FormControl(0, Validators.required),
    //   total: new FormControl(0, Validators.required),
    //   harga: new FormControl(0, Validators.required),
    // });
    // let form = this.details.controls[i].get('bapp') as FormArray;
    // form.push(fb);

    // this.details.controls[i].push(fb);

    // this.valueChange();
  }



  showLookup() {
    // let lokasi_pp_id;
    // lokasi_pp_id= this.entryForm.get('lokasi_pp_id').value['id'];

    // this.PrcPpService.getAllDetailLokasiByStatus(lokasi_pp_id).subscribe(t => {
      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        class: "modal-lg ",
        initialState: {
          // PrcPp: t['data'],
          // intruksi_id: this.entryForm.get("intruksi_id").value['id'],
        }
      };
      // this.bsModalRef = this.bsModalService.show(LookupComponent, modalConfig);
      // this.bsModalRef.content.event.subscribe(data => {
      //   if (data == null) {
      //   } else {
      //     // this.showNotification('top', 'right', "No PP " + data['qty'] + " ", 2);
      //     data.forEach(d=>{
      //       // this.addBlok( d['id'], d['item_id'], d['qty_belum_po'],d['no_pp'] );
      //     })
      //   }
      // });
    // });
  }



  // addKegiatan(blok_id, Kegiatan_id, km_hm_mulai, km_hm_akhir, km_hm_jumlah, volume) {
  //   let selectedKegiatan = [];
  //   this.dataSelectKegiatan.forEach(a => {
  //     if (Kegiatan_id == a.id) {
  //       selectedKegiatan = a;
  //     }
  //   });
  //   let selectedBlok = [];
  //   this.dataSelectBlok.forEach(a => {
  //     if (blok_id == a.id) {
  //       selectedBlok = a;
  //     }
  //   });
  //   let fb = this.builder.group({
  //     blok_id: new FormControl(selectedBlok, Validators.required),
  //     kegiatan_id: new FormControl(selectedKegiatan, Validators.required),
  //     km_hm_mulai: new FormControl(km_hm_mulai, Validators.required),
  //     km_hm_akhir: new FormControl(km_hm_akhir, Validators.required),
  //     km_hm_jumlah: new FormControl(km_hm_jumlah, Validators.required),
  //     volume: new FormControl(volume, Validators.required),
  //   });
  //   this.details_kegiatan.push(fb);
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
    // this.valueChange();
  }




  updateForm(data) {
    // const Kegiatans = data.details;
    // // console.log(Kegiatans);
    // let sub = 0;
    // for(let i of Kegiatans){
    //   sub=sub+ parseFloat( i.qty);

    // }
    // // console.log(sub);
  }
  recalculate() {
    // let Kegiatans = this.entryForm.get('details') as FormArray;
    // let data = { details: Kegiatans.value };
    // this.updateForm(data);
  }
  onClose() {
    // this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadData();
    this.loadSelect2();

    // this.valueChange();
  }
  valueChange(event, blok) {
    // console.log(event);
    // console.log(blok);
    // this.hitungPremi(blok);
  }



  numberFormat()
  {
    let estimasi = this.entryForm.get('estimasi').value;
    if (isString(estimasi)) {
      estimasi = parseFloat(estimasi.replace(/[^\d\.\-]/g, ""));
    }
    this.entryForm.get('estimasi').patchValue(formatNumber(estimasi, 'en_US', '1.2-2'));
  }
  numberFormatDetail(form)
  {
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
  }

  addBapp(spk_detail) {
    let that = this;
    let EstSpkDetail;
    // this.EstSpkService.getById(id).subscribe(data => {
      EstSpkDetail =spk_detail;

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        class: "modal-lg ",
        initialState: {
          EstSpkDetail: EstSpkDetail
        }
      };
      this.bsModalRef = this.bsModalService.show(AddComponent, modalConfig);
      this.bsModalRef.content.event.subscribe(data => {
        this.loadData()
        // let t = $('#datatables').DataTable().ajax.reload();
        // t.draw();
       // that.rerender();
      });


    // }, error => {

    // });

  }
  delete(id: number) {
    let that = this;
    swal({
      title: 'Yakin akan menghapus?',
      text: "Data akan dihapus dari database!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Ya, hapus data!',
      cancelButtonText: 'Batal',

      buttonsStyling: false
    }).then(function () {
      that.estSpkBappService.delete(id).subscribe(data => {
         swal({
        title: 'Deleted!',
        text: 'Data berhasil dihapus.',
        type: 'success',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
        })
        that.loadData();

      });


    });

  }

  edit(id: number,spk) {
    let that = this;
    let EstSpkBapp;
    this.estSpkBappService.getById(id).subscribe(data => {
      EstSpkBapp = data['data'];
      EstSpkBapp['blok']=spk['blok']
      EstSpkBapp['kegiatan']=spk['kegiatan']
      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        class: "modal-lg ",
        initialState: {
          EstSpkBapp: EstSpkBapp
        }
      };
      this.bsModalRef = this.bsModalService.show(EditComponent, modalConfig);
      this.bsModalRef.content.event.subscribe(data => {

        // let t = $('#datatables').DataTable().ajax.reload();
        // t.draw();
        that.loadData();
      });


    }, error => {

    });

  }
  posting(id: number) {
    let that = this;
    let data;
    swal({
      title: 'Yakin akan diposting?',
      text: "Data tidak bisa akan dapat diubah !",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Ya, posting data!',
      cancelButtonText: 'Batal',

      buttonsStyling: false
    }).then(function () {
      that.estSpkBappService.posting(id, data).subscribe(data => {
        that.loadData();
        swal({
          title: 'Info!',
          text: 'Posting berhasil.',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
      });

    });

  }
}
