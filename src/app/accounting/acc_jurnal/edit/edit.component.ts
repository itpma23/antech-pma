import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate, formatNumber } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { AccJurnal } from 'src/app/shared/models/acc_jurnal.model';
import { AccKegiatanService } from 'src/app/shared/services/acc_kegiatan.service';
import { TrkKendaraanService } from 'src/app/shared/services/trk_kendaraan.service';
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
import { isNumber } from 'util';
import { AccJurnalEntryService } from 'src/app/shared/services/acc_jurnal_entry.service';

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
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }

  entryForm: FormGroup;

  event: EventEmitter<any> = new EventEmitter();
  awalanHeading = "heading_";
  awalanCollapse = "collapse_";
  accJurnal: AccJurnal;
  dataSelectLokasi;
  dataSelectLokasiAfd;
  dataSelectGudang;
  dataSelectKaryawan;
  dataSelectBlok;
  dataSelectKegiatan;
  dataSelectUom;
  dataSelectAkun;
  dataSelectTipe;
  dataSelectTraksi;
  dataSelectLokasiDetail: any[];
  isLoadingDetail = false;
  dataSelectTipeJurnal: { id: string; text: string; }[];

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private accJurnalService: AccJurnalEntryService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private accKegiatanService: AccKegiatanService,
    private trkKendaraanService: TrkKendaraanService,
    private accAkunService: AccAkunService,
    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();
    let time: Date = new Date();

    this.entryForm = this.builder.group({
      tanggal: new FormControl(toDate, Validators.required),
      keterangan: new FormControl('', Validators.required),
      no_jurnal: new FormControl(''),
      no_referensi: new FormControl(''),
      lokasi_id: new FormControl([], Validators.required),
      total_debet: new FormControl(0),
      total_kredit: new FormControl(0),
      tipe_jurnal: new FormControl([]),


      details: this.builder.array([])


    });
  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    console.log(this.accJurnal)
    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.accJurnal.tanggal)));
    this.entryForm.get('keterangan').patchValue(this.accJurnal.keterangan);
    this.entryForm.get('no_jurnal').patchValue(this.accJurnal.no_jurnal);
    this.entryForm.get('no_referensi').patchValue(this.accJurnal.no_referensi);


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
      // this.entryForm.controls['keterangan'].patchValue(tipe_jurnal);

    });
    let selectTipe;
    this.dataSelectTipeJurnal.forEach(a => {
      if (a.id == this.accJurnal.tipe_jurnal) {
        selectTipe = a;
      }
    });
    this.entryForm.controls['tipe_jurnal'].patchValue(selectTipe);


    let selectLokasi;
    this.gbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
        if (this.accJurnal.lokasi_id == d.id) {
          selectLokasi = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectLokasi);
    });

    // let selectLokasiAfd;
    // this.gbmOrganisasiService.getAllByType('AFDELING_STASIUN').subscribe(x => {
    //   this.dataSelectLokasiAfd = [];
    //   x.forEach(d => {
    //     this.dataSelectLokasiAfd.push({ "id": d.id, "text": d.nama });
    //     if (this.accJurnal.lokasi_afd_id == d.id) {
    //       selectLokasiAfd = { "id": d.id, "text": d.nama }
    //     }
    //   });
    //   this.entryForm.get('lokasi_afd_id').patchValue(selectLokasiAfd);
    // });

    // let selectGudang;
    // this.gbmOrganisasiService.getAllByType('GUDANG').subscribe(x => {
    //   this.dataSelectGudang = [];
    //   x.forEach(d => {
    //     this.dataSelectGudang.push({ "id": d.id, "text": d.nama });
    //     if (this.accJurnal.gudang_id == d.id) {
    //       selectGudang = { "id": d.id, "text": d.nama }
    //     }
    //   });
    //   this.entryForm.get('gudang_id').patchValue(selectGudang);
    // });

    // let selectKaryawan;
    // this.karyawanService.getAll().subscribe(x => {
    //   this.dataSelectKaryawan = [];
    //   x['data'].forEach(d => {
    //     this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama });
    //     if (this.accJurnal.karyawan_id == d.id) {
    //       selectKaryawan = { "id": d.id, "text": d.nama }
    //     }
    //   });
    //   this.entryForm.get('karyawan_id').patchValue(selectKaryawan);
    // });

    this.gbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasiDetail = [];
      x.forEach(d => {
        this.dataSelectLokasiDetail.push({ "id": d.id, "text": d.nama });

      });
      this.accAkunService.getAllDetail().subscribe(x => {
        this.dataSelectAkun = [];
        x['data'].forEach(d => {
          this.dataSelectAkun.push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
        });
        this.trkKendaraanService.getAll().subscribe(x => {
          this.dataSelectTraksi = [];
          x['data'].forEach(d => {
            this.dataSelectTraksi.push({ "id": d.id, "text": d.kode + '-' + d.nama + '(' + d.traksi + ')' });
          });

          this.gbmOrganisasiService.getAllByType('BLOK_MESIN').subscribe(x => {
            this.dataSelectBlok = [];
            x.forEach(d => {
              this.dataSelectBlok.push({ "id": d.id, "text": d.kode + ' - ' + d.nama + '(' + d.nama_parent + ')' });
            });

            this.accKegiatanService.getAll().subscribe(x => {
              this.dataSelectKegiatan = [];
              x['data'].forEach(d => {
                this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama + " (" + d.kode + ")" });
              });

              this.isLoadingDetail = true;

              let dtl = this.accJurnal.detail;

              for (const d of dtl) {

                this.addBlok(
                  d['lokasi_id'],
                  d['acc_akun_id'],
                  d['kendaraan_mesin_id'],
                  d['blok_stasiun_id'],
                  d['kegiatan_id'],
                  d['debet'],
                  d['kredit'],
                  d['ket']
                );

              }

              this.isLoadingDetail = false;
              this.hitungNilai();
            });
          });
        });
      });
    });


  }
  onSubmit() {


    this.isFormSubmitted = true;

    if (this.entryForm.invalid) {
      return;
    }

    let frmData = this.entryForm.value;
    let total_debet = parseFloat(this.entryForm.get('total_debet').value.replace(/[^\d\.\-]/g, ""));
    let total_kredit = parseFloat(this.entryForm.get('total_kredit').value.replace(/[^\d\.\-]/g, ""));
    if (total_debet != total_kredit) {
      swal({
        title: 'Perhatian!',
        text: 'Debet/Kredit belum balance!',
        type: 'warning',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      })
      return;
    }
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');

    this.entryForm.get('details').value.forEach(x => {
      if (!isNumber(x.debet)) {
        x.debet = parseFloat(x.debet.replace(/[^\d\.\-]/g, ""));
      }
      if (!isNumber(x.kredit)) {
        x.kredit = parseFloat(x.kredit.replace(/[^\d\.\-]/g, ""));
      }
    });
    // // console.log(frmData);
    this.accJurnalService.update(this.accJurnal.id, frmData).subscribe(data => {
      // console.log(data);
      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Data berhasil diubah',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })

        this.event.emit('OK');
        this.bsModalRef.hide();
      } else {
        swal({
          title: 'Proses Simpan Gagal!',
          text: '' + data['data'],
          type: 'warning',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
      }
    });
  }

  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };
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
  addBlokNew() {

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


  addBlok(lokasi_id, acc_akun_id, traksi_id, blok_id, kegiatan_id, debet, kredit, ket) {

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

    if (!this.isLoadingDetail) {
      this.formatNumbering(fb);
    }
  }




  removeBlokItem(item) {
    let i = this.details.controls.indexOf(item);
    if (i != -1) {
      // let x=	this.details.controls.splice(i, 1);
      let items = this.entryForm.get('details') as FormArray;
      items.removeAt(i);
      let data = { details: items.value };
      this.updateForm(data);
    }
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
    // console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

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
