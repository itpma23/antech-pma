import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { formatDate, formatNumber } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { AccJurnalEntryService } from 'src/app/shared/services/acc_jurnal_entry.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { AccKegiatanService } from 'src/app/shared/services/acc_kegiatan.service';
import { TrkKendaraanService } from 'src/app/shared/services/trk_kendaraan.service';
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
import { isNumber } from 'util';
import { ImportComponent } from '../import/import.component';


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
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }

  entryForm: FormGroup;

  event: EventEmitter<any> = new EventEmitter();

  awalanHeading = "heading_";
  awalanCollapse = "collapse_";
  dataSelectLokasi;
  dataSelectLokasiAfd;
  dataSelectGudang;
  dataSelectBlok;
  dataSelectMesin;
  dataSelectKegiatan;
  dataSelectKaryawan;
  dataSelectUom;
  dataSelectAkun;
  dataSelecttipe_jurnal;
  dataSelectTraksi;
  dataSelectLokasiDetail: any[];
  dataSelectTipeJurnal: { id: string; text: string; }[];

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private bsModalRef2: BsModalRef,
    private accJurnalService: AccJurnalEntryService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private accKegiatanService: AccKegiatanService,
    private trkKendaraanService: TrkKendaraanService,
    private accAkunService: AccAkunService,
    private bsModalService: BsModalService,

    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();
    this.entryForm = this.builder.group({

      tanggal: new FormControl(toDate, Validators.required),
      keterangan: new FormControl('', Validators.required),
      no_jurnal: new FormControl('<OTOMATIS>'),
      no_referensi: new FormControl(''),
      total_debet: new FormControl(0),
      total_kredit: new FormControl(0),
      lokasi_id: new FormControl([], Validators.required),
      tipe_jurnal: new FormControl([]),


      details: this.builder.array([])

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }
  public options: any;

  private loadSelect2(): void {

    this.dataSelectTipeJurnal = [
      { id: 'UMUM', text: 'UMUM' },
      { id: 'CLOSING', text: 'TUTUP BUKU' },
      { id: 'OTH', text: 'LAIN - LAIN' },
      { id: 'ADJ', text: 'ADJUSTMENT' },
      { id: 'RECLASS-LR', text: 'RECLASS LABA RUGI' },

    ];
    this.entryForm.controls['tipe_jurnal'].valueChanges.subscribe(x => {
      let tipe_jurnal = x.id;
      this.entryForm.controls['keterangan'].patchValue(tipe_jurnal);

    });
    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasiDetail = [];
      x.forEach(d => {
        this.dataSelectLokasiDetail.push({ "id": d.id, "text": d.nama });
      });
    });

    this.GbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
    });

    this.accKegiatanService.getAll().subscribe(x => {
      this.dataSelectKegiatan = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama + " (" + d.kode + ")" });
      });
    });


    this.accAkunService.getAllDetail().subscribe(x => {
      this.dataSelectAkun = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectAkun.push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
      });
    });


    this.trkKendaraanService.getAll().subscribe(x => {
      this.dataSelectTraksi = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectTraksi.push({ "id": d.id, "text": d.kode + '-' + d.nama + '(' + d.traksi + ')' });
      });
    });

    this.GbmOrganisasiService.getAllByType('BLOK_MESIN').subscribe(x => {
      this.dataSelectBlok = [];
      x.forEach(d => {
        this.dataSelectBlok.push({ "id": d.id, "text": d.kode + ' - ' + d.nama + '(' + d.nama_parent + ')' });
      });
    });

  }
  onSubmit() {

  this.isFormSubmitted = true;

  if (this.entryForm.invalid) {
    swal({
      title: 'Perhatian!',
      text: 'Data belum lengkap!',
      type: 'warning',
      confirmButtonClass: "btn btn-success",
      buttonsStyling: false
    });
    return;
  }

  let frmData = this.entryForm.getRawValue();

  let total_debet = parseFloat(
    this.entryForm.get('total_debet').value.toString().replace(/[^\d\.\-]/g, "")
  ) || 0;

  let total_kredit = parseFloat(
    this.entryForm.get('total_kredit').value.toString().replace(/[^\d\.\-]/g, "")
  ) || 0;

  if (total_debet !== total_kredit) {
    swal({
      title: 'Perhatian!',
      text: 'Debet/Kredit belum balance!',
      type: 'warning',
      confirmButtonClass: "btn btn-success",
      buttonsStyling: false
    });
    return;
  }

  frmData.tanggal = formatDate(frmData.tanggal, "yyyy-MM-dd", 'en_US');

  this.accJurnalService.create(frmData).subscribe((data: any) => {

    if (data.status === 'OK') {

      swal({
        title: 'Info!',
        text: 'Data berhasil disimpan dengan Nomor: ' + data.data,
        type: 'success',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      });

      this.event.emit('OK');
      this.bsModalRef.hide();

    } else {

      swal({
        title: 'Proses Simpan Gagal!',
        text: '' + data.data,
        type: 'warning',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      });

    }

  });

}


  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };


  addBlokItem() {
    let selectedLokasiDetail: any = [];
    let lokasi_id = this.entryForm.get('lokasi_id').value['id'];
    let keterangan = this.entryForm.get('keterangan').value;
    this.dataSelectLokasiDetail.forEach(a => {
      if (lokasi_id == a.id) {
        selectedLokasiDetail = a;
      }
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
  }
  hitungNilai() {
    let dr = 0;
    let cr = 0;
    let jumlah = 0;
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


    this.entryForm.get('total_debet').patchValue(formatNumber(dr, 'en_US', '1.2-2'));
    this.entryForm.get('total_kredit').patchValue(formatNumber(cr, 'en_US', '1.2-2'));

  }
formatNumbering(form) {

  let debet = form.get('debet').value;
  let kredit = form.get('kredit').value;

  debet = Number(debet.toString().replace(/[^\d\.\-]/g, "")) || 0;
  kredit = Number(kredit.toString().replace(/[^\d\.\-]/g, "")) || 0;

  form.get('debet').patchValue(
    formatNumber(debet, 'en_US', '1.2-2'),
    { emitEvent: false }
  );

  form.get('kredit').patchValue(
    formatNumber(kredit, 'en_US', '1.2-2'),
    { emitEvent: false }
  );

  // 🔥 penting
  this.hitungNilai();

}
  updateForm(data) {

  }
  recalculate() {


  }
  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();


  }
  valueChange($event) {

  }
  import() {
    let modalConfig = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true,
      //size: 'lg',
      class: "modal-lg ",

    };
    this.bsModalRef2 = this.bsModalService.show(ImportComponent, modalConfig);
    this.bsModalRef2.content.event.subscribe(result => {
      if (result.status == 'OK') {
        let dtl = result.data;

        for (let index = 0; index < dtl.length; index++) {
          const d = dtl[index];
          this.addDetail(
            d['lokasi_id'],
            d['acc_akun_id'],
            null, null, null,
            d['debet'],
            d['kredit'],
            d['ket']
          );
        }

        // PENTING
        this.hitungNilai();

        // baru validasi
        this.validateBalanceAfterImport();
      }
    });
  }
  addDetail(lokasi_id, acc_akun_id, traksi_id, blok_id, kegiatan_id, debet, kredit, ket) {

    this.dataSelectBlok;
    this.dataSelectKegiatan;
    this.dataSelectUom;
    this.dataSelectAkun;
    let selectedLokasiDetail;
    this.dataSelectLokasiDetail.forEach(a => {
      if (lokasi_id == a.id) {
        selectedLokasiDetail = a;
      }
    });
    let selectedAkun;
    this.dataSelectAkun.forEach(a => {
      if (acc_akun_id == a.id) {
        selectedAkun = a;
      }
    });

    let selectedTraksi = [];
    this.dataSelectTraksi.forEach(a => {
      if (traksi_id == a.id) {
        selectedTraksi = a;
      }
    });
    let selectedBlok = [];
    this.dataSelectBlok.forEach(a => {
      if (blok_id == a.id) {
        selectedBlok = a;
      }
    });
    let selectedKegiatan = [];
    this.dataSelectKegiatan.forEach(a => {
      if (kegiatan_id == a.id) {
        selectedKegiatan = a;
      }
    });

    let fb = this.builder.group({

      lokasi_id: new FormControl(selectedLokasiDetail, Validators.required),
      acc_akun_id: new FormControl(selectedAkun, Validators.required),
      debet: new FormControl(debet, Validators.required),
      kredit: new FormControl(kredit, Validators.required),
      traksi_id: new FormControl(selectedTraksi,),
      blok_id: new FormControl(selectedBlok,),
      kegiatan_id: new FormControl(selectedKegiatan,),
      ket: new FormControl(ket,),

    });

    this.details.push(fb);
    this.formatNumbering(fb);
  }
  generateJurnalLR() {
    let tanggal = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    let lokasi_id = this.entryForm.get('lokasi_id').value.id;
    let sendData = { tanggal: tanggal, lokasi_id: lokasi_id };
    this.accJurnalService.generateJurnalLR(sendData).subscribe(data => {
      let dtl = data['data'];
      for (let index = 0; index < dtl.length; index++) {
        const d = dtl[index];
        this.addDetail(d['lokasi_id'], d['acc_akun_id'], null, null, null, d['debet'], d['kredit'], d['ket']);
      }

    });

  }

  validateBalanceAfterImport() {

    let totalDebetControl = this.entryForm.get('total_debet');
    let totalKreditControl = this.entryForm.get('total_kredit');

    let total_debet = 0;
    let total_kredit = 0;

    if (totalDebetControl && totalDebetControl.value !== null && totalDebetControl.value !== undefined) {
      total_debet = Number(
        totalDebetControl.value.toString().replace(/[^\d\.\-]/g, "")
      );
    }

    if (totalKreditControl && totalKreditControl.value !== null && totalKreditControl.value !== undefined) {
      total_kredit = Number(
        totalKreditControl.value.toString().replace(/[^\d\.\-]/g, "")
      );
    }

    if (isNaN(total_debet)) total_debet = 0;
    if (isNaN(total_kredit)) total_kredit = 0;

    if (total_debet !== total_kredit) {
      swal({
        title: 'Perhatian!',
        text: 'Hasil import tidak balance!',
        type: 'warning',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      });
    }
  }
  trackByIndex(index: number) {
    return index;
  }

  copyDetail(index: number) {

    const src = this.details.at(index).value;

    const fb = this.builder.group({

      lokasi_id: new FormControl(src.lokasi_id, Validators.required),
      acc_akun_id: new FormControl(src.acc_akun_id, Validators.required),
      debet: new FormControl(src.debet),
      kredit: new FormControl(src.kredit),
      traksi_id: new FormControl(src.traksi_id),
      blok_id: new FormControl(src.blok_id),
      kegiatan_id: new FormControl(src.kegiatan_id),
      ket: new FormControl(src.ket)

    });

    this.details.push(fb);
    this.hitungNilai();

  }
}
