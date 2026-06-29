import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { InvPenerimaanPoService } from 'src/app/shared/services/inv_penerimaan_po.service';
import { PrcPoService } from 'src/app/shared/services/prc_po.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { AccKegiatanKelompokService } from 'src/app/shared/services/acc_kegiatan_kelompok.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmUomService } from 'src/app/shared/services/gbm_uom.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { TradingPenerimaanPoService } from 'src/app/shared/services/trading_penerimaan_po.service';

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


  dataSelectLokasi;
  dataSelectLokasiAfd;
  dataSelectGudang;
  dataSelectSupplier;
  dataSelectBlok;
  dataSelectMesin;
  dataSelectKegiatan;
  dataSelectKaryawan;
  dataSelectUom;
  dataSelectItem;
  dataSelectTipe;
  dataSelectTraksi;
  dataSelectPo;

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private invPermintaanPoService: TradingPenerimaanPoService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private PrcPoService: PrcPoService,
    private accKegiatanKelompokService: AccKegiatanKelompokService,
    private karyawanService: KaryawanService,
    private gbmUomService: GbmUomService,
    private invItemService: InvItemService,
    private GbmSupplierService: GbmSupplierService,

    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();
    this.entryForm = this.builder.group({

      no_transaksi: new FormControl('(AutoNumber)'),

      tanggal: new FormControl(toDate, Validators.required),
      catatan: new FormControl(''),
      no_surat_jalan_supplier: new FormControl('', Validators.required),
      lokasi_id: new FormControl([], Validators.required),
      po_id: new FormControl([], Validators.required),
      gudang_id: new FormControl([], Validators.required),
      supplier_id: new FormControl([], Validators.required),


      details: this.builder.array([])

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }
  public options: any;

  private loadSelect2(): void {
    this.entryForm.controls['po_id'].valueChanges.subscribe(x => {
      this.tampilItemPo();
    });
    this.dataSelectTipe = [
      { id: '1', text: 'LANGSUNG' },
      { id: '2', text: 'TIDK LANGSUNG' },

    ];

    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });

      this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {

        let gd_id = x.id;
        console.log(x)
        this.GbmOrganisasiService.getGudangByUnit(gd_id).subscribe(x => {
          console.log(x)
          this.dataSelectGudang = [];
          x.forEach(d => {
            this.dataSelectGudang.push({ "id": d.id, "text": d.nama });
          });
          this.entryForm.controls['gudang_id'].valueChanges.subscribe(x => {

          });
        });

      });
    });
    this.GbmSupplierService.getAll().subscribe(x => {
      this.dataSelectSupplier = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectSupplier.push({ "id": d.id, "text": d.nama_supplier });
      });

      this.entryForm.controls['supplier_id'].valueChanges.subscribe(x => {
        let supplier_id = x.id;
        this.PrcPoService.getAllPOReleaseBySupplierBlmClose(supplier_id).subscribe(x => {
          this.dataSelectPo = [];
          x['data'].forEach(d => {
            if (supplier_id == d.supplier_id) {
              this.dataSelectPo.push({ "id": d.id, "text": d.no_po + " - (" + d.tanggal + ")" });
            }
          });
        });
      });
    });

    this.invItemService.getAll().subscribe(x => {
      this.dataSelectItem = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectItem.push({ "id": d.id, "text": d.kode + ' - ' + d.nama + "(" + d.uom + ")" });
      });
    });

    this.gbmUomService.getAll().subscribe(x => {
      this.dataSelectUom = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectUom.push({ "id": d.id, "text": d.nama });
      });
    });



    // this.GbmOrganisasiService.getAllByType('BLOK_MESIN').subscribe(x=>{
    //   this.dataSelectBlok=[];
    //   x.forEach(d => {
    //     this.dataSelectBlok.push({"id":d.id,"text":d.nama});
    //   });
    // });

  }
  onSubmit() {

    this.isFormSubmitted = true;

    if (this.entryForm.invalid) {

      swal({
        title: 'Perhatian',
        text: 'Data belum lengkap. Silakan periksa kembali.',
        type: 'warning',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      });

      return;
    }

    const invalidKet = this.details.controls.some(ctrl => {
      return !this.validateKeteranganFormat(ctrl.get('ket').value);
    });

    if (invalidKet) {

      swal({
        title: 'Format Keterangan',
        text: 'Gunakan format: Kegunaan - Part Number - Merek',
        type: 'warning',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      });

      return;
    }

    const melebihiList = this.getQtyMelebihiList();

    if (melebihiList.length > 0) {

      let html = "<div style='text-align:left'>";

      html += "<p>Beberapa item yang diinput melebihi sisa qty pada PO.</p>";
      html += "<br>";

      melebihiList.forEach(x => {

        html +=
          "<div style='margin-bottom:10px'>" +
          "<b>" + x.item + "</b><br>" +
          "Qty diterima : <b>" + x.qty_input + "</b><br>" +
          "Sisa PO : " + x.qty_po +
          "</div>";

      });

      html += "<br>Apakah Anda ingin melanjutkan penyimpanan data penerimaan ini?";
      html += "</div>";

      const that = this;

      swal({
        title: "Konfirmasi Qty Penerimaan",
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


  tampilItemPo() {
    let po_id = this.entryForm.get('po_id').value['id']
    this.PrcPoService.getAllDetailBlmTerima(po_id).subscribe(res => {
      let dtl = res['data'];
      this.details.clear();

      for (let index = 0; index < dtl.length; index++) {
        const d = dtl[index];
        this.addBlokPo(
          d['item_id'],
          d['qty_belum_terima'],
          '',
          d['id'],
          d['harga'],
          d['diskon']
        );
      }

      // 🔥 langsung hitung
      this.recalculateHpp();

    })
  }

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
      // qty sisa dari PO
      qty_belum_terima: new FormControl(qty),

      hpp_sebelum: new FormControl({ value: 0, disabled: true }),
      hpp_setelah: new FormControl({ value: 0, disabled: true }),
    });

    // 🔥 pasang listener di sini
    group.get('qty').valueChanges.subscribe(() => this.recalculateHpp());
    group.get('harga').valueChanges.subscribe(() => this.recalculateHpp());
    group.get('diskon').valueChanges.subscribe(() => this.recalculateHpp());

    this.details.push(group);
  }

  listenDetailChange() {

    this.details.controls.forEach((group: FormGroup) => {

      group.get('qty').valueChanges.subscribe(() => {
        this.recalculateHpp();
      });

      group.get('harga').valueChanges.subscribe(() => {
        this.recalculateHpp();
      });

      group.get('diskon').valueChanges.subscribe(() => {
        this.recalculateHpp();
      });

    });

  }

  recalculateHpp() {

    const gudang = this.entryForm.get('gudang_id').value;

    if (!gudang || !this.details.length) {
      return;
    }

    const payload = {
      gudang_id: gudang,
      details: this.details.getRawValue()
    };

    this.invPermintaanPoService.previewHpp(payload)
      .subscribe(res => {

        if (res.status === 'OK') {

          res.data.forEach((r, index) => {

            if (this.details.at(index)) {

              this.details.at(index).patchValue({
                hpp_sebelum: Math.round(r.hpp_lama * 100) / 100,
                hpp_setelah: Math.round(r.hpp_baru * 100) / 100
              }, { emitEvent: false });

            }

          });

        }

      });
  }

  removeBlokPo(blok) {
    let i = this.details.controls.indexOf(blok);
    if (i != -1) {
      let detail = this.entryForm.get('details') as FormArray;
      detail.removeAt(i);
      let data = { details: detail.value };
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

  }

  validateKeteranganFormat(value: string): boolean {
    if (!value) {
      return false;
    }

    const parts = value.split('-').map(v => v.trim());

    // wajib: kegunaan - part number - merek
    if (parts.length < 3) {
      return false;
    }

    // tiap bagian tidak boleh kosong
    return parts.every(p => p.length > 0);
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

    this.invPermintaanPoService.create(frmData).subscribe(data => {

      if (data['status'] === 'OK') {

        swal({
          title: 'Info!',
          text: 'Data berhasil disimpan dengan Nomor:' + data['data'],
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

}
