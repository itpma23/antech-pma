import { Component, OnInit, EventEmitter, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { PrcRekapService } from 'src/app/shared/services/prc_rekap.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { AccTbsInvoiceService } from 'src/app/shared/services/acc_tbs_invoice.service';
import { AccTbsInvoice } from 'src/app/shared/models/acc_tbs_invoice.model';
import { PksTimbanganService } from 'src/app/shared/services/pks_timbangan.service';
import { AccKuitansiPembelianTbsService } from 'src/app/shared/services/acc_kuitansi_pembelian_tbs.service';
import { PksHargaTbsService } from 'src/app/shared/services/pks_harga_tbs.service';
import Swal from 'sweetalert2';
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

  @ViewChild('modalTimbanganTemplate', { static: false }) modalTimbanganTemplate: TemplateRef<any>;
  bsModalTimbanganRef: BsModalRef;
  dataTimbangan: any[] = [];
  selectedTimbangan: any[] = [];
  loadingTimbangan = false;

  filterTanggalMulai: Date;
  filterTanggalAkhir: Date;

  datepickerConfig: any = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }

  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();

  accTbsInvoice: any; // data dari modal list

  dataSelectLokasi: any = [];
  dataSelectBlok: any = [];
  dataSelectMesin: any = [];
  pajakSudahDihitung;
  dataSelectSupplier: any = [];
  dataSelectRekap: any = [];
  dataSelectItem: any = [];
  rekapTimbangan: any = [];

  dataSelectMetodeBayar: any[] = [
    { id: 'TUNAI', text: 'Tunai' },
    { id: 'HUTANG', text: 'Hutang' },
    { id: 'TRANSFER', text: 'Transfer' }
  ];
  hargaPerBaris: any;

  constructor(
    private builder: FormBuilder,
    public bsModalRef: BsModalRef,
    private bsModalService: BsModalService,
    private accKuitansiPembelianTbsService: AccKuitansiPembelianTbsService,
    private pksTimbanganService: PksTimbanganService,
    private pksHargaTbsService: PksHargaTbsService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private gbmSupplier: GbmSupplierService
  ) {
    var toDate: Date = new Date();

    this.entryForm = this.builder.group({
      lokasi_id: new FormControl([], Validators.required),
      no_kuitansi: new FormControl('AutoNumber'),
      tanggal: new FormControl(toDate, Validators.required),
      supplier_id: new FormControl([], Validators.required),
      metode_bayar: new FormControl([], Validators.required),
      harga_satuan: new FormControl('', Validators.required),
      keterangan: new FormControl(''),
      details: this.builder.array([]),
      total_berat_terima: new FormControl({ value: 0, disabled: true }),
      total_potongan: new FormControl({ value: 0, disabled: true }),
      total_berat_bersih: new FormControl({ value: 0, disabled: true }),
      total_tagihan: new FormControl({ value: 0, disabled: true }),
      dpp: new FormControl({ value: 0, disabled: true }), // total sebelum pajak
      ppn: new FormControl({ value: 0, disabled: true }),
      pph: new FormControl({ value: 0, disabled: true }),
    });
    this.pajakSudahDihitung = true; // reset kalau user ganti data
  }

  get userControl() { return this.entryForm.controls; }
  get details(): FormArray { return this.entryForm.get('details') as FormArray; }

  ngOnInit() {
    this.loadSelect2();

    if (this.accTbsInvoice) {
      this.pajakSudahDihitung = true; // reset kalau user ganti data

      this.patchForm(this.accTbsInvoice);
    }
  }

  ngAfterViewInit(): void {
    this.formChange();
  }

  private formChange(): void {
    // kosong untuk sekarang, bisa diisi kalau mau listen perubahan form
  }

  private loadSelect2(): void {
    // load lokasi
    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(function (x: any) {
      this.dataSelectLokasi = [];
      for (var i = 0; i < x.length; i++) {
        var d = x[i];
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      }
    }.bind(this));

    // load supplier
    this.gbmSupplier.getAll().subscribe(function (x: any) {
      this.dataSelectSupplier = [];
      for (var i = 0; i < x['data'].length; i++) {
        var d = x['data'][i];
        this.dataSelectSupplier.push({ "id": d.id, "text": d.kode_supplier + " - " + d.nama_supplier });
      }

      // jika edit, patch supplier dari accTbsInvoice
      if (this.accTbsInvoice && this.accTbsInvoice.supplier_id) {
        for (var j = 0; j < this.dataSelectSupplier.length; j++) {
          if (this.dataSelectSupplier[j].id == this.accTbsInvoice.supplier_id) {
            this.entryForm.patchValue({ supplier_id: this.dataSelectSupplier[j] });
            break;
          }
        }
      }

    }.bind(this));

    // saat supplier berubah, ambil harga TBS
    this.entryForm.controls['supplier_id'].valueChanges.subscribe(function (x: any) {
      if (!x || !x.id) return;
      var supplier_id = x.id;
      var tanggal = this.entryForm.get('tanggal').value;
      var tanggalFormatted = formatDate(tanggal, 'yyyy-MM-dd', 'en_US');

      this.pksHargaTbsService.getHargaTbs(tanggalFormatted, supplier_id).subscribe(function (res: any) {
        if (res.status === 'OK') {
          var harga = res.data.harga_tbs || 0;
          this.entryForm.patchValue({ harga_satuan: harga });
        } else {
          this.entryForm.patchValue({ harga_satuan: 0 });
        }
      }.bind(this), function (error: any) {
        console.error('Gagal ambil harga TBS:', error);
        this.entryForm.patchValue({ harga_satuan: 0 });
      }.bind(this));
    }.bind(this));
  }

  patchForm(data: any) {
    if (!data) return;

    // --- Header / field utama ---
    this.entryForm.patchValue({
      lokasi_id: data.lokasi_id
        ? { id: data.lokasi_id, text: data.lokasi_nama ? data.lokasi_nama : '' }
        : [],
      no_kuitansi: data.no_kuitansi ? data.no_kuitansi : 'AutoNumber',
      tanggal: data.tanggal ? new Date(data.tanggal) : new Date(),
      supplier_id: data.supplier_id
        ? { id: data.supplier_id, text: data.supplier_nama ? data.supplier_nama : '' }
        : [],
      metode_bayar: data.metode_bayar
        ? { id: data.metode_bayar, text: data.metode_bayar }
        : [],
      harga_satuan: data.harga_satuan ? parseFloat(data.harga_satuan) : 0,
      keterangan: data.keterangan ? data.keterangan : '',
      total_berat_terima: data.total_berat_terima ? parseFloat(data.total_berat_terima) : 0,
      total_potongan: data.total_potongan ? parseFloat(data.total_potongan) : 0,
      total_berat_bersih: data.total_berat_bersih ? parseFloat(data.total_berat_bersih) : 0,
      dpp: data.dpp ? parseFloat(data.dpp) : 0,
      ppn: data.ppn ? parseFloat(data.ppn) : 0,
      pph: data.pph ? parseFloat(data.pph) : 0,
      total_tagihan: data.total_tagihan ? parseFloat(data.total_tagihan) : 0
    });

    // --- Detail Timbangan ---
    const detailsArray = this.entryForm.get('details') as FormArray;
    detailsArray.clear(); // bersihkan form array
    this.hargaPerBaris = []; // 💥 reset subtotal array

    if (data.details && data.details.length > 0) {
      for (let i = 0; i < data.details.length; i++) {
        const d = data.details[i];

        // ambil harga per baris / fallback ke harga global
        const hargaSatuan = parseFloat(d.harga_satuan) || 0;


        // ambil berat terima
        const beratTerima = d.berat_bruto ? parseFloat(d.berat_bruto) : 0;

        // hitung subtotal (nilai per baris)
        const subtotal =
          d.nilai != null && parseFloat(d.nilai) !== 0
            ? parseFloat(d.nilai)
            : beratTerima * hargaSatuan;

        // 💥 masukkan subtotal ke array hargaPerBaris
        this.hargaPerBaris.push(subtotal);

        // push ke FormArray
        detailsArray.push(
          this.builder.group({
            id: [d.id],
            kuitansi_id: [d.kuitansi_id],
            tiket_timbang_id: [d.tiket_timbang_id],
            no_tiket: [d.no_tiket],
            tanggal: [d.tanggal_timbang ? new Date(d.tanggal_timbang) : null],
            berat_terima: [beratTerima],
            berat_potongan: [d.potongan ? parseFloat(d.potongan) : 0],
            berat_bersih: [d.berat_bersih ? parseFloat(d.berat_bersih) : 0],
            harga_satuan: [hargaSatuan],
            nilai: [subtotal],
            keterangan: [d.keterangan ? d.keterangan : '']
          })
        );
      }
    }

    // --- Tandai pajak sudah dihitung jika nilainya ada ---
    this.selectedTimbangan = []; // reset dulu

    // isi ulang selectedTimbangan berdasarkan data di detail
    if (data.details && data.details.length > 0) {
      this.selectedTimbangan = data.details.map((d: any) => ({
        no_tiket: d.no_tiket,
        tanggal: d.tanggal_timbang ? new Date(d.tanggal_timbang) : null,
        nama_supplier: data.supplier_nama,
        berat_terima: d.berat_bruto ? parseFloat(d.berat_bruto) : 0,
        berat_potongan: d.potongan ? parseFloat(d.potongan) : 0,
        berat_bersih: d.berat_bersih ? parseFloat(d.berat_bersih) : 0
      }));
    }


    // 💥 langsung hitung total global setelah patch
    //this.hitungTotal();
  }



  onSubmit() {
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) return;

    var frmData = this.entryForm.getRawValue();
    frmData['tanggal'] = formatDate(frmData['tanggal'], 'yyyy-MM-dd', 'en_US');

    this.accKuitansiPembelianTbsService.update(this.accTbsInvoice.id, frmData).subscribe(function (res: any) {
      if (res.status === 'OK') {
        swal({
          title: 'Info!',
          text: 'Data berhasil diupdate dengan Nomor:' + res.data,
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        });
        this.event.emit('OK');
        this.bsModalRef.hide();
      } else {
        swal({
          title: 'Perhatian!',
          text: 'Proses Update Gagal',
          type: 'warning',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        });
      }
    }.bind(this));
  }

  hitungTotal() {
    const detailsArray = this.entryForm.get('details') as FormArray;

    let totalTerima = 0;
    let totalPotongan = 0;
    let totalBersih = 0;
    let totalDpp = 0;

    detailsArray.value.forEach((d: any, i: number) => {
      const beratBersih = +d.berat_bersih || 0;
      const beratPotongan = +d.berat_potongan || 0;
      const beratTerima = +d.berat_terima || 0;

      // DPP diambil dari subtotal kalau sudah dihitung
      const subtotal = (this.hargaPerBaris && this.hargaPerBaris[i] != null)
        ? +this.hargaPerBaris[i]
        : beratTerima * (+d.harga_satuan || 0);

      totalTerima += beratBersih;
      totalPotongan += beratPotongan;
      totalBersih += beratTerima;
      totalDpp += subtotal;
    });

    this.entryForm.patchValue({
      total_berat_terima: totalTerima,
      total_potongan: totalPotongan,
      total_berat_bersih: totalBersih,
      dpp: totalDpp,
      total_tagihan: totalDpp,
      ppn: 0,
      pph: 0
    }, { emitEvent: false });

    let currentPpn = 0;
    let currentPph = 0;

    if (this.entryForm.get('ppn')) {
      currentPpn = this.entryForm.get('ppn').value || 0;
    }

    if (this.entryForm.get('pph')) {
      currentPph = this.entryForm.get('pph').value || 0;
    }


    this.pajakSudahDihitung = (currentPpn > 0 || currentPph > 0);
  }

  hitungPajak(tipe: 'ppn' | 'pph' | 'pphg') {
    const totalTagihanControl = this.entryForm.get('total_tagihan');
    const totalTagihan = totalTagihanControl ? totalTagihanControl.value : 0;
    const dppControl = this.entryForm.get('dpp');
    const dpp = dppControl ? dppControl.value : 0;
    const ppnControl = this.entryForm.get('ppn');
    const pphControl = this.entryForm.get('pph');
    const ppn = ppnControl ? ppnControl.value : 0;
    const pph = pphControl ? pphControl.value : 0;
  
    const that = this;
  
    if (this.pajakSudahDihitung === undefined) {
      this.pajakSudahDihitung = false;
    }
  
    const swalCustom = Swal.mixin({
      customClass: {
        popup: 'swal-popup-dpa',
        title: 'swal-title-dpa',
        confirmButton: 'swal-confirm-dpa',
        cancelButton: 'swal-cancel-dpa'
      },
      buttonsStyling: false
    });
  
    if (dpp <= 0 || totalTagihan <= 0) {
      this.showNotification('top', 'right', 'Total tagihan masih 0, tidak bisa menghitung pajak', 4);
      return;
    }
  
    // ✅ Perhitungan khusus untuk PPH Gross-Up
    if (tipe === 'pphg') {
      const rate = 0.25 / 100; // 0.25%
      const dppGross = dpp / (1 - rate);
      const pphGrossUp = dppGross * rate;
      const totalSetelahPajak = dppGross - pphGrossUp; // PPH ditanggung perusahaan
  
      that.entryForm.patchValue(
        {
          dpp: dppGross,
          pph: pphGrossUp,
          total_tagihan: totalSetelahPajak
        },
        { emitEvent: false }
      );
  
      that.pajakSudahDihitung = true;
  
      swalCustom.fire({
        title: 'Hasil Perhitungan PPH Gross-Up',
        html:
          '<div style="text-align:center; margin-bottom: 15px;">' +
          '<i class="material-icons" style="font-size: 56px; color: #28a745;">calculate</i>' +
          '</div>' +
          '<div style="text-align:left">' +
          '<p><strong>DPP Awal:</strong> Rp ' + formatNumber(dpp) + '</p>' +
          '<p><strong>DPP Gross:</strong> Rp ' + formatNumber(dppGross) + '</p>' +
          '<p><strong>PPH (0.25% Gross-Up):</strong> Rp ' + formatNumber(pphGrossUp) + '</p>' +
          '<hr>' +
          '<p><strong>Total Setelah Pajak:</strong> Rp ' + formatNumber(totalSetelahPajak) + '</p>' +
          '</div>',
        confirmButtonText: 'OK'
      });
  
      return;
    }
  
    // ✅ Perhitungan PPN dan PPH biasa
    if (ppn > 0 && pph > 0) {
      this.pajakSudahDihitung = true;
      swalCustom.fire({
        title: 'Hasil Pajak Sudah Dihitung',
        html:
          '<div style="text-align:center; margin-bottom: 15px;">' +
          '<i class="material-icons" style="font-size: 56px; color: #007bff;">info</i>' +
          '</div>' +
          '<div style="text-align:left">' +
          '<p><strong>DPP:</strong> Rp ' + formatNumber(dpp) + '</p>' +
          '<p><strong>PPN:</strong> Rp ' + formatNumber(ppn) + '</p>' +
          '<p><strong>PPh:</strong> Rp ' + formatNumber(pph) + '</p>' +
          '<hr>' +
          '<p><strong>Total Setelah Pajak:</strong> Rp ' + formatNumber(totalTagihan) + '</p>' +
          '</div>',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    // 🔢 Input manual persentase
    swalCustom.fire({
      title: 'Masukkan Persentase Pajak ' + tipe.toUpperCase(),
      input: 'number',
      inputLabel: 'Masukkan angka tanpa simbol %, contoh: 11 untuk 11%',
      inputAttributes: {
        min: '0',
        max: '100',
        step: '0.01'
      },
      inputValue: tipe === 'ppn' ? 11 : 2.5,
      showCancelButton: true,
      confirmButtonText: 'Hitung',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      preConfirm: function (value) {
        if (!value || isNaN(value) || parseFloat(value) < 0) {
          swalCustom.showValidationMessage('Masukkan angka pajak yang valid!');
          return false;
        }
        return parseFloat(value);
      }
    }).then(function (result) {
      if (!result.isConfirmed || !result.value) return;
  
      const rate = result.value / 100;
      let ppnVal = ppn;
      let pphVal = pph;
  
      if (tipe === 'ppn') {
        ppnVal = dpp * rate;
      } else {
        pphVal = dpp * rate;
      }
  
      const totalSetelahPajak = dpp + ppnVal - pphVal;
  
      that.entryForm.patchValue(
        {
          ppn: ppnVal,
          pph: pphVal,
          total_tagihan: totalSetelahPajak
        },
        { emitEvent: false }
      );
  
      if (ppnVal > 0 || pphVal > 0) {
        that.pajakSudahDihitung = true;
      }
  
      swalCustom.fire({
        title: 'Hasil Perhitungan ' + tipe.toUpperCase(),
        html:
          '<div style="text-align:center; margin-bottom: 15px;">' +
          '<i class="material-icons" style="font-size: 56px; color: #28a745;">check_circle</i>' +
          '</div>' +
          '<div style="text-align:left">' +
          '<p><strong>DPP:</strong> Rp ' + formatNumber(dpp) + '</p>' +
          '<p><strong>' + tipe.toUpperCase() + ' (' + result.value + '%):</strong> Rp ' +
          formatNumber(tipe === 'ppn' ? ppnVal : pphVal) + '</p>' +
          '<hr>' +
          '<p><strong>Total Setelah Pajak:</strong> Rp ' + formatNumber(totalSetelahPajak) + '</p>' +
          '</div>',
        confirmButtonText: 'OK'
      });
    });
  
    function formatNumber(value: number) {
      return value.toLocaleString('id-ID', { minimumFractionDigits: 0 });
    }
  }


  showNotification(from, align, message, color = 4) {
    const type = ['', 'info', 'success', 'warning', 'danger', 'rose', 'primary'];

    $.notify({
      icon: "notifications",
      message: message
    }, {
      type: type[color],
      timer: 3000,
      placement: {
        from: from,
        align: align
      },
      z_index: 20000, // ✅ jauh di atas z-index modal (biasanya 1050)
      newest_on_top: true,
      allow_dismiss: true,
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
      }
    });
  }

  showTimbanganPKS() {
    var supplier = this.entryForm.get('supplier_id').value;
    var tanggal = this.entryForm.get('tanggal').value;
    if (!supplier || !supplier.id) {
      this.showNotification('top', 'right', 'Silakan pilih supplier terlebih dahulu', 4);
      return;
    }

    this.filterTanggalAkhir = new Date(tanggal);
    this.filterTanggalMulai = new Date(tanggal);
    this.filterTanggalMulai.setDate(this.filterTanggalMulai.getDate() - 30);

    var data = {
      supp_id: supplier.id,
      tgl_mulai: formatDate(this.filterTanggalMulai, 'yyyy-MM-dd', 'en_US'),
      tgl_sd: formatDate(this.filterTanggalAkhir, 'yyyy-MM-dd', 'en_US')
    };

    this.loadingTimbangan = true;
    this.pksTimbanganService.getTimbanganTBS(data).subscribe(function (res: any) {
      this.loadingTimbangan = false;
      this.dataTimbangan = (res.status === 'OK') ? res.data : [];
      this.bsModalTimbanganRef = this.bsModalService.show(this.modalTimbanganTemplate, {
        class: 'modal-xl',
        ignoreBackdropClick: true
      });
    }.bind(this), function (err: any) {
      this.loadingTimbangan = false;
      this.showNotification('top', 'right', 'Gagal memuat data timbangan', 4);
    }.bind(this));
  }

  pilihTimbangan() {
    if (!this.selectedTimbangan || this.selectedTimbangan.length === 0) {
      this.showNotification('top', 'right', 'Belum ada data yang dipilih', 4);
      return;
    }

    const detailsArray = this.entryForm.get('details') as FormArray;
    let jumlahBaru = 0; // untuk hitung berapa data baru yang ditambah

    for (let i = 0; i < this.selectedTimbangan.length; i++) {
      const row = this.selectedTimbangan[i];

      // 🔍 cek apakah no_tiket sudah ada di details
      const sudahAda = detailsArray.value.some((d: any) => d.no_tiket === row.no_tiket);
      if (sudahAda) continue; // kalau sudah ada, skip biar gak double

      // 🚀 push data baru ke form
      detailsArray.push(this.builder.group({
        no_tiket: [row.no_tiket],
        tanggal: [row.tanggal],
        berat_terima: [row.berat_terima],
        berat_potongan: [row.berat_potongan],
        berat_bersih: [row.berat_bersih],
        harga_satuan: [row.harga || 0]
      }));

      jumlahBaru++;
    }

    // Tutup modal & update total hanya kalau ada data baru
    this.closeModalTimbangan();
    if (jumlahBaru > 0) {
      this.hitungTotal();
      this.showNotification('top', 'right', jumlahBaru + ' data ditambahkan', 2);
    } else {
      this.showNotification('top', 'right', 'Tidak ada data baru yang ditambahkan (duplikat diabaikan)', 4);
    }
  }


  closeModalTimbangan() {
    if (this.bsModalTimbanganRef) this.bsModalTimbanganRef.hide();
  }

  onClose() {
    this.bsModalRef.hide();
  }

  hapusDetail(index: number) {
    var detailsArray = this.entryForm.get('details') as FormArray;
    detailsArray.removeAt(index);
    this.hitungTotal();


    // Jika pajak sudah dihitung sebelumnya, reset nilai pajak dan beri notifikasi
    if (this.pajakSudahDihitung) {
      this.entryForm.patchValue({
        ppn: 0,
        pph: 0,
        total_tagihan: this.entryForm.get('dpp').value // kembalikan ke DPP
      }, { emitEvent: false });



      this.pajakSudahDihitung = false;
    }

    this.showNotification(
      'top',
      'right',
      'Data detail berubah, pajak direset. Silakan hitung ulang pajak.',
      1
    );
  }

  refreshTimbangan() {
    const supplier = this.entryForm.get('supplier_id').value;
    if (!supplier || !supplier.id) {
      this.showNotification('top', 'right', 'Silakan pilih supplier terlebih dahulu', 4);
      return;
    }

    const data = {
      supp_id: supplier.id,
      tgl_mulai: formatDate(this.filterTanggalMulai, 'yyyy-MM-dd', 'en_US'),
      tgl_sd: formatDate(this.filterTanggalAkhir, 'yyyy-MM-dd', 'en_US')
    };

    this.loadingTimbangan = true;
    this.pksTimbanganService.getTimbanganTBS(data).subscribe((res: any) => {
      this.loadingTimbangan = false;
      if (res.status === 'OK') {
        this.dataTimbangan = res.data;
      } else {
        this.dataTimbangan = [];
      }
    }, err => {
      this.loadingTimbangan = false;
      console.error(err);
      this.showNotification('top', 'right', 'Gagal memuat data timbangan', 4);
    });
  }


  onSelectionChange(event) {

  }

  onHargaSatuanChange(index: number, event: any) {
    const hargaBaru = +event.target.value || 0;
    const detailsArray = this.entryForm.get('details') as FormArray;
    const detailGroup = detailsArray.at(index) as FormGroup;

    const beratTerima = +detailGroup.value.berat_terima || 0;
    const subtotal = beratTerima * hargaBaru;

    // 💥 Update harga_satuan langsung ke detail form baris
    detailGroup.patchValue({ harga_satuan: hargaBaru }, { emitEvent: false });

    // Simpan subtotal per baris
    this.hargaPerBaris[index] = subtotal;

    // Hitung ulang total global
    this.hitungTotal();
  }
}