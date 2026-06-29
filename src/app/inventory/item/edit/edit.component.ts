import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";
import { Akun } from 'src/app/shared/models/akun.model';
import { formatDate } from '@angular/common';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { InvKategoriService } from 'src/app/shared/services/inv_kategori.service';
import { GbmUomService } from 'src/app/shared/services/gbm_uom.service';
import { InvItem } from 'src/app/shared/models/inv_item.model';
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'edit-cmp',
  styleUrls: ['edit.component.css'],
  templateUrl: 'edit.component.html'
})

export class EditComponent implements OnInit, AfterViewInit {
  isFormSubmitted = false;
  isChangePhoto = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  entryForm: FormGroup;
  dataSelectKategori;
  dataSelectSatuan;
  event: EventEmitter<any> = new EventEmitter();
  item: InvItem;
  dbName;
  pathName;
  PATH_URL;
  dataSelectJenisItem: { id: string; text: string; }[];
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private invItemService: InvItemService,
    private invKategoriService: InvKategoriService,
    private gbmUomService: GbmUomService,
    private authenticationService: AuthenticationService,

  ) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;
    this.entryForm = this.builder.group({
      kode: new FormControl(null, Validators.required),
      nama: new FormControl(null, Validators.required),
      kategori_id: new FormControl([], Validators.required),
      uom_id: new FormControl([], Validators.required),
      min_stok: new FormControl(0, Validators.required),
      jenis_item: new FormControl([], Validators.required),
      aktif: new FormControl(1, Validators.required),


    });




  }
  get userControl() { return this.entryForm.controls; }
  private loadSelect2(): void {
    this.dataSelectJenisItem = [
      { id: 'BARANG STOK', text: 'BARANG STOK' },
      { id: 'ASSET', text: 'ASSET' },
      { id: 'JASA', text: 'JASA' }
    ];
    let selectedJenis;
    this.dataSelectJenisItem.forEach(d => {
      if (d.id == this.item.jenis_item) {
        selectedJenis = { "id": d.id, "text": d.text };
      }

    });
    this.entryForm.controls['jenis_item'].patchValue(selectedJenis);
    let selectedSatuan;
    this.gbmUomService.getAll().subscribe(x => {
      this.dataSelectSatuan = [];
      let data = x['data'];

      data.forEach(d => {
        this.dataSelectSatuan.push({ "id": d.id, "text": d.nama });
        if (d.id == this.item.uom_id) {
          selectedSatuan = { "id": d.id, "text": d.nama };
        }
      });
      this.entryForm.controls['uom_id'].patchValue(selectedSatuan);

    });

    let selectedKategori;
    this.invKategoriService.getAll().subscribe(x => {
      this.dataSelectKategori = [];
      let data = x['data'];

      data.forEach(d => {
        this.dataSelectKategori.push({ "id": d.id, "text": d.nama });
        if (d.id == this.item.inv_kategori_id) {
          selectedKategori = { "id": d.id, "text": d.nama };
        }
      });
      this.entryForm.controls['kategori_id'].patchValue(selectedKategori);

    });

  }
  ngAfterViewInit(): void {

    this.entryForm.controls['kode'].patchValue(this.item.kode);
    this.entryForm.controls['nama'].patchValue(this.item.nama);
    this.entryForm.controls['aktif'].patchValue(this.item.aktif == true ? 1 : 0);
    //  this.entryForm.controls['harga_beli'].patchValue(this.item.harga_beli);



  }


  onSubmit() {
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }
    let dataSubmit: InvItem = {
      'kode': this.entryForm.get('kode').value,
      'nama': this.entryForm.get('nama').value,
      'uom_id': this.entryForm.get('uom_id').value['id'],
      'min_stok': this.entryForm.get('min_stok').value,
      // 'harga_beli': this.entryForm.get('harga_beli').value,
      'inv_kategori_id': this.entryForm.get('kategori_id').value['id'],
      'jenis_item': this.entryForm.get('jenis_item').value['id'],
      'aktif': this.entryForm.get('aktif').value

    };
    console.log(dataSubmit);

    this.invItemService.update(this.item.id, dataSubmit).subscribe(data => {
      console.log(data);
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
          text: 'Proses Simpan Gagal: '+ data['data'],
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
