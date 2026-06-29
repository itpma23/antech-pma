import { Component, OnInit, EventEmitter, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { PrcRekapService } from 'src/app/shared/services/prc_rekap.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { AccTbsInvoiceService } from 'src/app/shared/services/acc_tbs_invoice.service';
import { PksTimbanganService } from 'src/app/shared/services/pks_timbangan.service';
import { PksHargaTbsService } from 'src/app/shared/services/pks_harga_tbs.service';
import { AccKuitansiPembelianTbsService } from 'src/app/shared/services/acc_kuitansi_pembelian_tbs.service';
import Swal from 'sweetalert2';
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

  @ViewChild('modalTimbanganTemplate', { static: false }) modalTimbanganTemplate: TemplateRef<any>;
  bsModalTimbanganRef: BsModalRef;
  dataTimbangan: any[] = [];
  selectedTimbangan: any[] = [];
  loadingTimbangan = false;

  filterTanggalMulai: Date;
  filterTanggalAkhir: Date;

  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }

  entryForm: FormGroup;

  event: EventEmitter<any> = new EventEmitter();


  dataSelectLokasi;
  dataSelectBlok;
  dataSelectMesin;
  dataSelectSupplier;
  dataSelectRekap;
  pajakSudahDihitung;
  dataSelectItem;
  rekapTimbangan: any = [];
  hargaPerBaris: number[] = [];

  // Array untuk dropdown metode bayar
  dataSelectMetodeBayar = [
    { id: 'TUNAI', text: 'Tunai' },
    { id: 'HUTANG', text: 'Hutang' },
    { id: 'TRANSFER', text: 'Transfer' }

  ];

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private bsModalRef1: BsModalRef,
    private bsModalService: BsModalService,
    private translate: TranslateService,
    private invItemService: InvItemService,
    private prcRekapService: PrcRekapService,
    private pksTimbanganService: PksTimbanganService,
    private pksHargaTbsService: PksHargaTbsService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private gbmSupplier: GbmSupplierService,
    private accKuitansiPembelianTbs: AccKuitansiPembelianTbsService

  ) {
    let toDate: Date = new Date();

    this.entryForm = this.builder.group({
      lokasi_id: new FormControl([], Validators.required),
      no_kuitansi: new FormControl('AutoNumber'),
      tanggal: new FormControl(toDate, Validators.required),
      supplier_id: new FormControl([], Validators.required),

      // Tambahan dari form kanan (detail pembayaran)
      metode_bayar: new FormControl([], Validators.required),
      harga_satuan: new FormControl('', Validators.required),
      keterangan: new FormControl(''),

      // Detail timbangan (array)
      details: this.builder.array([]),

      // Total (readonly, nanti diupdate dari logic)
      total_berat_terima: new FormControl({ value: 0, disabled: true }),
      total_potongan: new FormControl({ value: 0, disabled: true }),
      total_berat_bersih: new FormControl({ value: 0, disabled: true }),
      total_tagihan: new FormControl({ value: 0, disabled: true }),
      dpp: new FormControl({ value: 0, disabled: true }), // total sebelum pajak
      ppn: new FormControl({ value: 0, disabled: true }),
      pph: new FormControl({ value: 0, disabled: true }),

    });
    this.pajakSudahDihitung = false; // reset kalau user ganti data


  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    this.formChange();

  }
  public options: any;

  private formChange(): void {

    let IdSpk;

  }
  private loadSelect2(): void {

    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
    });

    this.gbmSupplier.getAll().subscribe(x => {
      // console.log(x);
      this.dataSelectSupplier = [];
      x['data'].forEach(d => {
        this.dataSelectSupplier.push({ "id": d.id, "text": d.kode_supplier + " - " + d.nama_supplier });
      });
    });


    this.entryForm.controls['supplier_id'].valueChanges.subscribe(x => {
      let supplier_id = x.id;

      const tanggal = this.entryForm.get('tanggal').value;

      // Format tanggal dengan Angular helper
      const tanggalFormatted = formatDate(tanggal, 'yyyy-MM-dd', 'en_US');

      this.pksHargaTbsService.getHargaTbs(tanggalFormatted, supplier_id)
        .subscribe(res => {
          if (res.status === 'OK') {
            const harga = res.data.harga_tbs || 0;
            this.entryForm.patchValue({ harga_satuan: harga });
          } else {
            this.entryForm.patchValue({ harga_satuan: 0 });
          }
        }, error => {
          console.error('Gagal ambil harga TBS:', error);
          this.entryForm.patchValue({ harga_satuan: 0 });
        });
    });



  }
  onSubmit() {
    // console.log('submit');
    this.isFormSubmitted = true;

    if (this.entryForm.invalid) {
      return;
    }
    let frmData = this.entryForm.getRawValue();

    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');


    console.log(frmData);

    this.accKuitansiPembelianTbs.create(frmData).subscribe(data => {
      // // console.log(data);
      if (data['status'] == 'OK') {
        // console.log('ok');
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

  totalBeratTerima() {

  }


  // showTimbanganPKS() {

  // }

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



  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };
  addBlok(item = '') {
  }

  removeBlok(i) {
  }
  updateForm(data) {
    const bloks = data.details;
    let sub = 0;
    for (let i of bloks) {
      sub = sub + parseFloat(i.jumlah_janjang);

    }
    // console.log(sub);
    //this.entryForm.get('total').patchValue( sub);

  }
  recalculate() {
    let bloks = this.entryForm.get('details') as FormArray;
    let data = { details: bloks.value };
    this.updateForm(data);


  }
  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();



  }
  valueChange($event) {

  }

  showTimbanganPKS() {
    const supplier = this.entryForm.get('supplier_id').value;
    const tanggal = this.entryForm.get('tanggal').value;

    if (!supplier || !supplier.id) {
      this.showNotification('top', 'right', 'Silakan pilih supplier terlebih dahulu', 4);
      return;
    }

    this.filterTanggalAkhir = new Date(tanggal);
    this.filterTanggalMulai = new Date(tanggal);
    this.filterTanggalMulai.setDate(this.filterTanggalMulai.getDate() - 30);

    const data = {
      supp_id: supplier.id,
      tgl_mulai: formatDate(this.filterTanggalMulai, 'yyyy-MM-dd', 'en_US'),
      tgl_sd: formatDate(this.filterTanggalAkhir, 'yyyy-MM-dd', 'en_US')
    };

    this.loadingTimbangan = true;
    this.pksTimbanganService.getTimbanganTBS(data).subscribe(res => {
      this.loadingTimbangan = false;
      if (res.status === 'OK') {
        this.dataTimbangan = res.data;
      } else {
        this.dataTimbangan = [];
      }

      // ✅ Buka modal lewat ngx-bootstrap, bukan jQuery
      this.bsModalTimbanganRef = this.bsModalService.show(this.modalTimbanganTemplate, {
        class: 'modal-xl',
        ignoreBackdropClick: true,
        keyboard: true,
        backdrop: true
      });
    }, err => {
      this.loadingTimbangan = false;
      this.showNotification('top', 'right', 'Gagal memuat data timbangan', 4);
    });
  }
  closeModalTimbangan() {
    if (this.bsModalTimbanganRef) {
      this.bsModalTimbanganRef.hide();
    }
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

  hapusDetail(index: number) {
    const detailsArray = this.entryForm.get('details') as FormArray;
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

    this.pajakSudahDihitung = false;
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
