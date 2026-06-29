import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { EstBkmPemeliharaanService } from 'src/app/shared/services/est_bkm_pemeliharaan.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { EstBkmPemeliharaan, EstBkmPemeliharaanDetail, EstBkmPemeliharaanItem } from 'src/app/shared/models/est_bkm_pemeliharaan.model';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { AccKegiatanService } from 'src/app/shared/services/acc_kegiatan.service';
import { HrmsKaryawanGajiService } from 'src/app/shared/services/hrms_karyawan_gaji.service';

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

  bkmPemeliharaan: EstBkmPemeliharaan;
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
  dataKegiatan: any;
  estRekapitulasi = [];

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private estBkmPemeliharaanService: EstBkmPemeliharaanService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private KaryawanService: KaryawanService,
    private InvItemService: InvItemService,
    private accKegiatanService: AccKegiatanService,
    private translate: TranslateService,
    private hrmsKaryawanGajiService: HrmsKaryawanGajiService,
  ) {
    let toDate: Date = new Date();
    let time: Date = new Date();

    this.entryForm = this.builder.group({
      no_transaksi: new FormControl('AutoNumber'),
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
      details_item: this.builder.array([]),
    });
  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    let date: Date = new Date();
    let strDate = formatDate(date, "yyyy-MM-dd", "en_US");

    //this.entryForm.get('no_transaksi').patchValue(this.bkmPemeliharaan.no_transaksi);
    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.bkmPemeliharaan.tanggal)));

    this.entryForm.get('mandor_hasil_kerja').patchValue(this.bkmPemeliharaan.hasil_kerja_mandor);
    this.entryForm.get('mandor_jumlah_hk').patchValue(this.bkmPemeliharaan.jumlah_hk_mandor);
    this.entryForm.get('mandor_rupiah_hk').patchValue(this.bkmPemeliharaan.rp_hk_mandor);
    this.entryForm.get('mandor_premi').patchValue(this.bkmPemeliharaan.premi_mandor);
    this.entryForm.get('mandor_denda').patchValue(this.bkmPemeliharaan.denda_mandor);
    this.entryForm.get('ket_mandor').patchValue(this.bkmPemeliharaan.ket_mandor);
    this.entryForm.get('ket_kerani').patchValue(this.bkmPemeliharaan.ket_kerani);
    this.entryForm.get('kerani_hasil_kerja').patchValue(this.bkmPemeliharaan.hasil_kerja_kerani);
    this.entryForm.get('kerani_jumlah_hk').patchValue(this.bkmPemeliharaan.jumlah_hk_kerani);
    this.entryForm.get('kerani_rupiah_hk').patchValue(this.bkmPemeliharaan.rp_hk_kerani);
    this.entryForm.get('kerani_premi').patchValue(this.bkmPemeliharaan.premi_kerani);
    this.entryForm.get('kerani_denda').patchValue(this.bkmPemeliharaan.denda_kerani);
    this.entryForm.get('is_premi_kontanan').patchValue(this.bkmPemeliharaan.is_premi_kontanan == true ? 1 : 0);
    this.entryForm.get('is_asistensi').patchValue(this.bkmPemeliharaan.is_asistensi == true ? 1 : 0);
    this.entryForm.get('is_asistensi_unit').patchValue(this.bkmPemeliharaan.is_asistensi_unit == true ? 1 : 0);

  }
  public options: any;

  private loadSelect2(): void {
    let selectedEstate;
    this.gbmOrganisasiService.getAllByType('ESTATE').subscribe(x => {
      this.dataSelectEstate = [];
      x.forEach(d => {
        this.dataSelectEstate.push({ "id": d.id, "text": d.nama });
        if (this.bkmPemeliharaan.lokasi_id == d.id) {
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
        if (this.bkmPemeliharaan.rayon_afdeling_id == d.id) {
          selectedRayonAfdeling = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('afdeling_id').patchValue(selectedRayonAfdeling);
    });
    // this.KaryawanService.getAllAktifByDivisi(this.bkmPemeliharaan.rayon_afdeling_id, this.bkmPemeliharaan.tanggal).subscribe(x => {
    this.KaryawanService.getAllAktifEstate().subscribe(x => {

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
        if (this.bkmPemeliharaan.mandor_id == d.id) {
          selectedMandor = { "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" }
        }
        if (this.bkmPemeliharaan.kerani_id == d.id) {
          selectedKerani = { "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" }
        }
        if (this.bkmPemeliharaan.asisten_id == d.id) {
          selectedAsisten = { "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" }
        }

      });
      this.entryForm.get('mandor_id').patchValue(selectedMandor);
      this.entryForm.get('asisten_id').patchValue(selectedAsisten);
      this.entryForm.get('kerani_id').patchValue(selectedKerani);
      this.entryForm.get('mandor_hasil_kerja').patchValue(this.bkmPemeliharaan.hasil_kerja_mandor);
      this.entryForm.get('mandor_jumlah_hk').patchValue(this.bkmPemeliharaan.jumlah_hk_mandor);
      this.entryForm.get('mandor_rupiah_hk').patchValue(this.bkmPemeliharaan.rp_hk_mandor);
      this.entryForm.get('mandor_premi').patchValue(this.bkmPemeliharaan.premi_mandor);
      this.entryForm.get('mandor_denda').patchValue(this.bkmPemeliharaan.denda_mandor);
      this.entryForm.get('ket_mandor').patchValue(this.bkmPemeliharaan.ket_mandor);
      this.entryForm.get('ket_kerani').patchValue(this.bkmPemeliharaan.ket_kerani);
      this.entryForm.get('kerani_hasil_kerja').patchValue(this.bkmPemeliharaan.hasil_kerja_kerani);
      this.entryForm.get('kerani_jumlah_hk').patchValue(this.bkmPemeliharaan.jumlah_hk_kerani);
      this.entryForm.get('kerani_rupiah_hk').patchValue(this.bkmPemeliharaan.rp_hk_kerani);
      this.entryForm.get('kerani_premi').patchValue(this.bkmPemeliharaan.premi_kerani);
      this.entryForm.get('kerani_denda').patchValue(this.bkmPemeliharaan.denda_kerani);
      if (this.bkmPemeliharaan.is_asistensi_unit != true) {
        this.KaryawanService.getAllAktifByDivisi(this.bkmPemeliharaan.rayon_afdeling_id, this.bkmPemeliharaan.tanggal).subscribe(x => {
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

          })
        })
      }
      if (this.bkmPemeliharaan.is_asistensi == true) {
        this.gbmOrganisasiService.getBlokByEstate(this.bkmPemeliharaan.lokasi_id).subscribe(x => {
          this.dataSelectBlok = [];
          x.forEach(d => {
            this.dataSelectBlok.push({ "id": d.id, "text": d.kode + " - " + d.nama });
          });
          this.accKegiatanService.getAllbyTipe('PEMELIHARAAN').subscribe(k => {
            this.dataKegiatan = k['data'];
            // console.log(this.dataKegiatan);
            this.dataSelectKegiatan = [];
            k['data'].forEach(d => {
              this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama + "-" + d.kode + " (" + d.uom + ")" });
            });
            let dtl: EstBkmPemeliharaanDetail[];
            dtl = this.bkmPemeliharaan.detail;
            for (let index = 0; index < dtl.length; index++) {
              const d = dtl[index];
              console.log(d);
              this.addDetail(d.blok_id, d.acc_kegiatan_id, d.karyawan_id, d.hasil_kerja, d.jumlah_hk, d.rupiah_hk, d.premi,d.keterangan, d.denda_pemeliharaan);
            }
            this.InvItemService.getAllBahanBkm().subscribe(t => {
              this.dataSelectItem = [];
              let i = t['data'];
              i.forEach(d => {
                this.dataSelectItem.push({ "id": d.id, "text": d.kode + " - " + d.nama + "(" + d.uom + ")" });
              });
              let dtl: EstBkmPemeliharaanItem[];
              dtl = this.bkmPemeliharaan.detail_item;
              for (let index = 0; index < dtl.length; index++) {
                const d = dtl[index];
                this.addItem(d.blok_id, d.kegiatan_id, d.item_id, d.qty);
              }
            });
          });
        });
      } else {
        this.gbmOrganisasiService.getBlokByAfdeling(this.bkmPemeliharaan.rayon_afdeling_id).subscribe(x => {
          this.dataSelectBlok = [];
          x.forEach(d => {
            this.dataSelectBlok.push({ "id": d.id, "text": d.kode + " - " + d.nama });
          });
          this.accKegiatanService.getAllbyTipe('PEMELIHARAAN').subscribe(k => {
            this.dataKegiatan = k['data'];
            // console.log(this.dataKegiatan);
            this.dataSelectKegiatan = [];
            k['data'].forEach(d => {
              this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama + "-" + d.kode + " (" + d.uom + ")" });
            });
            let dtl: EstBkmPemeliharaanDetail[];
            dtl = this.bkmPemeliharaan.detail;
            for (let index = 0; index < dtl.length; index++) {
              const d = dtl[index];
              console.log(d);
              this.addDetail(d.blok_id, d.acc_kegiatan_id, d.karyawan_id, d.hasil_kerja, d.jumlah_hk, d.rupiah_hk, d.premi,d.keterangan, d.denda_pemeliharaan);
            }

            this.InvItemService.getAll().subscribe(t => {
              this.dataSelectItem = [];
              let i = t['data'];
              i.forEach(d => {
                this.dataSelectItem.push({ "id": d.id, "text": d.kode + " - " + d.nama + "(" + d.uom + ")" });
              });
              let dtl: EstBkmPemeliharaanItem[];
              dtl = this.bkmPemeliharaan.detail_item;
              for (let index = 0; index < dtl.length; index++) {
                const d = dtl[index];
                this.addItem(d.blok_id, d.kegiatan_id, d.item_id, d.qty);
              }
            });
          });
        });
      }

    });

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

    let frmData = this.entryForm.getRawValue();// this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    this.estBkmPemeliharaanService.create(frmData).subscribe(data => {
      // console.log(data);
      if (data['status'] == 'OK') {
        // console.log('ok');
        this.event.emit('OK');
        swal({
          title: 'Info!',
          text: 'Data berhasil diSimpan dengan Nomor:' + data['data'],
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        this.bsModalRef.hide();
      }else {
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

  addDetailNew() {

    this.details.push(this.builder.group({
      karyawan_id: new FormControl([], Validators.required),
      blok_id: new FormControl([], Validators.required),
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
  addDetail(blok_id, kegiatan_id, karyawan_id, hasil_kerja, jumlah_hk, rupiah_hk, premi,keterangan, denda_pemeliharaan) {

    let selectedBlok = {};
    this.dataSelectBlok.forEach(a => {
      if (blok_id == a.id) {
        selectedBlok = a;
      }
    });
    let selectedKaryawan = {};
    this.dataSelectKaryawan.forEach(a => {
      if (karyawan_id == a.id) {
        selectedKaryawan = a;
      }
    });
    let selectedKegiatan = {};
    this.dataSelectKegiatan.forEach(a => {
      if (kegiatan_id == a.id) {
        selectedKegiatan = a;
      }
    });

    let x = this.getKegiatan(kegiatan_id);
    console.log(x)
    if (x['is_premi_otomatis'] == '1') {
      let fb = this.builder.group({
        karyawan_id: new FormControl(selectedKaryawan, Validators.required),
        blok_id: new FormControl(selectedBlok),
        kegiatan_id: new FormControl(selectedKegiatan, Validators.required),
        hasil_kerja: new FormControl(hasil_kerja, Validators.required),
        jumlah_hk: new FormControl({ value: jumlah_hk, disabled: true }, Validators.required),
        rupiah_hk: new FormControl({ value: rupiah_hk, disabled: true }, Validators.required),
        premi: new FormControl({ value: premi, disabled: true }, Validators.required),
        keterangan: new FormControl(keterangan),
        denda_pemeliharaan: new FormControl({ value: denda_pemeliharaan, disabled: true }, Validators.required),
      });

      this.details.push(fb);

    } else {
      let fb = this.builder.group({
        karyawan_id: new FormControl(selectedKaryawan, Validators.required),
        blok_id: new FormControl(selectedBlok),
        kegiatan_id: new FormControl(selectedKegiatan, Validators.required),
        hasil_kerja: new FormControl(hasil_kerja, Validators.required),
        jumlah_hk: new FormControl(jumlah_hk, Validators.required),
        rupiah_hk: new FormControl({ value: rupiah_hk, disabled: true }, Validators.required),
        premi: new FormControl(premi, Validators.required),
        keterangan: new FormControl(keterangan),
        denda_pemeliharaan: new FormControl(denda_pemeliharaan, Validators.required),
      });

      this.details.push(fb);

    }
  }
  addItem(blok_id, kegiatan_id, item_id, qty) {


    let selectedItem = [];
    this.dataSelectItem.forEach(a => {
      if (item_id == a.id) {
        selectedItem = a;
      }
    });

    let selectedBlok = [];
    this.dataSelectBlok.forEach(a => {
      if (blok_id == a.id) {
        selectedBlok = a;
      }
    });
    let selectedKegiatan = [];
    this.dataSelectKegiatan.forEach(a => {
      if (kegiatan_id == a.id) {
        selectedKegiatan = a;
      }
    });


    let fb = this.builder.group({
      // gudang_id: new FormControl(selectedGudang, Validators.required),
      blok_id: new FormControl(selectedBlok, Validators.required),
      kegiatan_id: new FormControl(selectedKegiatan, Validators.required),
      item_id: new FormControl(selectedItem, Validators.required),
      qty: new FormControl(qty, Validators.required),

    });

    this.details_item.push(fb);

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

  getKegiatan(kegiatan_id) {
    let kegiatan;
    this.dataKegiatan.forEach(element => {
      if (element['id'] == kegiatan_id) {
        kegiatan = element;
      }

    });
    return kegiatan;
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
      console.log(x)
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
    this.bsModalRef.hide();
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

    this.hrmsKaryawanGajiService.getGajiPerhari(karyawan_id,tanggal).subscribe(res => {
      console.log(res)
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
      console.log(res)
      if (res['status'] == 'OK') {
        let gajiPerhari = res['data']['rp_hk']
        let jumlah_hk = parseFloat(blok.get('jumlah_hk').value)
        blok.get('rupiah_hk').patchValue(jumlah_hk * gajiPerhari);
      }
    });
  }
  hitungPremi(blok) {

    let data = blok.value;
    return; /// Sesuai permintaan user di fungsi ini dinonaktifknan

    data['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    let send_data = {
      karyawan_id: blok.get('karyawan_id').value['id'],
      kegiatan_id: blok.get('kegiatan_id').value['id'],
      hasil_kerja: blok.get('hasil_kerja').value,
    }

    console.log(send_data);
    this.estBkmPemeliharaanService.hitungPremi(send_data).subscribe(res => {
      console.log(res)
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
