import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, ValidationErrors } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { Karyawan } from 'src/app/shared/models/karyawan.model';
import { formatDate } from '@angular/common';
import * as QuillNamespace from 'quill';
let Quill: any = QuillNamespace;
import ImageResize from 'quill-image-resize-module';
import { TranslateService } from '@ngx-translate/core';
Quill.register('modules/imageResize', ImageResize);
import { MustMatch } from 'src/app/shared/helpers/must-match.validator';
import { HrmsJabatanService } from 'src/app/shared/services/hrms_jabatan.service';
import { HrmsDepartemenService } from 'src/app/shared/services/hrms_depatemen.service';
import { HrmsKomponenGajiService } from 'src/app/shared/services/hrms_komponen_gaji.service';
import { HrmsTipeKaryawanService } from 'src/app/shared/services/hrms_tipe_karyawan.service';
import { HrmsPangkatService } from 'src/app/shared/services/hrms_pangkat.service';
import { HrmsGolonganService } from 'src/app/shared/services/hrms_golongan.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
declare var swal: any;
declare var $: any;
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
  jenis_kelamin = '';
  dataSelectRole = ['karyawan', 'AKUNTING', 'INVENTORY', 'ASSET', 'PAYROLL', 'PERPUSTAKAAN'];
  dataSelectDepartemen;
  dataSelectPangkat;
  dataSelectGolongan;
  dataSelectJabatan;
  dataSelectTipe;
  dataSelectKomponenGaji;
  dataSelectPengajar;
  dataSelectAgama;
  dataSelectLokasi;
  dataSelectSubBagian;
  aktifKaryawanChanged ="";
  dataSelectJabatanLokasi;
  dataSelectJabatanSubBagian;
  dataSelectJabatanTipe;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private karyawanService: KaryawanService,
    private translate: TranslateService,
    private hrmsJabatanService: HrmsJabatanService,
    private hrmsDepartemenService: HrmsDepartemenService,
    private hrmsPangkatService: HrmsPangkatService,
    private hrmsGolonganService: HrmsGolonganService,
    private hrmsKomponenGajiService: HrmsKomponenGajiService,
    private hrmsTipeKaryawanService: HrmsTipeKaryawanService,
    private GbmOrganisasiService: GbmOrganisasiService,
  ) {

    this.entryForm = this.builder.group({
      lokasi_tugas_id: new FormControl([], Validators.required),
      // lokasi_tipe: new FormControl([], Validators.required),
      sub_bagian_id: new FormControl([], Validators.required),
      nip: new FormControl(null, Validators.required),
      nama: new FormControl('', Validators.required),
      telp: new FormControl('', []),
      email: new FormControl('', []),
      jenis_kelamin: new FormControl("Laki-laki", Validators.required),
      status_id: new FormControl("1", Validators.required),
      tempat_lahir: new FormControl('', []),
      tgl_lahir: new FormControl('', Validators.required),
      tgl_masuk: new FormControl('', Validators.required),
      tgl_keluar: new FormControl('',),
      tgl_hbs_kontrak: new FormControl('',),
      alamat: new FormControl('', []),
      no_hp: new FormControl('', []),
      no_ktp: new FormControl('', []),
      no_npwp: new FormControl('', []),
      no_bpjs: new FormControl('', []),
      no_bpjs_ks: new FormControl('', []),
      no_rek_bank: new FormControl('', []),
      nama_bank: new FormControl('', []),
      no_kk: new FormControl('', []),
      // username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(/^\S*$/)]),
      // password: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      // re_password: new FormControl('', Validators.required,),
      username: new FormControl('', []),
      password: new FormControl('', []),
      re_password: new FormControl('', []),
      img: new FormControl(null, []),
      id_jabatan: new FormControl([], Validators.required),
      id_departemen: new FormControl([], Validators.required),
      id_golongan: new FormControl([], Validators.required),
      id_pangkat: new FormControl([], Validators.required),
      id_tipe_karyawan: new FormControl([], Validators.required),
      status_pernikahan: new FormControl('Menikah', Validators.required),
      agama: new FormControl([], Validators.required),
      golongan_darah: new FormControl([],),
      status_pajak: new FormControl([], Validators.required),
      keluargaItems: this.builder.array([]),
      pendidikanItems: this.builder.array([]),
      bahasaItems: this.builder.array([]),
      jabatanItems: this.builder.array([]),
      pangkatItems: this.builder.array([]),
      hukumanItems: this.builder.array([]),
      penghargaanItems: this.builder.array([]),
      pengalamanItems: this.builder.array([]),
      keahlianItems: this.builder.array([]),
      pelatihanItems: this.builder.array([]),

      is_jht: new FormControl(0, Validators.required),
      is_jp: new FormControl(0, Validators.required),
      is_jks: new FormControl(0, Validators.required),

      role_id: new FormControl([], []),
      is_admin: new FormControl('0', []),
      editor: new FormControl(null, []),
    }
      // , {
      //   validator: MustMatch('password', 're_password')
      // }
    );

  }
  get userControl() { return this.entryForm.controls; }
  get pengalamanItems(): FormArray {
    return this.entryForm.get('pengalamanItems') as FormArray;
  };
  get keahlianItems(): FormArray {
    return this.entryForm.get('keahlianItems') as FormArray;
  };
  get pelatihanItems(): FormArray {
    return this.entryForm.get('pelatihanItems') as FormArray;
  };
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

  addItemKeluarga() {

    this.keluargaItems.push(this.builder.group({
      nama_keluarga: new FormControl('', []),
      tempat_lahir_keluarga: new FormControl('', []),
      tanggal_lahir_keluarga: new FormControl('', []),
      status_keluarga: new FormControl('', []),
    }));

  }

  removeItemKeluarga(item) {

    let i = this.keluargaItems.controls.indexOf(item);

    if (i != -1) {
      this.keluargaItems.controls.splice(i, 1);
      let items = this.entryForm.get('keluargaItems') as FormArray;
      let data = { keluargaItems: items };
      // this.updateForm(data);
    }
  }
  addItemPelatihan() {

    this.pelatihanItems.push(this.builder.group({
      nama_pelatihan: new FormControl('', []),
      status: new FormControl('', []),

    }));

  }

  removeItemPelatihan(item) {

    let i = this.pelatihanItems.controls.indexOf(item);

    if (i != -1) {
      this.pelatihanItems.controls.splice(i, 1);
      let items = this.entryForm.get('pelatihanItems') as FormArray;
      let data = { pelatihanItems: items };
      // this.updateForm(data);
    }
  }
  addItemPengalaman() {

    this.pengalamanItems.push(this.builder.group({
      perusahaan: new FormControl('', []),
      mulai: new FormControl('', []),
      akhir: new FormControl('', []),
      status: new FormControl('', []),
    }));

  }

  removeItemPengalaman(item) {

    let i = this.pengalamanItems.controls.indexOf(item);

    if (i != -1) {
      this.pengalamanItems.controls.splice(i, 1);
      let items = this.entryForm.get('pengalamanItems') as FormArray;
      let data = { pengalamanItems: items };
      // this.updateForm(data);
    }
  }
  addItemKeahlian() {

    this.keahlianItems.push(this.builder.group({
      nama_keahlian: new FormControl('', []),
      status: new FormControl('', [])
    }));

  }

  removeItemKeahlian(item) {

    let i = this.keahlianItems.controls.indexOf(item);

    if (i != -1) {
      this.keahlianItems.controls.splice(i, 1);
      let items = this.entryForm.get('keahlianItems') as FormArray;
      let data = { keahlianItems: items };
      // this.updateForm(data);
    }
  }
  addItemPendidikan() {

    this.pendidikanItems.push(this.builder.group({
      nama_sekolah: new FormControl('', []),
      lokasi_sekolah: new FormControl('', []),
      jurusan: new FormControl('', []),
      no_ijazah: new FormControl('', []),
      tgl_ijazah: new FormControl('', []),
    }));

  }

  removeItemPendidikan(item) {

    let i = this.pendidikanItems.controls.indexOf(item);

    if (i != -1) {
      this.pendidikanItems.controls.splice(i, 1);
      let items = this.entryForm.get('pendidikanItems') as FormArray;
      let data = { pendidikanItems: items };
      // this.updateForm(data);
    }
  }
  addItemBahasa() {

    this.bahasaItems.push(this.builder.group({
      bahasa: new FormControl('', []),
      kemampuan_bicara: new FormControl('', []),
    }));

  }

  removeItemBahasa(item) {

    let i = this.bahasaItems.controls.indexOf(item);

    if (i != -1) {
      this.bahasaItems.controls.splice(i, 1);
      let items = this.entryForm.get('bahasaItems') as FormArray;
      let data = { invoiceItems: items };
      // this.updateForm(data);
    }
  }
  addItemPangkat() {

    this.pangkatItems.push(this.builder.group({
      riwayat_pangkat: new FormControl([], []),
      riwayat_golongan: new FormControl([], []),
      tmt_pangkat: new FormControl('', []),
      status_pangkat: new FormControl('', []),
    }));

  }

  removeItemPangkat(item) {

    let i = this.pangkatItems.controls.indexOf(item);

    if (i != -1) {
      this.pangkatItems.controls.splice(i, 1);
      let items = this.entryForm.get('pangkatItems') as FormArray;
      let data = { invoiceItems: items };
      // this.updateForm(data);
    }
  }
  addItemJabatan() {

    this.jabatanItems.push(this.builder.group({
      lokasi_tugas_id: new FormControl([]),
      sub_bagian_id: new FormControl([]),
      id_tipe_karyawan: new FormControl([]),
      riwayat_jabatan: new FormControl([], []),
      selesai_tugas_jabatan: new FormControl('', []),
      tmt_jabatan: new FormControl('', []),
      status_jabatan: new FormControl('', []),
    }));

  }

  removeItemJabatan(item) {

    let i = this.jabatanItems.controls.indexOf(item);

    if (i != -1) {
      this.jabatanItems.controls.splice(i, 1);
      let items = this.entryForm.get('jabatanItems') as FormArray;
      let data = { jabatanItems: items };
      // this.updateForm(data);
    }
  }
  addItemPenghargaan() {

    this.penghargaanItems.push(this.builder.group({
      nama_penghargaan: new FormControl('', []),
      tahun_penghargaan: new FormControl('', []),
      instansi_penghargaan: new FormControl('', []),
    }));

  }

  removeItemPenghargaan(item) {

    let i = this.penghargaanItems.controls.indexOf(item);

    if (i != -1) {
      this.penghargaanItems.controls.splice(i, 1);
      let items = this.entryForm.get('penghargaanItems') as FormArray;
      let data = { invoiceItems: items };
      // this.updateForm(data);
    }
  }
  addItemHukuman() {

    this.hukumanItems.push(this.builder.group({
      jenis_hukuman: new FormControl('', []),
      nosk_hukuman: new FormControl('', []),
      nosk_pemulihan: new FormControl('', []),
      tglsk_hukuman: new FormControl('', []),
      tglsk_pemulihan: new FormControl('', []),
    }));

  }

  removeItemHukuman(item) {

    let i = this.hukumanItems.controls.indexOf(item);

    if (i != -1) {
      this.hukumanItems.controls.splice(i, 1);
      let items = this.entryForm.get('hukumanItems') as FormArray;
      let data = { hukumanItems: items };
      // this.updateForm(data);
    }
  }

  ngAfterViewInit(): void {
    this.loadSelect2();
  }
  public dataSelect: any[] = [];
  public options: any;

  private loadSelect2(): void {
    // let m = this.translate.instant('holidays.messages.update');
    this.dataSelectAgama = [
      { id: 'ISLAM', text: 'ISLAM' },
      { id: 'KRISTEN', text: 'KRISTEN' },
      { id: 'KATHOLIK', text: 'KATHOLIK' },
      { id: 'BUDHA', text: 'BUDHA' },
      { id: 'HINDU', text: 'HINDU' },
    ];
    this.hrmsPangkatService.getAll().subscribe(x => {
      this.dataSelectPangkat = [];
      let dep = x['data'];
      dep.forEach(d => {
        this.dataSelectPangkat.push({ "id": d.id, "text": d.nama });

      });

    });
    this.GbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
    });
    this.entryForm.controls['lokasi_tugas_id'].valueChanges.subscribe(x => {
      let org_id = x.id;
      this.GbmOrganisasiService.getSubById(org_id).subscribe(x => {
        this.dataSelectSubBagian = [];
        x.forEach(d => {
          this.dataSelectSubBagian.push({ "id": d.id, "text": d.nama });
        });
      });
    });

    this.GbmOrganisasiService.getAllByType('SUBBAGIAN').subscribe(x => {
      this.dataSelectJabatanSubBagian = [];
      x.forEach(d => {
        this.dataSelectJabatanSubBagian.push({ "id": d.id, "text": d.nama });
      });
    });

    // this.GbmOrganisasiService.getAllByType("SUBBAGIAN").subscribe(x => {
    //   this.dataSelectSubBagian = [];
    //   x.forEach(d => {
    //     this.dataSelectSubBagian.push({ "id": d.id, "text": d.nama });
    //   });
    // });

    this.hrmsGolonganService.getAll().subscribe(x => {
      this.dataSelectGolongan = [];
      let dep = x['data'];
      dep.forEach(d => {
        this.dataSelectGolongan.push({ "id": d.id, "text": d.nama });

      });

    });
    this.hrmsDepartemenService.getAll().subscribe(x => {
      this.dataSelectDepartemen = [];
      let dep = x['data'];
      dep.forEach(d => {
        this.dataSelectDepartemen.push({ "id": d.id, "text": d.nama });

      });

    });
    this.hrmsJabatanService.getAll().subscribe(x => {
      this.dataSelectJabatan = [];
      let jab = x['data'];
      jab.forEach(d => {
        this.dataSelectJabatan.push({ "id": d.id, "text": d.nama });

      });

    });
    this.hrmsTipeKaryawanService.getAll().subscribe(x => {
      this.dataSelectTipe = [];
      let tip = x['data'];
      tip.forEach(d => {
        this.dataSelectTipe.push({ "id": d.id, "text": d.nama });

      });

    });

    this.dataSelect = [
      { id: 'Laki-laki', text: 'Laki-laki' },
      { id: 'Perempuan', text: 'Perempuan' },
    ];
    this.dataSelect.unshift({ id: -1, text: 'Pilih' });
  }
  onSubmit() {
    this.isFormSubmitted = true;
    let errors: any = [];
    let fieldError;
    if (this.entryForm.invalid) {

      Object.keys(this.entryForm.controls).forEach(key => {
        console.log(key);

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
        text: 'Form belum lengkap/Tidak Valid.' + errors,
        type: 'warning',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      })
      return;
    }
    console.log(this.entryForm.value);


    let frmDataValue = this.entryForm.value;
    let frmData = new FormData();

    // console.log(frmDataValue);
    this.entryForm.value.keluargaItems.forEach(element => {
      if (element.tanggal_lahir_keluarga == '' || element.tanggal_lahir_keluarga == null) {
        element.tanggal_lahir_keluarga = null;
      } else {
        element.tanggal_lahir_keluarga = formatDate(element.tanggal_lahir_keluarga, "yyyy-MM-dd", 'en_US')

      }

    });
    let tgl_keluar;
    if (this.entryForm.get('tgl_keluar').value == null || this.entryForm.get('tgl_keluar').value == '') {
      tgl_keluar = null
    } else {
      tgl_keluar = formatDate(this.entryForm.get('tgl_keluar').value, "yyyy-MM-dd", 'en_US')
    }
    if (this.aktifKaryawanChanged!="0"){
      tgl_keluar = null
    }
    let tgl_hbs_kontrak;
    if (this.entryForm.get('tgl_hbs_kontrak').value == null || this.entryForm.get('tgl_hbs_kontrak').value == '') {
      tgl_hbs_kontrak = null
    } else {
      tgl_hbs_kontrak = formatDate(this.entryForm.get('tgl_hbs_kontrak').value, "yyyy-MM-dd", 'en_US')
    }
    let role = this.entryForm.get('role_id').value.map(a => { return a.id });
    frmData.append("lokasi_tugas_id", this.entryForm.get('lokasi_tugas_id').value['id']);
    frmData.append("sub_bagian_id", this.entryForm.get('sub_bagian_id').value['id']);
    frmData.append('nip', this.entryForm.get('nip').value);
    frmData.append('nama', this.entryForm.get('nama').value);
    frmData.append('telp', this.entryForm.get('telp').value);
    frmData.append('no_hp', this.entryForm.get('no_hp').value);
    frmData.append('no_npwp', this.entryForm.get('no_npwp').value);
    frmData.append('no_ktp', this.entryForm.get('no_ktp').value);
    frmData.append('no_kk', this.entryForm.get('no_kk').value);
    frmData.append('no_bpjs', this.entryForm.get('no_bpjs').value);
    frmData.append('no_bpjs_ks', this.entryForm.get('no_bpjs_ks').value);
    frmData.append('no_rek_bank', this.entryForm.get('no_rek_bank').value);
    frmData.append('nama_bank', this.entryForm.get('nama_bank').value);
    frmData.append('email', this.entryForm.get('email').value);
    frmData.append('jenis_kelamin', this.entryForm.get('jenis_kelamin').value);
    frmData.append('tempat_lahir', this.entryForm.get('tempat_lahir').value);
    frmData.append('tgl_lahir', formatDate(this.entryForm.get('tgl_lahir').value, "yyyy-MM-dd", 'en_US'));
    frmData.append('tgl_masuk', formatDate(this.entryForm.get('tgl_masuk').value, "yyyy-MM-dd", 'en_US'));
    frmData.append('tgl_keluar', tgl_keluar);
    frmData.append('tgl_hbs_kontrak', tgl_hbs_kontrak);
    frmData.append('alamat', this.entryForm.get('alamat').value);
    frmData.append('username', this.entryForm.get('username').value);
    frmData.append('password', this.entryForm.get('password').value);
    frmData.append("userfile", this.entryForm.get('img').value);
    frmData.append('role_id', JSON.stringify(role));
    frmData.append("status_id", this.entryForm.get('status_id').value);
    frmData.append("status_pernikahan", this.entryForm.get('status_pernikahan').value);
    frmData.append("golongan_darah", this.entryForm.get('golongan_darah').value);
    frmData.append("status_pajak", this.entryForm.get('status_pajak').value);
    frmData.append("id_jabatan", this.entryForm.get('id_jabatan').value['id']);
    frmData.append("id_departemen", this.entryForm.get('id_departemen').value['id']);
    frmData.append("id_golongan", this.entryForm.get('id_golongan').value['id']);
    frmData.append("id_pangkat", this.entryForm.get('id_pangkat').value['id']);
    frmData.append("id_tipe_karyawan", this.entryForm.get('id_tipe_karyawan').value['id']);
    frmData.append("agama", this.entryForm.get('agama').value['id']);
    frmData.append("is_jht",this.entryForm.get('is_jht').value?"1":"0");
    frmData.append("is_jp", this.entryForm.get('is_jp').value?"1":"0");
    frmData.append("is_jks", this.entryForm.get('is_jks').value?"1":"0");
    frmDataValue['img'] = null;
    frmData.append("details", JSON.stringify(frmDataValue));

    this.karyawanService.create(frmData).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Simpan berhasil',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        });
        this.event.emit('OK');
        this.bsModalRef.hide();

      }
    });
  }


  jabatanGetSublokasi(form) {
    let org_id = form.get('lokasi_tugas_id');
    this.GbmOrganisasiService.getSubById(org_id).subscribe(x => {
      this.dataSelectJabatanSubBagian = [];
      x.forEach(d => {
        this.dataSelectJabatanSubBagian.push({ "id": d.id, "text": d.nama });
      });
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

    this.editor_modules = {
      toolbar: {
        container: [
          [{ 'font': [] }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'header': 1 }, { 'header': 2 }],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'align': [] }],
          ['link', 'image']
        ]
      },

      imageResize: true
    };

  }
  valueChange($event) {
    console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
  statusChange($event) {
    this.aktifKaryawanChanged  = $event.value;
    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;
  }

}
