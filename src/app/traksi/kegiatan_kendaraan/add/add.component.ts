import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { AccKegiatanService } from 'src/app/shared/services/acc_kegiatan.service';
import { TrkKendaraanService } from 'src/app/shared/services/trk_kendaraan.service';
import { TrkKegiatanKendaraanService } from 'src/app/shared/services/trk_kegiatan_kendaraan.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';

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


  dataSelectTraksi;
  dataSelectBlok;
  dataBlok: any[] = [];

  dataSelectMandor;
  dataSelectAsisten;
  dataSelectKegiatan;
  dataSelectEstate: any[];
  dataSelectKerani: any[];
  dataSelectKaryawan: any[];
  dataSelectGudang: any[];
  dataSelectStatusKendaraan: any[];
  dataSelectKendaraan: any[];
  lokasi_id: any;
  lokasi_tipe: any;
  dataKegiatan: any;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private trkKendaraanService: TrkKendaraanService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private KaryawanService: KaryawanService,
    private accKegiatanService: AccKegiatanService,
    private trkKegiatanKendaraanService: TrkKegiatanKendaraanService,
    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      no_transaksi: new FormControl('(AutoNumber)'),
      lokasi_id: new FormControl([], Validators.required),
      traksi_id: new FormControl([], Validators.required),
      mandor_id: new FormControl([]),
      is_asistensi: new FormControl(0),
      // kerani_id: new FormControl([], Validators.required),
      kendaraan_id: new FormControl([], Validators.required),
      status_kendaraan: new FormControl([], Validators.required),

      tanggal: new FormControl(toDate, Validators.required),

      details: this.builder.array([]),
      details_kegiatan: this.builder.array([]),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    // this.addDetail('mesin');
    this.addDetail();
    this.addKegiatan();
  }
  public options: any;

  private loadSelect2(): void {



    this.dataSelectStatusKendaraan = [
      { id: "BEROPERASI", text: "BEROPERASI" },
      { id: "TIDAK BEROPERASI", text: "TIDAK BEROPERASI" },
      { id: "BREAKDOWN", text: "BREAKDOWN" },
      { id: "STAND BY", text: "STAND BY" },
    ];

    this.GbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectEstate = [];
      x.forEach(d => {
        this.dataSelectEstate.push({ "id": d.id, "text": d.nama });
      });
      this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {
        this.lokasi_id = x.id;
        let org_id = x.id;
        this.GbmOrganisasiService.getById(org_id).subscribe(lok => {
          console.log(lok)
          this.lokasi_tipe = lok['data']['tipe'];
          if (lok['data']['tipe'] == 'MILL') {
            this.accKegiatanService.getAllbyTipe('TRAKSI_MILL').subscribe(x => {
              this.dataSelectKegiatan = [];
              x['data'].forEach(d => {
                this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama + " - " + d.kode });
              });
            });
            this.GbmOrganisasiService.getAllByType('MESIN').subscribe(x => {
              this.dataBlok = x;

              this.dataSelectBlok = [];
              x.forEach(d => {
                this.dataSelectBlok.push({ "id": d.id, "text": d.nama + "(" + d.kode + ")" + " - " + d.nama_parent });
              });

            });

          } else {
            this.GbmOrganisasiService.getBlokByEstate(org_id).subscribe(x => {
              this.dataBlok = x;

              this.dataSelectBlok = [];
              x.forEach(d => {
                this.dataSelectBlok.push({ "id": d.id, "text": d.nama + "(" + d.kode + ")" + " - " + d.nama_parent });
              });

            });
            this.accKegiatanService.getAllbyTipe('TRAKSI').subscribe(x => {
              this.dataKegiatan = x['data'];

              this.dataSelectKegiatan = [];
              x['data'].forEach(d => {
                this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama + " - " + d.kode });
              });
            });

          }

        })
        this.GbmOrganisasiService.getAllByType('TRAKSI').subscribe(x => {
          this.dataSelectTraksi = [];
          x.forEach(d => {
            if (d.parent_id == org_id) {
              this.dataSelectTraksi.push({ "id": d.id, "text": d.nama });
            }
          });
          this.entryForm.controls['traksi_id'].valueChanges.subscribe(x => {
            let traksi_id = x.id;
            this.trkKendaraanService.getAll().subscribe(x => {
              this.dataSelectKendaraan = [];
              x['data'].forEach(d => {
                if (d.traksi_id == traksi_id) {
                  this.dataSelectKendaraan.push({ "id": d.id, "text": d.kode + " - " + d.nama });
                }
              });
            })
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
              this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama + " - " + d.nip + " - " + d.sub_bagian_nama });
              this.dataSelectMandor.push({ "id": d.id, "text": d.nama + " - " + d.nip + " - " + d.sub_bagian_nama });
            }
          });
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
    this.trkKegiatanKendaraanService.create(frmData).subscribe(data => {
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
        this.entryForm.get('tanggal').patchValue(new Date(Date.parse(strDate)));
        this.entryForm.get('lokasi_id').patchValue({});
        this.entryForm.get('status_kendaraan').patchValue({});
        this.entryForm.get('traksi_id').patchValue({});
        this.entryForm.get('kendaraan_id').patchValue({});
        this.entryForm.get('mandor_id').patchValue({});
        this.entryForm.get('is_asistensi').patchValue(0);
        // this.entryForm.get('details').patchValue([]);
        // this.entryForm.get('details_kegiatan').patchValue([]);
        let dt = this.entryForm.get('details') as FormArray;
        let data_val = dt.value;
        for (let i of data_val) {
          dt.removeAt(i);
        }

        let dtk = this.entryForm.get('details_kegiatan') as FormArray;
        let data_val2 = dtk.value;
        for (let i of data_val2) {
          dtk.removeAt(i);
        }

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


    let frmData = this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');


    console.log(frmData);
    this.trkKegiatanKendaraanService.create(frmData).subscribe(data => {
      if (data['status'] == 'OK') {
        console.log('ok');
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
      denda_traksi: new FormControl(0),
      ket_denda: new FormControl(''),
    }));

    // this.valueChange();
  }
  addKegiatan() {

    this.details_kegiatan.push(this.builder.group({
      km_hm_mulai: new FormControl(0, Validators.required),
      km_hm_akhir: new FormControl(0, Validators.required),
      km_hm_jumlah: new FormControl(0, Validators.required),
      blok_id: new FormControl([]),
      kegiatan_id: new FormControl([], Validators.required),
      // hasil_kketerja: new FormControl(''),
      volume: new FormControl(1, Validators.required),
      ket: new FormControl(''),
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



  getSelisihKm(form) {
    let awal = form.get("km_hm_mulai").value;
    let akhir = form.get("km_hm_akhir").value;
    if (awal > akhir) {
      form.get('km_hm_jumlah').patchValue((awal - akhir).toFixed(1));
    } else {
      form.get('km_hm_jumlah').patchValue((akhir - awal).toFixed(1));
    }
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
  asistensiChange(event) {
    console.log(event);
    let org_id = this.entryForm.get('lokasi_id').value['id'];
    this.GbmOrganisasiService.getById(org_id).subscribe(lok => {

      this.GbmOrganisasiService.getById(org_id).subscribe(lok => {
        console.log(lok)
        this.lokasi_tipe = lok['data']['tipe'];
        if (event.target.checked) {

          this.GbmOrganisasiService.getAllByType('BLOK_MESIN').subscribe(x => {
            this.dataSelectBlok = [];
            x.forEach(d => {
              this.dataSelectBlok.push({ "id": d.id, "text": d.nama + "(" + d.kode + ")" + " - " + d.nama_parent });
            });
          })

          this.KaryawanService.getAllAktif().subscribe(x => {
            this.dataSelectKaryawan = [];
            this.dataSelectMandor = [];
            this.dataSelectAsisten = [];
            this.dataSelectKerani = [];
            let kary = x['data'];
            kary.forEach(d => {

              this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama + " - " + d.nip + " - " + d.sub_bagian_nama });
              this.dataSelectMandor.push({ "id": d.id, "text": d.nama + " - " + d.nip + " - " + d.sub_bagian_nama });

            });
          });

        } else {
          if (this.lokasi_tipe == 'MILL') {
            this.GbmOrganisasiService.getAllByType("MESIN").subscribe(x => {
              this.dataBlok = x;

              this.dataSelectBlok = [];
              x.forEach(d => {
                this.dataSelectBlok.push({ "id": d.id, "text": d.nama + "(" + d.kode + ")" + " - " + d.nama_parent });
              });
            })
          } else {
            this.GbmOrganisasiService.getBlokByEstate(org_id).subscribe(x => {
              this.dataSelectBlok = [];
              x.forEach(d => {
                this.dataSelectBlok.push({ "id": d.id, "text": d.nama + "(" + d.kode + ")" + " - " + d.nama_parent });
              });
            })
          }
          this.KaryawanService.getByLokasiTugas(org_id).subscribe(x => {
            this.dataSelectKaryawan = [];
            this.dataSelectMandor = [];
            this.dataSelectAsisten = [];
            this.dataSelectKerani = [];
            let kary = x['data'];
            kary.forEach(d => {
              if (d.lokasi_tugas_id == org_id) {
                this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama + " - " + d.nip + " - " + d.sub_bagian_nama });
                this.dataSelectMandor.push({ "id": d.id, "text": d.nama + " - " + d.nip + " - " + d.sub_bagian_nama });
              }
            });
          });

        }


      })
    })

  }
  hitungPremi(blok) {

    let data = blok.value
    data['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    console.log(data);
    this.trkKegiatanKendaraanService.hitungPremi(data).subscribe(res => {
      console.log(res)

      if (res['status'] == 'OK') {
        let hasil = res['data']
        let volume = parseFloat(blok.get('jumlah_hk').value)
        let rp_hk = parseFloat(hasil['rp_hk'])
        blok.get('rupiah_hk').patchValue(volume * rp_hk);


      }
    });

  }

  filterKegiatanByBlok(detail) {

    const blokValue = detail.get('blok_id').value;

    if (!blokValue) {
      return;
    }

    const dataBlok = this.dataBlok.find(
      x => x.id == blokValue.id
    );

    if (!dataBlok) {
      return;
    }

    let tipe = 'TRAKSI';

    if (this.lokasi_tipe == 'MILL') {
      tipe = 'TRAKSI_MILL';
    }

    console.log('STATUS BLOK', dataBlok.statusblok);

    this.accKegiatanService
      .getAllByStatusBlokTipe(
        tipe,
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
