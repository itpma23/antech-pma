import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { EstBkmPanenService } from 'src/app/shared/services/est_bkm_panen.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { AccKegiatanService } from 'src/app/shared/services/acc_kegiatan.service';
import { EstDendaPanenService } from 'src/app/shared/services/est_denda_panen.service';
import { EstKodeDendaPanenService } from 'src/app/shared/services/est_kode_denda_panen.service';
import { resolve } from 'url';
import { HrmsKaryawanGajiService } from 'src/app/shared/services/hrms_karyawan_gaji.service';

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

  dataSelectAfdeling;
  dataSelectBlok;
  dataSelectMandor;
  dataSelectAsisten;
  dataSelectDenda;
  dataSelectEstate: any[];
  dataSelectKerani: any[];
  dataSelectKaryawan: any[];
  dataSelectGudang: any[];
  dataSelectKegiatan: any[];
  dataSelectKodeDenda: any[];
  estRekapitulasi = [];
  dataKegiatan: any;

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private estBkmPanenService: EstBkmPanenService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private KaryawanService: KaryawanService,
    private accKegiatanService: AccKegiatanService,
    private estKodeDendaPanenService: EstKodeDendaPanenService,
    private estDendaPanenService: EstDendaPanenService,
    private hrmsKaryawanGajiService: HrmsKaryawanGajiService,
    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      no_transaksi: new FormControl('(AutoNumber)'),
      lokasi_id: new FormControl([], Validators.required),
      afdeling_id: new FormControl([], Validators.required),
      mandor_id: new FormControl([]),
      ket_mandor: new FormControl(''),
      ket_kerani: new FormControl(''),
      kerani_id: new FormControl([]),
      asisten_id: new FormControl([]),
      mandor_hasil_kerja: new FormControl(0),
      mandor_jumlah_hk: new FormControl(0),
      mandor_rupiah_hk: new FormControl(0),
      mandor_premi: new FormControl(0),
      mandor_denda: new FormControl(0),
      kerani_hasil_kerja: new FormControl(0),
      kerani_jumlah_hk: new FormControl(0),
      kerani_rupiah_hk: new FormControl(0),
      kerani_premi: new FormControl(0),
      kerani_denda: new FormControl(0),
      is_premi_kontanan: new FormControl(0),
      is_asistensi: new FormControl(0),
      is_asistensi_unit: new FormControl(0),
      tanggal: new FormControl(toDate, Validators.required),
      details: this.builder.array([]),

    });

  }
  get userControl() { return this.entryForm.controls; }
  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };
  get details_denda(): FormArray {
    return this.details.get('details_denda') as FormArray;
  };
  // get get_details(): FormGroup {
  //   return this.builder.group({
  //     karyawan_id: new FormControl([], Validators.required),
  //     blok_id: new FormControl([], Validators.required),
  //     // kegiatan_id: new FormControl([], Validators.required),
  //     hasil_kerja_jjg: new FormControl(0, Validators.required),
  //     hasil_kerja_brondolan: new FormControl(0, Validators.required),
  //     hasil_kerja_luas: new FormControl(0, Validators.required),
  //     premi_brondolan: new FormControl(0, Validators.required),
  //     rp_hk: new FormControl(0, Validators.required),
  //     premi_basis: new FormControl(0, Validators.required),
  //     premi_lebih_basis: new FormControl(0, Validators.required),
  //     details_denda: this.builder.array([]),


  //   });

  // }
  get get_details_denda(): FormGroup {
    return this.builder.group({
      denda_id: new FormControl([], Validators.required),
      qty: new FormControl(0, Validators.required),
      nilai: new FormControl(0, Validators.required),


    });

  }

  ngAfterViewInit(): void {
    this.addDetail();
  }
  public options: any;

  private loadSelect2(): void {
    this.accKegiatanService.getAllbyTipe('BKM_PANEN').subscribe(x => {
      this.dataKegiatan = x['data'];
      this.dataSelectKegiatan = [];
      x['data'].forEach(d => {
        this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama + "-" + d.kode + " (" + d.uom + ")" });
      });
    });
    this.GbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectEstate = [];
      x.forEach(d => {
        this.dataSelectEstate.push({ "id": d.id, "text": d.nama });
      });
      this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {
        let org_id = x.id;
        // this.GbmOrganisasiService.getAfdelingByEstate(org_id).subscribe(x => {
        this.GbmOrganisasiService.getAfdelingByEstateAndUser(org_id).subscribe(x => {
          this.dataSelectAfdeling = [];
          x.forEach(d => {
            this.dataSelectAfdeling.push({ "id": d.id, "text": d.nama });
          });
          this.entryForm.controls['afdeling_id'].valueChanges.subscribe(x => {
            let org_id = x.id;
            this.GbmOrganisasiService.getBlokByAfdeling(org_id).subscribe(x => {
              this.dataSelectBlok = [];
              x.forEach(d => {
                this.dataSelectBlok.push({ "id": d.id, "text": d.kode + " - " + d.nama });
              });
            })
            let tgl = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
            this.KaryawanService.getAllAktifByDivisi(org_id, tgl).subscribe(x => {
              console.log(x)
              this.dataSelectKaryawan = [];
              this.dataSelectMandor = [];
              this.dataSelectAsisten = [];
              this.dataSelectKerani = [];
              let kary = x['data'];
              kary.forEach(d => {

                this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" });
                this.dataSelectMandor.push({ "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" });
                this.dataSelectAsisten.push({ "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" });
                this.dataSelectKerani.push({ "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" });

              });
            });
          });
        });




      });

    });

    this.estKodeDendaPanenService.getAll().subscribe(x => {
      this.dataSelectKodeDenda = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectKodeDenda.push({ "id": d.id, "text": d.nama + "(" + d.kode + ")" });
      });
    });


  }
  hitungPremiMandorKerani() {
    let frmData = this.entryForm.getRawValue();// this.entryForm.value;
    this.estBkmPanenService.hitungPremiMandorKerani(frmData).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        this.entryForm.controls['mandor_premi'].patchValue(data['data']['premi_mandor'])
        this.entryForm.controls['kerani_premi'].patchValue(data['data']['premi_kerani'])
      }
    });
  }
  onSubmitClear() {
    this.isFormSubmitted = true;
    let frmData = this.entryForm.getRawValue();// this.entryForm.value;
    console.log(frmData)
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
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
    this.estBkmPanenService.create(frmData).subscribe(data => {
      if (data['status'] == 'OK') {
        swal({
          title: 'Info!',
          text: 'Data berhasil disimpan dengan Nomor:' + data['data'],
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        // this.event.emit('OK');
        // this.bsModalRef.hide();
        this.isFormSubmitted = false;
        let date: Date = new Date();
        let strDate = formatDate(date, "yyyy-MM-dd", "en_US");
        this.entryForm.get('details').patchValue([]);
        this.entryForm.get('no_transaksi').patchValue('(AutoNumber)');
        this.entryForm.get('tanggal').patchValue(new Date(Date.parse(strDate)));
        // this.entryForm.get('lokasi_id').patchValue({});
        // this.entryForm.get('afdeling_id').patchValue({});
        this.entryForm.get('mandor_id').patchValue({});
        this.entryForm.get('asisten_id').patchValue({});
        this.entryForm.get('kerani_id').patchValue({});
        this.entryForm.get('ket_mandor').patchValue('');
        this.entryForm.get('ket_kerani').patchValue('');
        this.entryForm.get('mandor_hasil_kerja').patchValue(0);
        this.entryForm.get('mandor_jumlah_hk').patchValue(0);
        this.entryForm.get('mandor_rupiah_hk').patchValue(0);
        this.entryForm.get('mandor_premi').patchValue(0);
        this.entryForm.get('mandor_denda').patchValue(0);
        this.entryForm.get('kerani_hasil_kerja').patchValue(0);
        this.entryForm.get('kerani_jumlah_hk').patchValue(0);
        this.entryForm.get('kerani_rupiah_hk').patchValue(0);
        this.entryForm.get('kerani_premi').patchValue(0);
        this.entryForm.get('kerani_denda').patchValue(0);
        this.entryForm.get('is_premi_kontanan').patchValue(0);
        this.entryForm.get('is_asistensi').patchValue(0);
        let dt = this.entryForm.get('details') as FormArray;
        let data_val = dt.value;
        console.log(data_val);
        for (let i of data_val) {
          console.log(i)
          dt.removeAt(i);

        }
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
    let frmData = this.entryForm.getRawValue();// this.entryForm.value;
    console.log(frmData)
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
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

    this.estBkmPanenService.create(frmData).subscribe(data => {
      if (data['status'] == 'OK') {
        swal({
          title: 'Info!',
          text: 'Data berhasil disimpan dengan Nomor:' + data['data'],
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



  addDetail() {

    this.details.push(this.builder.group({
      karyawan_id: new FormControl([], Validators.required),
      blok_id: new FormControl([], Validators.required),
      kegiatan_id: new FormControl([], Validators.required),
      bjr: new FormControl({ value: 0, disabled: false }, Validators.required),
      jumlah_hk: new FormControl(1, Validators.required),
      hasil_kerja_jjg: new FormControl(0, Validators.required),
      hasil_kerja_kg: new FormControl({ value: 0, disabled: true }, Validators.required),
      hasil_kerja_brondolan: new FormControl(0, Validators.required),
      hasil_kerja_luas: new FormControl(0, Validators.required),
      premi_brondolan: new FormControl({ value: 0, disabled: true }, Validators.required),
      rp_hk: new FormControl({ value: 0, disabled: true }, Validators.required),
      premi_basis: new FormControl({ value: 0, disabled: false }, Validators.required),
      premi_lebih_basis: new FormControl({ value: 0, disabled: false }, Validators.required),
      premi_panen: new FormControl({ value: 0, disabled: true }, Validators.required),
      denda_panen: new FormControl({ value: 0, disabled: true }, Validators.required),
      denda_basis: new FormControl({ value: 0, disabled: true }, Validators.required),
      basis_jjg: new FormControl({ value: 0, disabled: false }, Validators.required),
      total_pendapatan: new FormControl({ value: 0, disabled: true }, Validators.required),
      potongan: new FormControl('0', Validators.required),
      keterangan_potongan: new FormControl(''),
      ket: new FormControl(''),
      details_denda: this.builder.array([]),

    }));

    // this.valueChange();
  }
  addDenda(blok) {

    blok.get('details_denda').push(this.builder.group({
      denda_id: new FormControl([], Validators.required),
      qty: new FormControl(0, Validators.required),
      nilai: new FormControl(0, Validators.required),
      jumlah_denda: new FormControl(0, Validators.required),
    }));

    // this.valueChange();
  }


  removeDetail(Blok) {
    let i = this.details.controls.indexOf(Blok);
    if (i != -1) {
      //  let x=	this.details.controls.splice(i, 1);
      let bloks = this.entryForm.get('details') as FormArray;
      bloks.removeAt(i);
      let data = { details: bloks.value };
      this.updateForm(data);
    }

    // this.valueChange();
  }
  removeDenda(blok, denda) {
    let i = blok.get('details_denda').controls.indexOf(denda);
    if (i != -1) {
      //  let x=	this.details.controls.splice(i, 1);
      let dendas = blok.get('details_denda') as FormArray;
      dendas.removeAt(i);
      let data = { details_denda: dendas.value };
      this.updateForm(data);
    }
    // this.hitungPremi(blok);
    this.ubahPremi(blok);
    // this.valueChange();
  }


  hitungHkKaryawan(blok) {
    let karyawan_id = blok.get('karyawan_id').value['id']
    let tanggal = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');;
    this.hrmsKaryawanGajiService.getGajiPerhari(karyawan_id,tanggal).subscribe(res => {
      console.log(res)
      if (res['status'] == 'OK') {
        let gajiPerhari = res['data']['rp_hk']
        let jumlah_hk = parseFloat(blok.get('jumlah_hk').value)
        blok.get('rp_hk').patchValue(jumlah_hk * gajiPerhari);
      }
    });
  }

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
    if (!this.entryForm.dirty) {
      // form belum diapa-apakan → langsung close
      this.bsModalRef.hide();
      return;
    }

    // form sudah ada isi / perubahan → munculkan swal
    let that = this;
    swal({
      title: 'Yakin akan Menutup?',
      text: "Data yang sudah diinput akan hilang!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      buttonsStyling: false
    }).then(function () {
      that.bsModalRef.hide();
    });
  }

  ngOnInit() {
    this.loadSelect2();
    // this.valueChange();

  }
  asistensiChange(event) {
    // console.log(event);
    if (event.target.checked) {
      let org_id = this.entryForm.get('lokasi_id').value['id'];
      this.GbmOrganisasiService.getBlokByEstate(org_id).subscribe(x => {
        this.dataSelectBlok = [];
        x.forEach(d => {
          this.dataSelectBlok.push({ "id": d.id, "text": d.kode + " - " + d.nama });
        });
      })

    } else {
      let org_id = this.entryForm.get('afdeling_id').value['id'];
      this.GbmOrganisasiService.getBlokByAfdeling(org_id).subscribe(x => {
        this.dataSelectBlok = [];
        x.forEach(d => {
          this.dataSelectBlok.push({ "id": d.id, "text": d.kode + " - " + d.nama });
        });
      })

    }

  }
  asistensiUnitChange(event) {
    // console.log(event);
    if (event.target.checked) {
      let org_id = this.entryForm.get('lokasi_id').value['id'];
      this.KaryawanService.getAllAktifEstate().subscribe(x => {
        console.log(x)
        this.dataSelectKaryawan = [];
        this.dataSelectMandor = [];
        this.dataSelectAsisten = [];
        this.dataSelectKerani = [];
        let kary = x['data'];
        kary.forEach(d => {
          this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" });
          this.dataSelectMandor.push({ "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" });
          this.dataSelectAsisten.push({ "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" });
          this.dataSelectKerani.push({ "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" });

        });
      });
    } else {
      let tgl = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
      let org_id = this.entryForm.get('afdeling_id').value['id']
      this.KaryawanService.getAllAktifByDivisi(org_id, tgl).subscribe(x => {
        console.log(x)
        this.dataSelectKaryawan = [];
        this.dataSelectMandor = [];
        this.dataSelectAsisten = [];
        this.dataSelectKerani = [];
        let kary = x['data'];
        kary.forEach(d => {

          this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" });
          this.dataSelectMandor.push({ "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" });
          this.dataSelectAsisten.push({ "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" });
          this.dataSelectKerani.push({ "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" });

        });
      });

    }

  }
  valueChange(event, blok) {
    // console.log(event);
    // console.log(blok);
    this.hitungPremi(blok);
  }
  dendaChange(event, blok, denda) {
    console.log(event);
    console.log(blok);
    console.log(denda);
    let tgl=formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    let lokasi_id=this.entryForm.get('lokasi_id').value['id'];
     // this.estDendaPanenService.getById(event['id']).subscribe(x => {
       this.estDendaPanenService.getDendaPanenByTanggal(lokasi_id,event['id'],tgl).subscribe(x => {
         console.log(x)
      denda.get('nilai').patchValue(x['data']['nilai']);
      this.hitungDenda(blok, denda);

    });

  }
  getGajiPerhariMandor(ev) {
    this.entryForm.controls['mandor_rupiah_hk'].patchValue(0)
    this.entryForm.controls['mandor_jumlah_hk'].patchValue(0)
    this.entryForm.controls['mandor_premi'].patchValue(0)
    // let karyawan_id = ev['id']

    // this.hrmsKaryawanGajiService.getGajiPerhari(karyawan_id).subscribe(res => {
    //   console.log(res)
    //   if (res['status'] == 'OK') {
    //     let gajiPerhari = res['data']['rp_hk']
    //     let jum_hk = this.entryForm.controls['mandor_jumlah_hk'].value
    //     let rupiah = gajiPerhari * jum_hk
    //     this.entryForm.controls['mandor_rupiah_hk'].patchValue(rupiah)
    //   }
    // });
  }
  getGajiPerhariKerani(ev) {
    this.entryForm.controls['kerani_rupiah_hk'].patchValue(0)
    this.entryForm.controls['kerani_jumlah_hk'].patchValue(0)
    this.entryForm.controls['kerani_premi'].patchValue(0)
    // let karyawan_id = ev['id']
    // this.hrmsKaryawanGajiService.getGajiPerhari(karyawan_id).subscribe(res => {
    //   console.log(res)
    //   if (res['status'] == 'OK') {
    //     let gajiPerhari = res['data']['rp_hk']
    //     let jum_hk = this.entryForm.controls['kerani_jumlah_hk'].value
    //     let rupiah = gajiPerhari * jum_hk
    //     this.entryForm.controls['kerani_rupiah_hk'].patchValue(rupiah)
    //   }
    // });
  }
  hitungHkKerani() {
    let karyawan_id = this.entryForm.controls['kerani_id'].value['id']
    let tanggal = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    this.hrmsKaryawanGajiService.getGajiPerhari(karyawan_id,tanggal).subscribe(res => {
      console.log(res)
      if (res['status'] == 'OK') {
        let gajiPerhari = res['data']['rp_hk']
        let jum_hk = this.entryForm.controls['kerani_jumlah_hk'].value
        let rupiah = gajiPerhari * jum_hk
        this.entryForm.controls['kerani_rupiah_hk'].patchValue(rupiah)
      }
    });
  }
  hitungHkMandor() {
    let karyawan_id = this.entryForm.controls['mandor_id'].value['id']
    let tanggal = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    console.log('cek tanggal', tanggal)
    this.hrmsKaryawanGajiService.getGajiPerhari(karyawan_id, tanggal).subscribe(res => {
      console.log(res)
      if (res['status'] == 'OK') {
        let gajiPerhari = res['data']['rp_hk']
        let jum_hk = this.entryForm.controls['mandor_jumlah_hk'].value
        let rupiah = gajiPerhari * jum_hk
        this.entryForm.controls['mandor_rupiah_hk'].patchValue(rupiah)
      }
    });
  }
 hitungPremi(blok) {

    let data = blok.value
    data['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    console.log(data);
    this.estBkmPanenService.hitungPremi(data).subscribe(res => {
      console.log(res)

      if (res['status'] == 'OK') {
        let hasil = res['data']
        blok.get('jumlah_hk').patchValue(hasil['jumlah_hk']);

        blok.get('bjr').patchValue(hasil['bjr']); // request dharu/andri per 17 Juli2024      
        blok.get('hasil_kerja_kg').patchValue(hasil['hasil_kerja_kg']);
        let bjr=0;let jjg=0;
        jjg=blok.get('hasil_kerja_jjg').value;
        blok.get('premi_brondolan').patchValue(hasil['premi_brondolan']);
        blok.get('rp_hk').patchValue(hasil['rp_hk']);
        blok.get('premi_basis').patchValue(hasil['premi_basis']);
        blok.get('premi_lebih_basis').patchValue(hasil['upah_premi_lebih_basis']);
        blok.get('premi_panen').patchValue(hasil['premi_panen']);
        blok.get('denda_panen').patchValue(hasil['denda_panen']);
        blok.get('denda_basis').patchValue(hasil['denda_basis']);
        blok.get('basis_jjg').patchValue(hasil['basis_jjg']);
        blok.get('total_pendapatan').patchValue(hasil['total_pendapatan']);

      }
    });

  }
  hitungDenda(blok, denda) {
    console.log(denda);
    let qty = parseFloat(denda.get('qty').value)
    let nilai = parseFloat(denda.get('nilai').value)
    denda.get('jumlah_denda').patchValue(qty * nilai);
    // this.hitungPremi(blok);
    this.ubahPremi(blok)

  }

  ubahPremi(blok) {


    let hasil = blok.getRawValue();
    // console.log(hasil)
    let detail_denda = hasil['details_denda'];
    let jumlah_denda = 0;
    detail_denda.forEach(d => {
      jumlah_denda = jumlah_denda + parseFloat(d['jumlah_denda']);

    });
    blok.get('denda_panen').patchValue(jumlah_denda);
    let premi = parseFloat(hasil['premi_basis']) + parseFloat(hasil['premi_lebih_basis']) + parseFloat(hasil['premi_brondolan']);
    let jum_denda = (jumlah_denda) + parseFloat(hasil['denda_basis']) + parseFloat(hasil['potongan']);
    let total_pendapatan = parseFloat(hasil['rp_hk']) + premi - jum_denda;
    blok.get('premi_panen').patchValue(parseFloat(hasil['premi_basis']) + parseFloat(hasil['premi_lebih_basis']));
    blok.get('total_pendapatan').patchValue(total_pendapatan);


  }
  hitungRekapitulasi() {
    let dtls = this.details;
    let dt = dtls.getRawValue();
    // console.log(dt)
    const arr_hk = [];
    const arr_premi = [];
    const arr_jjg = [];
    const arr_luas = [];
    const arr_rp_hk = [];
    const arr_denda_panen = [];
    const arr_blok = this.remove_duplicate_array(dt.map(d => { return d['blok_id']['text'] }));
    let total_hk = 0;
    let total_premi = 0;
    let total_rp_hk = 0;
    let total_jjg = 0;
    let total_luas = 0;
    let total_denda_panen = 0;
    dt.forEach(d => {
      let jum_hk = parseFloat(d['jumlah_hk']);
      let rp_hk = parseFloat(d['jumlah_hk']) * parseFloat(d['rp_hk']);
      let premi = parseFloat(d['premi_panen']) + parseFloat(d['premi_brondolan']);
      let jjg = parseFloat(d['hasil_kerja_jjg']);
      let luas = parseFloat(d['hasil_kerja_luas']);
      let denda_panen = parseFloat(d['denda_panen']);
      let blok = d['blok_id']['text']

      if (!arr_hk[blok]) {
        arr_hk[blok] = [];
        arr_hk[blok] = jum_hk;

      } else {
        arr_hk[blok] = parseFloat(arr_hk[blok]) + jum_hk
      }
      if (!arr_rp_hk[blok]) {
        arr_rp_hk[blok] = [];
        arr_rp_hk[blok] = rp_hk
      } else {
        arr_rp_hk[blok] = parseFloat(arr_rp_hk[blok]) + rp_hk
      }
      if (!arr_premi[blok]) {
        arr_premi[blok] = [];
        arr_premi[blok] = premi
      } else {
        arr_premi[blok] = parseFloat(arr_premi[blok]) + premi
      }
      if (!arr_jjg[blok]) {
        arr_jjg[blok] = [];
        arr_jjg[blok] = jjg;
      } else {
        arr_jjg[blok] = parseFloat(arr_jjg[blok]) + jjg
      }
      if (!arr_luas[blok]) {
        arr_luas[blok] = [];
        arr_luas[blok] = luas;
      } else {
        arr_luas[blok] = parseFloat(arr_luas[blok]) + luas
      }
      if (!arr_denda_panen[blok]) {
        arr_denda_panen[blok] = [];
        arr_denda_panen[blok] = denda_panen;
      } else {
        arr_denda_panen[blok] = parseFloat(arr_denda_panen[blok]) + denda_panen
      }
      total_jjg = total_jjg + jjg
      total_hk = total_hk + jum_hk
      total_premi = total_premi + premi
      total_rp_hk = total_rp_hk + rp_hk
      total_luas = total_luas + luas
      total_denda_panen = total_denda_panen + denda_panen
    });
    // console.log(arr_hk)
    this.estRekapitulasi = []
    let data = {}
    arr_blok.forEach(b => {
      if (arr_hk[b] > 0 || arr_premi[b] > 0 || arr_jjg[b] > 0 || arr_rp_hk[b] > 0 || arr_luas[b] > 0 || arr_denda_panen[b] > 0) {
        data = { blok: b, hk: arr_hk[b], premi: arr_premi[b], jjg: arr_jjg[b], rp_hk: arr_rp_hk[b], luas: arr_luas[b], denda_panen: arr_denda_panen[b] }
        this.estRekapitulasi.push(data)
      }

    });
    this.estRekapitulasi['total_rp_hk'] = total_rp_hk
    this.estRekapitulasi['total_jjg'] = total_jjg
    this.estRekapitulasi['total_premi'] = total_premi
    this.estRekapitulasi['total_hk'] = total_hk
    this.estRekapitulasi['total_luas'] = total_luas
    this.estRekapitulasi['total_denda_panen'] = total_denda_panen
    // console.log(this.estRekapitulasi)
    // for(const {make, model, year} of dt) {
    //   if(!result[make]) result[make] = [];
    //   result[make].push({ model, year });
    // }
  }
  remove_duplicate_array(arr) {
    var tmp = [];
    for (var i = 0; i < arr.length; i++) {
      if (tmp.indexOf(arr[i]) == -1) {
        tmp.push(arr[i]);
      }
    }
    return tmp;
  }
}
