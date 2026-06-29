import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { formatDate, formatNumber } from '@angular/common';

import { AccSalesInvoice } from 'src/app/shared/models/acc_sales_invoice.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';

import { LookupRekapComponent } from '../lookup-rekap/lookup-rekap.component';
import { GbmCustomerService } from 'src/app/shared/services/gbm_customer.service';
import { AccSalesInvoiceService } from 'src/app/shared/services/acc_sales_invoice.service';
import { SlsKontrakService } from 'src/app/shared/services/sls_kontrak.service';
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
import { PrcPoTTDService } from 'src/app/shared/services/prc_po_ttd.service';

import { isNumber } from 'util';
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
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();

  accSalesInvoice: AccSalesInvoice;
  dbName;
  pathName;
  PATH_URL;
  dataSelectCustomer: any[];
  dataSelectLokasi: any[];
  dataSelectJenisInvoice: { id: string; text: string; }[];
  dataSelectAkunDebet: any[];
  dataSelectAkunKredit: any[];
  dataSelectUserTtd: any[];
  dataSelectKontrak: any[];

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private bsModalRef1: BsModalRef,
    private bsModalService: BsModalService,
    private accSalesInvoiceService: AccSalesInvoiceService,
    private slsKontrakService: SlsKontrakService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private gbmCustomerService: GbmCustomerService,
    private accAkunService: AccAkunService,
    private slsInvoice: AccSalesInvoiceService,
    private PrcPoTTDService: PrcPoTTDService,
  ) {

    let toDate: Date = new Date();
    this.entryForm = this.builder.group({
      id: new FormControl(null),
      lokasi_id: new FormControl([], Validators.required),
      sls_kontrak_id: new FormControl([], Validators.required),
      customer_id: new FormControl([], Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      tanggal_tempo: new FormControl(toDate, Validators.required),
      no_invoice: new FormControl('', Validators.required),
      jenis_invoice: new FormControl([], Validators.required),
      acc_akun_id_debet: new FormControl([], Validators.required),
      acc_akun_id_kredit: new FormControl([], Validators.required),

      deskripsi: new FormControl([], Validators.required),
      no_referensi: new FormControl(''),

      qty_real: new FormControl(0, Validators.required),
      qty: new FormControl(0, Validators.required),
      harga_satuan: new FormControl(0, Validators.required),
      jumlah: new FormControl(0, Validators.required),
      sub_total: new FormControl(0, Validators.required),
      premi: new FormControl(0, Validators.required),
      diskon: new FormControl(0, Validators.required),
      uang_muka: new FormControl(0, Validators.required),
      dpp: new FormControl(0, Validators.required),
      ppn: new FormControl(0, Validators.required),
      grand_total: new FormControl(0, Validators.required),

      user_ttd: new FormControl([], Validators.required),

      // Detail array (same structure as acc_sales_invoice_dt)
      detail: this.builder.array([]),
    });
  }

  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {
    // patch header fields (we expect this.accSalesInvoice to be set by parent before opening)
    if (!this.accSalesInvoice) return;

    // patch basic fields
    this.entryForm.controls['id'].patchValue(this.accSalesInvoice.id);
    this.entryForm.controls['no_invoice'].patchValue(this.accSalesInvoice.no_invoice);
    this.entryForm.controls['deskripsi'].patchValue(this.accSalesInvoice.deskripsi);
    this.entryForm.controls['sls_kontrak_id'].patchValue(this.accSalesInvoice.sls_kontrak_id);
    this.entryForm.controls['qty'].patchValue(this.accSalesInvoice.qty);
    this.entryForm.controls['qty_real'].patchValue(this.accSalesInvoice.qty_real);
    this.entryForm.controls['harga_satuan'].patchValue(this.accSalesInvoice.harga_satuan);
    this.entryForm.controls['jumlah'].patchValue(this.accSalesInvoice.jumlah);
    this.entryForm.controls['diskon'].patchValue(this.accSalesInvoice.diskon);
    this.entryForm.controls['uang_muka'].patchValue(this.accSalesInvoice.uang_muka);
    this.entryForm.controls['premi'].patchValue(this.accSalesInvoice.premi);
    this.entryForm.controls['ppn'].patchValue(this.accSalesInvoice.ppn);
    this.entryForm.controls['no_referensi'].patchValue(this.accSalesInvoice.no_referensi);
    this.entryForm.controls['grand_total'].patchValue(this.accSalesInvoice.grand_total);

    if (this.accSalesInvoice.tanggal) {
      this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.accSalesInvoice.tanggal)));
    }
    if (this.accSalesInvoice.tanggal_tempo) {
      this.entryForm.get('tanggal_tempo').patchValue(new Date(Date.parse(this.accSalesInvoice.tanggal_tempo)));
    }

    // populate detail FormArray from accSalesInvoice.detail (if any)
    if (Array.isArray(this.accSalesInvoice.detail) && this.accSalesInvoice.detail.length > 0) {
      // clear existing
      while ((this.entryForm.get('detail') as FormArray).length) {
        (this.entryForm.get('detail') as FormArray).removeAt(0);
      }

      this.accSalesInvoice.detail.forEach(d => {
        const fg = this.builder.group({
          id: [d.id || null],
          sls_invoice_id: [d.sls_invoice_id || null],
          rekap_id: [d.rekap_id || null],
          no_rekap: [d.no_rekap || ''],
          qty: [d.qty || 0],
          harga: [d.harga || 0],
          total: [d.total || 0],
          keterangan: [d.keterangan || '']
        });
        this.detailRows.push(fg);
      });

      // update header desc and totals to reflect detail
      this.updateDeskripsiHeader();
      this.updateHeaderTotals();
    }

    this.hitungTotal();
  }

  private loadSelect2(): void {
    this.dataSelectJenisInvoice = [
      { id: 'JUMLAH HARGA JUAL', text: 'JUMLAH HARGA JUAL' },
      { id: 'PENGGANTIAN', text: 'PENGGANTIAN' },
      { id: 'UANG MUKA', text: 'UANG MUKA' },
      { id: 'TERMIN', text: 'TERMIN' },
    ];

    // patch selected jenis later in loadSelect2 using accSalesInvoice if available
    let selectedJenisInvoice;
    if (this.accSalesInvoice) {
      this.dataSelectJenisInvoice.forEach(d => {
        if (d.id == this.accSalesInvoice.jenis_invoice) {
          selectedJenisInvoice = d;
        }
      });
      if (selectedJenisInvoice) {
        this.entryForm.controls['jenis_invoice'].patchValue(selectedJenisInvoice);
      }
    }

    // user ttd
    this.PrcPoTTDService.getAll().subscribe(x => {
      this.dataSelectUserTtd = [];
      let i = x['data'];
      let selectedUserTtd;
      i.forEach(d => {
        this.dataSelectUserTtd.push({ "id": d.nama, "text": d.nama });
        if (this.accSalesInvoice && d.nama == this.accSalesInvoice.user_ttd) {
          selectedUserTtd = { id: d.nama, text: d.nama };
        }
      });
      if (selectedUserTtd) {
        this.entryForm.controls['user_ttd'].patchValue(selectedUserTtd);
      }
    });

    // akun debet
    this.slsInvoice.getAllAkunDebetSalesInvoice().subscribe(x => {
      this.dataSelectAkunDebet = [];
      let selectedAkunDebet;
      x['data'].forEach(d => {
        this.dataSelectAkunDebet.push({ "id": d.acc_akun_id, "text": d.kode_akun + ' - ' + d.nama_akun });
        if (this.accSalesInvoice && d.acc_akun_id == this.accSalesInvoice.acc_akun_id_debet) {
          selectedAkunDebet = { "id": d.acc_akun_id, "text": d.kode_akun + ' - ' + d.nama_akun };
        }
      });
      if (selectedAkunDebet) {
        this.entryForm.controls['acc_akun_id_debet'].patchValue(selectedAkunDebet);
      }
    });

    // akun kredit
    this.slsInvoice.getAllAkunKreditSalesInvoice().subscribe(x => {
      this.dataSelectAkunKredit = [];
      let selectedAkunKredit;
      x['data'].forEach(d => {
        this.dataSelectAkunKredit.push({ "id": d.acc_akun_id, "text": d.kode_akun + ' - ' + d.nama_akun });
        if (this.accSalesInvoice && d.acc_akun_id == this.accSalesInvoice.acc_akun_id_kredit) {
          selectedAkunKredit = { "id": d.acc_akun_id, "text": d.kode_akun + ' - ' + d.nama_akun };
        }
      });
      if (selectedAkunKredit) {
        this.entryForm.controls['acc_akun_id_kredit'].patchValue(selectedAkunKredit);
      }
    });

    // customers
    this.gbmCustomerService.getAll().subscribe(x => {
      this.dataSelectCustomer = [];
      let selectedCustomer;
      x['data'].forEach(d => {
        this.dataSelectCustomer.push({ "id": d.id, "text": d.kode_customer + " - " + d.nama_customer });
        if (this.accSalesInvoice && d.id == this.accSalesInvoice.customer_id) {
          selectedCustomer = { "id": d.id, "text": d.kode_customer + " - " + d.nama_customer };
        }
      });
      if (selectedCustomer) {
        this.entryForm.controls['customer_id'].patchValue(selectedCustomer);
      }
    });

    // lokasi
    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = [];
      let selectedLokasi;
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
        if (this.accSalesInvoice && d.id == this.accSalesInvoice.lokasi_id) {
          selectedLokasi = { "id": d.id, "text": d.nama };
        }
      });
      if (selectedLokasi) {
        this.entryForm.controls['lokasi_id'].patchValue(selectedLokasi);
      }
    });

    // kontrak
    this.slsKontrakService.getAll().subscribe(x => {
      this.dataSelectKontrak = [];
      let selectedKontrak;
      x['data'].forEach(d => {
        this.dataSelectKontrak.push({ "id": d.id, "text": d.no_spk });
        if (this.accSalesInvoice && d.id == this.accSalesInvoice.sls_kontrak_id) {
          selectedKontrak = { "id": d.id, "text": d.no_spk };
        }
      });
      if (selectedKontrak) {
        this.entryForm.controls['sls_kontrak_id'].patchValue(selectedKontrak);
      }
    });
  }

  showRekap() {
    // if you want to allow re-selecting rekaps, implement similar to AddComponent
    let modalConfig = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-lg ",
      initialState: {
        customer_id: this.entryForm.get('customer_id').value.id
      }
    };
    this.bsModalRef1 = this.bsModalService.show(LookupRekapComponent, modalConfig);
    this.bsModalRef1.content.event.subscribe(item => {
      if (!item) return;
      // if lookup returns array, handle; else single
      if (Array.isArray(item)) {
        item.forEach(r => this.addRekapToDetail(r));
      } else {
        this.addRekapToDetail(item);
      }
      this.updateDeskripsiHeader();
      this.updateHeaderTotals();
    });
  }

  showNotification(from, align, message, color = 4) {
    var type = ['', 'info', 'success', 'warning', 'danger', 'rose', 'primary'];
    $.notify({ icon: "notifications", message: message }, {
      type: type[color],
      timer: 3000,
      placement: { from: from, align: align }
    });
  }

  onSubmit() {
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    let frmData = this.entryForm.getRawValue();

    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');

    frmData['grand_total'] = this.entryForm.get('grand_total').value;
    frmData['jumlah'] = this.entryForm.get('jumlah').value;
    frmData['uang_muka'] = this.entryForm.get('uang_muka').value;
    frmData['diskon'] = this.entryForm.get('diskon').value;
    frmData['qty'] = this.entryForm.get('qty').value;
    frmData['qty_real'] = this.entryForm.get('qty_real').value;
    frmData['harga_satuan'] = this.entryForm.get('harga_satuan').value;
    frmData['premi'] = this.entryForm.get('premi').value;




    this.accSalesInvoiceService.update(this.accSalesInvoice.id, frmData).subscribe(data => {
      if (data['status'] == 'OK') {
        swal({ title: 'Info!', text: 'Simpan berhasil', type: 'success', confirmButtonClass: "btn btn-success", buttonsStyling: false });
        this.event.emit('OK');
        this.bsModalRef.hide();
      } else {
        swal({ title: 'Perhatian!', text: 'Proses Simpan Gagal', type: 'warning', confirmButtonClass: "btn btn-success", buttonsStyling: false });
      }
    });
  }

  onClose() {
    this.bsModalRef.hide();
  }

  get detailRows() {
    return this.entryForm.get('detail') as FormArray;
  }

  // add single rekap to detail array
  addRekapToDetail(rekap) {
    // prevent duplicates by rekap_id
    const exists = this.detailRows.value.find(d => String(d.rekap_id) === String(rekap.id));
    if (exists) return;

    const fg = this.builder.group({
      id: [null],
      sls_invoice_id: [this.accSalesInvoice.id || null],
      rekap_id: [rekap.id],
      no_rekap: [rekap.no_rekap],
      qty: [Number(rekap.qty) || 0],
      harga: [Number(rekap.harga) || 0],
      total: [Number(rekap.total) || 0],
      keterangan: [`Penjualan produk dengan No Rekap ${rekap.no_rekap}`]
    });

    this.detailRows.push(fg);
  }

  updateDeskripsiHeader() {
    const list = this.detailRows.value.map(x => x.no_rekap);
    const desc = list.length ? 'Penjualan produk dengan No Rekap: ' + list.join(', ') : '';
    this.entryForm.patchValue({ deskripsi: desc });
  }

  updateHeaderTotals() {
    let totalQty = 0;
    let totalHarga = 0;
    let totalJumlah = 0;

    this.detailRows.value.forEach(d => {
      totalQty += Number(d.qty) || 0;
      totalHarga = d.harga || totalHarga;
      totalJumlah += Number(d.total) || 0;
    });

    this.entryForm.patchValue({
      qty: totalQty,
      qty_real: totalQty,
      harga_satuan: totalHarga,
      jumlah: totalJumlah,
    });

    this.hitungTotal();
  }

  removeDetail(i: number) {
    this.detailRows.removeAt(i);
    this.updateDeskripsiHeader();
    this.updateHeaderTotals();
  }

  removeAllDetail() {
    while (this.detailRows.length !== 0) {
      this.detailRows.removeAt(0);
    }
    this.updateDeskripsiHeader();
    this.updateHeaderTotals();
  }

  ngOnInit() {
    this.loadSelect2();

    this.entryForm.get('jenis_invoice').valueChanges.subscribe(val => {

      var jenis = this.getJenisInvoice();

      if (jenis === 'UANG MUKA') {

        this.entryForm.patchValue({
          qty: 0,
          jumlah: 0
        });

      } else {

        this.entryForm.patchValue({
          qty_real: 0
        });

      }

      this.hitungTotal();
    });
  }
  valueChange($event) {
    this.hitungTotal();
  }

  hitungTotal() {
    var jenis = this.getJenisInvoice();

    let harga = Number(this.entryForm.get('harga_satuan').value) || 0;
    let qty = Number(this.entryForm.get('qty').value) || 0;
    let qty_real = Number(this.entryForm.get('qty_real').value) || 0;

    let jumlah = 0;

    // 🔥 BEDA DI SINI
    if (jenis === 'UANG MUKA') {
      jumlah = qty_real * harga;
    } else {
      jumlah = qty * harga;
    }

    let disc = Number(this.entryForm.get('diskon').value) || 0;
    let uang_muka = Number(this.entryForm.get('uang_muka').value) || 0;
    let premi = Number(this.entryForm.get('premi').value) || 0;

    let dpp = 0;

    if (jenis === 'UANG MUKA') {
      // 🔥 uang muka TIDAK dipakai
      dpp = jumlah + premi - disc;
    } else {
      dpp = jumlah + premi - disc - uang_muka;
    }

    let ppn = Number(this.entryForm.get('ppn').value) || 0;
    let nilai_ppn = (ppn / 100) * dpp;
    let total = dpp + nilai_ppn;

    this.entryForm.patchValue({
      jumlah: jumlah,
      dpp: dpp,
      grand_total: total
    });
  }

  getJenisInvoice() {
    var val = this.entryForm.get('jenis_invoice').value;

    if (val && val.id) {
      return val.id;
    }

    return val;
  }
}
