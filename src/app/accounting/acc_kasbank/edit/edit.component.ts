import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { formatDate, formatNumber } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { AccKasbankService } from 'src/app/shared/services/acc_kasbank.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { AccKasbank } from 'src/app/shared/models/acc_kasbank.model';
import { AccKegiatanService } from 'src/app/shared/services/acc_kegiatan.service';
import { TrkKendaraanService } from 'src/app/shared/services/trk_kendaraan.service';
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
import { AccPermintaanDanaService } from 'src/app/shared/services/acc_permintaan_dana.service';
import { AccPermohonanBayarV2Service, JurnalPermohonanResponse } from 'src/app/shared/services/acc_permohonan_bayar_v2.service';

import { isNumber } from 'util';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { LookupPermohonanComponent } from '../lookup-permohonan-pembayaran/lookup-permohonan-pembayaran.component';

declare var swal: any;

@Component({
  moduleId: module.id,
  selector: 'edit-cmp',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.css'],
})
export class EditComponent implements OnInit, AfterViewInit {

  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();

  accKasbank: AccKasbank;

  awalanHeading = "heading_";
  awalanCollapse = "collapse_";

  permohonanIds: number[] = [];

  dataSelectLokasi = [];
  dataSelectLokasiDetail = [];
  dataSelectPermintaan = [];
  dataSelectPermohonanBayar = [];
  dataSelectAkunKasbank = [];
  dataSelectAkun = [];
  dataSelectTraksi = [];
  dataSelectBlok = [];
  isFormSubmitted = false;

  dataSelectKegiatan = [];

  dataSelectTipeJurnal = [];
  dataSelectTipePembayaran = [];
  dataSelectSumberDokumen = [];
  dataSelectSupplier = [];
  showPermohonanBayar: boolean;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  selectedJenisPermohonan: any;
  sumberDoc: any;

  constructor(
    private bsModalRef1: BsModalRef,
    private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private bsModalService: BsModalService,
    private AccKasbankService: AccKasbankService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private GbmSupplierService: GbmSupplierService,
    private accKegiatanService: AccKegiatanService,
    private trkKendaraanService: TrkKendaraanService,
    private accAkunService: AccAkunService,
    private translate: TranslateService,
    private accPermintaanDanaService: AccPermintaanDanaService,
    private accPermohonanPembayaranV2Service: AccPermohonanBayarV2Service
  ) {

    let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      tanggal: new FormControl(toDate, Validators.required),
      keterangan: new FormControl(''),
      no_transaksi: new FormControl(''),
      no_referensi: new FormControl(''),
      ref_id: new FormControl(''),

      lokasi_id: new FormControl([], Validators.required),

      permintaan_id: new FormControl([]),
      permohonan_id: new FormControl([]),
      supplier_id: new FormControl([]),

      akun_kasbank_id: new FormControl([], Validators.required),

      nilai: new FormControl(0, Validators.required),

      sumber_dokumen: new FormControl([], Validators.required),
      tipe_bayar: new FormControl([], Validators.required),
      tipe_jurnal: new FormControl([], Validators.required),

      details: this.builder.array([])

    });

  }

  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  }

  ngOnInit() {

    this.loadSelect2();

    this.entryForm.get('supplier_id').valueChanges.subscribe(val => {

      if (!val) return;

      const supplier_id = val.id;

      this.loadPermohonanSupplier(supplier_id);

    });

  }

  ngAfterViewInit(): void {

    if (!this.accKasbank) return;

    this.entryForm.patchValue({
      tanggal: new Date(this.accKasbank.tanggal),
      keterangan: this.accKasbank.keterangan,
      no_transaksi: this.accKasbank.no_transaksi,
      no_referensi: this.accKasbank.no_referensi,
      ref_id: this.accKasbank.ref_id,
      nilai: formatNumber(parseFloat(this.accKasbank.nilai), 'en_US', '1.2-2')
    });

if (
  this.accKasbank['permohonan_ids'] &&
  this.permohonanIds.length === 0
) {

  this.permohonanIds = [...this.accKasbank['permohonan_ids']];

  let text = '';

  this.permohonanIds.forEach(id => {

    const p = this.dataSelectPermohonanBayar.find(x => x.id == id);

    if (p) {
      if (text !== '') text += '\n';
      text += p.text;
    }

  });

  this.entryForm.get('permohonan_id').patchValue(text);

}

    /* =============================
   TAMPILKAN PERMOHONAN JIKA OUT
============================== */

    if (this.accKasbank.tipe_jurnal === 'out') {
      this.showPermohonanBayar = true;
    } else {
      this.showPermohonanBayar = false;
    }


  }

  private loadSelect2(): void {

    /* ==========================
     * STATIC SELECT
     * ========================== */
    this.dataSelectTipeJurnal = [
      { id: 'in', text: 'PENERIMAAN' },
      { id: 'out', text: 'PEMBAYARAN/PENGELUARAN' },
    ];

    this.dataSelectTipePembayaran = [
      { id: 'CASH', text: 'CASH' },
      { id: 'TRANSFER', text: 'TRANSFER' },
      { id: 'GIRO', text: 'GIRO' },
      { id: 'CHEQUE', text: 'CHEQUE' },
    ];

    this.dataSelectSumberDokumen = [
      { id: 'NONE', text: 'NONE' },
      { id: 'INVOICE_AP', text: 'INVOICE AP/PEMBELIAN (SUPPLIER)' },
      { id: 'INVOICE_AR', text: 'INVOICE AR/PENJUALAN (CUSTOMER)' },
      { id: 'BAPP_SEWA_KENDARAAN', text: 'BAPP SPK SEWA KENDARAAN' },
      { id: 'INVOICE_TBS', text: 'INVOICE PEMBELIAN TBS' },
      { id: 'KUITANSI_PEMBELIAN_T', text: 'KUITANSI PEMBELIAN TBS' },
      { id: 'BAPP_SPK_KEBUN', text: 'BAPP SPK KEBUN' },
      { id: 'INVOICE_ANGKUT_CPO', text: 'INVOICE ANGKUT CPO/PK' },
      { id: 'PERMINTAAN_DANA', text: 'PERMINTAAN DANA' },
      { id: 'UANG_MUKA', text: 'UANG MUKA' },
    ];

    /* ==========================
     * PATCH HEADER
     * ========================== */
    this.entryForm.get('tipe_jurnal').patchValue(
      this.dataSelectTipeJurnal.find(x => x.id === this.accKasbank.tipe_jurnal)
    );

    this.entryForm.get('tipe_bayar').patchValue(
      this.dataSelectTipePembayaran.find(x => x.id === this.accKasbank.tipe_bayar)
    );

    this.entryForm.get('sumber_dokumen').patchValue(
      this.dataSelectSumberDokumen.find(x => x.id === this.accKasbank.sumber_dokumen)
    );

    /* ==========================
     * AKUN KASBANK
     * ========================== */
    this.accAkunService.getAllKasbank().subscribe(res => {

      this.dataSelectAkunKasbank = [];
      let selected = null;

      res['data'].forEach(a => {
        const obj = {
          id: a.id,
          text: a.kode + ' - ' + a.nama
        };

        this.dataSelectAkunKasbank.push(obj);

        if (String(this.accKasbank.akun_kasbank_id) === String(a.id)) {
          selected = obj;
        }
      });

      if (selected) {
        this.entryForm.get('akun_kasbank_id').patchValue(selected);
      }
    });

    /* ==========================
     * LOKASI
     * ========================== */
    this.gbmOrganisasiService.getAllByType('UNIT').subscribe(x => {

      this.dataSelectLokasi = [];
      this.dataSelectLokasiDetail = [];

      x.forEach(d => {
        const obj = { id: d.id, text: d.nama };

        this.dataSelectLokasi.push(obj);
        this.dataSelectLokasiDetail.push(obj);

        if (String(this.accKasbank.lokasi_id) === String(d.id)) {
          this.entryForm.get('lokasi_id').patchValue(obj);
        }
      });

    });

    /* ==========================
     * SUPPLIER
     * ========================== */
    this.GbmSupplierService.getAll().subscribe(res => {

      this.dataSelectSupplier = [];

      res['data'].forEach(d => {

        const obj = {
          id: d.id,
          text: d.nama_supplier
        };

        this.dataSelectSupplier.push(obj);

        if (String(this.accKasbank['supplier_id']) === String(d.id)) {
          this.entryForm.get('supplier_id').patchValue(obj);
          this.loadPermohonanSupplier(d.id);
        }

      });

    });

    /* ==========================
     * MASTER DETAIL (WAJIB DULU)
     * ========================== */
    this.trkKendaraanService.getAll().subscribe(resTraksi => {

      this.dataSelectTraksi = [];

      resTraksi['data'].forEach(d => {
        this.dataSelectTraksi.push({
          id: d.id,
          text: d.kode + '-' + d.nama + '(' + d.traksi + ')'
        });
      });

      this.gbmOrganisasiService.getAllByType('BLOK_MESIN').subscribe(resBlok => {

        this.dataSelectBlok = [];

        resBlok.forEach(d => {
          this.dataSelectBlok.push({
            id: d.id,
            text: d.kode + ' - ' + d.nama + '(' + d.nama_parent + ')'
          });
        });

        this.accKegiatanService.getAll().subscribe(resKegiatan => {

          this.dataSelectKegiatan = [];

          resKegiatan['data'].forEach(d => {
            this.dataSelectKegiatan.push({
              id: d.id,
              text: d.nama + ' (' + d.kode + ')'
            });
          });

          /* ==========================
           * LOAD DETAIL (TERAKHIR)
           * ========================== */
          const detailForm = this.entryForm.get('details') as FormArray;
          detailForm.clear();

          const dtl: any[] = this.accKasbank.detail || [];

          for (let i = 0; i < dtl.length; i++) {

            const d = dtl[i];

            this.addBlok(
              d.lokasi_id,
              d.acc_akun_id,
              d.kendaraan_mesin_id,
              d.blok_stasiun_id,
              d.kegiatan_id,
              d.debet,
              d.kredit,
              d.ket,
              d.invoice_id
            );

          }

          // this.hitungNilai();

        });

      });

    });

  }

  addBlok(lokasi_id, acc_akun_id, traksi_id, blok_id, kegiatan_id, debet, kredit, ket, invoice_id) {

  this.accAkunService.getAllByLokasiId(lokasi_id).subscribe(res => {

    this.dataSelectAkun[lokasi_id] = [];

    let selectedAkun = null;

    res['data'].forEach(a => {

      const obj = {
        id: a.id,
        text: a.kode + ' - ' + a.nama
      };

      this.dataSelectAkun[lokasi_id].push(obj);

      if (String(acc_akun_id) === String(a.id)) {
        selectedAkun = obj;
      }

    });

    let selectedTraksi = null;

    this.dataSelectTraksi.forEach(a => {
      if (String(traksi_id) === String(a.id)) {
        selectedTraksi = a;
      }
    });

    let selectedBlok = null;

    this.dataSelectBlok.forEach(a => {
      if (String(blok_id) === String(a.id)) {
        selectedBlok = a;
      }
    });

    let selectedKegiatan = null;

    this.dataSelectKegiatan.forEach(a => {
      if (String(kegiatan_id) === String(a.id)) {
        selectedKegiatan = a;
      }
    });

    let fb = this.builder.group({

      lokasi_id: new FormControl({
        id: lokasi_id,
        text: ''
      }),

      acc_akun_id: new FormControl(selectedAkun),

      debet: new FormControl(
        formatNumber(parseFloat(debet), 'en_US', '1.2-2')
      ),

      kredit: new FormControl(
        formatNumber(parseFloat(kredit), 'en_US', '1.2-2')
      ),

      traksi_id: new FormControl(selectedTraksi),

      blok_id: new FormControl(selectedBlok),

      kegiatan_id: new FormControl(selectedKegiatan),

      ket: new FormControl(ket),

      invoice_id: new FormControl(invoice_id)

    });

    this.details.push(fb);

    // FIX AGAR NILAI TIDAK 0
    this.hitungNilai();

  });

}

  onSubmit() {

    if (this.entryForm.invalid) return;

    let frmData = this.entryForm.getRawValue();

    frmData['permohonan_ids'] = this.permohonanIds;

    frmData['nilai'] = parseFloat(
      this.entryForm.get('nilai').value.replace(/[^\d\.\-]/g, "")
    );

    frmData['tanggal'] = formatDate(
      this.entryForm.get('tanggal').value,
      "yyyy-MM-dd",
      'en_US'
    );

    this.AccKasbankService.update(this.accKasbank.id, frmData)
      .subscribe(data => {

        if (data['status'] === 'OK') {

          swal({
            title: 'Info!',
            text: 'Edit berhasil',
            type: 'success'
          });

          this.event.emit('OK');
          this.bsModalRef.hide();

        }

      });

  }

  onClose() {

    this.bsModalRef.hide();

  }

 loadPermohonanSupplier(supplier_id) {

  this.accPermohonanPembayaranV2Service
    .getAllBySupplier(supplier_id)
    .subscribe(res => {

      this.dataSelectPermohonanBayar = [];

      res['data'].forEach(d => {

        this.dataSelectPermohonanBayar.push({
          id: d.id,
          text: d.no_transaksi + ' (' + d.tanggal + ')'
        });

      });

      // =========================
      // HANYA LOAD AWAL SAJA
      // =========================
      if (
        this.accKasbank['permohonan_ids'] &&
        this.permohonanIds.length === 0
      ) {

        this.permohonanIds = [
          ...this.accKasbank['permohonan_ids']
        ];

      }

      // =========================
      // REBUILD TEXTAREA
      // =========================
      let text = '';

      this.permohonanIds.forEach(id => {

        const p =
          this.dataSelectPermohonanBayar.find(
            x => String(x.id) === String(id)
          );

        if (p) {

          if (text !== '') {
            text += '\n';
          }

          text += p.text;

        }

      });

      this.entryForm
        .get('permohonan_id')
        .patchValue(text);

    });

}

  lookupPermohonan() {

    const supplier = this.entryForm.get('supplier_id').value;
    console.log(supplier);

    if (
      !supplier ||
      (Array.isArray(supplier) && supplier.length === 0) ||
      (typeof supplier === 'object' && !supplier.id)
    ) {
      swal({
        title: 'Perhatian!',
        text: 'Pilih supplier terlebih dahulu',
        type: 'warning',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      });
      return;
    }

    let modalConfig = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-lg",
      initialState: {
        supplier_id: supplier.id,
        jenis_invoice: this.selectedJenisPermohonan   // ← FILTER JENIS
      }
    };

    this.bsModalRef1 = this.bsModalService.show(LookupPermohonanComponent, modalConfig);

    this.bsModalRef1.content.event.subscribe(item => {

      if (!item) return;

      this.addPermohonan(item);

      this.processPermohonan(item);

    });

  }

  processPermohonan(item) {

    if (!item) return;

    // =============================
    // VALIDASI JENIS HARUS SAMA
    // =============================
    if (this.selectedJenisPermohonan && item.jenis_invoice !== this.selectedJenisPermohonan) {

      swal({
        title: 'Tidak diperbolehkan',
        text: 'Permohonan harus dengan jenis invoice yang sama',
        type: 'warning',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      });

      return;
    }

    // =============================
    // SET JENIS PERTAMA
    // =============================
    if (!this.selectedJenisPermohonan) {

      this.selectedJenisPermohonan = item.jenis_invoice;

      let sumber = null;

      switch (item.jenis_invoice) {

        case 'PO':
        case 'PO JASA':
        case 'HUTANG LAINNYA':
          sumber = 'INVOICE_AP';
          break;

        case 'PEMBELIAN TBS':
          sumber = 'INVOICE_TBS';
          break;

        case 'BIAYA ANGKUT':
          sumber = 'INVOICE_ANGKUT_CPO';
          break;

        case 'PERMINTAAN DANA':
          sumber = 'PERMINTAAN_DANA';
          break;

        case 'UANG MUKA':
          sumber = 'UANG_MUKA';
          break;

        default:
          sumber = 'NONE';
          break;
      }

      const selected = this.dataSelectSumberDokumen.find(x => x.id === sumber);

      if (selected) {

        this.entryForm.get('sumber_dokumen').patchValue(selected);

        // LOCK FIELD
        this.entryForm.get('sumber_dokumen').disable();

      }

    }

    // =============================
    // LOAD JURNAL PERMOHONAN
    // =============================

    const permohonanId = item.id;

    this.accPermohonanPembayaranV2Service
      .getJurnalPermohonan(permohonanId)
      .subscribe((res: JurnalPermohonanResponse) => {

        if (!res || res.status !== 'OK') return;

        const d = res.data;

        const lokasi_id = d.lokasi_id;
        const akun_supplier_id = d.akun_supplier_id;

        let ket = 'Permohonan Pembayaran dengan Nomor ' + d.no_permohonan;

        if (d.referensi) {
          ket += ' ( Invoice: ' + d.referensi + ' )';
        }

        // ======================================
        // JIKA ADA LOKASI (AUTO LOAD AKUN)
        // ======================================
        if (lokasi_id) {

          this.accAkunService.getAllByLokasiId(lokasi_id).subscribe((x: any) => {

            this.dataSelectAkun[lokasi_id] = [];

            x['data'].forEach(a => {
              this.dataSelectAkun[lokasi_id].push({
                id: a.id,
                text: a.kode + ' - ' + a.nama
              });
            });

            this.addBlok(
              lokasi_id,
              akun_supplier_id ? akun_supplier_id : null,
              null,
              null,
              null,
              d.nilai,
              0,
              ket,
              d.ref_id ? d.ref_id : d.permohonan_id
            );

          });

        }

        // ======================================
        // JURNAL MANUAL (LOKASI BELUM ADA)
        // ======================================
        else {

          this.addBlok(
            {},
            akun_supplier_id ? akun_supplier_id : null,
            null,
            null,
            null,
            d.nilai,
            0,
            ket,
            d.permohonan_id
          );

        }

      });

  }

  addPermohonan(item) {

  if (!item) return;

  if (this.permohonanIds.includes(item.id)) {
    return;
  }

  // IMPORTANT
  this.permohonanIds = [
    ...this.permohonanIds,
    item.id
  ];

  let current =
    this.entryForm.get('permohonan_id').value || '';

  let text =
    item.no_transaksi + ' (' + item.tanggal + ')';

  if (current !== '') {
    current += '\n' + text;
  } else {
    current = text;
  }

  this.entryForm.get('permohonan_id').patchValue(current);

}

  get userControl() { return this.entryForm.controls; }

  SumberDokumenChange($event) {

    this.sumberDoc = $event.id;
    console.log(this.sumberDoc);
  }

  addBlokNew() {
    let selectedLokasiDetail: any = [];
    let lokasi_id = this.entryForm.get('lokasi_id').value['id'];
    let keterangan = this.entryForm.get('keterangan').value;
    this.dataSelectLokasiDetail.forEach(a => {
      if (lokasi_id == a.id) {
        selectedLokasiDetail = a;
      }
    });
    this.accAkunService.getAllByLokasiId(lokasi_id).subscribe(x => {
      console.log(x)
      this.dataSelectAkun[lokasi_id] = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectAkun[lokasi_id].push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
      });
    });
    this.details.push(this.builder.group({
      lokasi_id: new FormControl(selectedLokasiDetail, Validators.required),
      acc_akun_id: new FormControl([], Validators.required),
      debet: new FormControl(0, Validators.required),
      kredit: new FormControl(0, Validators.required),
      traksi_id: new FormControl([],),
      blok_id: new FormControl([],),
      kegiatan_id: new FormControl([]),
      ket: new FormControl(keterangan,),
    }));

  }

  removeBlokItem(blok) {
    let i = this.details.controls.indexOf(blok);
    if (i != -1) {
      let detail = this.entryForm.get('details') as FormArray;
      detail.removeAt(i);
      let data = { details: detail.value };
      this.updateForm(data);
    }
    this.hitungNilai();
  }

  updateForm(data) {

  }

  hitungNilai() {
    let dr = 0;
    let cr = 0;
    let jumlah = 0;
    let tipe = this.entryForm.get('tipe_jurnal').value['id']
    // console.log(this.entryForm.get('details').value);
    this.entryForm.get('details').value.forEach(x => {
      // console.log(x);
      if (isNumber(x.debet)) {
        dr += x.debet;
      } else {
        dr += parseFloat(x.debet.replace(/[^\d\.\-]/g, ""));
      }
      if (isNumber(x.kredit)) {
        cr += x.kredit;
      } else {
        cr += parseFloat(x.kredit.replace(/[^\d\.\-]/g, ""));
      }

    });
    console.log(tipe)
    if (tipe == 'in') {
      jumlah = cr - dr;
    } else {
      jumlah = dr - cr;
    }

    this.entryForm.get('nilai').patchValue(formatNumber(jumlah, 'en_US', '1.2-2'));

  }

  formatNumbering(form) {
    let debet = form.get('debet').value;
    let kredit = form.get('kredit').value;

    if (!isNumber(debet)) {
      debet = parseFloat(debet.replace(/[^\d\.\-]/g, ""));
    }

    if (!isNumber(kredit)) {
      kredit = parseFloat(kredit.replace(/[^\d\.\-]/g, ""));
    }

    form.get('debet').patchValue(formatNumber(debet, 'en_US', '1.2-2'));
    form.get('kredit').patchValue(formatNumber(kredit, 'en_US', '1.2-2'));

    this.hitungNilai();
  }

 removePermohonan(permohonanId: number) {

  // cari data permohonan
  const permohonan =
    this.dataSelectPermohonanBayar.find(
      x => String(x.id) === String(permohonanId)
    );

  // ambil nomor transaksi
  const noPermohonan =
    permohonan ? permohonan.text.split(' ')[0] : '';

  // hapus dari array chip
  this.permohonanIds =
    this.permohonanIds.filter(
      x => String(x) !== String(permohonanId)
    );

  // hapus detail berdasarkan ket
  const detail =
    this.entryForm.get('details') as FormArray;

  for (let i = detail.length - 1; i >= 0; i--) {

    const ket =
      detail.at(i).get('ket').value || '';

    if (ket.includes(noPermohonan)) {

      detail.removeAt(i);

    }

  }

  // rebuild textarea/chip
  let text = '';

  this.permohonanIds.forEach(id => {

    const p =
      this.dataSelectPermohonanBayar.find(
        x => x.id == id
      );

    if (p) {

      if (text !== '') {
        text += '\n';
      }

      text += p.text;

    }

  });

  this.entryForm.get('permohonan_id').patchValue(text);

  this.hitungNilai();

}

getPermohonanText(id: number): string {

  const p = this.dataSelectPermohonanBayar.find(
    x => String(x.id) === String(id)
  );

  return p ? p.text : '';

}

}