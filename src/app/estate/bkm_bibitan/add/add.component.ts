import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { EstBkmPemeliharaanService } from 'src/app/shared/services/est_bkm_pemeliharaan.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { AccKegiatanService } from 'src/app/shared/services/acc_kegiatan.service';
import { HrmsKaryawanGajiService } from 'src/app/shared/services/hrms_karyawan_gaji.service';
import { from } from 'rxjs';
import { EstBkmBibitService } from 'src/app/shared/services/est_bkm_bibit.service';

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


  dataSelectAfdeling;
  dataSelectBlok;

  dataSelectMandor;
  dataSelectAsisten;
  dataSelectItem;
  dataSelectEstate: any[];
  dataSelectKerani: any[];
  dataSelectKaryawan: any[];
  dataSelectGudang: any[];
  dataSelectKegiatan: any[];
  dataKegiatan;
  estRekapitulasi = [];
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private estBkmPemeliharaanService: EstBkmBibitService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private KaryawanService: KaryawanService,
    private accKegiatanService: AccKegiatanService,
    private InvItemService: InvItemService,
    private hrmsKaryawanGajiService: HrmsKaryawanGajiService,

    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      no_transaksi: new FormControl('(AutoNumber)'),
      lokasi_id: new FormControl([], Validators.required),
      afdeling_id: new FormControl([], Validators.required),
      mandor_id: new FormControl([]),
      kerani_id: new FormControl([]),
      asisten_id: new FormControl([]),

      tanggal: new FormControl(toDate, Validators.required),

      mandor_hasil_kerja: new FormControl(0),
      mandor_jumlah_hk: new FormControl(0),
      mandor_rupiah_hk: new FormControl(0),
      mandor_premi: new FormControl(0),
      mandor_denda: new FormControl(0),
      ket_mandor: new FormControl(''),
      ket_kerani: new FormControl(''),

      kerani_hasil_kerja: new FormControl(0),
      kerani_jumlah_hk: new FormControl(0),
      kerani_rupiah_hk: new FormControl(0),
      kerani_premi: new FormControl(0),
      kerani_denda: new FormControl(0),

      is_premi_kontanan: new FormControl(0),
      is_asistensi: new FormControl(0),
      is_asistensi_unit: new FormControl(0),

      details: this.builder.array([]),
      details_item: this.builder.array([]),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    // this.addDetail('mesin');
    this.addDetail();
  }
  public options: any;

  private loadSelect2(): void {

    this.accKegiatanService.getAllbyTipe('PEMELIHARAAN').subscribe(x => {
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
        // this.KaryawanService.getByLokasiTugas(org_id).subscribe(k => {     
        //   this.dataSelectAsisten = [];     
        //   let kary = k['data'];
        //   kary.forEach(d => {
        //     this.dataSelectAsisten.push({ "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" });
        //   });
        // });
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
              // console.log(x)
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


    this.InvItemService.getAllBahanBkm().subscribe(x => {
      this.dataSelectItem = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectItem.push({ "id": d.id, "text": d.kode + " - " + d.nama + "(" + d.uom + ")" });
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
    let frmData = this.entryForm.getRawValue();// this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    this.estBkmPemeliharaanService.create(frmData).subscribe(data => {
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

        // this.entryForm.get('lokasi_id').patchValue({});
        // this.entryForm.get('afdeling_id').patchValue({});
        this.entryForm.get('mandor_id').patchValue({});
        this.entryForm.get('asisten_id').patchValue({});
        this.entryForm.get('kerani_id').patchValue({});
        this.entryForm.get('no_transaksi').patchValue('(AutoNumber)');
        this.entryForm.get('tanggal').patchValue(new Date(Date.parse(strDate)));
        this.entryForm.get('mandor_hasil_kerja').patchValue(0);
        this.entryForm.get('mandor_jumlah_hk').patchValue(0);
        this.entryForm.get('mandor_rupiah_hk').patchValue(0);
        this.entryForm.get('mandor_premi').patchValue(0);
        this.entryForm.get('mandor_denda').patchValue(0);
        this.entryForm.get('ket_mandor').patchValue('');
        this.entryForm.get('ket_kerani').patchValue('');
        this.entryForm.get('kerani_hasil_kerja').patchValue(0);
        this.entryForm.get('kerani_jumlah_hk').patchValue(0);
        this.entryForm.get('kerani_rupiah_hk').patchValue(0);
        this.entryForm.get('kerani_premi').patchValue(0);
        this.entryForm.get('kerani_denda').patchValue(0);
        this.entryForm.get('is_premi_kontanan').patchValue(0);
        this.entryForm.get('is_asistensi').patchValue(0);
        // this.entryForm.get('details').patchValue([]);
        // this.entryForm.get('details_item').patchValue([]);
        let dt = this.entryForm.get('details') as FormArray;
        let data_val = dt.value;
        // console.log(data_val);
        for (let i of data_val) {
          // console.log(i)
          dt.removeAt(i);

        }
        let dt_item = this.entryForm.get('details_item') as FormArray;
        let data_item_val = dt_item.value;
        for (let i of data_item_val) {
          dt_item.removeAt(i);

        }
        this.event.emit('OK');
        return;
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


    let frmData = this.entryForm.getRawValue();// this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    this.estBkmPemeliharaanService.create(frmData).subscribe(data => {
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
  // get details_item(): FormArray {
  //   return this.entryForm.get('details_item') as FormArray;
  // };


  addDetail() {

    this.details.push(this.builder.group({
      karyawan_id: new FormControl([], Validators.required),
      blok_id: new FormControl([]),
      kegiatan_id: new FormControl([], Validators.required),
      hasil_kerja: new FormControl(0, Validators.required),
      jumlah_hk: new FormControl(0, Validators.required),
      rupiah_hk: new FormControl(0, Validators.required),
      premi: new FormControl(0, Validators.required),
      keterangan: new FormControl('',),
      denda_pemeliharaan: new FormControl(0, Validators.required),
    }));

    // this.valueChange();
  }
  addItem() {

    this.details_item.push(this.builder.group({
      gudang_id: new FormControl([]),
      blok_id: new FormControl([], Validators.required),
      kegiatan_id: new FormControl([], Validators.required),
      item_id: new FormControl([], Validators.required),
      qty: new FormControl(1, Validators.required),
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
  removeItem(item) {
    let i = this.details_item.controls.indexOf(item);
    if (i != -1) {
      //  let x=	this.details.controls.splice(i, 1);
      let items = this.entryForm.get('details_item') as FormArray;
      items.removeAt(i);
      let data = { details_item: items.value };
      this.updateForm(data);
    }

    // this.valueChange();
  }
  kegiatanDtlChange(blok) {
    let kegiatan_id = blok.get('kegiatan_id').value['id'];
    /// ==== start Sesuai permintaan user di fungsi ini dinonaktifknan
    blok.get('jumlah_hk').enable({ onlySelf: true });
    blok.get('rupiah_hk').disable({ onlySelf: false });
    blok.get('premi').enable({ onlySelf: true });
    return;
    ///end  ============

    blok.get('jumlah_hk').patchValue(0);
    blok.get('premi').patchValue(0);
    blok.get('rupiah_hk').patchValue(0);
    this.accKegiatanService.getById(kegiatan_id).subscribe(x => {
      // console.log(x)
      if (x['data']['is_premi_otomatis'] == '1') {
        blok.get('jumlah_hk').disable({ onlySelf: true });
        blok.get('rupiah_hk').disable({ onlySelf: true });
        blok.get('premi').disable({ onlySelf: true });

      } else {
        blok.get('jumlah_hk').enable({ onlySelf: true });
        blok.get('rupiah_hk').disable({ onlySelf: false });
        blok.get('premi').enable({ onlySelf: true });

      }

    });

  }
  // removeBlokItem( blok ) {
  //   let i = this.details_item.controls.indexOf(blok);
  //   if(i != -1) {
  //     let detail = this.entryForm.get('details_item') as FormArray;
  //     detail.removeAt(i);
  //     let data = {details_item: detail.value};
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
    this.estRekapitulasi['total_rp_hk'] = 0
    this.estRekapitulasi['total_hasil_kerja'] = 0
    this.estRekapitulasi['total_premi'] = 0
    this.estRekapitulasi['total_hk'] = 0
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
        // console.log(x)
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
        // console.log(x)
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
    this.hrmsKaryawanGajiService.getGajiPerhari(karyawan_id, tanggal).subscribe(res => {
      // console.log(res)
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

    this.hrmsKaryawanGajiService.getGajiPerhari(karyawan_id,tanggal).subscribe(res => {
      // console.log(res)
      if (res['status'] == 'OK') {
        let gajiPerhari = res['data']['rp_hk']
        let jum_hk = this.entryForm.controls['mandor_jumlah_hk'].value
        let rupiah = gajiPerhari * jum_hk
        this.entryForm.controls['mandor_rupiah_hk'].patchValue(rupiah)
      }
    });
  }
  hitungHkKaryawan(blok) {
    let karyawan_id = blok.get('karyawan_id').value['id']
        let tanggal = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');

    this.hrmsKaryawanGajiService.getGajiPerhari(karyawan_id, tanggal).subscribe(res => {
      // console.log(res)
      if (res['status'] == 'OK') {
        let gajiPerhari = res['data']['rp_hk']
        let jumlah_hk = parseFloat(blok.get('jumlah_hk').value)
        blok.get('rupiah_hk').patchValue(jumlah_hk * gajiPerhari);
      }
    });
  }
  hitungPremi(blok) {

    let data = blok.value;
    /// ==== start Sesuai permintaan user di fungsi ini dinonaktifknan
    return;


    data['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    let send_data = {
      karyawan_id: blok.get('karyawan_id').value['id'],
      kegiatan_id: blok.get('kegiatan_id').value['id'],
      hasil_kerja: blok.get('hasil_kerja').value,
    }

    // console.log(send_data);
    this.estBkmPemeliharaanService.hitungPremi(send_data).subscribe(res => {
      // console.log(res)
      if (res['status'] == 'OK') {
        let hasil = res['data']
        let kegiatan = hasil['kegiatan'];
        if (kegiatan['is_premi_otomatis'] == '1') {
          blok.get('jumlah_hk').patchValue(hasil['hk']);
          blok.get('premi').patchValue(hasil['premi']);
          blok.get('rupiah_hk').patchValue(hasil['rp_hk']);
        }
      }
    });

  }

  hitungRekapitulasi() {
    let dtls = this.entryForm.get('details') as FormArray;
    let dt = dtls.getRawValue();
    // console.log(dt)
    const arr_hk = [];
    const arr_premi = [];
    const arr_hasil_kerja = [];
    const arr_rp_hk = [];
    const arr_blok = this.remove_duplicate_array(dt.map(d => { return d['blok_id']['text'] }));
    const arr_kegiatan = this.remove_duplicate_array(dt.map(d => { return d['kegiatan_id']['text'] }));
    //   console.log(arr_blok);
    // console.log(arr_kegiatan) ;
    let total_hk = 0;
    let total_premi = 0;
    let total_rp_hk = 0;
    let total_hasil_kerja = 0;
    dt.forEach(d => {
      let jum_hk = parseFloat(d['jumlah_hk']);
      let rp_hk = parseFloat(d['jumlah_hk']) * parseFloat(d['rupiah_hk']);
      let premi = parseFloat(d['premi']);
      let hasil_kerja = parseFloat(d['hasil_kerja']);
      let blok = d['blok_id']['text']
      let kegiatan = d['kegiatan_id']['text']
      if (!arr_hk[blok]) {
        arr_hk[blok] = [];
        if (!arr_hk[blok][kegiatan]) {
          arr_hk[blok][kegiatan] = jum_hk;
        } else {
          arr_hk[blok][kegiatan] = parseFloat(arr_hk[blok][kegiatan]) + jum_hk
        }
      } else {
        if (!arr_hk[blok][kegiatan]) {
          arr_hk[blok][kegiatan] = jum_hk;
        } else {

          arr_hk[blok][kegiatan] = parseFloat(arr_hk[blok][kegiatan]) + jum_hk
        }
      }
      if (!arr_rp_hk[blok]) {
        arr_rp_hk[blok] = [];
        if (!arr_rp_hk[blok][kegiatan]) {
          arr_rp_hk[blok][kegiatan] = rp_hk;
        } else {
          arr_rp_hk[blok][kegiatan] = parseFloat(arr_rp_hk[blok][kegiatan]) + rp_hk
        }
      } else {
        if (!arr_rp_hk[blok][kegiatan]) {
          arr_rp_hk[blok][kegiatan] = rp_hk;
        } else {

          arr_rp_hk[blok][kegiatan] = parseFloat(arr_rp_hk[blok][kegiatan]) + rp_hk
        }
      }
      if (!arr_premi[blok]) {
        arr_premi[blok] = [];
        if (!arr_premi[blok][kegiatan]) {
          arr_premi[blok][kegiatan] = premi;
        } else {
          arr_premi[blok][kegiatan] = parseFloat(arr_premi[blok][kegiatan]) + premi
        }
      } else {
        if (!arr_premi[blok][kegiatan]) {
          arr_premi[blok][kegiatan] = premi;
        } else {

          arr_premi[blok][kegiatan] = parseFloat(arr_premi[blok][kegiatan]) + premi
        }
      }
      if (!arr_hasil_kerja[blok]) {
        arr_hasil_kerja[blok] = [];
        if (!arr_hasil_kerja[blok][kegiatan]) {
          arr_hasil_kerja[blok][kegiatan] = hasil_kerja;
        } else {
          arr_hasil_kerja[blok][kegiatan] = parseFloat(arr_hasil_kerja[blok][kegiatan]) + hasil_kerja
        }
      } else {
        if (!arr_hasil_kerja[blok][kegiatan]) {
          arr_hasil_kerja[blok][kegiatan] = hasil_kerja;
        } else {
          arr_hasil_kerja[blok][kegiatan] = parseFloat(arr_hasil_kerja[blok][kegiatan]) + hasil_kerja
        }
      }
      total_hasil_kerja = total_hasil_kerja + hasil_kerja
      total_hk = total_hk + jum_hk
      total_premi = total_premi + premi
      total_rp_hk = total_rp_hk + rp_hk
    });
    // console.log(arr_hk)
    this.estRekapitulasi = []
    let data = {}
    arr_blok.forEach(b => {
      arr_kegiatan.forEach(k => {
        if (arr_hk[b][k] > 0 || arr_premi[b][k] > 0 || arr_hasil_kerja[b][k] > 0 || arr_rp_hk[b][k] > 0) {
          data = { blok: b, kegiatan: k, hk: arr_hk[b][k], premi: arr_premi[b][k], hasil_kerja: arr_hasil_kerja[b][k], rp_hk: arr_rp_hk[b][k] }
          this.estRekapitulasi.push(data)
        }
      });

    });
    this.estRekapitulasi['total_rp_hk'] = total_rp_hk
    this.estRekapitulasi['total_hasil_kerja'] = total_hasil_kerja
    this.estRekapitulasi['total_premi'] = total_premi
    this.estRekapitulasi['total_hk'] = total_hk
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
