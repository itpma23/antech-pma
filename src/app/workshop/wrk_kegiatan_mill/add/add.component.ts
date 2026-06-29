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


  dataSelectWorkshop;
  dataSelectBlok;
  dataSelectItem;

  dataSelectMandor;
  dataSelectAsisten;
  dataSelectKegiatan;
  dataSelectEstate: any[];
  dataSelectKerani: any[];
  dataSelectKaryawan: any[];
  dataSelectGudang: any[];
  dataSelectKendaraan: any[];
  dataSelectStasiun: any[];
  dataSelectMesin: any[];

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private trkKendaraanService: TrkKendaraanService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private KaryawanService: KaryawanService,
    private accKegiatanService: AccKegiatanService,
    private WrkKegiatan:WrkKegiatanMillService,
    private InvItemService:InvItemService,
    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();
    let time: Date = new Date();

    this.entryForm = this.builder.group({

      no_transaksi: new FormControl('(AutoNumber)'),

      lokasi_id: new FormControl([], Validators.required),
      mesin_id: new FormControl([]),
      workshop_id: new FormControl([], Validators.required),
      stasiun_id: new FormControl([], Validators.required),
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
    // this.addDetail('mesin');
    this.addDetail();
    // this.addDetailItem();
    // this.addKegiatan();
  }
  public options: any;

  private loadSelect2(): void {

    this.accKegiatanService.getAll().subscribe(x => {
      this.dataSelectKegiatan = [];
      x['data'].forEach(d => {
        this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama });
      });
    });

    this.trkKendaraanService.getAll().subscribe(x => {
      this.dataSelectKendaraan = [];
      x['data'].forEach(d => {
        this.dataSelectKendaraan.push({ "id": d.id, "text": d.kode + " - " + d.nama+"("+d.traksi+")" });
      });
    })

    this.InvItemService.getAllSukuCadang().subscribe(x => {
      this.dataSelectItem = [];
      // console.log(x);
      x['data'].forEach(d => {
        this.dataSelectItem.push({ "id": d.id, "text": d.kode + " - " + d.nama });
      });
    })

    this.GbmOrganisasiService.getAllByType('MILL').subscribe(x => {
      this.dataSelectEstate = [];
      x.forEach(d => {
        this.dataSelectEstate.push({ "id": d.id, "text": d.nama });
      });
      this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {
        let org_id = x.id;
        this.GbmOrganisasiService.getWorkshopByUnit(org_id).subscribe(x => {
          this.dataSelectWorkshop = [];
          x.forEach(d => {
            this.dataSelectWorkshop.push({ "id": d.id, "text": d.nama });
          });
        });

        this.KaryawanService.getByLokasiTugas(org_id).subscribe(x => {
          this.dataSelectKaryawan = [];
          this.dataSelectMandor = [];
          this.dataSelectAsisten = [];
          this.dataSelectKerani = [];
          let kary = x['data'];
          kary.forEach(d => {
              if (d.lokasi_tugas_id == org_id) {
               this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama+" - "+d.nip+" - "+d.sub_bagian_nama });
               this.dataSelectMandor.push({ "id": d.id, "text": d.nama+" - "+d.nip+" - "+d.sub_bagian_nama });
                }
          });
        });
        this.GbmOrganisasiService.getAfdStByUnit(org_id).subscribe(x => {
          this.dataSelectStasiun = [];
          x.forEach(d => {
            this.dataSelectStasiun.push({ "id": d.id, "text": d.nama + "("+ d.kode +")" });
          });
          this.entryForm.controls['stasiun_id'].valueChanges.subscribe(x => {
            let st_id = x.id;
            this.GbmOrganisasiService.getMesinByStasiun(st_id).subscribe(x => {
              this.dataSelectMesin = [];
              x.forEach(d => {
                this.dataSelectMesin.push({ "id": d.id, "text": d.nama });
              });
            });
          })
        });
      });
    });

  }
  onSubmitClear() {
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
    let frmData = this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    this.WrkKegiatan.create(frmData).subscribe(data => {
      if (data['status'] == 'OK') {
        swal({
          title: 'Info!',
          text: 'Data berhasil disimpan dengan Nomor:'+data['data'],
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        // this.bsModalRef.hide();
        this.isFormSubmitted = false;

        let date: Date = new Date();
        let strDate = formatDate(date, "yyyy-MM-dd", "en_US");

        this.entryForm.get('no_transaksi').patchValue('(AutoNumber)');
        this.entryForm.get('tanggal').patchValue(new Date(Date.parse(strDate)));
        this.entryForm.get('tgl_mulai').patchValue(new Date(Date.parse(strDate)));
        this.entryForm.get('tgl_akhir').patchValue(new Date(Date.parse(strDate)));
        this.entryForm.get('km_hm_mulai').patchValue(0);
        this.entryForm.get('km_hm_akhir').patchValue(0);
        this.entryForm.get('lama_perbaikan').patchValue(0);
        this.entryForm.get('kerusakan').patchValue('');
        this.entryForm.get('alasan').patchValue('');
        this.entryForm.get('lokasi_id').patchValue({});
        this.entryForm.get('workshop_id').patchValue({});
        this.entryForm.get('kendaraan_mesin_id').patchValue({});
        this.entryForm.get('details').patchValue([]);
        this.entryForm.get('details_item').patchValue([]);

        this.event.emit('OK');
        return;
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
  onSubmit() {
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


    this.WrkKegiatan.create(frmData).subscribe(data => {
      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Data berhasil disimpan dengan Nomor:'+data['data'],
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

  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };
  get details_item(): FormArray {
    return this.entryForm.get('details_item') as FormArray;
  };
  get details_kegiatan(): FormArray {
    return this.entryForm.get('details_kegiatan') as FormArray;
  };
  // get details_kegiatan(): FormArray {
  //   return this.entryForm.get('details_kegiatan') as FormArray;
  // };


  addDetail() {
    this.details.push(this.builder.group({
      karyawan_id: new FormControl([], Validators.required),
      jumlah_hk: new FormControl(0, Validators.required),
      rupiah_hk: new FormControl(0, Validators.required),
      premi: new FormControl(0, Validators.required),
      // item_id: new FormControl([], Validators.required),
      // qty: new FormControl(0, Validators.required),
      // ket: new FormControl('', Validators.required),
    }));

    // this.valueChange();
  }
  addDetailItem() {
    this.details_item.push(this.builder.group({
      item_id: new FormControl([], Validators.required),
      qty: new FormControl(1, Validators.required),
      ket: new FormControl(''),
    }));

    // this.valueChange();
  }
  addKegiatan() {
    this.details_kegiatan.push(this.builder.group({
      km_hm_mulai: new FormControl(0, Validators.required),
      km_hm_akhir: new FormControl(0, Validators.required),
      km_hm_jumlah: new FormControl(0, Validators.required),
      blok_id: new FormControl([], Validators.required),
      kegiatan_id: new FormControl([], Validators.required),
      // hasil_kerja: new FormControl(0, Validators.required),
      volume: new FormControl(1, Validators.required),
    }));
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
      let Kegiatans = this.entryForm.get('details_kegiatan') as FormArray;
      Kegiatans.removeAt(i);
      let data = { details_kegiatan: Kegiatans.value };
      this.updateForm(data);
    }

    // this.valueChange();
  }
  // removeBlokKegiatan( blok ) {
  //   let i = this.details_kegiatan.controls.indexOf(blok);
  //   if(i != -1) {
  //     let detail = this.entryForm.get('details_kegiatan') as FormArray;
  //     detail.removeAt(i);
  //     let data = {details_kegiatan: detail.value};
  //     this.updateForm(data);
  //   }
  // }


  updateForm(data) {
    // const bloks = data.details;
    // let sub = 0;
    // for(let i of bloks){
    //   sub=sub+ parseFloat( i.jumlah_janjang);
    // }
    // // console.log(sub);
    //this.entryForm.get('total').patchValue( sub);

  }
  recalculate() {
    // let bloks = this.entryForm.get('details') as FormArray;
    // let data = { details: bloks.value };
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
    this.WrkKegiatan.hitungPremi(data).subscribe(res => {
      console.log(res)

      if (res['status'] == 'OK') {
        let hasil = res['data']
        let volume = parseFloat(blok.get('jumlah_hk').value)
        let rp_hk = parseFloat(hasil['rp_hk'])
        blok.get('rupiah_hk').patchValue(volume*rp_hk);


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
