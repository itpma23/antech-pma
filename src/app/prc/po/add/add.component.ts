import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { PksTankiService } from 'src/app/shared/services/pks_tanki.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { PrcPoService } from 'src/app/shared/services/prc_po.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { TranslateService } from '@ngx-translate/core';
import { Akun } from 'src/app/shared/models/akun.model';
import { PrcPo } from 'src/app/shared/models/prc_po.model';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { PrcSyaratBayarService } from 'src/app/shared/services/prc_syarat_bayar.service';
import { PrcFrancoService } from 'src/app/shared/services/prc_franco.service';
import { PrcPpService } from 'src/app/shared/services/prc_pp.service';

import { LookupPpComponent } from '../lookup-pp/lookup-pp.component';
import { PrcPoTTD } from 'src/app/shared/models/prc_po_ttd.model';
import { AccMatauangService } from 'src/app/shared/services/acc_mata_uang.service';
import { PrcPoTTDService } from 'src/app/shared/services/prc_po_ttd.service';
import { PrcQuotationService } from 'src/app/shared/services/prc_quotation.service';
import { formatDate, formatNumber } from '@angular/common';
import { isNullOrUndefined, isNumber, isString } from 'util';
import { NgxUiLoaderService } from 'ngx-ui-loader';

declare var $: any;
declare var swal: any;

interface Tipe {
  value: string;
  viewValue: string;
}
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
  categories: any[] = [];
  event: EventEmitter<any> = new EventEmitter();

  dataSelectTanki;
  dataSelectSimbol;
  dataSelectLokasi;
  dataSelectKode;
  dataSelectKaryawan;
  dataSelectItem;
  dataSelectSupplier;
  dataSelectSyaratBayar;
  dataSelectFranco;
  dataSelectQuotation;
  dataItem;
  dataSelectMataUang: any[];
  dataMatauang: any;
  dataSelectPeminta: any[];
  dataPeminta: any;
  dataSelectPenyetuju: any[];
  dataPenyetuju: any;
  dataSelectLokasiPP: any[];
  dataSelectReadyStok: { id: string; text: string; }[];
  dataSelectStatusStok: { id: string; text: string; }[];


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private bsModalRef1: BsModalRef,
    private bsModalService: BsModalService,
    private PrcPoService: PrcPoService,
    private translate: TranslateService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private KaryawanService: KaryawanService,
    private InvItemService: InvItemService,
    private GbmSupplierService: GbmSupplierService,
    private PrcSyaratBayarService: PrcSyaratBayarService,
    private PrcFrancoService: PrcFrancoService,
    private PrcPpService: PrcPpService,
    private prcPoTTDService: PrcPoTTDService,
    private accMatauangService: AccMatauangService,
    private PrcQuotationService: PrcQuotationService,
    private ngxLoader: NgxUiLoaderService


  ) {
    let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      lokasi_id: new FormControl([], Validators.required),
      lokasi_pp_id: new FormControl([], Validators.required),
      supplier_id: new FormControl([], Validators.required),
      syarat_bayar_id: new FormControl([], Validators.required),
      mata_uang_id: new FormControl([], Validators.required),
      franco_id: new FormControl([], Validators.required),
      quotation_id: new FormControl([]),
      status_stok: new FormControl([], Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      no_po: new FormControl('<OTOMATIS>', Validators.required),
      catatan: new FormControl('', Validators.required),
      ket_indent: new FormControl(''),
      tempo_bayar: new FormControl(0, ),
      sub_total: new FormControl(0, Validators.required),
      biaya_kirim: new FormControl(0, Validators.required),
      ppbkb: new FormControl(0, Validators.required),
      ppbkb_show: new FormControl(0, Validators.required),
      disc: new FormControl(0),
      diskon: new FormControl(0),
      biaya_lain: new FormControl(0),
      ppn: new FormControl(0, Validators.required),
      ppn_show: new FormControl(0),
      pph: new FormControl(0, Validators.required),
      pph_show: new FormControl(0),
      grand_total: new FormControl(0, Validators.required),

      details: this.builder.array([]),
    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    this.loadSelect2();
    // this.addBlok();

  }
  public dataSelect: any[] = [];
  public options: any;

  private loadSelect2(): void {
    let m = this.translate.instant('holidays.messages.update');

    this.dataSelectStatusStok = [
      { id: 'Ready Stok', text: 'Ready Stok' },
      { id: 'Indent', text: 'Indent' },
    ];

    this.entryForm.get('status_stok').valueChanges.subscribe(x => {
      if (x.id == 'Indent') {
        this.entryForm.controls['ket_indent'].enable();
      } else if (x.id == 'Ready') {
        this.entryForm.controls['ket_indent'].disable();
      } else {
        this.entryForm.controls['ket_indent'].disable();
      }
    });

    // this.dataSelectStatusStok.unshift({ id:'', text: 'Pilih' });

    this.GbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
    });
    this.GbmOrganisasiService.getAllByType("UNIT").subscribe(x => {
      this.dataSelectLokasiPP = [];
      x.forEach(d => {
        this.dataSelectLokasiPP.push({ "id": d.id, "text": d.nama });
      });
    });
    this.PrcQuotationService.getAll().subscribe(x => {
      // console.log(x)
      this.dataSelectQuotation = [];
      x['data'].forEach(d => {
        this.dataSelectQuotation.push({ "id": d.id, "text": d.no_quotation + '-' + d.no_referensi });
      });
    });

    // this.KaryawanService.getAll().subscribe(x=>{
    //   this.dataSelectKaryawan=[];
    //   x['data'].forEach(d => {
    //     this.dataSelectKaryawan.push({"id":d.id,"text":d.nama});
    //   });
    // });

    this.GbmSupplierService.getAll().subscribe(x => {
      this.dataSelectSupplier = [];
      x['data'].forEach(d => {
        this.dataSelectSupplier.push({ "id": d.id, "text": d.nama_supplier });
      });
      this.entryForm.controls['supplier_id'].valueChanges.subscribe(x => {
      let supplier_id = this.entryForm.get('supplier_id').value['id']
      this.GbmSupplierService.getById(supplier_id).subscribe(res => {
      this.entryForm.controls['tempo_bayar'].patchValue(res['data']['tempo_pembayaran']);
    })
      });
    });

    this.PrcSyaratBayarService.getAll().subscribe(x => {
      this.dataSelectSyaratBayar = [];
      x['data'].forEach(d => {
        this.dataSelectSyaratBayar.push({ "id": d.id, "text": "(" + d.jenis + ") " + d.kode + " - " + d.ket });
      });
    });

    this.PrcFrancoService.getAll().subscribe(x => {
      this.dataSelectFranco = [];
      x['data'].forEach(d => {
        this.dataSelectFranco.push({ "id": d.id, "text": "(" + d.nama + ") " + d.alamat });
      });
    });

    this.InvItemService.getAll().subscribe(x => {
      this.dataSelectItem = [];
      this.dataItem = x['data'];
      x['data'].forEach(d => {
        this.dataSelectItem.push({ "id": d.id, "text": "" + d.kode + " - " + d.nama });
      });
    });

    this.accMatauangService.getAll().subscribe(x => {
      this.dataSelectMataUang = [];
      this.dataMatauang = x['data'];
      console.log(x)
      x['data'].forEach(d => {
        this.dataSelectMataUang.push({ "id": d.id, "text": "(" + d.kode + ") " + d.nama });
      });
    });
    this.prcPoTTDService.getAllbyType('peminta').subscribe(x => {
      this.dataSelectPeminta = [];
      this.dataPeminta = x['data'];

      x['data'].forEach(d => {
        this.dataSelectPeminta.push({ "id": d.nama, "text": d.nama });
      });
    });

    this.prcPoTTDService.getAllbyType('penyetuju').subscribe(x => {
      this.dataSelectPenyetuju = [];
      this.dataPenyetuju = x['data'];

      x['data'].forEach(d => {
        this.dataSelectPenyetuju.push({ "id": d.nama, "text": d.nama });
      });
    });


    this.dataSelectKode = [
      { id: 'PP1', text: 'PP1' },
      { id: 'PP2', text: 'PP2' },
      { id: 'PP3', text: 'PP3' },
      { id: 'PP4', text: 'PP4' },
      { id: 'PP5', text: 'PP5' },
      { id: 'PP6', text: 'PP6' },
    ];

  }
  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };
  addBlok(pp_dt_id, item_id, qty, no_pp, ket = '') {
    // this.details.push(this.builder.group(new InvoiceBlok()));

    let selectedItem;
    this.dataItem.forEach(a => {
      if (item_id == a.id) {
        selectedItem = a;
      }
    });

    this.details.push(this.builder.group({
      pp_dt_id: new FormControl(pp_dt_id),
      item: new FormControl(selectedItem, Validators.required),
      uom: new FormControl(selectedItem.uom),
      qty: new FormControl(qty, Validators.required),
      xqty: new FormControl(formatNumber(qty, 'en_US', '1.2-2')),
      diskon: new FormControl(0),
      xdiskon: new FormControl(0),
      harga: new FormControl(0, Validators.required),
      xharga: new FormControl(0),
      total: new FormControl(0, Validators.required),
      no_pp: new FormControl(no_pp),
      ket: new FormControl(ket),
    }));

    this.totalSub();
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
      sub = sub + parseFloat(i.qty);
    }
    // console.log(sub);
    //this.entryForm.get('total').patchValue( sub);
  }
  onSubmitClear() {
    this.isFormSubmitted = true;
    // console.log(this.entryForm);
    if (this.entryForm.invalid) {
      return;
    }

    let frmData = this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    frmData['diskon'] = parseFloat(this.entryForm.get('diskon').value.replace(/[^\d\.\-]/g, ""));
    frmData['biaya_lain'] = parseFloat(this.entryForm.get('biaya_lain').value.replace(/[^\d\.\-]/g, ""));
    frmData['biaya_kirim'] = parseFloat(this.entryForm.get('biaya_kirim').value.replace(/[^\d\.\-]/g, ""));
    frmData['sub_total'] = parseFloat(this.entryForm.get('sub_total').value.replace(/[^\d\.\-]/g, ""));
    frmData['grand_total'] = parseFloat(this.entryForm.get('grand_total').value.replace(/[^\d\.\-]/g, ""));
    frmData['pph_nilai'] = parseFloat(this.entryForm.get('pph_show').value.replace(/[^\d\.\-]/g, ""));
    this.entryForm.get('details').value.forEach(x => {
      if (!isNumber(x.total)) {
        x.total = parseFloat(x.total.replace(/[^\d\.\-]/g, ""));
      }
    });
    let quotation_id;
    if (!isNullOrUndefined(this.entryForm.controls['quotation_id'].value)) {
      if (isNullOrUndefined(this.entryForm.controls['quotation_id'].value['id'])) {
        quotation_id = null
      } else {
        quotation_id = this.entryForm.controls['quotation_id'].value['id']
      }
    } else {
      quotation_id = null
    }
    frmData['quotation_id'] = quotation_id;
    this.PrcPoService.create(frmData).subscribe(data => {
      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Data berhasil diSimpan dengan Nomor:' + data['data'],
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })

        this.isFormSubmitted = false;
        let toDate: Date = new Date();
        this.entryForm = this.builder.group({
          lokasi_id: new FormControl([], Validators.required),
          lokasi_pp_id: new FormControl([], Validators.required),
          supplier_id: new FormControl([], Validators.required),
          syarat_bayar_id: new FormControl([], Validators.required),
          mata_uang_id: new FormControl([], Validators.required),
          franco_id: new FormControl([], Validators.required),
          quotation_id: new FormControl([]),
          status_stok: new FormControl([], Validators.required),
          tanggal: new FormControl(toDate, Validators.required),
          no_po: new FormControl('<OTOMATIS>', Validators.required),
          catatan: new FormControl('', Validators.required),
          tempo_bayar: new FormControl(0,Validators.required ),
          sub_total: new FormControl(0, Validators.required),
          biaya_kirim: new FormControl(0, Validators.required),
          ppbkb: new FormControl(0, Validators.required),
          ppbkb_show: new FormControl(0, Validators.required),
          disc: new FormControl(0),
          diskon: new FormControl(0),
          biaya_lain: new FormControl(0),
          ppn: new FormControl(0, Validators.required),
          ppn_show: new FormControl(0),
          pph: new FormControl(0, Validators.required),
          pph_show: new FormControl(0),
          grand_total: new FormControl(0, Validators.required),

          details: this.builder.array([]),
        });
         this.loadSelect2();
        this.event.emit('OK');
        return;

        // this.event.emit('OK');
        // this.bsModalRef.hide();
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
  onSubmit() {
    this.isFormSubmitted = true;
    // console.log(this.entryForm);
    if (this.entryForm.invalid) {
      return;
    }

    let frmData = this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    frmData['diskon'] = parseFloat(this.entryForm.get('diskon').value.replace(/[^\d\.\-]/g, ""));
    frmData['biaya_lain'] = parseFloat(this.entryForm.get('biaya_lain').value.replace(/[^\d\.\-]/g, ""));
    frmData['biaya_kirim'] = parseFloat(this.entryForm.get('biaya_kirim').value.replace(/[^\d\.\-]/g, ""));
    frmData['sub_total'] = parseFloat(this.entryForm.get('sub_total').value.replace(/[^\d\.\-]/g, ""));
    frmData['grand_total'] = parseFloat(this.entryForm.get('grand_total').value.replace(/[^\d\.\-]/g, ""));
    frmData['pph_nilai'] = parseFloat(this.entryForm.get('pph_show').value.replace(/[^\d\.\-]/g, ""));
    this.entryForm.get('details').value.forEach(x => {
      if (!isNumber(x.total)) {
        x.total = parseFloat(x.total.replace(/[^\d\.\-]/g, ""));
      }
    });
    let quotation_id;
    if (!isNullOrUndefined(this.entryForm.controls['quotation_id'].value)) {
      if (isNullOrUndefined(this.entryForm.controls['quotation_id'].value['id'])) {
        quotation_id = null
      } else {
        quotation_id = this.entryForm.controls['quotation_id'].value['id']
      }
    } else {
      quotation_id = null
    }
    frmData['quotation_id'] = quotation_id;
    this.PrcPoService.create(frmData).subscribe(data => {
      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Data berhasil diSimpan dengan Nomor:' + data['data'],
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

  }
  valueChange($event) {

  }
  valueLokasiPPChange($event) {

    let bloks = this.entryForm.get('details') as FormArray;
    bloks.clear()
  }
  getUOM(form) {
    this.dataItem.forEach(x => {
      if (x.id == form.get('item').value.id) {
        form.get('uom').patchValue(x.satuan);
      }
    });
  }

  showPp() {
    let lokasi_pp_id;
    lokasi_pp_id = this.entryForm.get('lokasi_pp_id').value['id'],
      this.PrcPpService.getAllDetailLokasiByStatus(lokasi_pp_id).subscribe(t => {
        let modalConfig = {
          animated: true,
          keyboard: true,
          backdrop: true,
          ignoreBackdropClick: true,
          //size: 'lg',
          class: "modal-lg ",
          initialState: {
            PrcPp: t['data'],
            // intruksi_id: this.entryForm.get("intruksi_id").value['id'],
          }
        };
        this.bsModalRef1 = this.bsModalService.show(LookupPpComponent, modalConfig);

        this.bsModalRef1.content.event.subscribe(data => {
          console.log(data);
          if (data == null) {
          } else {
            // this.showNotification('top', 'right', "No PP " + data['qty'] + " ", 2);
            data.forEach(d => {
              this.ngxLoader.start();
              this.addBlok(d['id'], d['item_id'], d['qty_belum_po'], d['no_pp'], d['ket']);

            })
          }
          this.ngxLoader.stop();
        });
      });
  }
  showNotification(from, align, message, color = 4) {
    var type = ['', 'info', 'success', 'warning', 'danger', 'rose', 'primary'];
    // console.log(type[color]);
    $.notify({
      icon: "notifications",
      message: message
    }, {
      type: type[color],
      timer: 3000,
      placement: {
        from: from,
        align: align
      }
    });
  }


  totalHarga(form) {
    let qty = form.get('xqty').value;
    if (isString(qty)) {
      qty = parseFloat(qty.replace(/[^\d\.\-]/g, ""));
    }
    form.get('xqty').patchValue(formatNumber(qty, 'en_US', '1.2-2'));
    form.get('qty').patchValue(qty);

    let diskon = form.get('xdiskon').value;
    if (isString(diskon)) {
      diskon = parseFloat(diskon.replace(/[^\d\.\-]/g, ""));
    }
    form.get('xdiskon').patchValue(formatNumber(diskon, 'en_US', '1.2-2'));
    form.get('diskon').patchValue(diskon);

    let harga = form.get('xharga').value;
    if (isString(harga)) {
      harga = parseFloat(harga.replace(/[^\d\.\-]/g, ""));
    }
    form.get('xharga').patchValue(formatNumber(harga, 'en_US', '1.2-2'));
    form.get('harga').patchValue(harga);

    let total = (qty * harga) - diskon;
    form.get('total').patchValue(formatNumber(total, 'en_US', '1.2-2'));

    this.totalSub();
  }


  totalSub() {
    let subTotal = 0;
    // console.log(this.entryForm.get('details').value);
    this.entryForm.get('details').value.forEach(x => {
      // console.log(x);
      if (isNumber(x.total)) {
        subTotal += x.total;
      } else {
        subTotal += parseFloat(x.total.replace(/[^\d\.\-]/g, ""));
      }

    });
    this.entryForm.get('sub_total').patchValue(formatNumber(subTotal, 'en_US', '1.2-2'));
    this.totalGrand();
  }

  totalGrand() {
    let subTotal = this.entryForm.get('sub_total').value;
    subTotal = isNumber(subTotal) ? subTotal : parseFloat(subTotal.replace(/[^\d\.\-]/g, ""));
    let diskon = this.entryForm.get('diskon').value;
    diskon = isNumber(diskon) ? diskon : parseFloat(diskon.replace(/[^\d\.\-]/g, ""));
    let biayaKirim = this.entryForm.get('biaya_kirim').value;
    biayaKirim = isNumber(biayaKirim) ? biayaKirim : parseFloat(biayaKirim.replace(/[^\d\.\-]/g, ""));
    let biayaLain = this.entryForm.get('biaya_lain').value;
    biayaLain = isNumber(biayaLain) ? biayaLain : parseFloat(biayaLain.replace(/[^\d\.\-]/g, ""));

    let grandTotal = 0;

    let ppn = parseFloat(this.entryForm.get('ppn').value);
    let ppnTotal = 0;
    let pph = parseFloat(this.entryForm.get('pph').value);
    let pphTotal = 0;
    let ppbkb = parseFloat(this.entryForm.get('ppbkb').value);
    let ppbkbTotal = 0;


    subTotal = subTotal - diskon;
    ppnTotal = (ppn / 100) * parseFloat(subTotal);
    pphTotal = (pph / 100) * parseFloat(subTotal);
    ppbkbTotal = (ppbkb / 100) * parseFloat(subTotal);
    grandTotal = parseFloat(subTotal) + (ppnTotal - pphTotal + ppbkbTotal) + parseFloat(biayaKirim);
    grandTotal = grandTotal + biayaLain;

    this.entryForm.get('biaya_kirim').patchValue(formatNumber(biayaKirim, 'en_US', '1.2-2'));
    this.entryForm.get('biaya_lain').patchValue(formatNumber(biayaLain, 'en_US', '1.2-2'));
    this.entryForm.get('diskon').patchValue(formatNumber(diskon, 'en_US', '1.2-2'));
    this.entryForm.get('ppn_show').patchValue(formatNumber(ppnTotal, 'en_US', '1.2-2'));
    this.entryForm.get('pph_show').patchValue(formatNumber(pphTotal, 'en_US', '1.2-2'));
    this.entryForm.get('ppbkb_show').patchValue(formatNumber(ppbkbTotal, 'en_US', '1.2-2'));
    this.entryForm.get('grand_total').patchValue(formatNumber(grandTotal, 'en_US', '1.2-2'));
  }

  calc_pph() {
    let subTotal = this.entryForm.get('sub_total').value;
    subTotal = isNumber(subTotal) ? subTotal : parseFloat(subTotal.replace(/[^\d\.\-]/g, ""));
    let pph_show = this.entryForm.get('pph_show').value;
    pph_show = isNumber(pph_show) ? pph_show : parseFloat(pph_show.replace(/[^\d\.\-]/g, ""));

    let pphPercent = 0;

    pphPercent = (pph_show / parseFloat(subTotal)) * 100;
    // pphPercent.toFixed(4);
    this.entryForm.get('pph').patchValue(pphPercent);

    this.totalGrand();
  }

}
