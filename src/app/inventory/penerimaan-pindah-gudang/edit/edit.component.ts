import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { InvPenerimaanPindahGudangService } from 'src/app/shared/services/inv_penerimaan_pindah_gudang.service';
import { InvPindahGudangService } from 'src/app/shared/services/inv_pindah_gudang.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { AccKegiatanKelompokService } from 'src/app/shared/services/acc_kegiatan_kelompok.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmUomService } from 'src/app/shared/services/gbm_uom.service';
import { InvPenerimaanPindahGudang } from 'src/app/shared/models/inv_penerimaan_pindah_gudang.model';

declare var $: any;
declare var swal: any;
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

  entryForm: FormGroup;

  event: EventEmitter<any> = new EventEmitter();

  invPenerimaanPindahGudang: InvPenerimaanPindahGudang;
  dataSelectLokasi;
  dataSelectLokasiAfd;
  dataSelectGudang;
  dataSelectKaryawan;
  dataSelectBlok;
  dataSelectKegiatan;
  dataSelectUom;
  dataSelectItem;
  dataSelectTipe;
  dataSelectTraksi;
  dataSelectPermintaan;
  dataSelectDariGudang: any[];
  dataSelectKeGudang: any[];
  dataSelectPindahGudang: any[];
  tipe: any;

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private invPenerimaanPindahGudangService: InvPenerimaanPindahGudangService,
    private invPindahGudangService: InvPindahGudangService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private invItemService: InvItemService,
    private gbmUomService: GbmUomService,
    private accKegiatanKelompokService: AccKegiatanKelompokService,
    private karyawanService: KaryawanService,

    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();
    let time: Date = new Date();

    this.entryForm = this.builder.group({
      tanggal: new FormControl(toDate, Validators.required),
      catatan: new FormControl(''),
      no_transaksi: new FormControl(''),
      lokasi_id: new FormControl([], Validators.required),
      dari_gudang_id: new FormControl([], Validators.required),
      gudang_id: new FormControl([], Validators.required),
      inv_pindah_gudang_id: new FormControl([], Validators.required),
      details: this.builder.array([])


    });
  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.invPenerimaanPindahGudang.tanggal)));
    this.entryForm.get('catatan').patchValue(this.invPenerimaanPindahGudang.catatan);
    this.entryForm.get('no_transaksi').patchValue(this.invPenerimaanPindahGudang.no_transaksi);
    this.tipe = this.invPenerimaanPindahGudang.tipe;

  }
  public options: any;

  private loadSelect2(): void {



    let selectLokasi;
    this.gbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
        if (this.invPenerimaanPindahGudang.lokasi_id == d.id) {
          selectLokasi = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectLokasi);
    });


    let selectDariGudang;
    this.gbmOrganisasiService.getAllGudangCentralAndVirtual().subscribe(x => {
      this.dataSelectDariGudang = [];
      x.forEach(d => {
        this.dataSelectDariGudang.push({ "id": d.id, "text": d.nama });
        if (this.invPenerimaanPindahGudang.dari_gudang_id == d.id) {
          selectDariGudang = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('dari_gudang_id').patchValue(selectDariGudang);
    });
    let selectKeGudang;
    this.gbmOrganisasiService.getAllGudangCentralAndVirtual().subscribe(x => {
      this.dataSelectKeGudang = [];
      x.forEach(d => {
        this.dataSelectKeGudang.push({ "id": d.id, "text": d.nama });
        if (this.invPenerimaanPindahGudang.gudang_id == d.id) {
          selectKeGudang = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('gudang_id').patchValue(selectKeGudang);
    });

    let selectPindahGudang;
    this.invPindahGudangService.getAll().subscribe(x => {
      this.dataSelectPindahGudang = [];
      x['data'].forEach(d => {
        this.dataSelectPindahGudang.push({ "id": d.id, "text": d.no_transaksi });
        if (this.invPenerimaanPindahGudang.inv_pindah_gudang_id == d.id) {
          selectPindahGudang = { "id": d.id, "text": d.no_transaksi + "(" + d.tanggal + ")" }
        }
      });
      this.entryForm.get('inv_pindah_gudang_id').patchValue(selectPindahGudang);
    });



    this.invItemService.getAll().subscribe(x => {
      this.dataSelectItem = [];
      x['data'].forEach(d => {
        this.dataSelectItem.push({ "id": d.id, "text": d.kode + ' - ' + d.nama + "(" + d.uom + ")" });
      });


      let dtl = [];
      dtl = this.invPenerimaanPindahGudang.detail;
      for (let index = 0; index < dtl.length; index++) {
        const d = dtl[index];
        this.addBlok(d['item_id'], d['qty'], d['ket']);
      }
    });



  }
  onSubmit() {


    this.isFormSubmitted = true;

    if (this.entryForm.invalid) {
      return;
    }

    let frmData = this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    frmData['tipe'] = this.tipe;

    // // console.log(frmData);
    this.invPenerimaanPindahGudangService.update(this.invPenerimaanPindahGudang.id, frmData).subscribe(data => {
      // console.log(data);
      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Edit berhasil',
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

  addBlokNew() {
    this.details.push(this.builder.group({
      item_id: new FormControl([], Validators.required),
      // uom_id: new FormControl([], Validators.required),
      qty: new FormControl('', Validators.required),
      traksi_id: new FormControl([], Validators.required),
      blok_id: new FormControl([], Validators.required),
      kegiatan_id: new FormControl([], Validators.required),
      ket: new FormControl('', Validators.required),
    }));
  }


  addBlok(item_id, qty, ket) {

    this.dataSelectBlok;
    this.dataSelectKegiatan;
    this.dataSelectUom;
    this.dataSelectItem;

    let selectedItem;
    this.dataSelectItem.forEach(a => {
      if (item_id == a.id) {
        selectedItem = a;
      }
    });


    let fb = this.builder.group({

      item_id: new FormControl(selectedItem),
      qty: new FormControl(qty),
      ket: new FormControl(ket),

    });

    this.details.push(fb);
  }




  removeBlokItem(item) {
    let i = this.details.controls.indexOf(item);
    if (i != -1) {
      // let x=	this.details.controls.splice(i, 1);
      let items = this.entryForm.get('details') as FormArray;
      items.removeAt(i);
      let data = { details: items.value };
      this.updateForm(data);
    }
  }




  updateForm(data) {

  }
  recalculate() {
  }
  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();


  }
  valueChange($event) {
    // console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
}
