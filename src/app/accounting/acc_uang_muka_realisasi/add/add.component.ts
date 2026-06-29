import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';

import { formatDate, formatNumber } from '@angular/common';

import { AccUangMukaRealisasiService } from 'src/app/shared/services/acc_uang_muka_realisasi.service';
import { LookupRekapComponent } from '../lookup-rekap/lookup-rekap.component';
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
import 'bootstrap-notify';
import { isNumber } from 'util';
import { AccPermintaanDanaService } from 'src/app/shared/services/acc_permintaan_dana.service';

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
  };

  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();

  public options: any;
  awalanHeading = "heading_";
  awalanCollapse = "collapse_";
  sumberDoc = '';

  dataSelectLokasi;
  dataSelectLokasiAfd;
  dataSelectGudang;
  dataSelectBlok;
  dataSelectMesin;
  dataSelectKegiatan;
  dataSelectKaryawan;
  dataSelectUom;

  dataSelectIsPermintaanDana = [
    { id: 0, text: 'Uang Muka' },
    { id: 1, text: 'Permintaan Dana' }
  ];

  dataSelectAkun;
  dataSelecttipe_jurnal;
  dataSelectTraksi;
  dataSelectLokasiDetail: any[] = [];

  dataSelectPermintaanDana: any[] = [];
  dataSelectJenisUangMuka: any[] = [];
  dataSelectUangMuka: any[] = [];
  dataSelectAkunUangMuka: any[] = [];
  dataSelectAkunRealisasi: any[] = [];
  kontrak: any[] = [];
  dataSelectAkunKasbank: any[] = [];

  uangMuka: any[] = [];
  permintaanDana: any[] = [];

  constructor(
    private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private bsModalRef1: BsModalRef,
    private bsModalService: BsModalService,
    private accUangMukaRealisasiService: AccUangMukaRealisasiService,
    private accPermintaanDanaService: AccPermintaanDanaService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private accAkunService: AccAkunService
  ) {

    let toDate: Date = new Date();

    this.entryForm = this.builder.group({
      lokasi_id: new FormControl([], Validators.required),

      // VALIDATOR DIHAPUS SESUAI PERMINTAAN
      acc_uang_muka: new FormControl([]),
      acc_permintaan_dana: new FormControl([]),

      tanggal: new FormControl(toDate, Validators.required),
      no_transaksi: new FormControl('<OTOMATIS>', Validators.required),
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

  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {}

  private loadSelect2(): void {

    // Load akun detail
    this.accAkunService.getAllDetail().subscribe(x => {
      this.dataSelectAkunUangMuka = [];
      let i = x['data'];

      i.forEach(d => {
        this.dataSelectAkunUangMuka.push({ id: d.id, text: d.kode + ' - ' + d.nama });
      });

      this.dataSelectAkun = [];
      i.forEach(d => {
        this.dataSelectAkun.push({ id: d.id, text: d.kode + ' - ' + d.nama });
      });
    });

    this.accAkunService.getAllKasbank().subscribe(x => {
      this.dataSelectAkunKasbank = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectAkunKasbank.push({ id: d.id, text: d.kode + ' - ' + d.nama });
      });
    });

    this.GbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ id: d.id, text: d.nama });
      });
    });

    // Uang Muka
    this.accUangMukaRealisasiService.getAllUangMukaBlmRealisasi().subscribe(x => {
      this.dataSelectUangMuka = [];
      this.uangMuka = [];
      let data = x['data'] || [];

      data.forEach(d => {
        this.dataSelectUangMuka.push({
          id: d.id,
          text: d.no_transaksi + '(' + d.tanggal + ') -' + d.keterangan
        });
        this.uangMuka.push(d);
      });
    });

    // Permintaan Dana
    this.accUangMukaRealisasiService.getAllPermintaanDanaBlmRealisasi().subscribe(x => {
      this.dataSelectPermintaanDana = [];
      this.permintaanDana = [];
      let data = x['data'] || [];

      data.forEach(d => {
        this.dataSelectPermintaanDana.push({
          id: d.id,
          text: d.no_transaksi + '(' + d.tanggal + ') -' + d.keterangan
        });
        this.permintaanDana.push(d);
      });
    });

    // Lokasi Detail
    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasiDetail = [];
      x.forEach(d => {
        this.dataSelectLokasiDetail.push({ id: d.id, text: d.nama });
      });
    });

    // VALUE CHANGE — ACC UANG MUKA (NO OPTIONAL CHAINING)
    this.entryForm.controls['acc_uang_muka'].valueChanges.subscribe(x => {

      const acc_uang_muka = x && x.id ? x.id : null;

      if (acc_uang_muka) {
        this.uangMuka.forEach(d => {
          if (acc_uang_muka === d.id) {
            this.entryForm.controls['nilai_uang_muka'].patchValue(d.nilai);
            this.entryForm.controls['keterangan'].patchValue('Realisasi:' + d.keterangan);

            this.dataSelectAkunUangMuka.forEach(u => {
              if (u.id === d.acc_akun_id) {
                this.entryForm.controls['acc_akun_uang_muka'].patchValue(u);
              }
            });
          }
        });
      } else {
        this.entryForm.controls['nilai_uang_muka'].patchValue(0);
      }

      this.hitungTotal();
    });

    // VALUE CHANGE — PERMINTAAN DANA
    this.entryForm.controls['acc_permintaan_dana'].valueChanges.subscribe(x => {

      const acc_pd = x && x.id ? x.id : null;

      if (acc_pd) {
        this.permintaanDana.forEach(d => {
          if (acc_pd === d.id) {

            this.entryForm.controls['nilai_uang_muka'].patchValue(d.nilai);
            this.entryForm.controls['keterangan'].patchValue('Realisasi:' + d.keterangan);

            this.dataSelectAkunUangMuka.forEach(u => {
              if (u.id === d.acc_akun_id) {
                this.entryForm.controls['acc_akun_uang_muka'].patchValue(u);
              }
            });

          }
        });
      } else {
        this.entryForm.controls['nilai_uang_muka'].patchValue(0);
      }

      this.hitungTotal();
    });

    // VALIDATOR DINAMIS DIHAPUS SESUAI PERMINTAAN
  }

  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  }

  addBlokItem() {

    let lokasiValue = this.entryForm.get('lokasi_id').value;
    let lokasiId = lokasiValue && lokasiValue.id ? lokasiValue.id : null;

    let selectedLokasiDetail: any = [];

    this.dataSelectLokasiDetail.forEach(a => {
      if (lokasiId == a.id) {
        selectedLokasiDetail = a;
      }
    });

    let keterangan = this.entryForm.get('keterangan').value;

    this.details.push(this.builder.group({
      lokasi_id: new FormControl(selectedLokasiDetail, Validators.required),
      acc_akun_id: new FormControl([], Validators.required),
      debet: new FormControl(0, Validators.required),
      kredit: new FormControl(0, Validators.required),
      traksi_id: new FormControl([]),
      blok_id: new FormControl([]),
      kegiatan_id: new FormControl([]),
      ket: new FormControl(keterangan),
    }));
  }

  addBlok(
    lokasi_id,
    acc_akun_id,
    traksi_id,
    blok_id,
    kegiatan_id,
    debet,
    kredit,
    ket
  ) {
    let selectedLokasiDetail;
    this.dataSelectLokasiDetail.forEach(a => {
      if (lokasi_id == a.id) selectedLokasiDetail = a;
    });

    let selectedAkun;
    this.dataSelectAkun.forEach(a => {
      if (acc_akun_id == a.id) selectedAkun = a;
    });

    let selectedTraksi = [];
    if (this.dataSelectTraksi) {
      this.dataSelectTraksi.forEach(a => {
        if (traksi_id == a.id) selectedTraksi = a;
      });
    }

    let selectedBlok = [];
    if (this.dataSelectBlok) {
      this.dataSelectBlok.forEach(a => {
        if (blok_id == a.id) selectedBlok = a;
      });
    }

    let selectedKegiatan = [];
    if (this.dataSelectKegiatan) {
      this.dataSelectKegiatan.forEach(a => {
        if (kegiatan_id == a.id) selectedKegiatan = a;
      });
    }

    let sdebet = isNumber(debet) ? debet : parseFloat(String(debet).replace(/[^\d\.\-]/g, ""));
    let skredit = isNumber(kredit) ? kredit : parseFloat(String(kredit).replace(/[^\d\.\-]/g, ""));

    let fb = this.builder.group({
      lokasi_id: new FormControl(selectedLokasiDetail, Validators.required),
      acc_akun_id: new FormControl(selectedAkun, Validators.required),
      debet: new FormControl(formatNumber(sdebet, 'en_US', '1.2-2'), Validators.required),
      kredit: new FormControl(formatNumber(skredit, 'en_US', '1.2-2'), Validators.required),
      traksi_id: new FormControl(selectedTraksi),
      blok_id: new FormControl(selectedBlok),
      kegiatan_id: new FormControl(selectedKegiatan),
      ket: new FormControl(ket),
    });

    this.details.push(fb);
    this.hitungTotal();
  }

  onSubmit() {

    this.isFormSubmitted = true;

    if (this.entryForm.invalid) return;

    let frmData = this.entryForm.value;

    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, 'yyyy-MM-dd', 'en_US');
    frmData['selisih'] = parseFloat(String(frmData['selisih']).replace(/[^\d\.\-]/g, "")) || 0;
    frmData['nilai_realisasi'] = parseFloat(String(frmData['nilai_realisasi']).replace(/[^\d\.\-]/g, "")) || 0;
    frmData['nilai_uang_muka'] = parseFloat(String(frmData['nilai_uang_muka']).replace(/[^\d\.\-]/g, "")) || 0;

    frmData['details'].forEach(x => {
      x.debet = isNumber(x.debet) ? x.debet : parseFloat(String(x.debet).replace(/[^\d\.\-]/g, ""));
      x.kredit = isNumber(x.kredit) ? x.kredit : parseFloat(String(x.kredit).replace(/[^\d\.\-]/g, ""));
    });

    this.accUangMukaRealisasiService.create(frmData).subscribe(data => {

      if (data['status'] === 'OK') {

        swal({
          title: 'Info!',
          text: 'Data berhasil disimpan dengan Nomor:' + data['data'],
          type: 'success',
          confirmButtonClass: 'btn btn-success',
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
          confirmButtonClass: 'btn btn-success',
          buttonsStyling: false
        });
      }
    });

  }

  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();
  }

  valueChange(e) {
    this.hitungTotal();
  }

  hitungTotal() {
    let dr = 0;
    let cr = 0;

    let um = this.entryForm.get('nilai_uang_muka').value;
    um = isNumber(um) ? um : parseFloat(String(um).replace(/[^\d\.\-]/g, "")) || 0;

    this.entryForm.get('details').value.forEach(x => {
      let d = isNumber(x.debet) ? x.debet : parseFloat(String(x.debet).replace(/[^\d\.\-]/g, ""));
      let k = isNumber(x.kredit) ? x.kredit : parseFloat(String(x.kredit).replace(/[^\d\.\-]/g, ""));
      dr += d;
      cr += k;
    });

    let realisasi = dr - cr;
    let selisih = um - realisasi;

    this.entryForm.get('selisih').patchValue(formatNumber(selisih, 'en_US', '1.2-2'));
    this.entryForm.get('nilai_uang_muka').patchValue(formatNumber(um, 'en_US', '1.2-2'));
    this.entryForm.get('nilai_realisasi').patchValue(formatNumber(realisasi, 'en_US', '1.2-2'));
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
}
