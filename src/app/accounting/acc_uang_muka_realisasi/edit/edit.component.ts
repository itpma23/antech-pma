import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';

import { formatDate, formatNumber } from '@angular/common';

import { AccUangMukaRealisasiService } from 'src/app/shared/services/acc_uang_muka_realisasi.service';
import { AccUangMukaService } from 'src/app/shared/services/acc_uang_muka.service';
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
import { AccPermintaanDanaService } from 'src/app/shared/services/acc_permintaan_dana.service';

import 'bootstrap-notify';
import { isNumber } from 'util';
import { AccUangMukaRealisasi } from 'src/app/shared/models/acc_uang_muka_realisasi.model';

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
  };

  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();

  accUangMukaRealisasi: AccUangMukaRealisasi;

  dataSelectLokasi: any[] = [];
  dataSelectLokasiDetail: any[] = [];
  dataSelectAkun: any[] = [];
  dataSelectAkunKasbank: any[] = [];
  dataSelectAkunUangMuka: any[] = [];

  dataSelectUangMuka: any[] = [];
  dataSelectPermintaanDana: any[] = [];

  uangMuka: any[] = [];
  permintaanDana: any[] = [];

  dataSelectIsPermintaanDana = [
    { id: 0, text: 'Uang Muka' },
    { id: 1, text: 'Permintaan Dana' }
  ];

  constructor(
    private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private bsModalService: BsModalService,
    private accRealisasiService: AccUangMukaRealisasiService,
    private accUMService: AccUangMukaService,
    private accPDService: AccPermintaanDanaService,
    private orgService: GbmOrganisasiService,
    private accAkunService: AccAkunService,
  ) {

    this.entryForm = this.builder.group({
      lokasi_id: new FormControl([], Validators.required),

      // optional sesuai permintaan Anda
      acc_uang_muka: new FormControl([]),
      acc_permintaan_dana: new FormControl([]),

      tanggal: new FormControl(new Date(), Validators.required),
      no_transaksi: new FormControl('', Validators.required),

      acc_akun_kasbank: new FormControl([], Validators.required),
      acc_akun_uang_muka: new FormControl([], Validators.required),

      keterangan: new FormControl([], Validators.required),

      is_permintaan_dana: new FormControl([], Validators.required),

      nilai_uang_muka: new FormControl(0, Validators.required),
      nilai_realisasi: new FormControl(0, Validators.required),
      selisih: new FormControl(0, Validators.required),

      details: this.builder.array([])
    });
  }

  ngOnInit() {
    this.loadSelect2();
  }

  ngAfterViewInit() {
    this.patchHeader();
    this.hitungTotal();
  }

  patchHeader() {
    let data = this.accUangMukaRealisasi;

    this.entryForm.controls['no_transaksi'].patchValue(data.no_transaksi);
    this.entryForm.controls['keterangan'].patchValue(data.keterangan);

    this.entryForm.controls['nilai_uang_muka'].patchValue(data.nilai_uang_muka);
    this.entryForm.controls['nilai_realisasi'].patchValue(data.nilai_realisasi);

    this.entryForm.controls['tanggal'].patchValue(new Date(Date.parse(data.tanggal)));

    this.entryForm.controls['is_permintaan_dana'].patchValue(
      data.is_permintaan_dana == 1
        ? { id: 1, text: 'Permintaan Dana' }
        : { id: 0, text: 'Uang Muka' }
    );
  }

  private loadSelect2(): void {

    /* ============================================
       1. LOKASI
    ============================================ */
    this.orgService.getAllAdmUnitByAccess().subscribe((x: any) => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ id: d.id, text: d.nama });

        if (d.id == this.accUangMukaRealisasi.lokasi_id) {
          this.entryForm.controls['lokasi_id'].patchValue({ id: d.id, text: d.nama });
        }
      });
    });

    /* ============================================
       2. LOKASI DETAIL
    ============================================ */
    this.orgService.getAllByType('UNIT').subscribe((x: any) => {
      this.dataSelectLokasiDetail = [];
      x.forEach(d => {
        this.dataSelectLokasiDetail.push({ id: d.id, text: d.nama });
      });
    });

    /* ============================================
       3. AKUN DETAIL
    ============================================ */
    this.accAkunService.getAllDetail().subscribe((x: any) => {
      this.dataSelectAkun = [];
      this.dataSelectAkunUangMuka = [];

      x.data.forEach(a => {
        const item = { id: a.id, text: a.kode + ' - ' + a.nama };
        this.dataSelectAkun.push(item);
        this.dataSelectAkunUangMuka.push(item);

        if (a.id == this.accUangMukaRealisasi.acc_akun_uang_muka_id) {
          this.entryForm.controls['acc_akun_uang_muka'].patchValue(item);
        }
      });
    });

    /* ============================================
       4. AKUN KASBANK
    ============================================ */
    this.accAkunService.getAllKasbank().subscribe((x: any) => {
      this.dataSelectAkunKasbank = [];
      x.data.forEach(a => {
        const item = { id: a.id, text: a.kode + ' - ' + a.nama };
        this.dataSelectAkunKasbank.push(item);

        if (a.id == this.accUangMukaRealisasi.acc_akun_kasbank_id) {
          this.entryForm.controls['acc_akun_kasbank'].patchValue(item);
        }
      });
    });

    /* ============================================
       5. UANG MUKA READONLY (jika is_permintaan_dana = 0)
    ============================================ */
    if (this.accUangMukaRealisasi.is_permintaan_dana == 0) {

      this.accUMService.getById(this.accUangMukaRealisasi.acc_uang_muka_id)
        .subscribe((res: any) => {

          let d = res.data;
          const val = {
            id: d.id,
            text: d.no_transaksi + ' (' + d.tanggal + ') - ' + d.keterangan
          };

          this.dataSelectUangMuka = [val];
          this.uangMuka = [d];

          this.entryForm.get('acc_uang_muka').patchValue(val);
          this.entryForm.get('acc_uang_muka').disable({ emitEvent: false });
        });
    }

    /* ============================================
       6. PERMINTAAN DANA READONLY (jika is_permintaan_dana = 1)
    ============================================ */
    if (this.accUangMukaRealisasi.is_permintaan_dana == 1) {

      this.accPDService.getById(this.accUangMukaRealisasi.acc_permintaan_dana_id)
        .subscribe((res: any) => {

          let d = res.data;
          const val = {
            id: d.id,
            text: d.no_transaksi + ' (' + d.tanggal + ') - ' + d.keterangan
          };

          this.dataSelectPermintaanDana = [val];
          this.permintaanDana = [d];

          this.entryForm.get('acc_permintaan_dana').patchValue(val);
          this.entryForm.get('acc_permintaan_dana').disable({ emitEvent: false });
        });
    }

    /* ============================================
       7. DETAIL JURNAL
    ============================================ */
    let rows = this.accUangMukaRealisasi.detail || [];
    rows.forEach(d => {
      this.addBlokItem(
        d.lokasi_id,
        d.acc_akun_id,
        d.kendaraan_mesin_id,
        d.blok_stasiun_id,
        d.kegiatan_id,
        d.debet,
        d.kredit,
        d.ket
      );
    });
  }



  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  }

  addBlokItem(
    lokasi_id: any = null,
    acc_akun_id: any = null,
    traksi_id: any = null,
    blok_id: any = null,
    kegiatan_id: any = null,
    debet: any = 0,
    kredit: any = 0,
    ket: any = ''
  ) {

    let lokasiDetail = null;
    this.dataSelectLokasiDetail.forEach(a => { if (a.id == lokasi_id) lokasiDetail = a; });

    let akun = null;
    this.dataSelectAkun.forEach(a => { if (a.id == acc_akun_id) akun = a; });

    let sdebet = isNumber(debet) ? debet : parseFloat(String(debet).replace(/[^\d\.\-]/g, ""));
    let skredit = isNumber(kredit) ? kredit : parseFloat(String(kredit).replace(/[^\d\.\-]/g, ""));

    let fb = this.builder.group({
      lokasi_id: new FormControl(lokasiDetail, Validators.required),
      acc_akun_id: new FormControl(akun, Validators.required),
      debet: new FormControl(formatNumber(sdebet, 'en_US', '1.2-2'), Validators.required),
      kredit: new FormControl(formatNumber(skredit, 'en_US', '1.2-2'), Validators.required),
      traksi_id: new FormControl(traksi_id || []),
      blok_id: new FormControl(blok_id || []),
      kegiatan_id: new FormControl(kegiatan_id || []),
      ket: new FormControl(ket),
    });

    this.details.push(fb);
    this.hitungTotal();
  }


  onSubmit() {

    this.isFormSubmitted = true;
    if (this.entryForm.invalid) return;

    let frm = this.entryForm.getRawValue();

    frm['tanggal'] = formatDate(frm['tanggal'], 'yyyy-MM-dd', 'en_US');

    frm['nilai_uang_muka'] = parseFloat(String(frm['nilai_uang_muka']).replace(/[^\d\.\-]/g, "")) || 0;
    frm['nilai_realisasi'] = parseFloat(String(frm['nilai_realisasi']).replace(/[^\d\.\-]/g, "")) || 0;
    frm['selisih'] = parseFloat(String(frm['selisih']).replace(/[^\d\.\-]/g, "")) || 0;

    frm.details.forEach(d => {
      d.debet = isNumber(d.debet) ? d.debet : parseFloat(String(d.debet).replace(/[^\d\.\-]/g, ""));
      d.kredit = isNumber(d.kredit) ? d.kredit : parseFloat(String(d.kredit).replace(/[^\d\.\-]/g, ""));
    });

    this.accRealisasiService.update(this.accUangMukaRealisasi.id, frm).subscribe((data: any) => {

      if (data.status == 'OK') {
        swal({
          title: 'Info!',
          text: 'Simpan berhasil',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        });

        this.event.emit('OK');
        this.bsModalRef.hide();
      }
      else {
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

  hitungTotal() {

    let dr = 0;
    let cr = 0;

    let um = this.entryForm.get('nilai_uang_muka').value;
    um = isNumber(um) ? um : parseFloat(String(um).replace(/[^\d\.\-]/g, "")) || 0;

    let rows = this.entryForm.get('details').value;

    rows.forEach(r => {
      let d = isNumber(r.debet) ? r.debet : parseFloat(String(r.debet).replace(/[^\d\.\-]/g, ""));
      let k = isNumber(r.kredit) ? r.kredit : parseFloat(String(r.kredit).replace(/[^\d\.\-]/g, ""));
      dr += d;
      cr += k;
    });

    let realisasi = dr - cr;
    let selisih = um - realisasi;

    this.entryForm.get('nilai_realisasi').patchValue(formatNumber(realisasi, 'en_US', '1.2-2'));
    this.entryForm.get('selisih').patchValue(formatNumber(selisih, 'en_US', '1.2-2'));
    this.entryForm.get('nilai_uang_muka').patchValue(formatNumber(um, 'en_US', '1.2-2'));
  }

  onClose() {
    this.bsModalRef.hide();
  }
  valueChange(e) {
    this.hitungTotal();
  }

  formatNumbering(form) {

    let debet = form.get('debet').value;
    let kredit = form.get('kredit').value;

    debet = isNumber(debet) ? debet : parseFloat(String(debet).replace(/[^\d\.\-]/g, ""));
    kredit = isNumber(kredit) ? kredit : parseFloat(String(kredit).replace(/[^\d\.\-]/g, ""));

    form.get('debet').patchValue(formatNumber(debet, 'en_US', '1.2-2'));
    form.get('kredit').patchValue(formatNumber(kredit, 'en_US', '1.2-2'));

    this.hitungTotal();
  }

  removeBlokItem(blok) {
    let i = this.details.controls.indexOf(blok);
    if (i !== -1) {
      this.details.removeAt(i);
    }
    this.hitungTotal();
  }
  get userControl() { return this.entryForm.controls; }
}
