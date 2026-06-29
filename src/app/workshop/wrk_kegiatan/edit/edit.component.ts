import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { AccKegiatanService } from 'src/app/shared/services/acc_kegiatan.service';
import { TrkKendaraanService } from 'src/app/shared/services/trk_kendaraan.service';
import { WrkKegiatanService } from 'src/app/shared/services/wrk_kegiatan.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { WrkKegiatan, WrkKegiatanDetail, WrkKegiatanDetailItem, WrkKegiatanLog, WrkKegiatanKendaraanLog } from 'src/app/shared/models/wrk_kegiatan.model';

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
  awalanHeading = "heading_";
  awalanCollapse = "collapse_";

  entryForm: FormGroup;

  event: EventEmitter<any> = new EventEmitter();

  WrkKegiatan: WrkKegiatan;
  dataSelectAfdeling;
  dataSelectBlok;
  dataSelectItem;

  dataSelectMandor;
  dataSelectAsisten;
  dataSelectKegiatan;
  dataSelectEstate: any[];
  dataSelectKerani: any[];
  dataSelectKaryawan: any[];
  dataSelectGudang: any[];
  dataSelectWorkshop: any;
  dataSelectKendaraan: any[];


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private trkKendaraanService: TrkKendaraanService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private KaryawanService: KaryawanService,
    private accKegiatanService: AccKegiatanService,
    private WrkKegiatanService: WrkKegiatanService,
    private InvItemService: InvItemService,
    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();
    let time: Date = new Date();

    this.entryForm = this.builder.group({
      no_transaksi: new FormControl(''),
      lokasi_id: new FormControl([], Validators.required),
      kendaraan_mesin_id: new FormControl([]),
      workshop_id: new FormControl([], Validators.required),

      tanggal: new FormControl(toDate, Validators.required),
      tgl_mulai: new FormControl(toDate, Validators.required),
      tgl_akhir: new FormControl(toDate, Validators.required),
      km_hm_mulai: new FormControl(0, Validators.required),
      km_hm_akhir: new FormControl(0, Validators.required),
      lama_perbaikan: new FormControl(0, Validators.required),
      kerusakan: new FormControl(''),
      alasan: new FormControl(''),

      jam_mulai: new FormControl(time, Validators.required),
      jam_akhir: new FormControl(time, Validators.required),

      details: this.builder.array([]),
      details_kegiatan: this.builder.array([]),
      details_item: this.builder.array([]),
      // details_kegiatan: this.builder.array([]),
    });
  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    let date: Date = new Date();
    let strDate = formatDate(date, "yyyy-MM-dd", "en_US");

    this.entryForm.get('no_transaksi').patchValue(this.WrkKegiatan.no_transaksi);
    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.WrkKegiatan.tanggal)));
    this.entryForm.get('tgl_mulai').patchValue(new Date(Date.parse(this.WrkKegiatan.tgl_mulai)));
    this.entryForm.get('tgl_akhir').patchValue(new Date(Date.parse(this.WrkKegiatan.tgl_akhir)));
    this.entryForm.get('km_hm_mulai').patchValue(this.WrkKegiatan.km_hm_mulai);
    this.entryForm.get('km_hm_akhir').patchValue(this.WrkKegiatan.km_hm_akhir);
    this.entryForm.get('lama_perbaikan').patchValue(this.WrkKegiatan.lama_perbaikan);
    this.entryForm.get('kerusakan').patchValue(this.WrkKegiatan.kerusakan);
    this.entryForm.get('alasan').patchValue(this.WrkKegiatan.alasan);

    this.entryForm.get('jam_mulai').patchValue(strDate + " " + this.WrkKegiatan['jam_mulai']);
    this.entryForm.get('jam_akhir').patchValue(strDate + " " + this.WrkKegiatan['jam_akhir']);


  }
  public options: any;

  private loadSelect2(): void {
    let selectedEstate;
    this.gbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectEstate = [];
      x.forEach(d => {
        this.dataSelectEstate.push({ "id": d.id, "text": d.nama });
        if (this.WrkKegiatan.lokasi_id == d.id) {
          selectedEstate = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectedEstate);
      this.gbmOrganisasiService.getById(this.WrkKegiatan.lokasi_id).subscribe(lok => {
        console.log(lok)
        if (lok['data']['tipe'] == 'MILL') {
          this.accKegiatanService.getAllbyTipe('TRAKSI_MILL').subscribe(k => {
            this.dataSelectKegiatan = [];
            k['data'].forEach(d => {
              this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama + " - " + d.kode });
            });
            this.gbmOrganisasiService.getAllByType('MESIN').subscribe(x => {
              this.dataSelectBlok = [];
              x.forEach(d => {
                this.dataSelectBlok.push({ "id": d.id, "text": d.nama + "(" + d.kode + ")"+" - "+ d.nama_parent  });
              });
              let selectedKendaraan: any = [];
              this.trkKendaraanService.getAll().subscribe(x => {
                this.dataSelectKendaraan = [];
                x['data'].forEach(d => {
                  this.dataSelectKendaraan.push({ "id": d.id, "text": d.kode + " - " + d.nama + "(" + d.traksi + ")" });
                  if (this.WrkKegiatan.kendaraan_mesin_id == d.id) {
                    selectedKendaraan = { "id": d.id, "text": d.kode + " - " + d.nama + "(" + d.traksi + ")" }
                  }
                });
                this.entryForm.get('kendaraan_mesin_id').patchValue(selectedKendaraan);
                let dtl: WrkKegiatanKendaraanLog[];
                  dtl = this.WrkKegiatan.detail_log;
                  for (let index = 0; index < dtl.length; index++) {
                    const d = dtl[index];
                    this.addKegiatan(d.blok_id, d.kendaraan_id, d.acc_kegiatan_id, d.jumlah_jam,d.hm_km, d.volume, d.ket);
                  }
              });

            });
          });

        } else {
          this.accKegiatanService.getAllbyTipe('TRAKSI').subscribe(k => {
            this.dataSelectKegiatan = [];
            k['data'].forEach(d => {
              this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama + " - " + d.kode });
            });
            this.gbmOrganisasiService.getBlokByEstate(this.WrkKegiatan.lokasi_id).subscribe(x => {
              this.dataSelectBlok = [];
              x.forEach(d => {
                this.dataSelectBlok.push({ "id": d.id, "text": d.nama + "(" + d.kode + ")"+" - "+ d.nama_parent  });
              });
              let selectedKendaraan: any = [];
              this.trkKendaraanService.getAll().subscribe(x => {
                this.dataSelectKendaraan = [];
                x['data'].forEach(d => {
                  this.dataSelectKendaraan.push({ "id": d.id, "text": d.kode + " - " + d.nama + "(" + d.traksi + ")" });
                  if (this.WrkKegiatan.kendaraan_mesin_id == d.id) {
                    selectedKendaraan = { "id": d.id, "text": d.kode + " - " + d.nama + "(" + d.traksi + ")" }
                  }
                });
                this.entryForm.get('kendaraan_mesin_id').patchValue(selectedKendaraan);
                let dtl: WrkKegiatanKendaraanLog[];
                  dtl = this.WrkKegiatan.detail_log;
                  for (let index = 0; index < dtl.length; index++) {
                    const d = dtl[index];
                    this.addKegiatan(d.blok_id, d.kendaraan_id, d.acc_kegiatan_id, d.jumlah_jam,d.hm_km, d.volume, d.ket);
                  }
              });

            });
          });
        }
      })
    });


    let selectedWorkshop;
    this.gbmOrganisasiService.getAllByType('WORKSHOP').subscribe(x => {
      this.dataSelectWorkshop = [];
      x.forEach(d => {
        this.dataSelectWorkshop.push({ "id": d.id, "text": d.nama });
        if (this.WrkKegiatan.workshop_id == d.id) {
          selectedWorkshop = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('workshop_id').patchValue(selectedWorkshop);
    });

    // let selectedItem;
    // this.InvItemService.getAllSukuCadang().subscribe(x => {
    //   this.dataSelectItem = [];
    //   x['data'].forEach(d => {
    //     this.dataSelectItem.push({ "id": d.id, "text": d.kode + " - " + d.nama });

    //   });

    //   let dtlItem: WrkKegiatanDetailItem[];
    //   console.log(dtlItem);
    //   dtlItem = this.WrkKegiatan.detail_item;
    //   for (let index = 0; index < dtlItem.length; index++) {
    //     const d = dtlItem[index];
    //     this.addDetailItem(d.item_id, d.qty, d.ket);
    //   }
    // })

    this.KaryawanService.getByLokasiTugas(this.WrkKegiatan.lokasi_id).subscribe(t => {
      console.log('x');
      this.dataSelectKaryawan = [];
      let i = t['data'];
      i.forEach(d => {
        this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama + "(" + d.nip + ")" });
      });

      let dtl: WrkKegiatanDetail[];
      dtl = this.WrkKegiatan.detail;
      console.log(this.WrkKegiatan);
      for (let index = 0; index < dtl.length; index++) {
        const d = dtl[index];
        this.addDetail(d.karyawan_id, d.jumlah_hk, d.rupiah_hk, d.premi);
      }

    });

  }
  onSubmit() {
    // // console.log(this.entryForm.value);

    this.isFormSubmitted = true;

    if (this.entryForm.invalid) {
      swal({
        title: 'Perhatian!',
        text: 'Data belum lengkap!',
        type: 'warning',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      })
      return;
    }


    let jam_mulai = formatDate(this.entryForm.get('jam_mulai').value, "HH:mm", "en_US");
    let jam_akhir = formatDate(this.entryForm.get('jam_akhir').value, "HH:mm", "en_US");

    let frmData = this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    frmData['jam_mulai'] = jam_mulai;
    frmData['jam_akhir'] = jam_akhir;

    this.WrkKegiatanService.update(this.WrkKegiatan.id, frmData).subscribe(data => {
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
  get details_item(): FormArray {
    return this.entryForm.get('details_item') as FormArray;
  };
  get details_kegiatan(): FormArray {
    return this.entryForm.get('details_kegiatan') as FormArray;
  };


  addDetail(karyawan_id, jumlah_hk, rupiah_hk, premi) {

    let selectedKaryawan = [];
    this.dataSelectKaryawan.forEach(a => {
      if (karyawan_id == a.id) {
        selectedKaryawan = a;
      }
    });


    let fb = this.builder.group({
      karyawan_id: new FormControl(selectedKaryawan, Validators.required),
      jumlah_hk: new FormControl(jumlah_hk, Validators.required),
      rupiah_hk: new FormControl(rupiah_hk, Validators.required),
      premi: new FormControl(premi, Validators.required),
    });

    this.details.push(fb);

    // this.valueChange();
  }
  addDetailItem(item_id, qty, ket) {

    let selectedItem = [];
    this.dataSelectItem.forEach(a => {
      if (item_id == a.id) {
        selectedItem = a;
      }
    });


    let fb = this.builder.group({
      item_id: new FormControl(selectedItem, Validators.required),
      qty: new FormControl(qty, Validators.required),
      ket: new FormControl(ket),
    });

    this.details_item.push(fb);

    // this.valueChange();
  }
  addKegiatan(blok_id, kendaraan_id, acc_kegiatan_id, jumlah_jam,hm_km, volume, ket) {
    let selectedKegiatan = [];
    this.dataSelectKegiatan.forEach(a => {
      if (acc_kegiatan_id == a.id) {
        selectedKegiatan = a;
      }
    });
    let selectedKendaraan = [];
    this.dataSelectKendaraan.forEach(a => {
      if (kendaraan_id == a.id) {
        selectedKendaraan = a;
      }
    });
    console.log(acc_kegiatan_id);

    let selectedBlok = [];
    this.dataSelectBlok.forEach(a => {
      if (blok_id == a.id) {
        selectedBlok = a;
      }
    });


    let fb = this.builder.group({
      blok_id: new FormControl(selectedBlok),
      kendaraan_id: new FormControl(selectedKendaraan),
      acc_kegiatan_id: new FormControl(selectedKegiatan, Validators.required),
      jumlah_jam: new FormControl(jumlah_jam, Validators.required),
      hm_km: new FormControl(hm_km, Validators.required),
      volume: new FormControl(volume, Validators.required),
      ket: new FormControl(ket),
    });

    this.details_kegiatan.push(fb);

    // this.valueChange();
  }

  removeDetail(dtl) {
    let i = this.details.controls.indexOf(dtl);
    if (i != -1) {
      //  let x=	this.details.controls.splice(i, 1);
      let dtls = this.entryForm.get('details') as FormArray;
      dtls.removeAt(i);
      let data = { details: dtls.value };
      this.updateForm(data);
    }

    // this.valueChange();
  }
  removeDetailItem(dtl) {
    let i = this.details_item.controls.indexOf(dtl);
    if (i != -1) {
      //  let x=	this.details.controls.splice(i, 1);
      let dtls = this.entryForm.get('details_item') as FormArray;
      dtls.removeAt(i);
      let data = { details: dtls.value };
      this.updateForm(data);
    }

    // this.valueChange();
  }
  removeKegiatan(Kegiatan) {
    let i = this.details_kegiatan.controls.indexOf(Kegiatan);
    if (i != -1) {
      //  let x=	this.details.controls.splice(i, 1);
      let kegiatans = this.entryForm.get('details_kegiatan') as FormArray;
      kegiatans.removeAt(i);
      let data = { details_kegiatan: kegiatans.value };
      this.updateForm(data);
    }

    // this.valueChange();
  }




  updateForm(data) {
    // const Kegiatans = data.details;
    // // console.log(Kegiatans);
    // let sub = 0;
    // for(let i of Kegiatans){
    //   sub=sub+ parseFloat( i.qty);

    // }
    // // console.log(sub);
  }
  recalculate() {
    // let Kegiatans = this.entryForm.get('details') as FormArray;
    // let data = { details: Kegiatans.value };
    // this.updateForm(data);
  }
  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();
    // this.valueChange();
  }
  valueChange(event, blok) {
    // console.log(event);
    // console.log(blok);
    this.hitungPremi(blok);
  }

  hitungPremi(blok) {

    let data = blok.value
    data['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    console.log(data);
    this.WrkKegiatanService.hitungPremi(data).subscribe(res => {
      console.log(res)

      if (res['status'] == 'OK') {
        let hasil = res['data']
        let qty = parseFloat(blok.get('jumlah_hk').value)
        let rp_hk = parseFloat(hasil['rp_hk'])
        blok.get('rupiah_hk').patchValue(qty * rp_hk);


      }
    });

  }


  calculateTime(event) {
    let jam_masuk = this.entryForm.get('jam_mulai').value;
    let jam_selesai = this.entryForm.get('jam_akhir').value;

    let selisihjam = 0;

    if (jam_masuk < jam_selesai) {
      let x = jam_selesai.getTime() - jam_masuk.getTime();
      selisihjam = (x / 3600000);
    }
    if (jam_masuk > jam_selesai) {
      let x = (86400000 + jam_selesai.getTime()) - jam_masuk.getTime();
      selisihjam = (x / 3600000);
    }

    this.entryForm.get('lama_perbaikan').patchValue(selisihjam);
  }

  detailMesin(event) {
    if (event == null) {
      $("#detail_mesin").hide();
    } else {
      if (event.id == null || event.id == undefined) {
        $("#detail_mesin").hide();
      } else {
        $("#detail_mesin").show();
      }

    }
  }

}
