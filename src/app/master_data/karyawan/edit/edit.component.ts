import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, ValidationErrors } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { Karyawan } from 'src/app/shared/models/karyawan.model';
import { formatDate } from '@angular/common';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { MustMatch } from 'src/app/shared/helpers/must-match.validator';
import { HrmsJabatanService } from 'src/app/shared/services/hrms_jabatan.service';
import { HrmsDepartemenService } from 'src/app/shared/services/hrms_depatemen.service';
import { HrmsPangkatService } from 'src/app/shared/services/hrms_pangkat.service';
import { HrmsKomponenGajiService } from 'src/app/shared/services/hrms_komponen_gaji.service';
import { HrmsGolonganService } from 'src/app/shared/services/hrms_golongan.service';
import { HrmsTipeKaryawanService } from 'src/app/shared/services/hrms_tipe_karyawan.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { isEmpty } from 'rxjs/operators';
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'edit-cmp',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.css'],
})

export class EditComponent implements OnInit, AfterViewInit {
  isFormSubmitted = false;
  isChangePhoto = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  entryForm: FormGroup;
  categories: any[] = [];
  event: EventEmitter<any> = new EventEmitter();
  karyawan: Karyawan;
  dbName;
  pathName;
  PATH_URL;
  dataSelectRole = ['karyawan', 'AKUNTING', 'INVENTORY', 'ASSET', 'PAYROLL', 'PERPUSTAKAAN']
  dataSelectDepartemen;
  dataSelectPangkat;
  dataSelectGolongan;
  dataSelectJabatan;
  dataSelectTipe;
  dataSelectKomponenGaji;
  dataSelectAgama;
  dataSelectLokasi;
  dataSelectSubBagian;
  aktifKaryawanChanged = "1";
  dataSelectJabatanLokasi = [];
  dataSelectJabatanSubBagian = [];
  dataSelectJabatanTipe = [];
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private karyawanService: KaryawanService,
    private authenticationService: AuthenticationService,
    private hrmsJabatanService: HrmsJabatanService,
    private hrmsDepartemenService: HrmsDepartemenService,
    private hrmsPangkatService: HrmsPangkatService,
    private hrmsGolonganService: HrmsGolonganService,
    private hrmsKomponenGajiService: HrmsKomponenGajiService,
    private hrmsTipeKaryawanService: HrmsTipeKaryawanService,
    private GbmOrganisasiService: GbmOrganisasiService,
  ) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;
    this.entryForm = this.builder.group({
      lokasi_tugas_id: new FormControl([], Validators.required),
      sub_bagian_id: new FormControl([], Validators.required),
      nip: new FormControl(null, Validators.required),
      nama: new FormControl('', Validators.required),
      telp: new FormControl('', []),
      email: new FormControl('', []),
      jenis_kelamin: new FormControl("Laki-laki", Validators.required),
      status_id: new FormControl("1", []),
      agama: new FormControl([], Validators.required),
      tempat_lahir: new FormControl('', []),
      tgl_lahir: new FormControl('', Validators.required),
      tgl_masuk: new FormControl('', Validators.required),
      tgl_keluar: new FormControl(),
      tgl_hbs_kontrak: new FormControl(),
      alamat: new FormControl('', []),
      no_hp: new FormControl('', []),
      no_ktp: new FormControl('', []),
      no_npwp: new FormControl('', []),
      no_bpjs: new FormControl('', []),
      no_bpjs_ks: new FormControl('', []),
      nama_bank: new FormControl('', []),
      no_rek_bank: new FormControl('', []),
      no_kk: new FormControl('', []),
      // username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(/^\S*$/)]),
      // password: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      // re_password: new FormControl('', Validators.required,),
      img: new FormControl(null, []),
      id_jabatan: new FormControl([], Validators.required),
      id_departemen: new FormControl([], Validators.required),
      id_golongan: new FormControl([], Validators.required),
      id_pangkat: new FormControl([], Validators.required),
      id_tipe_karyawan: new FormControl([], Validators.required),
      status_pernikahan: new FormControl('Menikah', Validators.required),
      golongan_darah: new FormControl([], Validators.required),
      status_pajak: new FormControl([], Validators.required),
      keluargaItems: this.builder.array([]),
      pendidikanItems: this.builder.array([]),
      bahasaItems: this.builder.array([]),
      jabatanItems: this.builder.array([]),
      pangkatItems: this.builder.array([]),
      hukumanItems: this.builder.array([]),
      penghargaanItems: this.builder.array([]),
      keahlianItems: this.builder.array([]),
      pengalamanItems: this.builder.array([]),
      pelatihanItems: this.builder.array([]),

      is_jht: new FormControl(0, Validators.required),
      is_jp: new FormControl(0, Validators.required),
      is_jks: new FormControl(0, Validators.required),

      role_id: new FormControl([], []),
      is_admin: new FormControl('0', []),
      editor: new FormControl(null, []),

    });

  }
  get userControl() { return this.entryForm.controls; }
  get pendidikanItems(): FormArray {
    return this.entryForm.get('pendidikanItems') as FormArray;
  };
  get keluargaItems(): FormArray {
    return this.entryForm.get('keluargaItems') as FormArray;
  };
  get bahasaItems(): FormArray {
    return this.entryForm.get('bahasaItems') as FormArray;
  };
  get jabatanItems(): FormArray {
    return this.entryForm.get('jabatanItems') as FormArray;
  };
  get pangkatItems(): FormArray {
    return this.entryForm.get('pangkatItems') as FormArray;
  };
  get hukumanItems(): FormArray {
    return this.entryForm.get('hukumanItems') as FormArray;
  };
  get penghargaanItems(): FormArray {
    return this.entryForm.get('penghargaanItems') as FormArray;
  };
  get keahlianItems(): FormArray {
    return this.entryForm.get('keahlianItems') as FormArray;
  };
  get pengalamanItems(): FormArray {
    return this.entryForm.get('pengalamanItems') as FormArray;
  };
  get pelatihanItems(): FormArray {
    return this.entryForm.get('pelatihanItems') as FormArray;
  };

  addItemKeluarga(nama?, status?, tempat_lahir?, jenis_kelamin?, tgl_lahir?) {

    this.keluargaItems.push(this.builder.group({
      nama_keluarga: new FormControl(nama, []),
      tempat_lahir_keluarga: new FormControl(tempat_lahir, []),
      tanggal_lahir_keluarga: new FormControl(tgl_lahir, []),
      status_keluarga: new FormControl(status, []),
    }));

  }

  // removeItem(item) {

  //   let i = this.invoiceItems.controls.indexOf(item);

  //   if(i != -1) {
  //   //  let x=	this.invoiceItems.controls.splice(i, 1);
  //     let items = this.entryForm.get('invoiceItems') as FormArray;
  //     items.removeAt(i);
  //   	let data = {invoiceItems: items.value};
  //   	this.updateForm(data);
  //   }
  // }
  removeItemKeluarga(item) {

    let i = this.keluargaItems.controls.indexOf(item);

    if (i != -1) {
      // this.keluargaItems.controls.splice(i, 1);
      let items = this.entryForm.get('keluargaItems') as FormArray;
      items.removeAt(i);
      // let data = { keluargaItems: items };
      // this.updateForm(data);
    }
  }
  addItemPendidikan(nama?, lokasi?, jurusan?, no_ijazah?, tgl_ijazah?) {

    this.pendidikanItems.push(this.builder.group({
      nama_sekolah: new FormControl(nama, []),
      lokasi_sekolah: new FormControl(lokasi, []),
      jurusan: new FormControl(jurusan, []),
      no_ijazah: new FormControl(no_ijazah, []),
      tgl_ijazah: new FormControl(tgl_ijazah, []),
    }));

  }

  removeItemPendidikan(item) {

    let i = this.pendidikanItems.controls.indexOf(item);

    if (i != -1) {
      this.pendidikanItems.controls.splice(i, 1);
      let items = this.entryForm.get('pendidikanItems') as FormArray;
      items.removeAt(i);
      // let data = { pendidikanItems: items };
      // this.updateForm(data);
    }
  }
  addItemBahasa(bahasa?, kemampuan?) {

    this.bahasaItems.push(this.builder.group({
      bahasa: new FormControl(bahasa, []),
      kemampuan_bicara: new FormControl(kemampuan, []),
    }));

  }

  removeItemBahasa(item) {

    let i = this.bahasaItems.controls.indexOf(item);

    if (i != -1) {
      this.bahasaItems.controls.splice(i, 1);
      let items = this.entryForm.get('bahasaItems') as FormArray;
      items.removeAt(i);
      // let data = { invoiceItems: items };
      // this.updateForm(data);
    }
  }
  addItemPangkat(pangkat_id?, golongan_id?, tmt?, status?) {
    let selectedPangkat = [];
    this.dataSelectPangkat.forEach(a => {
      if (pangkat_id == a.id) {
        selectedPangkat = a;
      }
    });

    let selectedGolongan = [];
    this.dataSelectPangkat.forEach(a => {
      if (golongan_id == a.id) {
        selectedGolongan = a;
      }
    });
    this.pangkatItems.push(this.builder.group({
      riwayat_pangkat: new FormControl(selectedPangkat, []),
      riwayat_golongan: new FormControl(selectedGolongan, []),
      tmt_pangkat: new FormControl(tmt, []),
      status_pangkat: new FormControl(status, []),
    }));

  }

  removeItemPangkat(item) {

    let i = this.pangkatItems.controls.indexOf(item);

    if (i != -1) {
      this.pangkatItems.controls.splice(i, 1);
      let items = this.entryForm.get('pangkatItems') as FormArray;
      items.removeAt(i);
      // let data = { invoiceItems: items };
      // this.updateForm(data);
    }
  }
  addItemJabatan(lokasi_tugas_id?, sub_bagian_id?, id_tipe_Karyawan?, jabatan_id?, selesai_tugas_jabatan?, tmt_jabatan?, status_jabatan?) {
    let selectedLokasi = [];
    this.dataSelectJabatanLokasi.forEach(a => {
      if (lokasi_tugas_id == a.id) {
        selectedLokasi = a;
      }
    });
    let selectedSubBagian = [];
    this.dataSelectJabatanSubBagian.forEach(a => {
      if (sub_bagian_id == a.id) {
        selectedSubBagian = a;
      }
    });
    let selectedTipeKaryawan = [];
    this.dataSelectJabatanTipe.forEach(a => {
      if (id_tipe_Karyawan == a.id) {
        selectedTipeKaryawan = a;
      }
    });
    let selectedJabatan = [];
    this.dataSelectJabatan.forEach(a => {
      if (jabatan_id == a.id) {
        selectedJabatan = a;
      }
    });
    this.jabatanItems.push(this.builder.group({
      lokasi_tugas_id: new FormControl(selectedLokasi, []),
      sub_bagian_id: new FormControl(selectedSubBagian, []),
      id_tipe_karyawan: new FormControl(selectedTipeKaryawan, []),
      riwayat_jabatan: new FormControl(selectedJabatan, []),
      selesai_tugas_jabatan: new FormControl(selesai_tugas_jabatan, []),
      tmt_jabatan: new FormControl(tmt_jabatan, []),
      status_jabatan: new FormControl(status_jabatan, []),
    }));

  }

  removeItemJabatan(item) {

    let i = this.jabatanItems.controls.indexOf(item);

    if (i != -1) {
      this.jabatanItems.controls.splice(i, 1);
      let items = this.entryForm.get('jabatanItems') as FormArray;
      items.removeAt(i);
      // let data = { jabatanItems: items };
      // this.updateForm(data);
    }
  }
  addItemPenghargaan(nama?, tahun?, instansi?) {

    this.penghargaanItems.push(this.builder.group({
      nama_penghargaan: new FormControl(nama, []),
      tahun_penghargaan: new FormControl(tahun, []),
      instansi_penghargaan: new FormControl(instansi, []),
    }));

  }

  removeItemPenghargaan(item) {

    let i = this.penghargaanItems.controls.indexOf(item);

    if (i != -1) {
      this.penghargaanItems.controls.splice(i, 1);
      let items = this.entryForm.get('penghargaanItems') as FormArray;
      items.removeAt(i);
      // let data = { invoiceItems: items };
      // this.updateForm(data);
    }
  }
  addItemHukuman(jenis_hukuman?, no_sk?, no_pemulihan?, tgl_sk?, tgl_pemulihan?) {

    this.hukumanItems.push(this.builder.group({
      jenis_hukuman: new FormControl(jenis_hukuman, []),
      nosk_hukuman: new FormControl(no_sk, []),
      nosk_pemulihan: new FormControl(no_pemulihan, []),
      tglsk_hukuman: new FormControl(tgl_sk, []),
      tglsk_pemulihan: new FormControl(tgl_pemulihan, []),
    }));

  }

  removeItemHukuman(item) {

    let i = this.hukumanItems.controls.indexOf(item);

    if (i != -1) {
      this.hukumanItems.controls.splice(i, 1);
      let items = this.entryForm.get('hukumanItems') as FormArray;
      items.removeAt(i);
      // let data = { hukumanItems: items };
      // this.updateForm(data);
    }
  }
  addItemPelatihan(nama_pelatihan?, status?) {

    this.pelatihanItems.push(this.builder.group({
      nama_pelatihan: new FormControl(nama_pelatihan, []),
      status: new FormControl(status, []),

    }));

  }

  removeItemPelatihan(item) {

    let i = this.pelatihanItems.controls.indexOf(item);

    if (i != -1) {
      this.pelatihanItems.controls.splice(i, 1);
      let items = this.entryForm.get('pelatihanItems') as FormArray;
      items.removeAt(i);
      // let data = { pelatihanItems: items };
      // this.updateForm(data);
    }
  }

  addItemPengalaman(perusahaan?, mulai?, akhir?, status?) {
    this.pengalamanItems.push(this.builder.group({
      perusahaan: new FormControl(perusahaan, []),
      mulai: new FormControl(mulai, []),
      akhir: new FormControl(akhir, []),
      status: new FormControl(status, []),
    }));

  }

  removeItemPengalaman(item) {

    let i = this.pengalamanItems.controls.indexOf(item);

    if (i != -1) {
      this.pengalamanItems.controls.splice(i, 1);
      let items = this.entryForm.get('pengalamanItems') as FormArray;
      items.removeAt(i);
      // let data = { pengalamanItems: items };
      // this.updateForm(data);
    }
  }
  addItemKeahlian(nama_keahlian?, status?) {
    this.keahlianItems.push(this.builder.group({
      nama_keahlian: new FormControl(nama_keahlian, []),
      status: new FormControl(status, [])
    }));


  }

  removeItemKeahlian(item) {

    let i = this.keahlianItems.controls.indexOf(item);

    if (i != -1) {
      this.keahlianItems.controls.splice(i, 1);
      let items = this.entryForm.get('keahlianItems') as FormArray;
      items.removeAt(i);
      // let data = { keahlianItems: items };
      // this.updateForm(data);
    }
  }

  ngAfterViewInit(): void {
    // console.log(this.karyawan);
    let tgl_keluar;
    if (this.karyawan.tgl_keluar == null || this.karyawan.tgl_keluar == '0000-00-00' || this.karyawan.tgl_keluar == '') {
      tgl_keluar = null
    } else {
      tgl_keluar = new Date(Date.parse(this.karyawan.tgl_keluar))
    }
    let tgl_hbs_kontrak;
    if (this.karyawan.tgl_hbs_kontrak == null || this.karyawan.tgl_hbs_kontrak == '0000-00-00' || this.karyawan.tgl_hbs_kontrak == '') {
      tgl_hbs_kontrak = null
    } else {
      tgl_hbs_kontrak = new Date(Date.parse(this.karyawan.tgl_hbs_kontrak))
    }
    this.entryForm.controls['nip'].patchValue(this.karyawan.nip);
    this.entryForm.controls['nama'].patchValue(this.karyawan.nama);
    this.entryForm.controls['jenis_kelamin'].patchValue(this.karyawan.jenis_kelamin);
    this.entryForm.controls['status_pernikahan'].patchValue(this.karyawan.status_kawin);
    this.entryForm.controls['alamat'].patchValue(this.karyawan.alamat);
    this.entryForm.controls['status_id'].patchValue(this.karyawan.status_id.toString(0));
    this.entryForm.controls['tgl_lahir'].patchValue(new Date(Date.parse(this.karyawan.tgl_lahir)));
    this.entryForm.controls['tgl_masuk'].patchValue(new Date(Date.parse(this.karyawan.tgl_masuk)));
    this.entryForm.controls['tgl_keluar'].patchValue(tgl_keluar);
    this.entryForm.controls['tgl_hbs_kontrak'].patchValue(tgl_hbs_kontrak);
    this.entryForm.controls['tempat_lahir'].patchValue(this.karyawan.tempat_lahir);
    this.entryForm.controls['email'].patchValue(this.karyawan.email);
    this.entryForm.controls['telp'].patchValue(this.karyawan.telp);
    this.entryForm.controls['golongan_darah'].patchValue(this.karyawan.golongan_darah);
    this.entryForm.controls['status_pajak'].patchValue(this.karyawan.status_pajak);
    this.entryForm.controls['no_hp'].patchValue(this.karyawan.no_hp);
    this.entryForm.controls['no_ktp'].patchValue(this.karyawan.no_ktp);
    this.entryForm.controls['no_kk'].patchValue(this.karyawan.no_kk);
    this.entryForm.controls['no_npwp'].patchValue(this.karyawan.no_npwp);
    this.entryForm.controls['no_bpjs'].patchValue(this.karyawan.no_bpjs);
    this.entryForm.controls['no_bpjs_ks'].patchValue(this.karyawan.no_bpjs_ks);
    this.entryForm.controls['nama_bank'].patchValue(this.karyawan.nama_bank);
    this.entryForm.controls['no_rek_bank'].patchValue(this.karyawan.no_rek_bank);
    this.entryForm.controls['is_jht'].patchValue(this.karyawan.is_jht==true?1:0);
    this.entryForm.controls['is_jp'].patchValue(this.karyawan.is_jp==true?1:0);
    this.entryForm.controls['is_jks'].patchValue(this.karyawan.is_jks==true?1:0);
    //this.entryForm.controls['is_admin'].patchValue((this.karyawan.login['is_admin'] == "1") ? true : false);
    //  this.entryForm.controls['username'].patchValue(this.karyawan.username);
    let role = this.karyawan.role_id.map(x => {
      return { id: x['role'], text: x['role'] }
    });
    console.log(this.karyawan);
    this.entryForm.controls['role_id'].patchValue(role);
    this.aktifKaryawanChanged = this.karyawan.status_id.toString(0);
    this.loadSelect2();






  }


  updateProfile() {
    // console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    let errors: any = [];
    let fieldError;
    if (this.entryForm.invalid) {

      Object.keys(this.entryForm.controls).forEach(key => {
        // console.log(key);
        const controlErrors: ValidationErrors = this.entryForm.get(key).errors;
        console.log(this.entryForm.get(key).errors);
        errors = [];
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            const showMessage = key + " is " + keyError
            errors.push(showMessage)
            fieldError = errors[0]
          });
        }
      });

      swal({
        title: 'Perhatian!',
        text: 'Form belum lengkap/Tidak valid.' + errors,
        type: 'warning',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      })
      return;
    }
    if (this.entryForm.invalid) {
      return;
    }
    let tgl_keluar;
    if (this.entryForm.get('tgl_keluar').value == null || this.entryForm.get('tgl_keluar').value == '') {
      tgl_keluar = null
    } else {
      tgl_keluar = formatDate(this.entryForm.get('tgl_keluar').value, "yyyy-MM-dd", 'en_US')
    }
    if (this.aktifKaryawanChanged != "0") {
      tgl_keluar = null
    }
    let tgl_hbs_kontrak;
    if (this.entryForm.get('tgl_hbs_kontrak').value == null || this.entryForm.get('tgl_hbs_kontrak').value == '') {
      tgl_hbs_kontrak = null
    } else {
      tgl_hbs_kontrak = formatDate(this.entryForm.get('tgl_hbs_kontrak').value, "yyyy-MM-dd", 'en_US')
    }
    let role = this.entryForm.get('role_id').value.map(a => { return a.id });
    let dataSubmit: any = {
      'lokasi_tugas_id': this.entryForm.get('lokasi_tugas_id').value['id'],
      'sub_bagian_id': this.entryForm.get('sub_bagian_id').value['id'],
      'nip': this.entryForm.get('nip').value,
      'nama': this.entryForm.get('nama').value,
      'jenis_kelamin': this.entryForm.get('jenis_kelamin').value,
      'tempat_lahir': this.entryForm.get('tempat_lahir').value,
      'tgl_lahir': formatDate(this.entryForm.get('tgl_lahir').value, "yyyy-MM-dd", 'en_US'),
      'tgl_masuk': formatDate(this.entryForm.get('tgl_masuk').value, "yyyy-MM-dd", 'en_US'),
      'tgl_keluar': tgl_keluar,
      'tgl_hbs_kontrak': tgl_hbs_kontrak,
      'alamat': this.entryForm.get('alamat').value,
      'is_admin': this.entryForm.get('is_admin').value,
      'role_id': role,
      'status_id': this.entryForm.get('status_id').value,
      'status_pernikahan': this.entryForm.get('status_pernikahan').value,
      'golongan_darah': this.entryForm.get('golongan_darah').value,
      'status_pajak': this.entryForm.get('status_pajak').value,
      'id_jabatan': this.entryForm.get('id_jabatan').value['id'],
      'id_departemen': this.entryForm.get('id_departemen').value['id'],
      'id_golongan': this.entryForm.get('id_golongan').value['id'],
      'id_pangkat': this.entryForm.get('id_pangkat').value['id'],
      'id_tipe_karyawan': this.entryForm.get('id_tipe_karyawan').value['id'],
      'agama': this.entryForm.get('agama').value['id'],
      'email': this.entryForm.get('email').value,
      'telp': this.entryForm.get('telp').value,
      'no_hp': this.entryForm.get('no_hp').value,
      'no_kk': this.entryForm.get('no_kk').value,
      'no_ktp': this.entryForm.get('no_ktp').value,
      'no_npwp': this.entryForm.get('no_npwp').value,
      'no_bpjs': this.entryForm.get('no_bpjs').value,
      'no_bpjs_ks': this.entryForm.get('no_bpjs_ks').value,
      'nama_bank': this.entryForm.get('nama_bank').value,
      'no_rek_bank': this.entryForm.get('no_rek_bank').value,
      'is_jht': this.entryForm.get('is_jht').value,
      'is_jp': this.entryForm.get('is_jp').value,
      'is_jks': this.entryForm.get('is_jks').value,
      // 'details': this.entryForm.value,



    };

    // frmData.append("details",   JSON.stringify(frmDataValue));
    console.log(dataSubmit);

    this.karyawanService.update(this.karyawan.id, dataSubmit).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        this.event.emit('OK');
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Simpan berhasil',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
        // this.event.emit('OK');
        // this.bsModalRef.hide();
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

  updateKeluarga() {
    // console.log(this.entryForm.invalid);
    let frmDataValue = this.entryForm.value;

    // console.log(this.entryForm.value);
    this.entryForm.value.keluargaItems.forEach(element => {
      if (element.tanggal_lahir_keluarga == '' || element.tanggal_lahir_keluarga == null) {
        element.tanggal_lahir_keluarga = null;
      } else {
        element.tanggal_lahir_keluarga = formatDate(element.tanggal_lahir_keluarga, "yyyy-MM-dd", 'en_US')
      }

    });
    let keluargaItem = { "keluargaItems": frmDataValue['keluargaItems'] };
    let frmData = new FormData();
    frmData.append("details", JSON.stringify(keluargaItem));
    this.karyawanService.update_riwayat_keluarga(this.karyawan.id, frmData).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        this.event.emit('OK');
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Simpan berhasil',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
        // this.event.emit('OK');
        // this.bsModalRef.hide();
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
  updatePendidikan() {
    // console.log(this.entryForm.invalid);
    let frmDataValue = this.entryForm.value;

    // console.log(frmDataValue);
    let pendidikanItem = { "pendidikanItems": frmDataValue['pendidikanItems'] };

    this.entryForm.value.pendidikanItems.forEach(element => {
      if (element.tgl_ijazah == '' || element.tgl_ijazah == null) {
        element.tgl_ijazah = null;
      } else {
        element.tgl_ijazah = formatDate(element.tgl_ijazah, "dd-MM-yyyy", 'en_US')
      }
    });

    // console.log(pendidikanItem);
    let frmData = new FormData();
    frmData.append("details", JSON.stringify(pendidikanItem));
    this.karyawanService.update_riwayat_pendidikan(this.karyawan.id, frmData).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        this.event.emit('OK');
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Simpan berhasil',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
        // this.event.emit('OK');
        // this.bsModalRef.hide();
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
  updateBahasa() {
    // console.log(this.entryForm.invalid);
    let frmDataValue = this.entryForm.value;
    let bahasa = { "bahasaItems": frmDataValue['bahasaItems'] };
    let frmData = new FormData();
    frmData.append("details", JSON.stringify(bahasa));
    this.karyawanService.update_riwayat_bahasa(this.karyawan.id, frmData).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        this.event.emit('OK');
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Simpan berhasil',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
        // this.event.emit('OK');
        // this.bsModalRef.hide();
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
  updateJabatan() {
    // console.log(this.entryForm.invalid);
    let frmDataValue = this.entryForm.value;
    let jabatan = { "jabatanItems": frmDataValue['jabatanItems'] };

    this.entryForm.value.jabatanItems.forEach(element => {
      if (element.tmt_jabatan == '' || element.tmt_jabatan == null) {
        element.tmt_jabatan = null;
      } else {
        element.tmt_jabatan = formatDate(element.tmt_jabatan, "dd-MM-yyyy", 'en_US')
      }
    });

    this.entryForm.value.jabatanItems.forEach(element => {
      if (element.selesai_tugas_jabatan == '' || element.selesai_tugas_jabatan == null) {
        element.selesai_tugas_jabatan = null;
      } else {
        element.selesai_tugas_jabatan = formatDate(element.selesai_tugas_jabatan, "dd-MM-yyyy", 'en_US')
      }
    });

    let frmData = new FormData();
    frmData.append("details", JSON.stringify(jabatan));
    this.karyawanService.update_riwayat_jabatan(this.karyawan.id, frmData).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        this.event.emit('OK');
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Simpan berhasil',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
        // this.event.emit('OK');
        // this.bsModalRef.hide();
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
  updatePangkat() {
    // console.log(this.entryForm.invalid);
    let frmDataValue = this.entryForm.value;
    let pangkat = { "pangkatItems": frmDataValue['pangkatItems'] };
    let frmData = new FormData();
    frmData.append("details", JSON.stringify(pangkat));
    this.karyawanService.update_riwayat_pangkat(this.karyawan.id, frmData).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        this.event.emit('OK');
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Simpan berhasil',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
        // this.event.emit('OK');
        // this.bsModalRef.hide();
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
  updatePenghargaan() {
    // console.log(this.entryForm.invalid);
    let frmDataValue = this.entryForm.value;
    let penghargaan = { "penghargaanItems": frmDataValue['penghargaanItems'] };
    let frmData = new FormData();
    frmData.append("details", JSON.stringify(penghargaan));
    this.karyawanService.update_riwayat_penghargaan(this.karyawan.id, frmData).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        this.event.emit('OK');
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Simpan berhasil',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
        // this.event.emit('OK');
        // this.bsModalRef.hide();
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
  updateHukuman() {
    // console.log(this.entryForm.invalid);
    let frmDataValue = this.entryForm.value;
    let hukuman = { "hukumanItems": frmDataValue['hukumanItems'] };

    this.entryForm.value.hukumanItems.forEach(element => {
      if (element.tglsk_hukuman == '' || element.tglsk_hukuman == null) {
        element.tglsk_hukuman = null;
      } else {
        element.tglsk_hukuman = formatDate(element.tglsk_hukuman, "dd-MM-yyyy", 'en_US')
      }
    });
    this.entryForm.value.hukumanItems.forEach(element => {
      if (element.tglsk_pemulihan == '' || element.tglsk_pemulihan == null) {
        element.tglsk_pemulihan = null;
      } else {
        element.tglsk_pemulihan = formatDate(element.tglsk_pemulihan, "dd-MM-yyyy", 'en_US')
      }
    });

    let frmData = new FormData();
    frmData.append("details", JSON.stringify(hukuman));
    this.karyawanService.update_riwayat_hukuman(this.karyawan.id, frmData).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        this.event.emit('OK');
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Simpan berhasil',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
        // this.event.emit('OK');
        // this.bsModalRef.hide();
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

  updateKeahlian() {
    // console.log(this.entryForm.invalid);
    let frmDataValue = this.entryForm.value;
    let keahlian = { "keahlianItems": frmDataValue['keahlianItems'] };
    let frmData = new FormData();
    frmData.append("details", JSON.stringify(keahlian));
    this.karyawanService.update_riwayat_keahlian(this.karyawan.id, frmData).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        this.event.emit('OK');
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Simpan berhasil',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
        // this.event.emit('OK');
        // this.bsModalRef.hide();
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

  updatePengalaman() {
    // console.log(this.entryForm.invalid);
    let frmDataValue = this.entryForm.value;
    let pengalaman = { "pengalamanItems": frmDataValue['pengalamanItems'] };

    // this.entryForm.value.pengalamanItems.forEach(element => {
    //   if (element.mulai=='' || element.mulai==null){
    //     element.mulai=null;
    //   }else{
    //     element.mulai=formatDate( element.mulai, "dd-MM-yyyy", 'en_US')
    //   }
    //   });
    //   this.entryForm.value.pengalamanItems.forEach(element => {
    //     if (element.akhir=='' || element.akhir==null){
    //       element.akhir=null;
    //     }else{
    //       element.akhir=formatDate( element.akhir, "dd-MM-yyyy", 'en_US')
    //     }
    //     });

    let frmData = new FormData();
    frmData.append("details", JSON.stringify(pengalaman));
    this.karyawanService.update_riwayat_pengalaman(this.karyawan.id, frmData).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        this.event.emit('OK');
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Simpan berhasil',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
        // this.event.emit('OK');
        // this.bsModalRef.hide();
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
  updatePelatihan() {
    // console.log(this.entryForm.invalid);
    let frmDataValue = this.entryForm.value;
    let pelatihan = { "pelatihanItems": frmDataValue['pelatihanItems'] };
    let frmData = new FormData();
    frmData.append("details", JSON.stringify(pelatihan));
    this.karyawanService.update_riwayat_pelatihan(this.karyawan.id, frmData).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        this.event.emit('OK');
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Simpan berhasil',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
        // this.event.emit('OK');
        // this.bsModalRef.hide();
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

  updatePhoto() {
    let frmData = new FormData();
    frmData.append("userfile", this.entryForm.get('img').value);
    this.karyawanService.updatePhoto(this.karyawan.id, frmData).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        this.event.emit('OK');

        swal({
          title: 'Info!',
          text: 'Simpan berhasil',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
        // this.event.emit('OK');
        // this.bsModalRef.hide();
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
  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {




  }
  private loadSelect2(): void {
    this.dataSelectAgama = [
      { id: 'ISLAM', text: 'ISLAM' },
      { id: 'KRISTEN', text: 'KRISTEN' },
      { id: 'KATHOLIK', text: 'KATHOLIK' },
      { id: 'BUDHA', text: 'BUDHA' },
      { id: 'HINDU', text: 'HINDU' },
    ];
    let selectAgama;
    this.dataSelectAgama.forEach(a => {
      if (a.id == this.karyawan.agama) {
        selectAgama = a;
      }

    })
    this.entryForm.controls['agama'].patchValue(selectAgama);
    this.hrmsPangkatService.getAll().subscribe(x => {
      let selectedPangkat;
      this.dataSelectPangkat = [];
      let dep = x['data'];
      dep.forEach(d => {
        this.dataSelectPangkat.push({ "id": d.id, "text": d.nama });
        if (d.id == this.karyawan.pangkat_id) {
          selectedPangkat = { "id": d.id, "text": d.nama };
        }

      });
      this.entryForm.controls['id_pangkat'].patchValue(selectedPangkat);
      this.hrmsGolonganService.getAll().subscribe(x => {
        let selectedGolongan;
        this.dataSelectGolongan = [];
        let dep = x['data'];
        dep.forEach(d => {
          this.dataSelectGolongan.push({ "id": d.id, "text": d.nama });
          if (d.id == this.karyawan.golongan_id) {
            selectedGolongan = { "id": d.id, "text": d.nama };
          }
        });
        this.entryForm.controls['id_golongan'].patchValue(selectedGolongan);
        dtl = [];
        dtl = this.karyawan.riwayat_pangkat;
        for (let index = 0; index < dtl.length; index++) {
          const d = dtl[index];
          this.addItemPangkat(d['pangkat_id'], d['golongan_id'], d['tmt'], d['status']);
        }
      });

    });


    let selectLokasiTugas;
    this.GbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
        this.dataSelectJabatanLokasi.push({ "id": d.id, "text": d.nama });
      });
      this.dataSelectLokasi.forEach(a => {
        if (a.id == this.karyawan.lokasi_tugas_id) {
          selectLokasiTugas = a;
        }

      });
      this.entryForm.controls['lokasi_tugas_id'].patchValue(selectLokasiTugas);
      let selectSubBagian;
      this.GbmOrganisasiService.getAllByType('SUBBAGIAN').subscribe(x => {
        this.dataSelectSubBagian = [];
        this.dataSelectJabatanSubBagian = [];
        x.forEach(d => {
          this.dataSelectSubBagian.push({ "id": d.id, "text": d.nama });
          this.dataSelectJabatanSubBagian.push({ "id": d.id, "text": d.nama });
        });
        this.dataSelectSubBagian.forEach(a => {
          if (a.id == this.karyawan.sub_bagian_id) {
            selectSubBagian = a;
          }

        });
        this.entryForm.controls['sub_bagian_id'].patchValue(selectSubBagian);
        this.hrmsTipeKaryawanService.getAll().subscribe(x => {
          let selectedTipe;
          this.dataSelectTipe = [];
          let tip = x['data'];
          tip.forEach(d => {
            this.dataSelectTipe.push({ "id": d.id, "text": d.nama });
            this.dataSelectJabatanTipe.push({ "id": d.id, "text": d.nama });
            if (d.id == this.karyawan.tipe_karyawan_id) {
              selectedTipe = { "id": d.id, "text": d.nama };
            }
          });
          this.entryForm.controls['id_tipe_karyawan'].patchValue(selectedTipe);
          this.hrmsJabatanService.getAll().subscribe(x => {
            let selectedJabatan;
            this.dataSelectJabatan = [];
            let jab = x['data'];
            jab.forEach(d => {
              this.dataSelectJabatan.push({ "id": d.id, "text": d.nama });
              if (d.id == this.karyawan.jabatan_id) {
                selectedJabatan = { "id": d.id, "text": d.nama };
              }
            });
            this.entryForm.controls['id_jabatan'].patchValue(selectedJabatan);

            let dtl = [];
            dtl = this.karyawan.riwayat_jabatan;
            console.log(dtl);
            for (let index = 0; index < dtl.length; index++) {
              const d = dtl[index];
              this.addItemJabatan(d['lokasi_tugas_id'], d['sub_bagian_id'], d['id_tipe_karyawan'], d['jabatan_id'], d['selesai_tugas'], d['tmt'], d['status']);
            }

          });

        });

      });

    });

      this.hrmsDepartemenService.getAll().subscribe(x => {
        let selectedDept;
        this.dataSelectDepartemen = [];
        let dep = x['data'];
        dep.forEach(d => {
          this.dataSelectDepartemen.push({ "id": d.id, "text": d.nama });
          if (d.id == this.karyawan.departemen_id) {
            selectedDept = { "id": d.id, "text": d.nama };
          }

        });
        this.entryForm.controls['id_departemen'].patchValue(selectedDept);
    });


    let dtl = [];
    dtl = this.karyawan.riwayat_bahasa;
    for (let index = 0; index < dtl.length; index++) {
      const d = dtl[index];
      this.addItemBahasa(d['bahasa'], d['kemampuan_bicara']);

    }
    dtl = [];
    dtl = this.karyawan.riwayat_pendidikan;
    for (let index = 0; index < dtl.length; index++) {
      const d = dtl[index];
      this.addItemPendidikan(d['nama_sekolah'], d['lokasi'], d['jurusan'], d['no_ijazah'], d['tgl_ijazah']);

    }
    dtl = [];
    dtl = this.karyawan.riwayat_penghargaan;
    for (let index = 0; index < dtl.length; index++) {
      const d = dtl[index];
      this.addItemPenghargaan(d['nama_penghargaan'], d['tahun'], d['instansi']);

    }
    dtl = [];
    dtl = this.karyawan.riwayat_hukuman;
    for (let index = 0; index < dtl.length; index++) {
      const d = dtl[index];
      this.addItemHukuman(d['jenis_hukuman'], d['no_sk'], d['no_pemulihan'], d['tgl_sk'], d['tgl_pemulihan']);

    }
    dtl = [];
    dtl = this.karyawan.riwayat_keluarga;
    for (let index = 0; index < dtl.length; index++) {
      const d = dtl[index];
      this.addItemKeluarga(d['nama'], d['status'], d['tempat_lahir'], d['jenis_kelamin'], new Date(Date.parse(d['tgl_lahir'])));

    }
    dtl = [];
    dtl = this.karyawan.riwayat_keahlian;
    for (let index = 0; index < dtl.length; index++) {
      const d = dtl[index];
      this.addItemKeahlian(d['nama_keahlian'], d['status']);

    }
    dtl = [];
    dtl = this.karyawan.riwayat_pelatihan;
    for (let index = 0; index < dtl.length; index++) {
      const d = dtl[index];
      this.addItemPelatihan(d['nama_pelatihan'], d['status']);

    }
    dtl = [];
    dtl = this.karyawan.riwayat_pengalaman;
    for (let index = 0; index < dtl.length; index++) {
      const d = dtl[index];
      this.addItemPengalaman(d['perusahaan'], d['mulai'], d['akhir'], d['status']);

    }

  }
  valueChange($event) {
    console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.entryForm.patchValue({
      img: file
    });
    this.entryForm.get('img').updateValueAndValidity();
    this.isChangePhoto = true;
    console.log(this.isChangePhoto);
  }
  statusChange($event) {

    this.aktifKaryawanChanged = $event.value;

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
}
