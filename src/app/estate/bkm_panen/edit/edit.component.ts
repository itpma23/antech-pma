import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { EstBkmPanenService } from 'src/app/shared/services/est_bkm_panen.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { EstBkmPanen, EstBkmPanenDetail } from 'src/app/shared/models/est_bkm_panen.model';
import { EstKodeDendaPanenService } from 'src/app/shared/services/est_kode_denda_panen.service';
import { EstDendaPanenService } from 'src/app/shared/services/est_denda_panen.service';
import { HrmsKaryawanGajiService } from 'src/app/shared/services/hrms_karyawan_gaji.service';
import { AccKegiatanService } from 'src/app/shared/services/acc_kegiatan.service';

declare var $: any;
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'edit-cmp',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.css'],
})

export class EditComponent implements OnInit, AfterViewInit {
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

  bkmPanen: EstBkmPanen;
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
  dataSelectKodeDenda: any[];
  estRekapitulasi = [];


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private estBkmPanenService: EstBkmPanenService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private KaryawanService: KaryawanService,
    private accKegiatanService: AccKegiatanService,
    private estKodeDendaPanenService: EstKodeDendaPanenService,
    private estDendaPanenService: EstDendaPanenService,
    private hrmsKaryawanGajiService: HrmsKaryawanGajiService,

    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();
    let time: Date = new Date();

    this.entryForm = this.builder.group({
      no_transaksi: new FormControl(''),
      lokasi_id: new FormControl([], Validators.required),
      afdeling_id: new FormControl([], Validators.required),
      mandor_id: new FormControl([]),
      kerani_id: new FormControl([]),
      asisten_id: new FormControl([]),
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
      tanggal: new FormControl(toDate, Validators.required),
      details: this.builder.array([]),
    });
  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    let date: Date = new Date();
    let strDate = formatDate(date, "yyyy-MM-dd", "en_US");

    this.entryForm.get('no_transaksi').patchValue(this.bkmPanen.no_transaksi);
    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.bkmPanen.tanggal)));


  }
  public options: any;


  private loadSelect2(): void {
    console.log(this.bkmPanen)
    let selectedEstate;
    this.gbmOrganisasiService.getAllByType('ESTATE').subscribe(x => {
      this.dataSelectEstate = [];
      x.forEach(d => {
        this.dataSelectEstate.push({ "id": d.id, "text": d.nama });
        if (this.bkmPanen.lokasi_id == d.id) {
          selectedEstate = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectedEstate);
    });



    let selectedRayonAfdeling;
    this.gbmOrganisasiService.getAllByType('AFDELING').subscribe(x => {
      this.dataSelectAfdeling = [];
      x.forEach(d => {
        this.dataSelectAfdeling.push({ "id": d.id, "text": d.nama });
        if (this.bkmPanen.rayon_afdeling_id == d.id) {
          selectedRayonAfdeling = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('afdeling_id').patchValue(selectedRayonAfdeling);
      this.KaryawanService.getAllAktifEstate().subscribe(x => {
        // this.KaryawanService.getAllAktifByDivisi(this.bkmPanen.rayon_afdeling_id, this.bkmPanen.tanggal).subscribe(x => {
        this.dataSelectKaryawan = [];
        this.dataSelectMandor = [];
        this.dataSelectAsisten = [];
        this.dataSelectKerani = [];
        let kary = x['data'];
        let selectedMandor: any = [];
        let selectedKerani: any = [];
        let selectedAsisten: any = [];
        kary.forEach(d => {
          this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" });
          this.dataSelectMandor.push({ "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" });
          this.dataSelectAsisten.push({ "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" });
          this.dataSelectKerani.push({ "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" });
          if (this.bkmPanen.mandor_id == d.id) {
            selectedMandor = { "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" }
          }
          if (this.bkmPanen.kerani_id == d.id) {
            selectedKerani = { "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" }
          }
          if (this.bkmPanen.asisten_id == d.id) {
            selectedAsisten = { "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" }
          }
        });
        this.entryForm.get('mandor_id').patchValue(selectedMandor);
        this.entryForm.get('asisten_id').patchValue(selectedAsisten);
        this.entryForm.get('kerani_id').patchValue(selectedKerani);
        this.entryForm.get('mandor_hasil_kerja').patchValue(this.bkmPanen.hasil_kerja_mandor);
        this.entryForm.get('mandor_jumlah_hk').patchValue(this.bkmPanen.jumlah_hk_mandor);
        this.entryForm.get('mandor_rupiah_hk').patchValue(this.bkmPanen.rp_hk_mandor);
        this.entryForm.get('mandor_premi').patchValue(this.bkmPanen.premi_mandor);
        this.entryForm.get('mandor_denda').patchValue(this.bkmPanen.denda_mandor);

        this.entryForm.get('ket_mandor').patchValue(this.bkmPanen.ket_mandor);
        this.entryForm.get('ket_kerani').patchValue(this.bkmPanen.ket_kerani);

        this.entryForm.get('kerani_hasil_kerja').patchValue(this.bkmPanen.hasil_kerja_kerani);
        this.entryForm.get('kerani_jumlah_hk').patchValue(this.bkmPanen.jumlah_hk_kerani);
        this.entryForm.get('kerani_rupiah_hk').patchValue(this.bkmPanen.rp_hk_kerani);
        this.entryForm.get('kerani_premi').patchValue(this.bkmPanen.premi_kerani);
        this.entryForm.get('kerani_denda').patchValue(this.bkmPanen.denda_kerani);

        this.entryForm.get('is_premi_kontanan').patchValue(this.bkmPanen.is_premi_kontanan == true ? 1 : 0);
        this.entryForm.get('is_asistensi').patchValue(this.bkmPanen.is_asistensi == true ? 1 : 0);
        this.entryForm.get('is_asistensi_unit').patchValue(this.bkmPanen.is_asistensi_unit == true ? 1 : 0);
        if (this.bkmPanen.is_asistensi_unit == false) {
          this.KaryawanService.getAllAktifByDivisi(this.bkmPanen.rayon_afdeling_id, this.bkmPanen.tanggal).subscribe(x => {
            this.dataSelectKaryawan = [];
            this.dataSelectMandor = [];
            this.dataSelectAsisten = [];
            this.dataSelectKerani = [];
            let kary = x['data'];
            let selectedMandor: any = [];
            let selectedKerani: any = [];
            let selectedAsisten: any = [];
            kary.forEach(d => {
              this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" });
              this.dataSelectMandor.push({ "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" });
              this.dataSelectAsisten.push({ "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" });
              this.dataSelectKerani.push({ "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" });
              if (this.bkmPanen.mandor_id == d.id) {
                selectedMandor = { "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" }
              }
              if (this.bkmPanen.kerani_id == d.id) {
                selectedKerani = { "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" }
              }
              if (this.bkmPanen.asisten_id == d.id) {
                selectedAsisten = { "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" }
              }
            });
          });

        }

        this.accKegiatanService.getAllbyTipe('BKM_PANEN').subscribe(x => {
          this.dataSelectKegiatan = [];
          x['data'].forEach(d => {
            this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama + "-" + d.kode + " (" + d.uom + ")" });
          });
        })
        if (this.bkmPanen.is_asistensi == true) {
          console.log('here')
          this.gbmOrganisasiService.getBlokByEstate(this.bkmPanen.lokasi_id).subscribe(x => {
            this.dataSelectBlok = [];
            x.forEach(d => {
              this.dataSelectBlok.push({ "id": d.id, "text": d.kode + " - " + d.nama });
            });
            let tgl = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
            this.estKodeDendaPanenService.getAll().subscribe(x => {
              this.dataSelectKodeDenda = [];
              let i = x['data'];
              i.forEach(d => {
                this.dataSelectKodeDenda.push({ "id": d.id, "text": d.nama + "(" + d.kode + ")" });
              });
              let dtl: EstBkmPanenDetail[];
              dtl = this.bkmPanen.detail;
              // console.log(dtl);
              for (let index = 0; index < dtl.length; index++) {
                const d = dtl[index];
                this.addDetailEdit(d.blok_id, d.karyawan_id, d.hasil_kerja_jjg, d.hasil_kerja_brondolan, d.hasil_kerja_luas,
                  d.hasil_kerja_kg, d.premi_brondolan, d.rp_hk, d.premi_basis, d.premi_lebih_basis,
                  d.premi_panen, d.denda_panen, d.denda_basis, d.basis_jjg, d.total_pendapatan, d.bjr, d.jumlah_hk, d.ket, d.potongan, d.keterangan_potongan, d.denda, d.acc_kegiatan_id);
              }
            });

          });

        } else {
          this.gbmOrganisasiService.getBlokByAfdeling(this.bkmPanen.rayon_afdeling_id).subscribe(x => {
            this.dataSelectBlok = [];
            x.forEach(d => {
              this.dataSelectBlok.push({ "id": d.id, "text": d.kode + " - " + d.nama });
            });
            this.estKodeDendaPanenService.getAll().subscribe(x => {
              this.dataSelectKodeDenda = [];
              let i = x['data'];
              i.forEach(d => {
                this.dataSelectKodeDenda.push({ "id": d.id, "text": d.nama + "(" + d.kode + ")" });
              });
              let dtl: EstBkmPanenDetail[];
              dtl = this.bkmPanen.detail;
              console.log(dtl);
              for (let index = 0; index < dtl.length; index++) {
                const d = dtl[index];
                this.addDetailEdit(d.blok_id, d.karyawan_id, d.hasil_kerja_jjg, d.hasil_kerja_brondolan, d.hasil_kerja_luas,
                  d.hasil_kerja_kg, d.premi_brondolan, d.rp_hk, d.premi_basis, d.premi_lebih_basis,
                  d.premi_panen, d.denda_panen, d.denda_basis, d.basis_jjg, d.total_pendapatan, d.bjr, d.jumlah_hk, d.ket, d.potongan, d.keterangan_potongan, d.denda, d.acc_kegiatan_id);
              }
            });
          })
        }
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
  onSubmit() {
    // // console.log(this.entryForm.value);

    this.isFormSubmitted = true;

    let frmData = this.entryForm.getRawValue();

    // --- AUTO SET DEFAULT NILAI ---
    // default numeric values
    if (!frmData.mandor_rupiah_hk) {
      this.entryForm.patchValue({ mandor_rupiah_hk: 0 });
    }

    if (!frmData.kerani_rupiah_hk) {
      this.entryForm.patchValue({ kerani_rupiah_hk: 0 });
    }

    if (!frmData.mandor_premi) {
      this.entryForm.patchValue({ mandor_premi: 0 });
    }

    if (!frmData.kerani_premi) {
      this.entryForm.patchValue({ kerani_premi: 0 });
    }

    if (!frmData.mandor_denda) {
      this.entryForm.patchValue({ mandor_denda: 0 });
    }

    if (!frmData.kerani_denda) {
      this.entryForm.patchValue({ kerani_denda: 0 });
    }

    // Ambil ulang setelah patch
    frmData = this.entryForm.getRawValue();
    console.log(frmData);

    if (this.entryForm.invalid) {
      swal({
        title: 'Perhatian!',
        text: 'Data belum lengkap!',
        type: 'warning',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      });
      return;
    }


    // let frmData = this.entryForm.getRawValue();// this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');

    console.log(frmData);
    this.estBkmPanenService.update(this.bkmPanen.id, frmData).subscribe(data => {
      // console.log(data);
      if (data['status'] == 'OK') {
        // console.log('ok');
        this.event.emit('OK');
        swal({
          title: 'Info!',
          text: 'Data berhasil diSimpan.',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        this.bsModalRef.hide();
      }
    });
  }

  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };



  addDetailEdit(blok_id, karyawan_id, hasil_kerja_jjg, hasil_kerja_brondolan,
    hasil_kerja_luas, hasil_kerja_kg, premi_brondolan, rp_hk, premi_basis, premi_lebih_basis,
    premi_panen, denda_panen, denda_basis, basis_jjg, total_pendapatan, bjr, jumlah_hk, ket, potongan, keterangan_potongan, arr_denda, kegiatan_id) {

    let selectedBlok;
    this.dataSelectBlok.forEach(a => {
      if (blok_id == a.id) {
        selectedBlok = a;
      }
    });

    let selectedKegiatan;
    this.dataSelectKegiatan.forEach(a => {
      if (kegiatan_id == a.id) {
        selectedKegiatan = a;
      }
    });

    let selectedKaryawan;
    this.dataSelectKaryawan.forEach(a => {
      if (karyawan_id == a.id) {
        selectedKaryawan = a;
      }
    });

    let fb = this.builder.group({
      karyawan_id: new FormControl(selectedKaryawan, Validators.required),
      blok_id: new FormControl(selectedBlok, Validators.required),
      kegiatan_id: new FormControl(selectedKegiatan),
      bjr: new FormControl({ value: bjr, disabled: false }, Validators.required),
      jumlah_hk: new FormControl(jumlah_hk, Validators.required),
      hasil_kerja_jjg: new FormControl(hasil_kerja_jjg, Validators.required),
      hasil_kerja_kg: new FormControl({ value: hasil_kerja_kg, disabled: true }, Validators.required),
      hasil_kerja_brondolan: new FormControl(hasil_kerja_brondolan, Validators.required),
      hasil_kerja_luas: new FormControl(hasil_kerja_luas, Validators.required),
      premi_brondolan: new FormControl({ value: premi_brondolan, disabled: true }, Validators.required),
      rp_hk: new FormControl({ value: rp_hk, disabled: true }, Validators.required),
      premi_basis: new FormControl({ value: premi_basis, disabled: false }, Validators.required),
      premi_lebih_basis: new FormControl({ value: premi_lebih_basis, disabled: false }, Validators.required),

      premi_panen: new FormControl({ value: premi_panen, disabled: true }, Validators.required),
      denda_panen: new FormControl({ value: denda_panen, disabled: true }, Validators.required),
      denda_basis: new FormControl({ value: denda_basis, disabled: true }, Validators.required),
      basis_jjg: new FormControl({ value: basis_jjg, disabled: false }, Validators.required),
      total_pendapatan: new FormControl({ value: total_pendapatan, disabled: true }, Validators.required),
      ket: new FormControl(ket),
      potongan: new FormControl(potongan, Validators.required),
      keterangan_potongan: new FormControl(keterangan_potongan),
      details_denda: this.builder.array([]),
    });


    let dtl_denda = fb.get('details_denda') as FormArray;
    arr_denda.forEach(denda => {
      let selectedDenda;
      this.dataSelectKodeDenda.forEach(a => {
        if (denda['kode_denda_panen_id'] == a.id) {
          selectedDenda = a;
        }
      });
      dtl_denda.push(this.builder.group({
        denda_id: new FormControl(selectedDenda, Validators.required),
        qty: new FormControl(denda['qty'], Validators.required),
        nilai: new FormControl(denda['nilai'], Validators.required),
        jumlah_denda: new FormControl(denda['qty'] * denda['nilai'], Validators.required),
      }));
    });

    this.details.push(fb);
    // this.valueChange();
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
      potongan: new FormControl(0, Validators.required),
      keterangan_potongan: new FormControl(''),
      ket: new FormControl(''),
      details_denda: this.builder.array([]),

    }));

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

  removeDetail(dtl) {
    let i = this.details.controls.indexOf(dtl);
    if (i != -1) {
      // let x=	this.details.controls.splice(i, 1);
      let items = this.entryForm.get('details') as FormArray;
      items.removeAt(i);
      let data = { details: items.value };
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

  updateForm(data) {
    // const items = data.details;
    // // console.log(items);
    // let sub = 0;
    // for(let i of items){
    //   sub=sub+ parseFloat( i.qty);

    // }
    // // console.log(sub);
  }
  recalculate() {
    // let items = this.entryForm.get('details') as FormArray;
    // let data = { details: items.value };
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
      this.gbmOrganisasiService.getBlokByEstate(org_id).subscribe(x => {
        this.dataSelectBlok = [];
        x.forEach(d => {
          this.dataSelectBlok.push({ "id": d.id, "text": d.kode + " - " + d.nama });
        });
      })

    } else {
      let org_id = this.entryForm.get('afdeling_id').value['id'];
      this.gbmOrganisasiService.getBlokByAfdeling(org_id).subscribe(x => {
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
    let tgl = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    let lokasi_id = this.entryForm.get('lokasi_id').value['id'];
    // this.estDendaPanenService.getById(event['id']).subscribe(x => {
    this.estDendaPanenService.getDendaPanenByTanggal(lokasi_id, event['id'], tgl).subscribe(x => {
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
    let tanggal = this.entryForm.get('tanggal').value;
    this.hrmsKaryawanGajiService.getGajiPerhari(karyawan_id, tanggal).subscribe(res => {
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
    let tanggal = this.entryForm.get('tanggal').value;
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

  hitungHkKaryawan(blok) {
    let karyawan_id = blok.get('karyawan_id').value['id']
    let tanggal = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');;
    this.hrmsKaryawanGajiService.getGajiPerhari(karyawan_id, tanggal).subscribe(res => {
      console.log(res)
      if (res['status'] == 'OK') {
        let gajiPerhari = res['data']['rp_hk']
        let jumlah_hk = parseFloat(blok.get('jumlah_hk').value)
        blok.get('rp_hk').patchValue(jumlah_hk * gajiPerhari);
      }
    });
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

  recalculateHKPremi() {
    let id = this.bkmPanen.id;

    this.estBkmPanenService.calculateHk(id).subscribe(res => {

      if (res['status'] === 'OK') {

        let mandor = res['data']['mandor_kerani'];
        let details = res['data']['detail'];

        /** Update HK Mandor */
        this.entryForm.get('mandor_rupiah_hk').patchValue(mandor.rp_hk_mandor);

        /** Update HK Kerani */
        this.entryForm.get('kerani_rupiah_hk').patchValue(mandor.rp_hk_kerani);

        /** Update DETAIL KARYAWAN */
        let dtlForm = this.entryForm.get('details') as FormArray;

        for (let i = 0; i < details.length; i++) {
          let row = dtlForm.at(i);
          if (row) {
            if (row.get('rp_hk')) {
              row.get('rp_hk').patchValue(details[i].rupiah_hk);
            }
            // Jika backend nanti kirim premi:
            // if (row.get('premi')) {
            //   row.get('premi').patchValue(details[i].premi);
            // }
          }
          this.hitungPremi(row);
        }

        // Hitung ulang total
        this.hitungRekapitulasi();


        swal({
          title: 'Sukses!',
          text: 'HK dan Premi berhasil dihitung ulang.',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        });

      }

    });
  }
}
