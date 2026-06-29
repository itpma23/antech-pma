import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { PengajarService } from 'src/app/shared/services/pengajar.service';
import { Pengajar } from 'src/app/shared/models/pengajar.model';
import { formatDate } from '@angular/common';
import * as QuillNamespace from 'quill';
let Quill: any = QuillNamespace;
import ImageResize from 'quill-image-resize-module';
import { TranslateService } from '@ngx-translate/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { HrmsAbsensiService } from 'src/app/shared/services/hrms_absensi.service';
import { HrmsLemburService } from 'src/app/shared/services/hrms_lembur.service';
import { HrmsLokasiService } from 'src/app/shared/services/hrms_lokasi.service';
import { HrmsKaryawanGajiService } from 'src/app/shared/services/hrms_karyawan_gaji.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { HrmsJenisAbsensiService } from 'src/app/shared/services/hrms_jenis_absensi.service';

import { isNull } from 'util';

Quill.register('modules/imageResize', ImageResize);

declare var $: any;
declare var swal: any;
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
    private hrmsAbsensiService: HrmsAbsensiService,
    private hrmsLemburService: HrmsLemburService,
    private hrmsLokasiService: HrmsLokasiService,
    private hrmsKaryawanGajiService: HrmsKaryawanGajiService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private HrmsJenisAbsensiService: HrmsJenisAbsensiService,
    private translate: TranslateService,

  ) {
    let toDate: Date = new Date();
    let time: Date = new Date();
    this.entryForm = this.builder.group({
      karyawan_id: new FormControl([], Validators.required),
      lokasi_id: new FormControl([], Validators.required),
      jenis_absensi_id: new FormControl([], Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      jam_mulai_absensi: new FormControl(time, Validators.required),
      jam_selesai_absensi: new FormControl(time, Validators.required),

      nilai_lembur: new FormControl(0),
      tipe_lembur: new FormControl([]),
      jumlah_jam: new FormControl(0),
      istirahat: new FormControl(0),
      jam_mulai_lembur: new FormControl(time),
      jam_selesai_lembur: new FormControl(time),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    this.loadSelect2();
  }
  public dataSelectLokasi: any[] = [];
  public dataSelectKaryawan: any[] = [];
  public dataSelectJenisAbsensi: any[] = [];
  public dataSelectTipeLembur: any[] = [];

  public nilaiLembur;

  public options: any;

  private loadSelect2(): void {
    let m = this.translate.instant('holidays.messages.update');

    this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {
      let org_id = x.id;
      this.karyawanService.getByLokasiTugas(org_id).subscribe(x => {
        this.dataSelectKaryawan = [];

        let kary = x['data'];
        kary.forEach(d => {
          // beforeDataSelectKaryawan.push({ "id": d.id, "text": d.nama+" - "+d.nik_ktp+" - "+d.sub_bagian_nama });
          if (d.lokasi_tugas_id == org_id) {
            this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama+" - "+d.nip+" - "+d.sub_bagian_nama });
          }

        });
      });
    });

    this.dataSelectTipeLembur = [
      { id: 'HariKerja', text: 'Hari Kerja' },
      { id: 'HariMinggu', text: 'Hari Minggu' },
      { id: 'HariLibur', text: 'Hari Libur' },
      { id: 'HariRaya', text: 'Hari Raya' },
      { id: 'HariLiburPendek', text: 'Hari Libur HK terpendek' },
      { id: 'HariLiburKhusus', text: 'Hari Libur Khusus' },
    ];

    this.GbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x=>{
      this.dataSelectLokasi=[];
      x.forEach(d => {
        this.dataSelectLokasi.push({"id":d.id,"text":d.nama});
      });
    });

    this.HrmsJenisAbsensiService.getAll().subscribe(x=>{
      this.dataSelectJenisAbsensi=[];
      x['data'].forEach(d => {
        this.dataSelectJenisAbsensi.push({"id":d.id,"text":"("+d.kode+") "+d.keterangan});
      });
    });

  }
  // getPremi(jenis) {
  //   let karyawanGaji;
  //   let karyawan_id = this.entryForm.get('karyawan_id').value['id'];
  //   if (karyawan_id != null) {
  //     this.hrmsKaryawanGajiService.getById(karyawan_id).subscribe(data => {

  //        karyawanGaji = data['data'];
  //        console.log(karyawanGaji);
  //        if (karyawanGaji['detail'].length==0){
  //         this.entryForm.get('premi').patchValue('0');
  //         return;

  //        }
  //       if (jenis == "jabotabek") {
  //         this.entryForm.get('premi').patchValue(karyawanGaji['premi_jabotabek']);


  //       } else {
  //         this.entryForm.get('premi').patchValue(karyawanGaji['premi_non_jabotabek']);
  //       }
  //     });
  //   } else {
  //     this.entryForm.get('premi').patchValue('0');

  //   }

  // }
  onSubmitClear() {
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let jam_mulai_absensi = formatDate(this.entryForm.get('jam_mulai_absensi').value, "HH:mm", "en_US");
    let jam_selesai_absensi = formatDate(this.entryForm.get('jam_selesai_absensi').value, "HH:mm", "en_US");
    let jam_mulai_lembur = formatDate(this.entryForm.get('jam_mulai_lembur').value, "HH:mm", "en_US");
    let jam_selesai_lembur = formatDate(this.entryForm.get('jam_selesai_lembur').value, "HH:mm", "en_US");

    let frmData = new FormData();
    frmData.append('tanggal', formatDate(this.entryForm.get('tanggal').value, "yyy-MM-dd", "en_US"));
    frmData.append('karyawan_id', this.entryForm.get('karyawan_id').value['id']);
    frmData.append('lokasi_id', this.entryForm.get('lokasi_id').value['id']);
    // absensi
    frmData.append('jenis_absensi_id', this.entryForm.get('jenis_absensi_id').value['id']);
    frmData.append('masuk', jam_mulai_absensi);
    frmData.append('pulang', jam_selesai_absensi);
    frmData.append('jumlah_jam', '0');
    // lembur
    frmData.append('tipe_lembur', this.entryForm.get('tipe_lembur').value['id']);
    frmData.append('mulai', jam_mulai_lembur);
    frmData.append('selesai', jam_selesai_lembur);
    frmData.append('nilai_lembur', this.entryForm.get('nilai_lembur').value);
    frmData.append('jumlah_jam', this.entryForm.get('jumlah_jam').value);
    frmData.append('istirahat', this.entryForm.get('istirahat').value);
    frmData.append('basis_lembur_id', "0");
    this.hrmsAbsensiService.create(frmData).subscribe(data => {
      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          // text: 'Data berhasil disimpan dengan Nomor:'+data['data'],
          text: 'Data berhasil disimpan',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        // this.bsModalRef.hide();
        this.isFormSubmitted = false;

        let date: Date = new Date();
        let strDate = formatDate(date, "yyyy-MM-dd", "en_US");

        this.entryForm.get('jam_mulai_absensi').patchValue(strDate);
        this.entryForm.get('jam_selesai_absensi').patchValue(strDate);
        this.entryForm.get('tanggal').patchValue(strDate);
        this.entryForm.get('jam_mulai_lembur').patchValue(strDate);
        this.entryForm.get('jam_selesai_lembur').patchValue(strDate);
        this.entryForm.get('jumlah_jam').patchValue(0);
        this.entryForm.get('nilai_lembur').patchValue(0);
        this.entryForm.get('istirahat').patchValue(0);
        this.entryForm.get('karyawan_id').patchValue({});
        this.entryForm.get('lokasi_id').patchValue({});
        this.entryForm.get('jenis_absensi_id').patchValue({});
        this.entryForm.get('tipe_lembur').patchValue({});

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
      return;
    }
    let jam_mulai_absensi = formatDate(this.entryForm.get('jam_mulai_absensi').value, "HH:mm", "en_US");
    let jam_selesai_absensi = formatDate(this.entryForm.get('jam_selesai_absensi').value, "HH:mm", "en_US");
    let jam_mulai_lembur = formatDate(this.entryForm.get('jam_mulai_lembur').value, "HH:mm", "en_US");
    let jam_selesai_lembur = formatDate(this.entryForm.get('jam_selesai_lembur').value, "HH:mm", "en_US");

    let frmData = new FormData();
    frmData.append('tanggal', formatDate(this.entryForm.get('tanggal').value, "yyy-MM-dd", "en_US"));
    frmData.append('karyawan_id', this.entryForm.get('karyawan_id').value['id']);
    frmData.append('lokasi_id', this.entryForm.get('lokasi_id').value['id']);
    // absensi
    frmData.append('jenis_absensi_id', this.entryForm.get('jenis_absensi_id').value['id']);
    frmData.append('masuk', jam_mulai_absensi);
    frmData.append('pulang', jam_selesai_absensi);
    frmData.append('jumlah_jam', '0');
    // lembur
    frmData.append('tipe_lembur', this.entryForm.get('tipe_lembur').value['id']);
    frmData.append('mulai', jam_mulai_lembur);
    frmData.append('selesai', jam_selesai_lembur);
    frmData.append('nilai_lembur', this.entryForm.get('nilai_lembur').value);
    frmData.append('jumlah_jam', this.entryForm.get('jumlah_jam').value);
    frmData.append('istirahat', this.entryForm.get('istirahat').value);
    frmData.append('basis_lembur_id', "0");
    this.hrmsAbsensiService.create(frmData).subscribe(data => {
      if (data['status'] == 'OK') {
        this.event.emit('OK');
        this.bsModalRef.hide();
      }
    });

    // if (this.entryForm.get('nilai_lembur').value !== 0) {
    //   let frmDataLembur = new FormData();
    //   frmDataLembur.append('tanggal', formatDate(this.entryForm.get('tanggal').value, "yyy-MM-dd", "en_US"));
    //   frmDataLembur.append('karyawan_id', this.entryForm.get('karyawan_id').value['id']);
    //   frmDataLembur.append('tipe_lembur', this.entryForm.get('tipe_lembur').value['id']);
    //   frmDataLembur.append('lokasi_id', this.entryForm.get('lokasi_id').value['id']);
    //   frmDataLembur.append('mulai', jam_mulai);
    //   frmDataLembur.append('selesai', jam_selesai);
    //   frmDataLembur.append('nilai_lembur', this.entryForm.get('nilai_lembur').value);
    //   frmDataLembur.append('jumlah_jam', this.entryForm.get('jumlah_jam').value);
    //   frmDataLembur.append('istirahat', this.entryForm.get('istirahat').value);
    //   frmDataLembur.append('basis_lembur_id', "0");
    //   this.hrmsLemburService.create(frmDataLembur).subscribe(data => {
    //     if (data['status'] == 'OK') {
    //       this.event.emit('OK');
    //       this.bsModalRef.hide();
    //     }
    //   });
    // }
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
    // console.log(event);

    // this.kelasService.getMapelKelasOnly(event.id).subscribe(x => {
    //   // console.log(x);
    //   this.dataSelectMapelKelas = [];
    //   let mapelKelas = x['data'];
    //   // console.log(mapelKelas)
    //   mapelKelas.forEach(m => {
    //     this.dataSelectMapelKelas.push({ "id": m.mapel_kelas_id, "text": m.nama });

    //   });

    // });
  }



  calculateTime() {
    let jam_masuk = this.entryForm.get('jam_mulai_lembur').value;
    let jam_selesai = this.entryForm.get('jam_selesai_lembur').value;
    let istirahat = this.entryForm.get('istirahat').value;
    // console.log(jam_masuk.getTime());
    // console.log(jam_selesai.getTime());
    let x = 0;
    let selisihjam = 0;
    let totaljam = 0;
    if (jam_masuk < jam_selesai) {
      let x = jam_selesai.getTime() - jam_masuk.getTime();
      selisihjam = (x / 3600000);
    }
    if (jam_masuk > jam_selesai) {
      let x = (86400000 + jam_selesai.getTime()) - jam_masuk.getTime();
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
    console.log(data)
    this.hrmsLemburService.hitungLembur(data).subscribe(d => {
      let res = d['data'];
      this.nilaiLembur = res['gapok_perjam'] * res['jumlah_jam'];
      this.entryForm.get('nilai_lembur').patchValue(this.nilaiLembur.toFixed(2));
    })
  }



  valueTimeChange(event) {
    console.log(event);
    this.calculateTime();
  }
}
