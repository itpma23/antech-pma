import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";

import { InvAdj } from 'src/app/shared/models/inv_adj.model';
import { PksTankiService } from 'src/app/shared/services/pks_tanki.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { InvAdjService } from 'src/app/shared/services/inv_adj.service';
import { formatDate, formatNumber } from '@angular/common';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { isNullOrUndefined, isNumber, isString } from 'util';

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
  categories: any[] = [];
  event: EventEmitter<any> = new EventEmitter();
  InvAdj: InvAdj;
  dbName;
  pathName;
  PATH_URL;

  dataSelectTanki;
  dataSelectSimbol;
  itemMap: any = {};
  isRenderingDetails = false;


  dataSelectLokasi;
  dataSelectGudang;
  detailChunkSize = 30;
detailRenderedCount = 0;
detailSource = [];

  dataSelectSupplier;
  dataSelectKode;
  dataSelectKaryawan;
  dataSelectItem;

  dataItem;
  uom;

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private InvAdjService: InvAdjService,
    private authenticationService: AuthenticationService,
    private PksTankiService: PksTankiService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private GbmSupplierService: GbmSupplierService,
    private KaryawanService: KaryawanService,
    private InvItemService: InvItemService,
  ) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;

    let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      lokasi_id: new FormControl([], Validators.required),
      gudang_id: new FormControl([], Validators.required),
      // supplier_id: new FormControl([], Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      no_transaksi: new FormControl('', Validators.required),
      no_ref: new FormControl('', Validators.required),
      catatan: new FormControl('', Validators.required),

      details: this.builder.array([]),

    });




  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {

    // this.entryForm.controls['awal'].patchValue(this.InvAdj.awal);
    // this.entryForm.controls['akhir'].patchValue(this.InvAdj.akhir);
    this.entryForm.controls['no_transaksi'].patchValue(this.InvAdj.no_transaksi);
    this.entryForm.controls['no_ref'].patchValue(this.InvAdj.no_ref);
    this.entryForm.controls['catatan'].patchValue(this.InvAdj.catatan);

    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.InvAdj.tanggal)));


  }
  public options: any;


  private loadSelect2(): void {

    // let selectedtanki;
    // this.PksTankiService.getAll().subscribe(x=>{
    //   this.dataSelectTanki=[];
    //   x['data'].forEach(d => {
    //     this.dataSelectTanki.push({"id":d.id,"text":d.nama_tanki});
    //     if (this.InvAdj.tanki_id == d.id) {
    //       selectedtanki = { "id": d.id, "text": d.nama_tanki }
    //     }
    //   });
    //   this.entryForm.get('tanki_id').patchValue(selectedtanki);
    // });

    let selectedLokasi;
    this.GbmOrganisasiService.getAllByType("UNIT").subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
        if (this.InvAdj.lokasi_id == d.id) {
          selectedLokasi = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectedLokasi);
    });

    let selectedGudang;
    this.GbmOrganisasiService.getAllByType("GUDANG").subscribe(x => {
      this.dataSelectGudang = [];
      x.forEach(d => {
        this.dataSelectGudang.push({ "id": d.id, "text": d.nama });
        if (this.InvAdj.gudang_id == d.id) {
          selectedGudang = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('gudang_id').patchValue(selectedGudang);
    });

    // let selectedSupplier;
    // this.GbmSupplierService.getAll().subscribe(x=>{
    //   this.dataSelectSupplier=[];
    //   x['data'].forEach(d => {
    //     this.dataSelectSupplier.push({"id":d.id,"text":d.nama_supplier});
    //     if (this.InvAdj.supplier_id == d.id) {
    //       selectedSupplier = { "id": d.id, "text": d.nama_supplier }
    //     }
    //   });
    //   this.entryForm.get('supplier_id').patchValue(selectedSupplier);
    // });

    let selectedItem;
    this.InvItemService.getAll().subscribe(x => {
      this.dataSelectItem = [];
      this.dataItem = x['data'];

      // 🔥 build itemMap SEKALI
      for (let i = 0; i < this.dataItem.length; i++) {
        const d = this.dataItem[i];

        this.dataSelectItem.push({
          id: d.id,
          text: d.kode + ' - ' + d.nama + '(' + d.uom + ')'
        });

        this.itemMap[d.id] = d;
      }

      // 🔥 INI PENGGANTI LOOP addBlok
      this.prepareDetailSource();
    });


    // let selectedKaryawan;
    // this.KaryawanService.getAll().subscribe(x=>{
    //   this.dataSelectKaryawan=[];
    //   x['data'].forEach(d => {
    //     this.dataSelectKaryawan.push({"id":d.id,"text":d.nama});
    //     if (this.InvAdj.karyawan_id == d.id) {
    //       selectedKaryawan = { "id": d.id, "text": d.nama }
    //     }
    //   });
    //   this.entryForm.get('karyawan_id').patchValue(selectedKaryawan);
    // });

    this.dataSelectKode = [
      { id: 'PP1', text: 'PP1' },
      { id: 'PP2', text: 'PP2' },
      { id: 'PP3', text: 'PP3' },
      { id: 'PP4', text: 'PP4' },
      { id: 'PP5', text: 'PP5' },
      { id: 'PP6', text: 'PP6' },
    ];
    // let selectedKode;
    // this.dataSelectKode.forEach(d => {
    //   if (this.InvAdj.kode == d.id) {
    //     selectedKode = { "id": d.id, "text": d.text }
    //   }
    // });
    // this.entryForm.get('kode_id').patchValue(selectedKode);

    // let selectedSimbol;
    // this.dataSelectSimbol.forEach(d => {
    //   if (this.InvAdj.simbol == d.id) {
    //     selectedSimbol = d;
    //   }
    // });
    // this.entryForm.get("simbol").patchValue(selectedSimbol);

  }

  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };
  addBlok(item_id, qty, harga, total, ket) {
    // this.details.push(this.builder.group(new InvoiceBlok()));
    let selectedItem;
    this.dataSelectItem.forEach(a => {
      if (item_id == a.id) {
        selectedItem = a;
      }
    });

    let uom;
    this.dataItem.forEach(x => {
      if (item_id == x.id) {
        uom = x.uom;
      }
    });

    this.details.push(this.builder.group({
      item: new FormControl(selectedItem, Validators.required),
      uom: new FormControl(uom),
      qty: new FormControl(formatNumber(qty, 'en_US', '1.2-2'), Validators.required),
      harga: new FormControl(formatNumber(harga, 'en_US', '1.2-2'), Validators.required),
      total: new FormControl(formatNumber(total, 'en_US', '1.2-2'), Validators.required),
      ket: new FormControl(ket, Validators.required),
    }));
  }
  removeBlok(Blok) {
    let i = this.details.controls.indexOf(Blok);

    if (i != -1) {
      //  let x=	this.details.controls.splice(i, 1);
      let bloks = this.entryForm.get('details') as FormArray;
      bloks.removeAt(i);
      let data = { details: bloks.value };
      this.updateForm(data);
    }
  }
  updateForm(data) {
    const bloks = data.details;
    let sub = 0;
    for (let i of bloks) {
      sub = sub + parseFloat(i.jumlah_janjang);
    }
    console.log(sub);
    //this.entryForm.get('total').patchValue( sub);
  }

  onSubmit() {
    console.log(this.entryForm);

    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }


    let frmData = this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    this.entryForm.get('details').value.forEach(x => {
      if (!isNumber(x.qty)) {
        x.qty = parseFloat(x.qty.replace(/[^\d\.\-]/g, ""));
      }
      if (!isNumber(x.harga)) {
        x.harga = parseFloat(x.harga.replace(/[^\d\.\-]/g, ""));
      }
      if (!isNumber(x.total)) {
        x.total = parseFloat(x.total.replace(/[^\d\.\-]/g, ""));
      }
    });

    this.InvAdjService.update(this.InvAdj.id, frmData).subscribe(data => {
      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Data berhasil disimpan dengan Nomor:' + data['data'],
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

  cekHarga(form) {
    this.dataItem.forEach(x => {
      if (x.id == form.get('item').value.id) {
        form.get('uom').patchValue(x.uom);
      }
    });
  }

  totalHarga(form) {
    let qty = form.get('qty').value;
    if (isString(qty)) {
      qty = parseFloat(qty.replace(/[^\d\.\-]/g, ""));
    }
    form.get('qty').patchValue(formatNumber(qty, 'en_US', '1.2-2'));

    let harga = form.get('harga').value;
    if (isString(harga)) {
      harga = parseFloat(harga.replace(/[^\d\.\-]/g, ""));
    }
    form.get('harga').patchValue(formatNumber(harga, 'en_US', '1.2-2'));

    let total = qty * harga;
    // form.get('total').patchValue(total);
    form.get('total').patchValue(formatNumber(total, 'en_US', '1.2-2'));

  }

// buildDetailFast() {
//   console.group('DETAIL DEBUG');

//   console.log('InvAdj:', this.InvAdj);
//   console.log('InvAdj.detail RAW:', this.InvAdj.detail);
//   console.log('Jumlah detail:', this.InvAdj.detail ? this.InvAdj.detail.length : 0);

//   const controls = [];
//   const details = this.InvAdj.detail as any[];

//   for (let i = 0; i < details.length; i++) {
//     const d = details[i];

//     console.log('Detail ke-' + i, d);

//     const item = this.itemMap[d.item_id];

//     if (!item) {
//       console.warn('ITEM TIDAK DITEMUKAN DI MAP:', d.item_id);

//       // fallback supaya tidak error
//       controls.push(this.builder.group({
//         item: new FormControl(null, Validators.required),
//         uom: new FormControl(null),
//         qty: new FormControl(d.qty),
//         harga: new FormControl(d.harga),
//         total: new FormControl(d.total),
//         ket: new FormControl(d.ket),
//       }));

//       continue;
//     }

//     controls.push(this.builder.group({
//       item: new FormControl(
//         {
//           id: item.id,
//           text: item.kode + ' - ' + item.nama + '(' + item.uom + ')'
//         },
//         Validators.required
//       ),
//       uom: new FormControl(item.uom),
//       qty: new FormControl(d.qty),
//       harga: new FormControl(d.harga),
//       total: new FormControl(d.total),
//       ket: new FormControl(d.ket),
//     }));
//   }

//   console.log('Controls length:', controls.length);

//   console.groupEnd();

//   this.entryForm.setControl('details', this.builder.array(controls));
// }

prepareDetailSource() {
  this.detailSource = this.InvAdj.detail || [];
  this.detailRenderedCount = 0;

  // reset FormArray
  this.entryForm.setControl('details', this.builder.array([]));

  // render batch pertama biar langsung kelihatan
  this.renderNextChunk();

  // lanjutkan sisanya di background
  setTimeout(() => {
    this.renderNextChunkAuto();
  }, 0);
}



renderNextChunk() {
  const detailsFA = this.entryForm.get('details') as FormArray;

  const start = this.detailRenderedCount;
  const end = Math.min(
    start + this.detailChunkSize,
    this.detailSource.length
  );

  for (let i = start; i < end; i++) {
    const d = this.detailSource[i];
    const item = this.itemMap[d.item_id];

    detailsFA.push(this.builder.group({
      item: new FormControl(
        item
          ? { id: item.id, text: item.kode + ' - ' + item.nama + '(' + item.uom + ')' }
          : null,
        Validators.required
      ),
      uom: new FormControl(item ? item.uom : null),
      qty: new FormControl(d.qty),
      harga: new FormControl(d.harga),
      total: new FormControl(d.total),
      ket: new FormControl(d.ket),
    }));
  }

  this.detailRenderedCount = end;
}


renderNextChunkAuto() {
  // stop kalau sudah habis
  if (this.detailRenderedCount >= this.detailSource.length) {
    this.isRenderingDetails = false;
    return;
  }

  this.isRenderingDetails = true;

  // render 1 batch
  this.renderNextChunk();

  // lanjut batch berikutnya di event loop berikutnya
  setTimeout(() => {
    this.renderNextChunkAuto();
  }, 0); // 👈 kunci anti freeze
}



}
