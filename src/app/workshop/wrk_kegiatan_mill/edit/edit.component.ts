import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { AccKegiatanService } from 'src/app/shared/services/acc_kegiatan.service';
import { TrkKendaraanService } from 'src/app/shared/services/trk_kendaraan.service';
import { WrkKegiatanMillService } from 'src/app/shared/services/wrk_kegiatan_mill.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { WrkKegiatan, WrkKegiatanDetail, WrkKegiatanDetailItem, WrkKegiatanLog } from 'src/app/shared/models/wrk_kegiatan.model';

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
  dataSelectMesin: any[];
  dataSelectStasiun: any[];


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private trkKendaraanService: TrkKendaraanService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private KaryawanService: KaryawanService,
    private accKegiatanService: AccKegiatanService,
    private WrkKegiatanMillService: WrkKegiatanMillService,
    private InvItemService:InvItemService,
    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();
    let time: Date = new Date();

    this.entryForm = this.builder.group({
      no_transaksi: new FormControl(''),
      lokasi_id: new FormControl([], Validators.required),
      // kendaraan_mesin_id: new FormControl([]),
      mesin_id: new FormControl([]),
      stasiun_id: new FormControl([]),
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
    this.gbmOrganisasiService.getAllByType('MILL').subscribe(x => {
      this.dataSelectEstate = [];
      x.forEach(d => {
        this.dataSelectEstate.push({ "id": d.id, "text": d.nama });
        if (this.WrkKegiatan.lokasi_id == d.id) {
          selectedEstate = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectedEstate);
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

    let selectedStasiun;
    this.gbmOrganisasiService.getAllByType('STASIUN').subscribe(x => {
      this.dataSelectStasiun = [];
      x.forEach(d => {
        this.dataSelectStasiun.push({ "id": d.id, "text": d.nama });
        if (this.WrkKegiatan.stasiun_id == d.id) {
          selectedStasiun = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('stasiun_id').patchValue(selectedStasiun);
      this.entryForm.controls['stasiun_id'].valueChanges.subscribe(x => {
        let st_id = x.id;
        this.gbmOrganisasiService.getMesinByStasiun(st_id).subscribe(x => {
          this.dataSelectMesin = [];
          x.forEach(d => {
            this.dataSelectMesin.push({ "id": d.id, "text": d.nama });
          });
        });
      })
    });

    let selectedMesin:any=[];
    this.gbmOrganisasiService.getAllByType('MESIN').subscribe(x => {
      this.dataSelectMesin = [];
      x.forEach(d => {
        this.dataSelectMesin.push({ "id": d.id, "text": d.kode + " - " + d.nama });
        if (this.WrkKegiatan.mesin_id == d.id) {
          selectedMesin = { "id": d.id, "text": d.kode + " - " + d.nama }
        }
      });
      this.entryForm.get('mesin_id').patchValue(selectedMesin);
    });

    // let selectedItem;
    this.InvItemService.getAllSukuCadang().subscribe(x => {
      this.dataSelectItem = [];
      x['data'].forEach(d => {
        this.dataSelectItem.push({ "id": d.id, "text": d.kode + " - " + d.nama });
        // if (this.WrkKegiatan.item_id == d.id) {
        //   selectedItem = { "id": d.id, "text": d.nama }
        // }
      });
      // this.entryForm.get('item_id').patchValue(selectedItem);

      let dtlItem: WrkKegiatanDetailItem[];
      console.log(dtlItem);
      dtlItem = this.WrkKegiatan.detail_item;
      for (let index = 0; index < dtlItem.length; index++) {
        const d = dtlItem[index];
        this.addDetailItem(d.item_id, d.qty, d.ket);
      }
    })

    this.KaryawanService.getByLokasiTugas(this.WrkKegiatan.lokasi_id).subscribe(t => {
      console.log('x');
      this.dataSelectKaryawan = [];
      let i = t['data'];
      i.forEach(d => {
        this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama + "(" + d.nip + ")" });
      });
      let dtl: WrkKegiatanDetail[];
      dtl = this.WrkKegiatan.detail;
      for (let index = 0; index < dtl.length; index++) {
        const d = dtl[index];
        this.addDetail(d.karyawan_id, d.jumlah_hk, d.rupiah_hk, d.premi);
      }

    });
    // this.accKegiatanService.getAll().subscribe(k => {
    //   this.dataSelectKegiatan = [];
    //   k['data'].forEach(d => {
    //     this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama });
    //   });
    //   this.gbmOrganisasiService.getAllByType('BLOK').subscribe(x => {
    //     this.dataSelectBlok = [];
    //     x.forEach(d => {
    //       this.dataSelectBlok.push({ "id": d.id, "text": d.nama + "(" + d.kode + ")" });
    //     });
    //     let dtl: WrkKegiatanLog[];
    //     dtl = this.WrkKegiatan.detail_log;
    //     for (let index = 0; index < dtl.length; index++) {
    //       const d = dtl[index];
    //       this.addKegiatan(d.blok_id, d.acc_kegiatan_id, d.km_hm_mulai, d.km_hm_akhir, d.km_hm_jumlah, d.volume);
    //     }

    //   });


    // });




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

    this.WrkKegiatanMillService.update(this.WrkKegiatan.id, frmData).subscribe(data => {
      // console.log(data);
      if( data['status']=='OK'){
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
      }else{
        swal({
          title: 'Perhatian!',
          text: 'Proses Simpan Gagal' ,
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
  addKegiatan(blok_id, Kegiatan_id, km_hm_mulai, km_hm_akhir, km_hm_jumlah, volume) {


    let selectedKegiatan = [];
    this.dataSelectKegiatan.forEach(a => {
      if (Kegiatan_id == a.id) {
        selectedKegiatan = a;
      }
    });

    let selectedBlok = [];
    this.dataSelectBlok.forEach(a => {
      if (blok_id == a.id) {
        selectedBlok = a;
      }
    });


    let fb = this.builder.group({
      blok_id: new FormControl(selectedBlok, Validators.required),
      kegiatan_id: new FormControl(selectedKegiatan, Validators.required),
      km_hm_mulai: new FormControl(km_hm_mulai, Validators.required),
      km_hm_akhir: new FormControl(km_hm_akhir, Validators.required),
      km_hm_jumlah: new FormControl(km_hm_jumlah, Validators.required),
      volume: new FormControl(volume, Validators.required),
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
    this.WrkKegiatanMillService.hitungPremi(data).subscribe(res => {
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

}
