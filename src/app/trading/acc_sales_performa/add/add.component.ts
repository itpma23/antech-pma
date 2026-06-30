import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { AccSalesPerformaService } from 'src/app/shared/services/acc_sales_performa.service';
import { SlsKontrakService } from 'src/app/shared/services/sls_kontrak.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { GbmCustomerService } from 'src/app/shared/services/gbm_customer.service';
import { formatDate, formatNumber } from '@angular/common';

import { PrcPoTTDService } from 'src/app/shared/services/prc_po_ttd.service';
import { LookupRekapComponent } from '../lookup-rekap/lookup-rekap.component';
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
import 'bootstrap-notify';
import { isNumber } from 'util';

declare var $: any;
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'add-cmp',
  templateUrl: 'add.component.html',
  styleUrls: ['add.component.css'],
})

export class AddComponent implements OnInit, AfterViewInit {
  isFormSubmitted = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();

  public dataSelectMill: any[] = [];
  public dataSelectItem: any[] = [];
  public dataSelectCustomer: any[] = [];


  public options: any;
  dataSelectLokasi: any;
  dataSelectJenisPerforma: { id: string; text: string; }[];
  dataSelectKontrak: any[];
  dataSelectAkunDebet: any;
  dataSelectAkunKredit: any[];
  dataSelectUserTtd: any[];
  dataSelectBank: any[];
  selectedKontrak: any = null;
  kontrak: any[];

  bankMapping: any = {
    'BANK BNI': {
      no_rekening: '5577779898',
      atas_nama: 'PT PALM MAS ASRI',
      cabang_bank: 'ROA MALAKA'
    }
  };

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private bsModalRef1: BsModalRef,
    private bsModalService: BsModalService,
    private slsPerforma: AccSalesPerformaService,
    private slsKontrakService: SlsKontrakService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private GbmCustomerService: GbmCustomerService,
    private accAkunService: AccAkunService,
    private PrcPoTTDService: PrcPoTTDService,

  ) {
    let toDate: Date = new Date();

    this.entryForm = this.builder.group({
      lokasi_id: new FormControl([], Validators.required),
      sls_kontrak_id: new FormControl([]),
      customer_id: new FormControl([], Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      tanggal_tempo: new FormControl(toDate, Validators.required),
      no_performa: new FormControl('Autonumber'),
      kawasan: new FormControl(null),
      jenis_performa: new FormControl([], Validators.required),
      // acc_akun_id_debet: new FormControl([], Validators.required),
      // acc_akun_id_kredit: new FormControl([], Validators.required),

      deskripsi: new FormControl([], Validators.required),
      no_referensi: new FormControl('',),
      ppn_rp: new FormControl({ value: 0, disabled: true }),
      qty_real: new FormControl(0),


      qty: new FormControl(null),
      harga_satuan: new FormControl(null),
      dpp_nilai_lain: new FormControl({ value: 0, disabled: true }),
      jumlah: new FormControl(null),
      diskon: new FormControl(0),
      uang_muka: new FormControl(0),
      dpp: new FormControl(0,),
      ppn: new FormControl(0, Validators.required),
      grand_total: new FormControl(0, Validators.required),

      user_ttd: new FormControl([], Validators.required),
      bank_id: new FormControl([], Validators.required),

      no_rekening: new FormControl('', Validators.required),
      atas_nama: new FormControl('', Validators.required),
      cabang_bank: new FormControl('', Validators.required),

      detail: this.builder.array([]),
    });

    this.disableAutoFields();

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }

  get detailRows() {
    return this.entryForm.get('detail') as FormArray;
  }
  private loadSelect2(): void {
    this.dataSelectJenisPerforma = [
      { id: 'JUMLAH HARGA JUAL', text: 'JUMLAH HARGA JUAL' },
      { id: 'PENGGANTIAN', text: 'PENGGANTIAN' },
      { id: 'UANG MUKA', text: 'UANG MUKA' },
      { id: 'TERMIN', text: 'TERMIN' },

    ];


    this.PrcPoTTDService.getAll().subscribe(x => {
      this.dataSelectUserTtd = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectUserTtd.push({ "id": d.nama, "text": d.nama });
      });
    });

    this.slsPerforma.getBank().subscribe(x => {
      this.dataSelectBank = [];
      let i = x['data'];

      i.forEach(d => {
        this.dataSelectBank.push({ "id": d.id, "text": d.nama_bank });
      });

      // 🔥 WAJIB DISINI
      this.setDefaultBank();
    });
    // this.accAkunService.getAllDetail().subscribe(x => {
    //   this.dataSelectAkunDebet = [];
    //   let i = x['data'];
    //   i.forEach(d => {
    //     this.dataSelectAkunDebet.push({ "id": d.id, "text": d.kode + ' - ' + d.nama  });
    //   });
    // });
    // this.accAkunService.getAllDetail().subscribe(x => {
    //   this.dataSelectAkunKredit = [];
    //   let i = x['data'];
    //   i.forEach(d => {
    //     this.dataSelectAkunKredit.push({ "id": d.id, "text": d.kode + ' - ' + d.nama  });
    //   });
    // });
    this.GbmCustomerService.getAll().subscribe(x => {

      this.dataSelectCustomer = [];
      x['data'].forEach(d => {
        this.dataSelectCustomer.push({ "id": d.id, "text": d.kode_customer + " - " + d.nama_customer });
      });
    });
    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {

      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });

    });

    let customer_id;
    this.entryForm.controls['customer_id'].valueChanges.subscribe(x => {
      customer_id = x.id;
      this.slsKontrakService.getAllbyCustomer(customer_id).subscribe(x => {
        this.dataSelectKontrak = [];
        this.kontrak = [];
        x['data'].forEach(d => {
          this.dataSelectKontrak.push({ "id": d.id, "text": d.no_spk });
          this.kontrak.push(d);
        });
        console.log(this.kontrak)
      });

    });


  }


  showRekap() {
    let modalConfig = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-lg",
      initialState: {
        customer_id: this.entryForm.get('customer_id').value.id
      }
    };

    this.bsModalRef1 = this.bsModalService.show(LookupRekapComponent, modalConfig);

    this.bsModalRef1.content.event.subscribe((rekapArray) => {
      if (!rekapArray || rekapArray.length == 0) return;

      rekapArray.forEach(r => this.addRekapToDetail(r));

      this.updateDeskripsiHeader();
      this.updateHeaderTotals();
    });
  }

  showNotification(from, align, message, color = 4) {
    var type = ['', 'info', 'success', 'warning', 'danger', 'rose', 'primary'];
    console.log(type[color]);
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






  onSubmit() {
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) return;

    let frmData = this.entryForm.getRawValue();

    frmData['tanggal'] = formatDate(
      this.entryForm.get('tanggal').value,
      "yyyy-MM-dd",
      'en_US'
    );

    // 🔥 HEADER
    frmData['grand_total'] = this.parseNumber(this.entryForm.get('grand_total').value);
    frmData['jumlah'] = this.parseNumber(this.entryForm.get('jumlah').value);
    frmData['uang_muka'] = this.parseNumber(this.entryForm.get('uang_muka').value);
    frmData['diskon'] = this.parseNumber(this.entryForm.get('diskon').value);
    frmData['qty'] = this.parseNumber(this.entryForm.get('qty').value);
    frmData['harga_satuan'] = this.parseNumber(this.entryForm.get('harga_satuan').value);

    // 🔥 DETAIL
    frmData.detail = this.detailRows.value.map(d => ({
      rekap_id: d.rekap_id,
      qty: this.parseNumber(d.qty),
      harga: this.parseNumber(d.harga),
      total: this.parseNumber(d.total),
      keterangan: d.keterangan
    }));

    console.log('PAYLOAD:', frmData);

    this.slsPerforma.create(frmData).subscribe({

      // ✅ SUCCESS
      next: (res: any) => {

        if (res.status === 'OK') {

          swal({
            title: 'Berhasil!',
            text: 'Data berhasil disimpan',
            type: 'success',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          });

          this.event.emit('OK');
          this.bsModalRef.hide();

        } else {

          // 🔥 LOG DETAIL ERROR KE CONSOLE
          console.error('BACKEND ERROR:', res);

          // ❗ USER HANYA LIHAT PESAN UMUM
          swal({
            title: 'Gagal!',
            text: 'Terjadi kesalahan saat menyimpan data',
            type: 'error',
            confirmButtonClass: "btn btn-danger",
            buttonsStyling: false
          });

        }
      },

      // ❌ HTTP ERROR (500, dll)
      error: (err) => {

        console.error('SERVER ERROR DETAIL:', err);

        swal({
          title: 'Server Error!',
          text: 'Terjadi kesalahan pada server',
          type: 'error',
          confirmButtonClass: "btn btn-danger",
          buttonsStyling: false
        });

      }

    });
  }
  KontrakChange(event) {
    const d = this.kontrak.find(x => x.id == event.id);
    if (!d) return;

    let jenis = this.getJenisPerforma();

    if (jenis === 'UANG MUKA') {
      // 🔥 pakai qty_real
      this.entryForm.patchValue({
        qty: 0,
        qty_real: formatNumber(d.jumlah, 'en_US', '1.2-2'),
        harga_satuan: formatNumber(d.harga_satuan, 'en_US', '1.2-2')
      });

      // enable qty_real
      this.entryForm.get('qty_real').enable();

    }

    this.entryForm.patchValue({
      deskripsi: `${d.nama_item} Partai ${formatNumber(d.jumlah, 'en_US', '1.2-2')} Kg. No Kontrak: ${d.no_spk}`,
      no_referensi: d.no_spk
    });

    this.hitungTotal();
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

  ngOnInit() {

    this.loadSelect2();

    this.entryForm.get('jenis_performa').valueChanges.subscribe(val => {

      let jenis = this.getJenisPerforma();

      if (jenis === 'UANG MUKA' || jenis === 'PENGGANTIAN' || jenis === 'TERMIN') {

        this.entryForm.patchValue({
          qty: 0
        });

        this.entryForm.get('qty_real').enable();

      } else {

        this.entryForm.patchValue({
          qty_real: 0
        });

        this.entryForm.get('qty_real').disable();
      }

      this.hitungTotal();
    });

    this.entryForm.get('bank_id').valueChanges.subscribe(val => {

      this.entryForm.patchValue({
        no_rekening: '',
        atas_nama: '',
        cabang_bank: ''
      });

      if (!val) return;

      const mapping = this.bankMapping[val.text];

      if (mapping) {
        this.entryForm.patchValue({
          no_rekening: mapping.no_rekening,
          atas_nama: mapping.atas_nama,
          cabang_bank: mapping.cabang_bank
        });
      }

    });

    this.entryForm.get('kawasan').valueChanges.subscribe(val => {
      this.hitungTotal();
    });

  }
  resetKontrakEffect() {
    console.log('Mode: JUMLAH HARGA JUAL');

    // kosongkan input dari kontrak
    this.entryForm.patchValue({
      qty: 0,
      harga_satuan: 0,
      jumlah: 0
    });

    // 🔥 ambil dari rekap
    this.updateHeaderTotals();
  }

  handleUangMukaMode() {
    console.log('Mode: UANG MUKA');

    // pastikan tidak NaN
    let uangMuka = this.entryForm.get('uang_muka').value || 0;

    if (!isNumber(uangMuka)) {
      uangMuka = parseFloat(uangMuka.toString().replace(/[^\d\.\-]/g, "")) || 0;
    }

    // kalau ada kontrak, tetap pakai qty & harga dari kontrak
    // if (this.selectedKontrak) {
    //   this.applyKontrak(this.selectedKontrak);
    // }

    //this.hitungTotal();
  }
  valueChange($event) {

    this.hitungTotal();

  }
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
  formatNumbering(form) {
    let debet = form.get('debet').value
    let kredit = form.get('kredit').value
    if (!isNumber(debet)) {
      debet = parseFloat(debet.replace(/[^\d\.\-]/g, ""));
    }
    if (!isNumber(kredit)) {
      kredit = parseFloat(kredit.replace(/[^\d\.\-]/g, ""));
    }
    form.get('debet').patchValue(formatNumber(debet, 'en_US', '1.2-2'));
    form.get('kredit').patchValue(formatNumber(kredit, 'en_US', '1.2-2'));

  }
  nilaiInvoiceChange(event) {
    let total = this.entryForm.get('grand_total').value;
    if (!isNumber(total)) {
      total = parseFloat(total.replace(/[^\d\.\-]/g, ""));
    }
    this.entryForm.get('grand_total').patchValue(formatNumber(total, 'en_US', '1.2-2'));


  }

  updateDeskripsiHeader() {
    const list = this.detailRows.value.map(x => x.no_rekap);
    const desc = 'Penjualan produk dengan No Rekap: ' + list.join(', ');
    this.entryForm.patchValue({ deskripsi: desc });
  }
  updateHeaderTotals() {
    let totalQty = 0;
    let totalHarga = 0;
    let totalJumlah = 0;

    this.detailRows.value.forEach(d => {
      totalQty += Number(d.qty);
      totalHarga = d.harga;
      totalJumlah += Number(d.total);
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

  addRekapToDetail(rekap) {
    const fg = this.builder.group({
      rekap_id: [rekap.id],
      no_rekap: [rekap.no_rekap],
      qty: [rekap.qty],
      harga: [rekap.harga],
      total: [rekap.total],
      keterangan: [`Penjualan produk dengan No Rekap ${rekap.no_rekap}`]
    });

    this.detailRows.push(fg);
  }
  applyKontrak(event) {
    this.kontrak.forEach(d => {
      if (event.id == d.id) {
        this.entryForm.patchValue({
          qty: formatNumber(d.jumlah, 'en_US', '1.2-2'),
          harga_satuan: formatNumber(d.harga_satuan, 'en_US', '1.2-2'),
          deskripsi: d.nama_item + ' Partai ' + formatNumber(d.jumlah, 'en_US', '1.2-2') + 'Kg. NoSPK:' + d.no_spk
        });

        this.hitungTotal();
      }
    });
  }

  getJenisPerforma() {
    var val = this.entryForm.get('jenis_performa').value;

    if (val && val.id) {
      return val.id;
    }

    return '';
  }

  disableAutoFields() {
    this.entryForm.get('jumlah').disable(); // hanya jumlah
    this.entryForm.get('qty').disable(); // hanya jumlah

  }
  getJenisInvoice() {
    var val = this.entryForm.get('jenis_invoice').value;

    if (val && val.id) {
      return val.id;
    }

    return val;
  }

  parseNumber(val: any): number {
    if (val === null || val === undefined || val === '') return 0;

    if (typeof val === 'number') return val;

    // kalau string formatNumber (1,234.56)
    let clean = val.toString().replace(/,/g, '');

    return parseFloat(clean) || 0;
  }
  setDefaultBank() {
    if (!this.dataSelectBank || this.dataSelectBank.length === 0) return;

    const defaultBank = this.dataSelectBank.find(x => x.text === 'BANK BNI');

    if (defaultBank) {

      // 🔥 set select2 value
      this.entryForm.patchValue({
        bank_id: defaultBank
      });

      // 🔥 isi otomatis dari mapping
      const mapping = this.bankMapping[defaultBank.text];

      if (mapping) {
        this.entryForm.patchValue({
          no_rekening: mapping.no_rekening,
          atas_nama: mapping.atas_nama,
          cabang_bank: mapping.cabang_bank
        });
      }
    }
  }
}
