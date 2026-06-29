import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { AccSalesInvoiceService } from 'src/app/shared/services/acc_sales_invoice.service';
import { SlsKontrakService } from 'src/app/shared/services/sls_kontrak.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { GbmCustomerService } from 'src/app/shared/services/gbm_customer.service';
import { PrcPoTTDService } from 'src/app/shared/services/prc_po_ttd.service';
import { formatDate, formatNumber } from '@angular/common';

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
  dataSelectJenisInvoice: { id: string; text: string; }[];
  dataSelectKontrak: any[];
  dataSelectAkunDebet: any;
  dataSelectAkunKredit: any[];
  dataSelectUserTtd: any[];
  kontrak: any[];
  rekapList: any[] = [];


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private bsModalRef1: BsModalRef,
    private bsModalService: BsModalService,
    private slsInvoice: AccSalesInvoiceService,
    private slsKontrakService: SlsKontrakService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private GbmCustomerService: GbmCustomerService,
    private PrcPoTTDService: PrcPoTTDService,
    private accAkunService: AccAkunService,


  ) {
    let toDate: Date = new Date();

    this.entryForm = this.builder.group({
      lokasi_id: new FormControl([], Validators.required),
      sls_kontrak_id: new FormControl([], Validators.required),
      customer_id: new FormControl([], Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      tanggal_tempo: new FormControl(toDate, Validators.required),
      no_invoice: new FormControl('AutoNumber'),
      jenis_invoice: new FormControl([], Validators.required),
      acc_akun_id_debet: new FormControl([], Validators.required),
      acc_akun_id_kredit: new FormControl([], Validators.required),

      deskripsi: new FormControl([], Validators.required),
      no_referensi: new FormControl(''),

      qty: new FormControl(0, Validators.required),
      qty_real: new FormControl(0, Validators.required),
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
      detail: this.builder.array([]),
    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }


  private loadSelect2(): void {
    this.dataSelectJenisInvoice = [
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

    this.slsInvoice.getAllAkunDebetSalesInvoice().subscribe(x => {
      this.dataSelectAkunDebet = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectAkunDebet.push({ "id": d.acc_akun_id, "text": d.kode_akun + ' - ' + d.nama_akun });
      });
    });
    this.slsInvoice.getAllAkunKreditSalesInvoice().subscribe(x => {
      this.dataSelectAkunKredit = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectAkunKredit.push({ "id": d.acc_akun_id, "text": d.kode_akun + ' - ' + d.nama_akun });
      });
    });
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
    if (this.entryForm.invalid) {
      return;
    }

    let frmData = this.entryForm.getRawValue();;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');

frmData['grand_total'] = this.entryForm.get('grand_total').value;
frmData['jumlah'] = this.entryForm.get('jumlah').value;
frmData['uang_muka'] = this.entryForm.get('uang_muka').value;
frmData['diskon'] = this.entryForm.get('diskon').value;
frmData['qty'] = this.entryForm.get('qty').value;
frmData['qty_real'] = this.entryForm.get('qty_real').value;
frmData['harga_satuan'] = this.entryForm.get('harga_satuan').value;
frmData['premi'] = this.entryForm.get('premi').value;
    console.log(frmData);

    this.slsInvoice.create(frmData).subscribe(data => {
      // console.log(data);
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

  get detailRows() {
    return this.entryForm.get('detail') as FormArray;
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
    let harga = this.entryForm.get('harga_satuan').value;
    if (!isNumber(harga)) {
      harga = parseFloat(harga.replace(/[^\d\.\-]/g, ""));
    }

    let qty = this.entryForm.get('qty').value;
    if (!isNumber(qty)) {
      qty = parseFloat(qty.replace(/[^\d\.\-]/g, ""));
    }

    let qty_real = this.entryForm.get('qty_real').value;
    if (!isNumber(qty_real)) {
      qty_real = parseFloat(qty_real.replace(/[^\d\.\-]/g, ""));
    }

    let jumlah = 0;

    // 🔥 BEDANYA DI SINI
    if (jenis === 'UANG MUKA') {
      jumlah = qty_real * harga;
    } else {
      jumlah = qty * harga;
    }

    let disc = this.entryForm.get('diskon').value;
    if (!isNumber(disc)) {
      disc = parseFloat(disc.replace(/[^\d\.\-]/g, ""));
    }

    let uang_muka = this.entryForm.get('uang_muka').value;
    if (!isNumber(uang_muka)) {
      uang_muka = parseFloat(uang_muka.replace(/[^\d\.\-]/g, ""));
    }

    let premi = this.entryForm.get('premi').value;
    if (!isNumber(premi)) {
      premi = parseFloat(premi.replace(/[^\d\.\-]/g, ""));
    }

    let dpp = 0;

    if (jenis === 'UANG MUKA') {
      // 🔥 uang muka TIDAK dipakai
      dpp = jumlah + premi - disc;
    } else {
      dpp = jumlah + premi - disc - uang_muka;
    }

    let ppn = parseFloat(this.entryForm.get('ppn').value) || 0;
    let nilai_ppn = (ppn / 100) * dpp;
    let total = dpp + nilai_ppn;

    this.entryForm.patchValue({
      jumlah: formatNumber(jumlah, 'en_US', '1.2-2'),
      dpp: formatNumber(dpp, 'en_US', '1.2-2'),
      grand_total: formatNumber(total, 'en_US', '1.2-2'),
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
  KontrakChange(event) {
    const d = this.kontrak.find(x => x.id == event.id);
    if (!d) return;

    var jenis = this.getJenisInvoice();
    if (jenis === 'UANG MUKA') {
      this.entryForm.patchValue({
        qty: 0,
        harga_satuan: formatNumber(d.harga_satuan, 'en_US', '1.2-2'),
        // qty_real BIAR USER INPUT MANUAL
      });
    } else {
      this.entryForm.patchValue({
        qty: formatNumber(d.jumlah, 'en_US', '1.2-2'),
        harga_satuan: formatNumber(d.harga_satuan, 'en_US', '1.2-2'),
        qty_real: formatNumber(d.jumlah, 'en_US', '1.2-2')
      });
    }

    this.entryForm.patchValue({
      deskripsi: `${d.nama_item} Partai ${formatNumber(d.jumlah, 'en_US', '1.2-2')} Kg. No Kontrak: ${d.no_spk}`,
      no_referensi: d.no_spk
    });

    this.hitungTotal();
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


  getJenisInvoice() {
    var val = this.entryForm.get('jenis_invoice').value;

    if (val && val.id) {
      return val.id;
    }

    return val;
  }

}
