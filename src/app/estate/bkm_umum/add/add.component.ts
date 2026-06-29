import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { EstBkmUmumService } from 'src/app/shared/services/est_bkm_umum.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { AccKegiatanService } from 'src/app/shared/services/acc_kegiatan.service';
import { TrkKendaraanService } from 'src/app/shared/services/trk_kendaraan.service';
import { EstDendaPanenService } from 'src/app/shared/services/est_denda_panen.service';
import { EstKodeDendaPanenService } from 'src/app/shared/services/est_kode_denda_panen.service';
import { resolve } from 'url';
import { HrmsKaryawanGajiService } from 'src/app/shared/services/hrms_karyawan_gaji.service';
import { HrmsJenisAbsensiService } from 'src/app/shared/services/hrms_jenis_absensi.service';

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
  estRekapitulasi=[];
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
    dataBlok: any[] = [];

  dataSelectKerani: any[];
  dataSelectKaryawan: any[];
  dataSelectGudang: any[];
  dataKegiatan: any[];
  dataSelectKegiatan: any[];
  dataSelectKodeDenda: any[];
  dataSelectKendaraan: any[];
  public dataSelectJenisAbsensi: any[] = [];
  public dataSelectJenisAbsensiHK: any[] = [];

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private estBkmUmumService: EstBkmUmumService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private KaryawanService: KaryawanService,
    private accKegiatanService: AccKegiatanService,
    private trkKendaraanService: TrkKendaraanService,
    private estKodeDendaPanenService: EstKodeDendaPanenService,
    private estDendaPanenService: EstDendaPanenService,
    private hrmsKaryawanGajiService: HrmsKaryawanGajiService,
    private HrmsJenisAbsensiService: HrmsJenisAbsensiService,
    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      no_transaksi: new FormControl('(AutoNumber)'),
      no_ref: new FormControl(''),
      keterangan: new FormControl(''),
      lokasi_id: new FormControl([], Validators.required),
      rayon_afdeling_id: new FormControl([], Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      details: this.builder.array([]),

    });

  }
  get userControl() { return this.entryForm.controls; }
  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };


  ngAfterViewInit(): void {
    this.addDetail();
  }
  public options: any;

  private loadSelect2(): void {

    this.accKegiatanService.getAllbyTipe('UMUM').subscribe(x => {
        this.dataKegiatan = x['data'];

      this.dataSelectKegiatan = [];
      x['data'].forEach(d => {
        this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama +' - '+ d.kode });
      });
    });

    this.HrmsJenisAbsensiService.getAll().subscribe(x => {
      this.dataSelectJenisAbsensi = [];
      x['data'].forEach(d => {
        this.dataSelectJenisAbsensiHK.push({ "id": d.id, "hk": d.jumlah_hk });
        this.dataSelectJenisAbsensi.push({ "id": d.id, "text": "(" + d.kode + ") " + d.keterangan });
      });
    });

    // this.entryForm.controls['jenis_absensi_id'].valueChanges.subscribe(x=>{
    //   this.dataSelectJenisAbsensiHK.forEach(d=>{
    //     if (d.id == x.id) {
    //       console.log(d);
    //       this.entryForm.get('jumlah_hk').patchValue(d.hk);
    //     }
    //   });
    // });
    


    this.GbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectEstate = [];
      x.forEach(d => {
        this.dataSelectEstate.push({ "id": d.id, "text": d.nama });
      });
      this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {
        console.log(x);
        let org_id = x.id;
        // this.GbmOrganisasiService.getAfdStByUnit(org_id).subscribe(x => {
         // this.GbmOrganisasiService.getAfdelingByEstate(org_id).subscribe(x => {
          this.GbmOrganisasiService.getAfdelingByEstateAndUser(org_id).subscribe(x => {
          this.dataSelectAfdeling = [];
          x.forEach(d => {
            this.dataSelectAfdeling.push({ "id": d.id, "text": d.nama });
          });
          this.entryForm.controls['rayon_afdeling_id'].valueChanges.subscribe(x => {
            let org_id = x.id;
            let tgl = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
            this.KaryawanService.getAllAktifByDivisi(org_id, tgl).subscribe(x => {
              this.dataSelectKaryawan = [];
              let kary = x['data'];
              kary.forEach(d => {
                this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" });
              });
            });
          });
        });

        this.GbmOrganisasiService.getBlokByEstate(org_id).subscribe(x => {
            this.dataBlok = x;
          this.dataSelectBlok = [];
          x.forEach(d => {
            this.dataSelectBlok.push({ "id": d.id, "text": d.kode + " - " + d.nama + " - " + d.nama_parent});
          });
        })

        this.trkKendaraanService.getKendaraanByLokasi(org_id).subscribe(x => {
          this.dataSelectKendaraan = [];
          x.forEach(d => {
            this.dataSelectKendaraan.push({ "id": d.id, "text": d.kode + " - " + d.nama });
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

  onSubmitClear() {
    this.isFormSubmitted = true;
    let frmData = this.entryForm.value;
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
    this.estBkmUmumService.create(frmData).subscribe(data => {
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

        this.entryForm.get('no_transaksi').patchValue('(AutoNumber)');
        this.entryForm.get('no_ref').patchValue('');
        this.entryForm.get('tanggal').patchValue(new Date(Date.parse(strDate)));
        // this.entryForm.get('lokasi_id').patchValue({});
        // this.entryForm.get('rayon_afdeling_id').patchValue({});
        // this.entryForm.get('details').patchValue([]);
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
    let frmData = this.entryForm.value;
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

    this.estBkmUmumService.create(frmData).subscribe(data => {
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



  addDetail() {

    this.details.push(this.builder.group({
      karyawan_id: new FormControl([], Validators.required),
      kegiatan_id: new FormControl([]),
      blok_id: new FormControl([]),
      kendaraan_id: new FormControl([]),
      jenis_absensi_id: new FormControl([], Validators.required),
      jumlah_hk: new FormControl(0, Validators.required),
      rupiah_hk: new FormControl(0, Validators.required),
      premi: new FormControl(0, Validators.required),
      ket: new FormControl(''),

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

    // this.valueChange();
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
    this.estRekapitulasi['total_rp_hk'] = 0
    this.estRekapitulasi['total_hasil_kerja'] = 0
    this.estRekapitulasi['total_premi'] = 0
    this.estRekapitulasi['total_hk'] = 0
    this.loadSelect2();
    // this.valueChange();

  }
  valueChange(event, blok) {
    blok.get('jumlah_hk').patchValue(0);
    blok.get('premi').patchValue(0);
    blok.get('rupiah_hk').patchValue(0);
  }


  hitungHkKaryawan(blok) {
    let karyawan_id = blok.get('karyawan_id').value['id']
        let tanggal = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');;

    this.hrmsKaryawanGajiService.getGajiPerhari(karyawan_id, tanggal).subscribe(res => {
      console.log(res)
      if (res['status'] == 'OK') {
        let gajiPerhari = res['data']['rp_hk']
        let jumlah_hk = parseFloat(blok.get('jumlah_hk').value)
        blok.get('rupiah_hk').patchValue(jumlah_hk * gajiPerhari);
      }
    });
  }

  gethk(detail) {
    let absensi_id = detail.get('jenis_absensi_id').value.id;
    this.dataSelectJenisAbsensiHK.forEach(d => {
      if (d.id == absensi_id) {
        detail.get('jumlah_hk').patchValue(d.hk);
      }
    });
    this.hitungHkKaryawan(detail);
  }
  hitungRekapitulasi() {
    let dtls = this.entryForm.get('details') as FormArray;
    let dt = dtls.getRawValue();
    // console.log(dt)
    const arr_hk = [];
    const arr_premi = [];
    const arr_hasil_kerja = [];
    const arr_rp_hk = [];
    const arr_blok = this.remove_duplicate_array(dt.map(d => { return d['jenis_absensi_id']['text'] }));
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
      let blok = d['jenis_absensi_id']['text']
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

  filterKegiatanUmumByBlok(detail) {

  if (!detail.get('blok_id').value) {
    return;
  }

  const blokId = detail.get('blok_id').value.id;

  const dataBlok = this.dataBlok.find(x => x.id == blokId);

  if (!dataBlok) {
    return;
  }

  this.accKegiatanService
    .getAllByStatusBlokTipe(
      'UMUM',
      dataBlok.statusblok
    )
    .subscribe(res => {

      this.dataSelectKegiatan = [];

      res['data'].forEach(d => {

        this.dataSelectKegiatan.push({
          id: d.id,
          text: d.nama + ' - ' + d.kode
        });

      });

    });

}

}
