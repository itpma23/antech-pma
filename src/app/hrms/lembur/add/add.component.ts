import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { formatDate } from '@angular/common';
import ImageResize from 'quill-image-resize-module';
import { TranslateService } from '@ngx-translate/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { HrmsLemburService } from 'src/app/shared/services/hrms_lembur.service';
import { HrmsLokasiService } from 'src/app/shared/services/hrms_lokasi.service';
import { HrmsKomponenGajiService } from 'src/app/shared/services/hrms_komponen_gaji.service';
import { HrmsKaryawanGajiService } from 'src/app/shared/services/hrms_karyawan_gaji.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { HrmsBasisLemburService } from 'src/app/shared/services/hrms_basis_lembur.service';
import { isEmpty } from 'rxjs/operators';
import { isNull } from 'util';

declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'add-absensi-cmp',
  templateUrl: 'add.component.html'
})

export class AddComponent implements OnInit, AfterViewInit {
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
  karyawan_id;
  hari_id;
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
      // basis_lembur: new FormControl([]),
      // basis_lembur_id: new FormControl(0),
      jumlah_jam: new FormControl(0),
      istirahat: new FormControl(0),
      jam_mulai: new FormControl(time, Validators.required),
      jam_selesai: new FormControl(time, Validators.required),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    this.loadSelect2();
  }
  public dataSelectLokasi: any[] = [];
  public dataSelectKaryawan: any[] = [];
  public dataSelectTipeLembur: any[] = [];
  public dataSelectBasisLembur: any[] = [];
  public dataLembur: any[] = [];
  public dataGapok: any[] = [];

  public nilaiLembur;

  public options: any;

  private loadSelect2(): void {
    let m = this.translate.instant('holidays.messages.update');

    this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {
      let lok_id = x.id;
      this.karyawanService.getByLokasiTugas(lok_id).subscribe(x => {
        this.dataSelectKaryawan = [];
        console.log(x);
        let kary = x['data'];
        kary.forEach(d => {
          // beforeDataSelectKaryawan.push({ "id": d.id, "text": d.nama+" - "+d.nik_ktp+" - "+d.sub_bagian_nama });
          if (d.lokasi_tugas_id == lok_id) {
            this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama + " - " + d.nip + " - " + d.sub_bagian_nama });
            this.dataGapok.push({ "id": d.id, "text": d.gapok });
          }
        });
      });
    });

    // let gapok;
    // this.entryForm.controls['karyawan_id'].valueChanges.subscribe(x => {
    //   let karyawan_id = x.id;
    //   this.dataGapok.forEach(x => {
    //     if (x.id == karyawan_id) {
    //       gapok = x.text;
    //     }
    //     this.calculateTime();
    //   });
    // });

    this.GbmOrganisasiService.getAllByType("UNIT").subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
    });


    // this.HrmsBasisLemburService.getAll().subscribe(x=>{
    //   this.dataSelectTipeLembur=[];
    //   x['data'].forEach(d => {
    //     // this.dataSelectTipeLembur.push({"id":d.tipe_lembur,"text":d.tipe_lembur});
    //   });
    // });
    this.dataSelectTipeLembur = [
      { id: 'HariKerja', text: 'Hari Kerja' },
      { id: 'HariMinggu', text: 'Hari Minggu' },
      { id: 'HariLibur', text: 'Hari Libur' },
      { id: 'HariRaya', text: 'Hari Raya' },
    ];

    this.entryForm.controls['tipe_lembur'].valueChanges.subscribe(x => {
      this.calculateTime();
      // let tipe_lembur = x.id;
      // this.HrmsBasisLemburService.getAll().subscribe(x => {
      //   this.dataSelectBasisLembur = [];
      //   x['data'].forEach(d => {
      //     if (d.tipe_lembur == tipe_lembur) {
      //       this.dataSelectBasisLembur.push({ "id": d.id, "text": d.basis_jam_lembur });
      //       this.dataLembur.push(d);
      //     }
      //   });
      // });
    });

    // this.entryForm.controls['basis_lembur'].valueChanges.subscribe(x => {
    //   this.entryForm.get('basis_lembur_id').patchValue(x.id);
    //   let basis_jam_lembur = x.text;
    //   this.dataLembur.forEach(x => {
    //     if (x.basis_jam_lembur == basis_jam_lembur) {
    //       this.entryForm.get('jumlah_jam').patchValue(x.jumlah_jam_lembur);
    //       this.nilaiLembur = (1 / 173 * gapok) * x.jumlah_jam_lembur;
    //       this.entryForm.get('nilai_lembur').patchValue(this.nilaiLembur.toFixed(2));
    //     }
    //   });
    // });

  }
  getLemburPerjam(karyawan_id) {
    let karyawanGaji;
    if (karyawan_id != null) {
      this.hrmsKaryawanGajiService.getById(karyawan_id).subscribe(data => {
        karyawanGaji = data['data'];
        if (karyawanGaji['detail'].length == 0) {
          this.entryForm.get('lembur_perjam').patchValue(0);
        } else {
          this.entryForm.get('lembur_perjam').patchValue(parseFloat(karyawanGaji['lembur_perjam']));
        }
        this.calculateTime();
      });
    } else {
      this.entryForm.get('lembur_perjam').patchValue(0);

    }


  }

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
    totaljam = selisihjam - istirahat
    // let t = this.entryForm.get('jam_selesai').value - this.entryForm.get('jam_mulai').value
    // var jam = t / (1000 * 3600);

    if (isNull(this.entryForm.get('karyawan_id').value['id'])) {
      return
    };
    this.entryForm.get('jumlah_jam').patchValue(selisihjam);
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
  onSubmit() {
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let jam_mulai = formatDate(this.entryForm.get('jam_mulai').value, "HH:mm", "en_US");
    let jam_selesai = formatDate(this.entryForm.get('jam_selesai').value, "HH:mm", "en_US");

    let frmData = new FormData();
    frmData.append('tanggal', formatDate(this.entryForm.get('tanggal').value, "yyy-MM-dd", "en_US"));
    frmData.append('karyawan_id', this.entryForm.get('karyawan_id').value['id']);
    frmData.append('tipe_lembur', this.entryForm.get('tipe_lembur').value['id']);
    frmData.append('lokasi_id', this.entryForm.get('lokasi_id').value['id']);
    frmData.append('mulai', jam_mulai);
    frmData.append('selesai', jam_selesai);
    frmData.append('nilai_lembur', this.entryForm.get('nilai_lembur').value);
    frmData.append('jumlah_jam', this.entryForm.get('jumlah_jam').value);
    frmData.append('istirahat', this.entryForm.get('istirahat').value);
    frmData.append('basis_lembur_id', "0");
    // frmData.append('lembur_perjam', this.entryForm.get('lembur_perjam').value);

    this.hrmsLemburService.create(frmData).subscribe(data => {
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

  valueChange(event) {
    this.getLemburPerjam(event.id);


  }
  valueTimeChange(event) {
    console.log(event);
    this.calculateTime();


  }
}
