import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { formatDate, formatNumber } from '@angular/common';
import { AccSalesPerforma } from 'src/app/shared/models/acc_sales_performa.model';

import { LookupRekapComponent } from '../lookup-rekap/lookup-rekap.component';
import { AccSalesPerformaService } from 'src/app/shared/services/acc_sales_performa.service';
import { SlsKontrakService } from 'src/app/shared/services/sls_kontrak.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { GbmCustomerService } from 'src/app/shared/services/gbm_customer.service';
import { PrcPoTTDService } from 'src/app/shared/services/prc_po_ttd.service';

import { isNumber } from 'util';
declare var $: any;
declare var swal: any;

@Component({
  selector: 'edit-cmp',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.css'],

})
export class EditComponent implements OnInit, AfterViewInit {

  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();
  accSalesPerforma: any;
  loaded = {
    bank: false,
    customer: false,
    lokasi: false,
    user: false
  };
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  isEditMode = false;

  dataSelectJenisPerforma = [
    { id: 'JUMLAH HARGA JUAL', text: 'JUMLAH HARGA JUAL' },
    { id: 'PENGGANTIAN', text: 'PENGGANTIAN' },
    { id: 'UANG MUKA', text: 'UANG MUKA' },
    { id: 'TERMIN', text: 'TERMIN' }
  ];

  dataSelectBank: any[] = [];
  isFormSubmitted = false;

  dataSelectCustomer: any[] = [];
  dataSelectLokasi: any[] = [];
  dataSelectUserTtd: any[] = [];
  selectedKontrak: any = null;
  dataSelectKontrak: any[] = [];
  kontrak: any[] = [];

  bankMapping: any = {
    'BANK BNI': {
      no_rekening: '29-9999-5776',
      atas_nama: 'PT PALM MAS ASRI',
      cabang_bank: 'Roa Malaka'
    }
  };

    constructor(
    private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private bsModalService: BsModalService,
    private slsKontrakService: SlsKontrakService,

    private service: AccSalesPerformaService,
    private customerService: GbmCustomerService,
    private organisasiService: GbmOrganisasiService,
    private ttdService: PrcPoTTDService
  ) {

    this.entryForm = this.fb.group({
      lokasi_id: [[], Validators.required],
      customer_id: [[], Validators.required],
      sls_kontrak_id: [[], Validators.required],

      tanggal: [new Date(), Validators.required],
      tanggal_tempo: [new Date(), Validators.required],
      no_performa: [''],
      jenis_performa: [[], Validators.required],

      deskripsi: ['', Validators.required],
      no_referensi: [''],

      qty: [0],
      harga_satuan: [0],
      jumlah: [0],

      kawasan: new FormControl(null),

      diskon: [0],
      ppn_rp: new FormControl({ value: 0, disabled: true }),

      qty_real: [0],

      uang_muka: [0],
      dpp: [0],
      dpp_nilai_lain: [{ value: 0, disabled: true }],
      ppn: [0],
      grand_total: [0],

      bank_id: [[], Validators.required],
      no_rekening: [''],
      atas_nama: [''],
      cabang_bank: [''],

      user_ttd: [[], Validators.required],

      detail: this.fb.array([])
    });
    this.disableAutoFields();

  }

  disableAutoFields() {
    this.entryForm.get('jumlah').disable(); // hanya jumlah
    this.entryForm.get('qty').disable(); // hanya jumlah

  }
  get detailRows() {
    return this.entryForm.get('detail') as FormArray;
  }

  ngOnInit() {
    this.loadSelect2();
    this.handleBankAutoFill();
  }

  ngAfterViewInit() {
  }

  // =========================
  // LOAD DATA SELECT
  // =========================
  loadData() {

    this.service.getBank().subscribe(x => {
      this.dataSelectBank = x['data'].map(d => ({
        id: d.id,
        text: d.nama_bank
      }));
    });

    this.customerService.getAll().subscribe(x => {
      this.dataSelectCustomer = x['data'].map(d => ({
        id: d.id,
        text: d.nama_customer
      }));
    });

    this.organisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = x.map(d => ({
        id: d.id,
        text: d.nama
      }));
    });

    this.ttdService.getAll().subscribe(x => {
      this.dataSelectUserTtd = x['data'].map(d => ({
        id: d.nama,
        text: d.nama
      }));
    });
  }

  // =========================
  // PATCH DATA EDIT
  // =========================
  patchData() {
    this.isEditMode = true;
    const d = this.accSalesPerforma;

    this.detailRows.clear();

    const lokasi = this.dataSelectLokasi.find(x => x.id == d.lokasi_id);
    const customer = this.dataSelectCustomer.find(x => x.id == d.customer_id);
    const bank = this.dataSelectBank.find(x => x.id == d.bank_id);
    const user = this.dataSelectUserTtd.find(x => x.id == d.user_ttd);

    // 🔥 PENTING: enable dulu supaya bisa tampil di UI
    this.entryForm.get('qty_real').enable();

    this.entryForm.patchValue({
      lokasi_id: lokasi,
      customer_id: customer,
      bank_id: bank,
      user_ttd: user,
      jenis_performa: { id: d.jenis_performa, text: d.jenis_performa },

      no_performa: d.no_performa,
      deskripsi: d.deskripsi,
      no_referensi: d.no_referensi,
      kawasan: (d.is_berikat == 1) ? 1 : 0,
      qty: Number(d.qty),
      qty_real: Number(d.qty_real), // 🔥 dari API
      harga_satuan: Number(d.harga_satuan),
      jumlah: Number(d.jumlah),
      diskon: Number(d.diskon),
      uang_muka: Number(d.uang_muka),
      ppn: Number(d.ppn),
      grand_total: Number(d.grand_total),

      tanggal: new Date(d.tanggal),
      tanggal_tempo: new Date(d.tanggal_tempo)
    });

    // 🔥 DETAIL
    if (d.detail) {
      d.detail.forEach(x => {
        this.detailRows.push(this.fb.group({
          rekap_id: x.rekap_id,
          no_rekap: x.no_rekap,
          qty: Number(x.qty),
          harga: Number(x.harga),
          total: Number(x.total),
          keterangan: x.keterangan
        }));
      });
    }

    // 🔥 trigger kontrak load
    if (customer && customer.id) {
      this.entryForm.get('customer_id').setValue(customer);
    }

    // 🔥 HITUNG ULANG TANPA RUSAK qty_real
    this.hitungTotal();
    // 🔥 OPTIONAL: disable lagi kalau bukan UANG MUKA
    if (d.jenis_performa !== 'UANG MUKA') {
      this.entryForm.get('qty_real').disable();
    }
  }
  private loadSelect2(): void {

    this.service.getBank().subscribe(x => {
      this.dataSelectBank = x['data'].map(d => ({
        id: d.id,
        text: d.nama_bank
      }));
      this.loaded.bank = true;
      this.tryPatch();
    });

    this.entryForm.get('customer_id').valueChanges.subscribe(x => {

      if (!x) return;

      this.slsKontrakService.getAllbyCustomer(x.id).subscribe(res => {

        this.kontrak = res['data'];

        // 🔥 isi dulu select2
        this.dataSelectKontrak = res['data'].map(d => ({
          id: d.id,
          text: d.no_spk
        }));

        // 🔥 baru cari selected
        const selected = this.dataSelectKontrak.find(k => k.id == this.accSalesPerforma.sls_kontrak_id);

        if (selected) {
          this.entryForm.patchValue({
            sls_kontrak_id: selected
          });
        }

      });

    });

    this.customerService.getAll().subscribe(x => {
      this.dataSelectCustomer = x['data'].map(d => ({
        id: d.id,
        text: d.nama_customer
      }));
      this.loaded.customer = true;
      this.tryPatch();
    });

    this.organisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = x.map(d => ({
        id: d.id,
        text: d.nama
      }));
      this.loaded.lokasi = true;
      this.tryPatch();
    });

    this.ttdService.getAll().subscribe(x => {
      this.dataSelectUserTtd = x['data'].map(d => ({
        id: d.nama,
        text: d.nama
      }));
      this.loaded.user = true;
      this.tryPatch();
    });
  }

  tryPatch() {
    if (
      this.loaded.bank &&
      this.loaded.customer &&
      this.loaded.lokasi &&
      this.loaded.user
    ) {
      this.patchData();
    }
  }

  // =========================
  // HITUNG TOTAL
  // =========================
  hitungTotal() {

    let jenis = this.getJenisPerforma();

    // ===== QTY =====
    let qty = this.entryForm.get('qty').value || 0;
    if (!isNumber(qty)) {
      qty = parseFloat(qty.toString().replace(/[^\d\.\-]/g, "")) || 0;
    }


    let qty_real = this.entryForm.get('qty_real').value || 0;
    if (!isNumber(qty_real)) {
      qty_real = parseFloat(qty_real.toString().replace(/[^\d\.\-]/g, "")) || 0;
    }
    // ===== HARGA =====
    let harga = this.entryForm.get('harga_satuan').value || 0;
    if (!isNumber(harga)) {
      harga = parseFloat(harga.toString().replace(/[^\d\.\-]/g, "")) || 0;
    }

        // ===== DISKON =====
    let disc = this.entryForm.get('diskon').value || 0;
    if (!isNumber(disc)) {
      disc = parseFloat(disc.toString().replace(/[^\d\.\-]/g, "")) || 0;
    }

    // ===== UANG MUKA =====
    let uang_muka = this.entryForm.get('uang_muka').value || 0;
    if (!isNumber(uang_muka)) {
      uang_muka = parseFloat(uang_muka.toString().replace(/[^\d\.\-]/g, "")) || 0;
    }


    // ===== JUMLAH =====
    let jumlah = 0;
    let dpp = 0;
    let dpp_nilai_lain;

      if (jenis === 'UANG MUKA' || jenis === 'PENGGANTIAN' || jenis === 'TERMIN') {
      let qty_real = this.entryForm.get('qty_real').value || 0;

      if (!isNumber(qty_real)) {
        qty_real = parseFloat(qty_real.toString().replace(/[^\d\.\-]/g, "")) || 0;
      }

      jumlah = qty_real * harga;
      dpp_nilai_lain = (11 / 12) * jumlah;
      dpp = jumlah;
    } else {
      jumlah = qty * harga;
      dpp = jumlah - disc - uang_muka;

    }

    // ===== PPN =====
    let ppn = this.entryForm.get('ppn').value || 0;
    if (!isNumber(ppn)) {
      ppn = parseFloat(ppn.toString().replace(/[^\d\.\-]/g, "")) || 0;
    }

    // =========================================
    // 🔥 DPP NORMAL
    // =========================================




    if (dpp < 0) dpp = 0;

    // =========================================
    // 🔥 DPP NILAI LAIN (11/12)
    // =========================================
    dpp_nilai_lain = (11 / 12) * dpp;

    // =========================================
    // 🔥 PPN
    // =========================================
    let nilai_ppn = (ppn / 100) * dpp_nilai_lain;

    // =========================================
    // 🔥 TOTAL
    // =========================================
    let total = 0;
    let kawasan = this.entryForm.get('kawasan').value;

    if (kawasan == 1) {
      // 🔥 KAWASAN BERIKAT → langsung DPP
      total = dpp;

    } else {
      // 🔥 NON KAWASAN → pakai 11/12 + PPN
      total = dpp + nilai_ppn;
    }

    if (!isFinite(total)) total = 0;

    // =========================================
    // PATCH
    // =========================================
    this.entryForm.patchValue({
      jumlah: formatNumber(jumlah, 'en_US', '1.2-2'),
      uang_muka: formatNumber(uang_muka, 'en_US', '1.2-2'),
      diskon: formatNumber(disc, 'en_US', '1.2-2'),
      qty: formatNumber(qty, 'en_US', '1.2-2'),
      harga_satuan: formatNumber(harga, 'en_US', '1.2-2'),
      dpp: formatNumber(dpp, 'en_US', '1.2-2'),
      dpp_nilai_lain: formatNumber(dpp_nilai_lain, 'en_US', '1.2-2'),
      ppn_rp: formatNumber(nilai_ppn, 'en_US', '1.2-2'), // 🔥 TAMBAHAN

      grand_total: formatNumber(total, 'en_US', '1.2-2')
    });

  }
  // =========================
  // UPDATE HEADER DARI DETAIL
  // =========================
  updateHeaderTotals(isPatch: boolean = false) {

    let totalQty = 0;
    let totalHarga = 0;
    let totalJumlah = 0;

    this.detailRows.value.forEach(d => {
      totalQty += Number(d.qty);
      totalHarga = d.harga;
      totalJumlah += Number(d.total);
    });

    let jenis = this.getJenisPerforma();

    let patch: any = {
      qty: totalQty,
      harga_satuan: totalHarga,
      jumlah: totalJumlah,
    };

    // 🔥 PENTING: jangan overwrite qty_real kalau UANG MUKA
    if (!isPatch && jenis !== 'UANG MUKA') {
      patch.qty_real = totalQty;
    }

    this.entryForm.patchValue(patch);

    this.hitungTotal();
  }

  get userControl() { return this.entryForm.controls; }


  // =========================
  // SUBMIT
  // =========================
  onSubmit() {
    this.isFormSubmitted = true;


    if (this.entryForm.invalid) return;

    let data = this.entryForm.getRawValue();

    // 🔥 FIX STRUCTURE (WAJIB)
    data.lokasi_id = { id: data.lokasi_id.id || data.lokasi_id };
    data.customer_id = { id: data.customer_id.id || data.customer_id };
    data.jenis_performa = { id: data.jenis_performa.id || data.jenis_performa };
    data.user_ttd = { id: data.user_ttd.id || data.user_ttd };

    // 🔥 FORMAT DATE
    data.tanggal = formatDate(data.tanggal, 'yyyy-MM-dd', 'en_US');
    data.tanggal_tempo = formatDate(data.tanggal_tempo, 'yyyy-MM-dd', 'en_US');

    // 🔥 DETAIL
    data.detail = this.detailRows.value.map(d => ({
      rekap_id: d.rekap_id,
      qty: this.parse(d.qty),
      harga: this.parse(d.harga),
      total: this.parse(d.total),
      keterangan: d.keterangan
    }));

    console.log('UPDATE PAYLOAD:', data);

    this.service.update(this.accSalesPerforma.id, data).subscribe({
      next: (res: any) => {
        if (res.status === 'OK') {
          swal("Berhasil", "Data disimpan", "success");
          this.event.emit('OK');
          this.bsModalRef.hide();
        } else {
          swal("Gagal", "Tidak bisa simpan", "error");
        }
      },
      error: err => {
        console.error(err);
        swal("Error", "Server error", "error");
      }
    });
  }

  // =========================
  // BANK AUTO
  // =========================
  handleBankAutoFill() {
    this.entryForm.get('bank_id').valueChanges.subscribe(val => {

      this.entryForm.patchValue({
        no_rekening: '',
        atas_nama: '',
        cabang_bank: ''
      }, { emitEvent: false });

      if (!val) return;

      const map = this.bankMapping[val.text];

      if (map) {
        this.entryForm.patchValue({
          no_rekening: map.no_rekening,
          atas_nama: map.atas_nama,
          cabang_bank: map.cabang_bank
        }, { emitEvent: false });
      }
    });
  }

  // =========================
  // UTIL
  // =========================
  parse(val) {
    if (!val) return 0;
    return parseFloat(val.toString().replace(/,/g, '')) || 0;
  }

  removeDetail(i) {
    this.detailRows.removeAt(i);
    this.updateHeaderTotals();
  }

  showRekap() {

    const customer = this.entryForm.get('customer_id').value;

    if (!customer || !customer.id) {
      swal("Warning", "Pilih customer dulu", "warning");
      return;
    }

    const modal = this.bsModalService.show(LookupRekapComponent, {
      class: 'modal-lg',
      initialState: {
        customer_id: customer.id, //  WAJIB
        selectedRekap: this.detailRows.value
      }
    });

    modal.content.event.subscribe(data => {

      data.forEach(r => {

        const exists = this.detailRows.value.find(x => x.rekap_id == r.id);

        if (!exists) {
          this.detailRows.push(this.fb.group({
            rekap_id: r.id,
            no_rekap: r.no_rekap,
            qty: r.qty,
            harga: r.harga,
            total: r.total,
            keterangan: `Rekap ${r.no_rekap}`
          }));
        }

      });

      this.updateHeaderTotals();
    });
  }
  valueChange($event) {

    this.hitungTotal();

  }

  KontrakChange(event) {

    // ❗ STOP kalau lagi edit (biar gak override dari DB)
    if (this.isEditMode) return;

    if (!this.kontrak || this.kontrak.length === 0) return;

    const d = this.kontrak.find(x => x.id == event.id);
    if (!d) return;

    let jenis = this.getJenisPerforma();

    if (jenis === 'UANG MUKA' || jenis === 'PENGGANTIAN' || jenis === 'TERMIN') {
      this.entryForm.patchValue({
        qty: 0,
        qty_real: formatNumber(d.jumlah, 'en_US', '1.2-2'),
        harga_satuan: formatNumber(d.harga_satuan, 'en_US', '1.2-2')
      });

      this.entryForm.get('qty_real').enable();
    }

    this.entryForm.patchValue({
      deskripsi: `${d.nama_item} Partai ${formatNumber(d.jumlah, 'en_US', '1.2-2')} Kg. No Kontrak: ${d.no_spk}`,
      no_referensi: d.no_spk
    });

    this.hitungTotal();
  }

  getJenisPerforma() {
    const val = this.entryForm.get('jenis_performa').value;

    if (val && val.id) {
      return val.id;
    }

    return '';
  }

  onClose() {
    if (!this.entryForm.dirty) {
      // form belum diapa-apakan → langsung close
      this.bsModalRef.hide();
      return;
    }

    // form sudah ada isi / perubahan → munculkan swal
    let that = this;
    swal({
      title: 'Yakin akan Menutup?',
      text: "Data yang sudah diinput akan hilang!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      buttonsStyling: false
    }).then(function () {
      that.bsModalRef.hide();
    });
  }
}