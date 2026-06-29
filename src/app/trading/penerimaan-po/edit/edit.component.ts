import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { InvPenerimaanPoService } from 'src/app/shared/services/inv_penerimaan_po.service';
import { PrcPoService } from 'src/app/shared/services/prc_po.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvPenerimaanPo } from 'src/app/shared/models/inv_penerimaan_po.model';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { GbmUomService } from 'src/app/shared/services/gbm_uom.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { AccKegiatanKelompokService } from 'src/app/shared/services/acc_kegiatan_kelompok.service';
import { TradingPenerimaanPoService } from 'src/app/shared/services/trading_penerimaan_po.service';

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

  invPenerimaanPo: InvPenerimaanPo;
  dataSelectLokasi;
  dataSelectLokasiAfd;
  dataSelectGudang;
  dataSelectSupplier;
  dataSelectKaryawan;
  dataSelectBlok;
  dataSelectKegiatan;
  dataSelectUom;
  dataSelectItem;
  dataSelectTipe;
  dataSelectTraksi;
  dataSelectPo;

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private invPenerimaanPoService: TradingPenerimaanPoService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private invItemService: InvItemService,
    private gbmUomService: GbmUomService,
    private accKegiatanKelompokService: AccKegiatanKelompokService,
    private karyawanService: KaryawanService,
    private PrcPoService: PrcPoService,
    private GbmSupplierService: GbmSupplierService,

    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();
    let time: Date = new Date();

    this.entryForm = this.builder.group({
      tanggal: new FormControl(toDate, Validators.required),
      catatan: new FormControl(''),
      no_transaksi: new FormControl('', Validators.required),
      no_surat_jalan_supplier: new FormControl('', Validators.required),
      lokasi_id: new FormControl([], Validators.required),
      gudang_id: new FormControl([], Validators.required),
      supplier_id: new FormControl([], Validators.required),
      po_id: new FormControl([], Validators.required),


      details: this.builder.array([])


    });
  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.invPenerimaanPo.tanggal)));
    this.entryForm.get('catatan').patchValue(this.invPenerimaanPo.catatan);
    this.entryForm.get('no_transaksi').patchValue(this.invPenerimaanPo.no_transaksi);
    this.entryForm.get('no_surat_jalan_supplier').patchValue(this.invPenerimaanPo.no_surat_jalan_supplier);
    // this.entryForm.get('no_transaksi').patchValue(this.invPenerimaanPo.no_transaksi);


  }
  public options: any;

  private loadSelect2(): void {

    let selectLokasi;
    this.gbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
        if (this.invPenerimaanPo.lokasi_id == d.id) {
          selectLokasi = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectLokasi);
    });

    let selectGudang;
    this.gbmOrganisasiService.getAllByType('GUDANG').subscribe(x => {
      this.dataSelectGudang = [];
      x.forEach(d => {
        this.dataSelectGudang.push({ "id": d.id, "text": d.nama });
        if (this.invPenerimaanPo.gudang_id == d.id) {
          selectGudang = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('gudang_id').patchValue(selectGudang);
    });

    let selectPo;
    this.PrcPoService.getAll().subscribe(x => {
      this.dataSelectPo = [];
      x['data'].forEach(d => {
        this.dataSelectPo.push({ "id": d.id, "text": d.no_po+" - "+d.nama_supplier });
        if (this.invPenerimaanPo.po_id == d.id) {
          selectPo = { "id": d.id, "text": d.no_po+" - "+d.nama_supplier }
        }
      });
      this.entryForm.get('po_id').patchValue(selectPo);
    });

    let selectSupplier;
    this.GbmSupplierService.getAll().subscribe(x => {
      this.dataSelectSupplier = [];
      x['data'].forEach(d => {
        this.dataSelectSupplier.push({ "id": d.id, "text": d.nama_supplier });
        if (this.invPenerimaanPo.supplier_id == d.id) {
          selectSupplier = { "id": d.id, "text": d.nama_supplier }
        }
      });
      this.entryForm.get('supplier_id').patchValue(selectSupplier);
    });

    this.invItemService.getAll().subscribe(x => {
      this.dataSelectItem = [];
      x['data'].forEach(d => {
        this.dataSelectItem.push({ "id": d.id, "text": d.kode + ' - ' + d.nama + "(" + d.uom + ")" });
      });
      this.invPenerimaanPoService.getTraksi().subscribe(x => {
        this.dataSelectTraksi = [];
        x['data'].forEach(d => {
          this.dataSelectTraksi.push({ "id": d.id, "text": d.nama });
        });
        let dtl = [];
        dtl = this.invPenerimaanPo.detail;
        for (let index = 0; index < dtl.length; index++) {
          const d = dtl[index];
          this.addBlokPo(d['item_id'], d['qty'], d['ket'],d['po_dt_id'],d['harga'],d['diskon']);
        }
      });
    });

  }
 onSubmit() {

  this.isFormSubmitted = true;

  if (this.entryForm.invalid) {
    return;
  }

  const melebihiList = this.getQtyMelebihiList();

  if (melebihiList.length > 0) {

    let html = "<div style='text-align:left'>";
    html += "<p>Beberapa item melebihi qty pada PO.</p><br>";

    melebihiList.forEach(x => {

      html +=
        "<div style='margin-bottom:10px'>" +
        "<b>" + x.item + "</b><br>" +
        "Qty diterima : <b>" + x.qty_input + "</b><br>" +
        "Sisa PO : " + x.qty_po +
        "</div>";

    });

    html += "<br>Lanjutkan penyimpanan data?";
    html += "</div>";

    const that = this;

    swal({
      title: "Konfirmasi Qty",
      html: html,
      type: "info",
      showCancelButton: true,
      confirmButtonText: "Lanjut Simpan",
      cancelButtonText: "Periksa Kembali",
      confirmButtonClass: "btn btn-success",
      cancelButtonClass: "btn btn-default",
      buttonsStyling: false
    }).then(function () {

      that.simpanData();

    });

    return;
  }

  this.simpanData();
}

  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };

  addBlokPo(item_id, qty, ket, po_dt_id, harga, diskon) {

  let selectedItem;

  this.dataSelectItem.forEach(a => {
    if (item_id == a.id) {
      selectedItem = a;
    }
  });

  const group = this.builder.group({
    item_id: new FormControl(selectedItem, Validators.required),
    qty: new FormControl(qty, Validators.required),
    harga: new FormControl(harga, Validators.required),
    diskon: new FormControl(diskon, Validators.required),
    ket: new FormControl(ket),
    po_dt_id: new FormControl(po_dt_id),

    qty_belum_terima: new FormControl(qty),

    hpp_sebelum: new FormControl({ value: 0, disabled: true }),
    hpp_setelah: new FormControl({ value: 0, disabled: true }),
  });

  this.details.push(group);
}


getQtyMelebihiList() {

  const list = [];

  this.details.controls.forEach((group: FormGroup) => {

    const itemObj = group.get('item_id').value;

    let itemName = '';

    if (itemObj && itemObj.text) {
      itemName = itemObj.text;
    }

    const qty = Number(group.get('qty').value);
    const max = Number(group.get('qty_belum_terima').value);

    if (qty > max) {

      list.push({
        item: itemName,
        qty_input: qty,
        qty_po: max
      });

    }

  });

  return list;
}

simpanData() {

  let frmData = this.entryForm.getRawValue();

  frmData['tanggal'] = formatDate(
    this.entryForm.get('tanggal').value,
    "yyyy-MM-dd",
    'en_US'
  );

  this.invPenerimaanPoService.update(this.invPenerimaanPo.id, frmData)
    .subscribe(data => {

      if (data['status'] == 'OK') {

        swal({
          title: 'Info!',
          text: 'Edit berhasil',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        });

        this.event.emit('OK');

        this.bsModalRef.hide();

      } else {

        swal({
          title: 'Perhatian!',
          text: 'Proses Simpan Gagal',
          type: 'warning',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        });

      }

    });
}

  removeBlokPo( blok ) {
    let i = this.details.controls.indexOf(blok);
    if(i != -1) {
      let detail = this.entryForm.get('details') as FormArray;
      detail.removeAt(i);
      let data = {details: detail.value};
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
