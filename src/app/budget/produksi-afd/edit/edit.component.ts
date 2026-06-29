import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { BgtProduksi } from 'src/app/shared/models/bgt_produksi.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import {BgtProduksiService } from 'src/app/shared/services/bgt_produksi.service';
import { AccKegiatanService } from 'src/app/shared/services/acc_kegiatan.service';
declare var $: any;
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'edit-cmp',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.css'],
})

export class EditComponent implements OnInit, AfterViewInit {
  isFormSubmitted = false;
  isChangePhoto = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();
  public dataSelectLokasi: any[] = [];
  public dataSelectAfdeling: any[] = [];
  public dataSelectKegiatan: any[] = [];

  bgtProduksi: BgtProduksi;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private bgtProduksiService: BgtProduksiService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private accKegiatanService: AccKegiatanService


  ) {

    let toDate: Date = new Date();
    this.entryForm = this.builder.group({

      // kegiatan_id: new FormControl([], Validators.required),
      lokasi_id: new FormControl([], Validators.required),
      afdeling_id: new FormControl([], Validators.required),
      tahun: new FormControl(0,),
      b01: new FormControl(0, ),
      b02: new FormControl(0,),
      b03: new FormControl(0, ),
      b04: new FormControl(0, ),
      b05: new FormControl(0,),
      b06: new FormControl(0, ),
      b07: new FormControl(0, ),
      b08: new FormControl(0, ),
      b09: new FormControl(0,),
      b10: new FormControl(0, ),
      b11: new FormControl(0, ),
      b12: new FormControl(0, ),



    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    console.log(this.bgtProduksi);

    this.entryForm.controls['tahun'].patchValue(this.bgtProduksi.tahun);
    this.entryForm.controls['b01'].patchValue(this.bgtProduksi.b01);
    this.entryForm.controls['b02'].patchValue(this.bgtProduksi.b02);
    this.entryForm.controls['b03'].patchValue(this.bgtProduksi.b03);
    this.entryForm.controls['b04'].patchValue(this.bgtProduksi.b04);
    this.entryForm.controls['b05'].patchValue(this.bgtProduksi.b05);
    this.entryForm.controls['b06'].patchValue(this.bgtProduksi.b06);
    this.entryForm.controls['b07'].patchValue(this.bgtProduksi.b07);
    this.entryForm.controls['b08'].patchValue(this.bgtProduksi.b08);
    this.entryForm.controls['b09'].patchValue(this.bgtProduksi.b09);
    this.entryForm.controls['b10'].patchValue(this.bgtProduksi.b10);
    this.entryForm.controls['b11'].patchValue(this.bgtProduksi.b11);
    this.entryForm.controls['b12'].patchValue(this.bgtProduksi.b12);

  }
  private loadSelect2(): void {



    let selectLokasi;
    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      // console.log(x);
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
      this.dataSelectLokasi.forEach(a => {
        if (a.id == this.bgtProduksi.lokasi_id) {
          selectLokasi = a;
        }
      });
      this.entryForm.controls['lokasi_id'].patchValue(selectLokasi);
    });

    let selectAfdeling;
    this.GbmOrganisasiService.getAllByType('AFDELING').subscribe(x => {
      // console.log(x);
      this.dataSelectAfdeling = [];
      x.forEach(d => {
        this.dataSelectAfdeling.push({ "id": d.id, "text": d.nama });
      });
      this.dataSelectAfdeling.forEach(a => {
        if (a.id == this.bgtProduksi.afdeling_id) {
          selectAfdeling = a;
        }
      });
      this.entryForm.controls['afdeling_id'].patchValue(selectAfdeling);

    });

    

  }

  onSubmit() {
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    // let frmData=new FormData();
    // if (this.entryForm.invalid) {
    //   return;
    // }
    let dataSubmit = this.entryForm.value;
    console.log(this.entryForm.value);
    // console.log(dataSubmit);
    this.bgtProduksiService.update(this.bgtProduksi.id, dataSubmit).subscribe(data => {

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
  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.entryForm.patchValue({
      img: file
    });
    this.entryForm.get('img').updateValueAndValidity();
    this.isChangePhoto = true;
    console.log(this.isChangePhoto);
  }
}
