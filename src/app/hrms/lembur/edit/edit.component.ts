import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { HrmsLemburService } from 'src/app/shared/services/hrms_lembur.service';
import { HrmsLokasiService } from 'src/app/shared/services/hrms_lokasi.service';
import { HrmsKaryawanGajiService } from 'src/app/shared/services/hrms_karyawan_gaji.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { HrmsBasisLemburService } from 'src/app/shared/services/hrms_basis_lembur.service';
import { isNull } from 'util';

declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'edit-lembur-cmp',
  templateUrl: 'edit.component.html'
})

export class EditComponent implements OnInit, AfterViewInit {
  bsConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'YYYY-MM-DD',

    containerClass: 'theme-dark-blue'
  };
  editor_modules: any;
  isFormSubmitted = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }

  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();
  pengajar_id;
  hari_id;
  lembur;
  gapok = 0;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private karyawanService: KaryawanService,
    private hrmsLemburService: HrmsLemburService,
    private hrmsLokasiService: HrmsLokasiService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private translate: TranslateService,
    private hrmsKaryawanGajiService: HrmsKaryawanGajiService,
    private HrmsBasisLemburService: HrmsBasisLemburService,
  ) {

    let toDate: Date = new Date();
    let time: Date = new Date();
    this.entryForm = this.builder.group({
      karyawan_id: new FormControl([], Validators.required),
      lokasi_id: new FormControl([], Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      // lembur_perjam: new FormControl(0,Validators.required),
      nilai_lembur: new FormControl(0, Validators.required),
      tipe_lembur: new FormControl([], Validators.required),
      istirahat: new FormControl(0),
      // basis_lembur: new FormControl([], Validators.required),
      // basis_lembur_id: new FormControl('', Validators.required),
      jumlah_jam: new FormControl(0, Validators.required),
      jam_mulai: new FormControl(time, Validators.required),
      jam_selesai: new FormControl(time, Validators.required),

    });

  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {
    let date: Date = new Date();
    let strDate = formatDate(date, "yyyy-MM-dd", "en_US");
    let tanggal = new Date(Date.parse(this.lembur['tanggal']));


    this.entryForm.get('jam_mulai').patchValue(strDate + " " + this.lembur['mulai']);
    this.entryForm.get('jam_selesai').patchValue(strDate + " " + this.lembur['selesai']);
    this.entryForm.get('tanggal').patchValue(tanggal);
    this.entryForm.get('jumlah_jam').patchValue(this.lembur['jumlah_jam']);
    this.entryForm.get('nilai_lembur').patchValue(this.lembur['nilai_lembur']);
    this.entryForm.get('istirahat').patchValue(this.lembur['istirahat']);
    // this.entryForm.get('lembur_perjam').patchValue(this.lembur['lembur_perjam']);


  }
  public dataSelectLokasi: any[] = [];
  public dataSelectKaryawan: any[] = [];
  public dataSelectTipeLembur: any[] = [];
  public dataSelectBasisLembur: any[] = [];
  public dataLembur: any[] = [];
  public dataGapok: any[] = [];
  public nilaiLembur;
  public basisLembur;


  private loadSelect2(): void {
    console.log(this.lembur)
    let selectedKaryawan;
    this.karyawanService.getAll().subscribe(x => {
      this.dataSelectKaryawan = [];
      let kary = x['data'];
      kary.forEach(d => {
        this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama });
        if (d.id == this.lembur['karyawan_id']) {
          selectedKaryawan = { "id": d.id, "text": d.nama };
        }

      });
      this.entryForm.get('karyawan_id').patchValue(selectedKaryawan);
    });
    // let gapok;
    this.entryForm.controls['karyawan_id'].valueChanges.subscribe(x => {
      let karyawan_id = x.id;
      // this.dataGapok.forEach(x => {
      //   if (x.id == karyawan_id) {
      //     this.gapok = x.text;

      //   }
      //   this.calculateTime();
      // });
    });


    let selectedMill;
    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
        if (this.lembur.lokasi_id == d.id) {
          selectedMill = { "id": d.id, "text": d.nama };
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectedMill);
    });

    this.dataSelectTipeLembur = [
      { id: 'HariKerja', text: 'Hari Kerja' },
      { id: 'HariMinggu', text: 'Hari Minggu' },
      { id: 'HariLibur', text: 'Hari Libur' },
      { id: 'HariRaya', text: 'Hari Raya' },
    ];

    let selectedTipeLembur;
    this.dataSelectTipeLembur.forEach(x => {
      if (x.id == this.lembur.tipe_lembur) {
        selectedTipeLembur = x;
      }
    });
    this.entryForm.get('tipe_lembur').patchValue(selectedTipeLembur);
    let selectedBasisLembur;

    // this.HrmsBasisLemburService.getAll().subscribe(x => {

    //   this.dataSelectBasisLembur = [];
    //   x['data'].forEach(d => {
    //     this.dataSelectBasisLembur.push({ "id": d.id, "text": d.jumlah_jam_lembur });
    //     if (this.lembur.basis_lembur_id == d.id) {
    //       selectedBasisLembur = { "id": d.id, "text": d.jumlah_jam_lembur };
    //       this.dataSelectTipeLembur.forEach(x => {
    //         if (x.id == d.tipe_lembur) {
    //           selectedTipeLembur = x;
    //         }
    //       });
    //       this.basisLembur = d;
    //     }
    //   });
    //   this.entryForm.get('basis_lembur').patchValue(selectedBasisLembur);
    //   this.entryForm.get('tipe_lembur').patchValue(selectedTipeLembur);
    //   this.entryForm.get('basis_lembur_id').patchValue(selectedBasisLembur.id);

    //   console.log()
    // });


    // this.entryForm.controls['tipe_lembur'].valueChanges.subscribe(x => {
    //   let tipe_lembur = x.id;
    //   this.HrmsBasisLemburService.getAll().subscribe(x => {
    //     this.dataSelectBasisLembur = [];
    //     x['data'].forEach(d => {
    //       if (d.tipe_lembur == tipe_lembur) {
    //         this.dataSelectBasisLembur.push({ "id": d.id, "text": d.basis_jam_lembur });
    //       }
    //     });
    //   });
    // });

    // this.entryForm.controls['basis_lembur'].valueChanges.subscribe(x => {
    //   let basis_jam_lembur = x.text;
    //   this.dataLembur.forEach(x => {
    //     if (x.basis_jam_lembur == basis_jam_lembur) {
    //       this.entryForm.get('jumlah_jam').patchValue(x.jumlah_jam_lembur);
    //       this.nilaiLembur = (1 / 173 * this.gapok) * x.jumlah_jam_lembur;
    //       this.entryForm.get('nilai_lembur').patchValue(this.nilaiLembur.toFixed(2));
    //     }
    //   });
    // });


  }
  onSubmit() {
    this.isFormSubmitted = true;
    console.log(this.entryForm);

    if (this.entryForm.invalid) {
      return;
    }
    let jam_mulai = formatDate(this.entryForm.get('jam_mulai').value, "HH:mm", "en_US");
    let jam_selesai = formatDate(this.entryForm.get('jam_selesai').value, "HH:mm", "en_US");

    let frmData = new FormData();
    frmData.append('tanggal', formatDate(this.entryForm.get('tanggal').value, "yyy-MM-dd", "en_US"));
    frmData.append('karyawan_id', this.entryForm.get('karyawan_id').value['id']);
    frmData.append('lokasi_id', this.entryForm.get('lokasi_id').value['id']);
    frmData.append('tipe_lembur', this.entryForm.get('tipe_lembur').value['id']);
    frmData.append('mulai', jam_mulai);
    frmData.append('selesai', jam_selesai);
    frmData.append('istirahat', this.entryForm.get('istirahat').value);
    frmData.append('jumlah_jam', this.entryForm.get('jumlah_jam').value);
    frmData.append('nilai_lembur', this.entryForm.get('nilai_lembur').value);
    frmData.append('basis_lembur_id',"0");
    // frmData.append('lembur_perjam', this.entryForm.get('lembur_perjam').value);
    this.hrmsLemburService.update(this.lembur.id, frmData).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        console.log('ok');
        this.event.emit('OK');
        this.bsModalRef.hide();
      }
    });
  }

  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.entryForm.patchValue({
      img: file
    });
    this.entryForm.get('img').updateValueAndValidity()
    console.log(file);
  }
  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();

  }
  // getLemburPerjam(karyawan_id) {
  //   let karyawanGaji;
  //   if (karyawan_id != null) {
  //     this.hrmsKaryawanGajiService.getById(karyawan_id).subscribe(data => {

  //       karyawanGaji = data['data'];
  //       if (karyawanGaji['detail'].length == 0) {
  //         this.entryForm.get('lembur_perjam').patchValue(0);
  //       } else {
  //         this.entryForm.get('lembur_perjam').patchValue(parseFloat(karyawanGaji['lembur_perjam']));
  //       }
  //       this.calculateTime();
  //     });
  //   } else {
  //     this.entryForm.get('lembur_perjam').patchValue(0);

  //   }


  // }
  calculateTime() {
    let jam_masuk = this.entryForm.get('jam_mulai').value;
    let jam_selesai = this.entryForm.get('jam_selesai').value;
    let istirahat = this.entryForm.get('istirahat').value;
    // console.log(jam_masuk.getTime());
    // console.log(jam_selesai.getTime());
    let x = 0;
    let selisihjam = 0;
    let totaljam = 0;
    if (jam_masuk < jam_selesai) {
      let x = jam_selesai.getTime() - jam_masuk.getTime();
      // console.log(x);
      // x=(x % 86400000) / 3600000;
      selisihjam = (x / 3600000);

    }
    if (jam_masuk > jam_selesai) {
      let x = (86400000 + jam_selesai.getTime()) - jam_masuk.getTime();
      // console.log(x);
      // x=(x % 86400000) / 3600000;
      selisihjam = (x / 3600000);
    }
    // let t = this.entryForm.get('jam_selesai').value - this.entryForm.get('jam_mulai').value
    // var jam = t / (1000 * 3600);
    totaljam=selisihjam-istirahat
    this.entryForm.get('jumlah_jam').patchValue(selisihjam);
    if (!(this.entryForm.get('karyawan_id').value)) {
      return
    }else{
      if (!(this.entryForm.get('karyawan_id').value['id'])) {
        return
      }
    };
    let data = { karyawan_id: this.entryForm.get('karyawan_id').value['id'], tipe_lembur: this.entryForm.get('tipe_lembur').value['id'], jumlah_jam: totaljam }
    // console.log(data)
    this.hrmsLemburService.hitungLembur(data).subscribe(d => {
      let res = d['data'];
      this.nilaiLembur = res['gapok_perjam'] * res['jumlah_jam'];
      this.entryForm.get('nilai_lembur').patchValue(this.nilaiLembur.toFixed(2));


    })


  }
  calculateOvertime(e) {
    // var jam = this.entryForm.get('jumlah_jam').value;
    // var lembur_perjam = this.entryForm.get('lembur_perjam').value
    // this.entryForm.get('nilai_lembur').patchValue(jam * 1.5 * lembur_perjam);

    // console.log(jam);
  }
  valueChange(event) {
    //this.getLemburPerjam(event.id);


  }
  valueTimeChange(event) {
    console.log(event);
    this.calculateTime();


  }
}
