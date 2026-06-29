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
import { TrkKegiatanKendaraan, TrkKegiatanKendaraanDetail, TrkKegiatanKendaraanLog } from 'src/app/shared/models/trk_kegiatan_kendaraan.model';


declare var $: any;
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'copy-cmp',
  templateUrl: 'copy.component.html',
  styleUrls: ['copy.component.css'],
})

export class CopyComponent implements OnInit, AfterViewInit {
  editor_modules: any;
  isFormSubmitted = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  awalanHeading = "heading_";
  awalanCollapse = "collapse_";

  entryForm: FormGroup;

  event: EventEmitter<any> = new EventEmitter();

  trkKegiatanKendaraan: TrkKegiatanKendaraan;
  dataSelectAfdeling;
  dataSelectBlok;

  dataSelectMandor;
  dataSelectAsisten;
  dataSelectKegiatan;
  dataSelectEstate: any[];
  dataSelectKerani: any[];
  dataSelectKaryawan: any[];
  dataSelectGudang: any[];
  dataSelectTraksi: any;
  dataSelectKendaraan: any[];
  dataSelectStatusKendaraan: any[];
  lokasi_tipe: any;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private trkKendaraanService: TrkKendaraanService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private KaryawanService: KaryawanService,
    private accKegiatanService: AccKegiatanService,
    private trkKegiatanKendaraanService: TrkKegiatanKendaraanService,
    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();
    let time: Date = new Date();

    this.entryForm = this.builder.group({
      no_transaksi: new FormControl('AutoNumber'),
      lokasi_id: new FormControl([], Validators.required),
      traksi_id: new FormControl([], Validators.required),
      mandor_id: new FormControl([]),
      is_asistensi: new FormControl(0),
      kendaraan_id: new FormControl([], Validators.required),
      status_kendaraan: new FormControl([], Validators.required),

      tanggal: new FormControl(toDate, Validators.required),

      details: this.builder.array([]),
      details_kegiatan: this.builder.array([]),
    });
  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    let date: Date = new Date();
    let strDate = formatDate(date, "yyyy-MM-dd", "en_US");

    this.entryForm.get('is_asistensi').patchValue(this.trkKegiatanKendaraan.is_asistensi == true ? 1 : 0);
    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.trkKegiatanKendaraan.tanggal)));

  }
  public options: any;

  private loadSelect2(): void {
    let selectedEstate;
    this.gbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectEstate = [];
      x.forEach(d => {
        this.dataSelectEstate.push({ "id": d.id, "text": d.nama });
        if (this.trkKegiatanKendaraan.lokasi_id == d.id) {
          selectedEstate = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectedEstate);
      this.gbmOrganisasiService.getById(this.trkKegiatanKendaraan.lokasi_id).subscribe(lok => {
        console.log(lok)
        if (lok['data']['tipe'] == 'MILL') {
          this.accKegiatanService.getAllbyTipe('TRAKSI_MILL').subscribe(x => {
            this.dataSelectKegiatan = [];
            x['data'].forEach(d => {
              this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama + " - " + d.kode });
            });

            if (this.trkKegiatanKendaraan.is_asistensi == true) {
              this.gbmOrganisasiService.getAllByType('BLOK_MESIN').subscribe(x => {
                this.dataSelectBlok = [];
                x.forEach(d => {
                  this.dataSelectBlok.push({ "id": d.id, "text": d.nama + "(" + d.kode + ")" + " - " + d.nama_parent });
                });
                let dtl: TrkKegiatanKendaraanLog[];
                dtl = this.trkKegiatanKendaraan.detail_log;
                for (let index = 0; index < dtl.length; index++) {
                  const d = dtl[index];
                  this.addKegiatan(d.blok_id, d.acc_kegiatan_id, d.km_hm_mulai, d.km_hm_akhir, d.km_hm_jumlah, d.volume, d.ket);
                }
              });

            } else {
              this.gbmOrganisasiService.getAllByType('MESIN').subscribe(x => {
                this.dataSelectBlok = [];
                x.forEach(d => {
                  this.dataSelectBlok.push({ "id": d.id, "text": d.nama + "(" + d.kode + ")" + " - " + d.nama_parent });
                });
                let dtl: TrkKegiatanKendaraanLog[];
                dtl = this.trkKegiatanKendaraan.detail_log;
                for (let index = 0; index < dtl.length; index++) {
                  const d = dtl[index];
                  this.addKegiatan(d.blok_id, d.acc_kegiatan_id, d.km_hm_mulai, d.km_hm_akhir, d.km_hm_jumlah, d.volume, d.ket);
                }
              });

            }

          });

        } else {
          this.accKegiatanService.getAllbyTipe('TRAKSI').subscribe(x => {
            this.dataSelectKegiatan = [];
            x['data'].forEach(d => {
              this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama + " - " + d.kode });
            });
            if (this.trkKegiatanKendaraan.is_asistensi == true) {
              this.gbmOrganisasiService.getAllByType('BLOK_MESIN').subscribe(x => {
                this.dataSelectBlok = [];
                x.forEach(d => {
                  this.dataSelectBlok.push({ "id": d.id, "text": d.nama + "(" + d.kode + ")" + " - " + d.nama_parent });
                });
                let dtl: TrkKegiatanKendaraanLog[];
                dtl = this.trkKegiatanKendaraan.detail_log;
                for (let index = 0; index < dtl.length; index++) {
                  const d = dtl[index];
                  this.addKegiatan(d.blok_id, d.acc_kegiatan_id, d.km_hm_mulai, d.km_hm_akhir, d.km_hm_jumlah, d.volume, d.ket);
                }
              });

            } else {
              this.gbmOrganisasiService.getBlokByEstate(this.trkKegiatanKendaraan.lokasi_id).subscribe(x => {
                this.dataSelectBlok = [];
                x.forEach(d => {
                  this.dataSelectBlok.push({ "id": d.id, "text": d.nama + "(" + d.kode + ")" + " - " + d.nama_parent });
                });
                let dtl: TrkKegiatanKendaraanLog[];
                dtl = this.trkKegiatanKendaraan.detail_log;
                for (let index = 0; index < dtl.length; index++) {
                  const d = dtl[index];
                  this.addKegiatan(d.blok_id, d.acc_kegiatan_id, d.km_hm_mulai, d.km_hm_akhir, d.km_hm_jumlah, d.volume, d.ket);
                }
              });
            }
          });
        }
      })
    });

    this.dataSelectStatusKendaraan = [
      { id: "BEROPERASI", text: "BEROPERASI" },
      { id: "TIDAK BEROPERASI", text: "TIDAK BEROPERASI" },
      { id: "BREAKDOWN", text: "BREAKDOWN" },
      { id: "STAND BY", text: "STAND BY" },
    ];
    this.dataSelectStatusKendaraan.forEach(x => {
      if (x.id == this.trkKegiatanKendaraan.status_kendaraan) {
        this.entryForm.get('status_kendaraan').patchValue(x);
      }
    });

    this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {
      let org_id = x.id;
      let selectedTraksi;
      this.gbmOrganisasiService.getAllByType('TRAKSI').subscribe(x => {
        this.dataSelectTraksi = [];
        x.forEach(d => {
          if (d.parent_id == org_id) {
            this.dataSelectTraksi.push({ "id": d.id, "text": d.nama });
            if (this.trkKegiatanKendaraan.traksi_id == d.id) {
              selectedTraksi = { "id": d.id, "text": d.nama }
            }
          }
        });
        this.entryForm.get('traksi_id').patchValue(selectedTraksi);
      });

    });

    this.entryForm.controls['traksi_id'].valueChanges.subscribe(x => {
      let traksi_id = x.id;
      let selectedKendaraan;
      this.trkKendaraanService.getAll().subscribe(x => {
        this.dataSelectKendaraan = [];
        x['data'].forEach(d => {
          if (d.traksi_id == traksi_id) {
            this.dataSelectKendaraan.push({ "id": d.id, "text": d.kode + " - " + d.nama });
            if (this.trkKegiatanKendaraan.kendaraan_id == d.id) {
              selectedKendaraan = { "id": d.id, "text": d.kode + " - " + d.nama }
            }
          }
        });
        this.entryForm.get('kendaraan_id').patchValue(selectedKendaraan);
      });
    });
    if (this.trkKegiatanKendaraan.is_asistensi == true) {
      this.KaryawanService.getAllAktif().subscribe(x => {
        this.dataSelectMandor = [];
        this.dataSelectAsisten = [];
        this.dataSelectKerani = [];
        let kary = x['data'];
        let selectedMandor: any = [];
        kary.forEach(d => {
            this.dataSelectMandor.push({ "id": d.id, "text": d.nama + " - " + d.nip + " - " + d.sub_bagian_nama });
            if (this.trkKegiatanKendaraan.mandor_id == d.id) {
              selectedMandor = { "id": d.id, "text": d.nama + " - " + d.nip + " - " + d.sub_bagian_nama }
            }
          this.entryForm.get('mandor_id').patchValue(selectedMandor);
        });

      });

      this.KaryawanService.getAllAktif().subscribe(t => {
        this.dataSelectKaryawan = [];
        let i = t['data'];
        i.forEach(d => {
          this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama + " - " + d.nip + " - " + d.sub_bagian_nama });
        });
        let dtl: TrkKegiatanKendaraanDetail[];
        dtl = this.trkKegiatanKendaraan.detail;
        for (let index = 0; index < dtl.length; index++) {
          const d = dtl[index];
          this.addDetail(d.karyawan_id, d.jumlah_hk, d.rupiah_hk, d.premi, d.denda_traksi, d.ket_denda) ;
        }

      });


    } else {
      this.KaryawanService.getByLokasiTugas(this.trkKegiatanKendaraan.lokasi_id).subscribe(x => {
        this.dataSelectMandor = [];
        this.dataSelectAsisten = [];
        this.dataSelectKerani = [];
        let kary = x['data'];
        let selectedMandor: any = [];
        kary.forEach(d => {
          if (d.lokasi_tugas_id == this.trkKegiatanKendaraan.lokasi_id) {
            this.dataSelectMandor.push({ "id": d.id, "text": d.nama + " - " + d.nip + " - " + d.sub_bagian_nama });
            if (this.trkKegiatanKendaraan.mandor_id == d.id) {
              selectedMandor = { "id": d.id, "text": d.nama + " - " + d.nip + " - " + d.sub_bagian_nama }
            }
          }
          this.entryForm.get('mandor_id').patchValue(selectedMandor);
        });

      });

      this.KaryawanService.getByLokasiTugas(this.trkKegiatanKendaraan.lokasi_id).subscribe(t => {
        this.dataSelectKaryawan = [];
        let i = t['data'];
        i.forEach(d => {
          this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama + " - " + d.nip + " - " + d.sub_bagian_nama });
        });
        let dtl: TrkKegiatanKendaraanDetail[];
        dtl = this.trkKegiatanKendaraan.detail;
        for (let index = 0; index < dtl.length; index++) {
          const d = dtl[index];
          this.addDetail(d.karyawan_id, d.jumlah_hk, d.rupiah_hk, d.premi, d.denda_traksi, d.ket_denda);
        }

      });

    }


  }
  onSubmit() {
    // // console.log(this.entryForm.value);

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
          text: 'Data berhasil disimpan dengan Nomor:'+data['data'],
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


  addDetail(karyawan_id, jumlah_hk, rupiah_hk, premi , denda_traksi, ket_denda) {

    let selectedKaryawan = [];
    this.dataSelectKaryawan.forEach(a => {
      if (karyawan_id == a.id) {
        selectedKaryawan = a;
      }
    });


    let fb = this.builder.group({
      karyawan_id: new FormControl(selectedKaryawan, Validators.required),
      jumlah_hk: new FormControl(jumlah_hk, Validators.required),
      rupiah_hk: new FormControl(rupiah_hk, Validators.required),
      premi: new FormControl(premi, Validators.required),
      denda_traksi: new FormControl(denda_traksi),
      ket_denda: new FormControl(ket_denda),
    });

    this.details.push(fb);

    // this.valueChange();
  }
  addKegiatan(blok_id, Kegiatan_id, km_hm_mulai, km_hm_akhir, km_hm_jumlah, volume,ket) {


    let selectedKegiatan = [];
    this.dataSelectKegiatan.forEach(a => {
      if (Kegiatan_id == a.id) {
        selectedKegiatan = a;
      }
    });

    let selectedBlok = [];
    this.dataSelectBlok.forEach(a => {
      if (blok_id == a.id) {
        selectedBlok = a;
      }
    });


    let fb = this.builder.group({
      blok_id: new FormControl(selectedBlok),
      kegiatan_id: new FormControl(selectedKegiatan, Validators.required),
      km_hm_mulai: new FormControl(km_hm_mulai, Validators.required),
      km_hm_akhir: new FormControl(km_hm_akhir, Validators.required),
      km_hm_jumlah: new FormControl(km_hm_jumlah, Validators.required),
      volume: new FormControl(volume, Validators.required),
      ket: new FormControl(ket),
    });

    this.details_kegiatan.push(fb);

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
      let kegiatans = this.entryForm.get('details_kegiatan') as FormArray;
      kegiatans.removeAt(i);
      let data = { details_kegiatan: kegiatans.value };
      this.updateForm(data);
    }

    // this.valueChange();
  }




  updateForm(data) {
    // const Kegiatans = data.details;
    // // console.log(Kegiatans);
    // let sub = 0;
    // for(let i of Kegiatans){
    //   sub=sub+ parseFloat( i.qty);

    // }
    // // console.log(sub);
  }
  recalculate() {
    // let Kegiatans = this.entryForm.get('details') as FormArray;
    // let data = { details: Kegiatans.value };
    // this.updateForm(data);
  }
  onClose() {
    this.bsModalRef.hide();
  }

  getSelisihKm( form ) {
    let awal = form.get("km_hm_mulai").value;
    let akhir = form.get("km_hm_akhir").value;
    if (awal > akhir) {
      form.get('km_hm_jumlah').patchValue( (awal - akhir).toFixed(1) );
    }else {
      form.get('km_hm_jumlah').patchValue( (akhir - awal).toFixed(1) );
    }
  }

  ngOnInit() {
    this.loadSelect2();
    // this.valueChange();
  }
  asistensiChange(event) {
    console.log(event);
    let org_id = this.entryForm.get('lokasi_id').value['id'];
    this.gbmOrganisasiService.getById(org_id).subscribe(lok => {

      this.gbmOrganisasiService.getById(org_id).subscribe(lok => {
        console.log(lok)
        this.lokasi_tipe = lok['data']['tipe'];
        if (event.target.checked) {

          this.gbmOrganisasiService.getAllByType('BLOK_MESIN').subscribe(x => {
            this.dataSelectBlok = [];
            x.forEach(d => {
              this.dataSelectBlok.push({ "id": d.id, "text": d.nama + "("+ d.kode +")"+" - "+ d.nama_parent });
            });
          })

          this.KaryawanService.getAllAktif().subscribe(x => {
            this.dataSelectKaryawan = [];
            this.dataSelectMandor = [];
            this.dataSelectAsisten = [];
            this.dataSelectKerani = [];
            let kary = x['data'];
            kary.forEach(d => {

                 this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama+" - "+d.nip+" - "+d.sub_bagian_nama });
                 this.dataSelectMandor.push({ "id": d.id, "text": d.nama+" - "+d.nip+" - "+d.sub_bagian_nama });

            });
          });

        } else {
        if  (this.lokasi_tipe=='MILL'){
          this.gbmOrganisasiService.getAllByType("MESIN").subscribe(x => {
            this.dataSelectBlok = [];
            x.forEach(d => {
              this.dataSelectBlok.push({ "id": d.id, "text": d.nama + "("+ d.kode +")"+" - "+ d.nama_parent });
            });
          })
        }else{
          this.gbmOrganisasiService.getBlokByEstate(org_id).subscribe(x => {
            this.dataSelectBlok = [];
            x.forEach(d => {
              this.dataSelectBlok.push({ "id": d.id, "text": d.nama + "("+ d.kode +")"+" - "+ d.nama_parent });
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
                 this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama+" - "+d.nip+" - "+d.sub_bagian_nama });
                 this.dataSelectMandor.push({ "id": d.id, "text": d.nama+" - "+d.nip+" - "+d.sub_bagian_nama });
               }
            });
          });

        }


      })
    })

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
    this.trkKegiatanKendaraanService.hitungPremi(data).subscribe(res => {
      console.log(res)

      if (res['status'] == 'OK') {
        let hasil = res['data']
        let qty = parseFloat(blok.get('jumlah_hk').value)
        let rp_hk = parseFloat(hasil['rp_hk'])
        blok.get('rupiah_hk').patchValue(qty * rp_hk);


      }
    });

  }

}
