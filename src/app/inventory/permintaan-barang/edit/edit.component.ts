import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { InvPermintaanBarangService } from 'src/app/shared/services/inv_permintaan_barang.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvPermintaanBarang } from 'src/app/shared/models/inv_permintaan_barang.model';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { GbmUomService } from 'src/app/shared/services/gbm_uom.service';
import { AccKegiatanKelompokService } from 'src/app/shared/services/acc_kegiatan_kelompok.service';
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

  entryForm: FormGroup;

  event: EventEmitter<any> = new EventEmitter();

  invPermintaanBarang: InvPermintaanBarang;
  dataSelectLokasi;
  dataSelectLokasiAfd;
  dataSelectLokasiTraksi;
  dataSelectGudang;
  dataSelectKaryawan;
  dataSelectBlok;
  dataSelectKegiatan;
  dataSelectUom;
  dataSelectItem;
  dataSelectTipe;
  dataSelectTraksi;

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private invPermintaanBarangService: InvPermintaanBarangService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private invItemService: InvItemService,
    private gbmUomService: GbmUomService,
    private accKegiatanService: AccKegiatanService,
    private karyawanService: KaryawanService,

    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();
    let time: Date = new Date();

    this.entryForm = this.builder.group({
      tanggal: new FormControl(toDate, Validators.required),
      catatan: new FormControl(''),
      no_transaksi: new FormControl(''),
      // nama_tanki: new FormControl(''),
      lokasi_id: new FormControl([], Validators.required),
      lokasi_afd_id: new FormControl([],),
      lokasi_traksi_id: new FormControl([],),
      gudang_id: new FormControl([], Validators.required),
      karyawan_id: new FormControl([], Validators.required),
      tipe: new FormControl([], Validators.required),


      details: this.builder.array([])


    });
  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.invPermintaanBarang.tanggal)));
    this.entryForm.get('catatan').patchValue(this.invPermintaanBarang.catatan);
    this.entryForm.get('no_transaksi').patchValue(this.invPermintaanBarang.no_transaksi);


  }
  public options: any;

  private loadSelect2(): void {


    this.dataSelectTipe = [
      { id: 'TRAKSI', text: 'TRAKSI' },
      { id: 'UNIT', text: 'UNIT' },
      // { id: 'WORKSHOP', text: 'WORKSHOP' },
    ];
    let selectTipe;
    this.dataSelectTipe.forEach(a => {
      if (a.id == this.invPermintaanBarang.tipe) {
        selectTipe = a;
      }
    });
    this.entryForm.controls['tipe'].patchValue(selectTipe);


    let selectLokasi;
    this.gbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
        if (this.invPermintaanBarang.lokasi_id == d.id) {
          selectLokasi = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectLokasi);
      let lokasi_id = selectLokasi['id'];
      let selectLokasiAfd: any = [];
      this.gbmOrganisasiService.getAfdStByUnit(lokasi_id).subscribe(x => {
        this.dataSelectLokasiAfd = [];
        x.forEach(d => {
          this.dataSelectLokasiAfd.push({ "id": d.id, "text": d.nama });
          if (this.invPermintaanBarang.lokasi_afd_id == d.id) {
            selectLokasiAfd = { "id": d.id, "text": d.nama }
          }
        });
        this.entryForm.get('lokasi_afd_id').patchValue(selectLokasiAfd);
      });
    });



    let selectLokasiTraksi: any = [];
    this.gbmOrganisasiService.getAllByType('TRAKSI').subscribe(x => {
      this.dataSelectLokasiTraksi = [];
      x.forEach(d => {
        this.dataSelectLokasiTraksi.push({ "id": d.id, "text": d.nama });
        if (this.invPermintaanBarang.lokasi_traksi_id == d.id) {
          selectLokasiTraksi = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_traksi_id').patchValue(selectLokasiTraksi);
    });

    let selectGudang;
    this.gbmOrganisasiService.getAllByType('GUDANG').subscribe(x => {
      this.dataSelectGudang = [];
      x.forEach(d => {
        this.dataSelectGudang.push({ "id": d.id, "text": d.nama });
        if (this.invPermintaanBarang.gudang_id == d.id) {
          selectGudang = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('gudang_id').patchValue(selectGudang);
    });

    let selectKaryawan;
    this.karyawanService.getAll().subscribe(x => {
      this.dataSelectKaryawan = [];
      x['data'].forEach(d => {
        this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama });
        if (this.invPermintaanBarang.karyawan_id == d.id) {
          selectKaryawan = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('karyawan_id').patchValue(selectKaryawan);


    });



    this.invItemService.getAll().subscribe(x => {
      this.dataSelectItem = [];
      x['data'].forEach(d => {
        this.dataSelectItem.push({ "id": d.id, "text": d.kode + ' - ' + d.nama + "(" + d.uom + ")" });
      });

      this.invPermintaanBarangService.getTraksi().subscribe(x => {
        this.dataSelectTraksi = [];
        x['data'].forEach(d => {
          this.dataSelectTraksi.push({ "id": d.id, "text": d.nama });
        });

        this.gbmOrganisasiService.getBlokByAfdeling(this.invPermintaanBarang.lokasi_afd_id).subscribe(x => {
          this.dataSelectBlok = [];
          x.forEach(d => {
            this.dataSelectBlok.push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
          });

          this.accKegiatanService.getAllbyTipe('BAHAN').subscribe(x => {
            this.dataSelectKegiatan = [];
            x['data'].forEach(d => {
              this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama });
            });

            let dtl = [];
            dtl = this.invPermintaanBarang.detail;
            for (let index = 0; index < dtl.length; index++) {
              const d = dtl[index];
              this.addBlok(d['item_id'], d['traksi_id'], d['blok_id'], d['kegiatan_id'], d['qty'], d['ket']);
            }
          });
        });
      });
    });



  }
  onSubmit() {


    this.isFormSubmitted = true;

    if (this.entryForm.invalid) {
      return;
    }

    let frmData = this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    this.invPermintaanBarangService.update(this.invPermintaanBarang.id, frmData).subscribe(data => {
      // console.log(data);
      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Edit berhasil',
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

  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };

  addBlokNew() {
    if (this.entryForm.get('tipe').value.id == 'TRAKSI') {
      this.details.push(this.builder.group({
        qty: new FormControl('1', Validators.required),
        item_id: new FormControl([]),
        blok_id: new FormControl({ value: [], disabled: 'disabled' }),
        traksi_id: new FormControl([]),
        kegiatan_id: new FormControl([]),
        ket: new FormControl('', Validators.required),
      }));
    } else {
      this.details.push(this.builder.group({
        qty: new FormControl('1', Validators.required),
        item_id: new FormControl([]),
        blok_id: new FormControl([]),
        traksi_id: new FormControl({ value: [], disabled: 'disabled' }),
        kegiatan_id: new FormControl([]),
        ket: new FormControl('', Validators.required),
      }));
    }

    this.entryForm.get('tipe').valueChanges.subscribe(x => {
      if (x.id == 'TRAKSI') {
        this.details.controls.forEach(x => {
          x.get('blok_id').disable();
          x.get('blok_id').patchValue([]);
          x.get('traksi_id').enable();
          x.get('traksi_id').patchValue([]);
        });
      } else {
        this.details.controls.forEach(x => {
          x.get('blok_id').enable();
          x.get('blok_id').patchValue([]);
          x.get('traksi_id').disable();
          x.get('traksi_id').patchValue([]);
        });
      }
    });
  }


  addBlok(item_id, traksi_id, blok_id, kegiatan_id, qty, ket) {

    this.dataSelectBlok;
    this.dataSelectKegiatan;
    this.dataSelectUom;
    this.dataSelectItem;

    let selectedItem = [];
    this.dataSelectItem.forEach(a => {
      if (item_id == a.id) {
        selectedItem = a;
      }
    });
    let selectedTraksi = [];
    this.dataSelectTraksi.forEach(a => {
      if (traksi_id == a.id) {
        selectedTraksi = a;
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

    let tipe = this.entryForm.get('tipe').value['id']
    if (tipe == 'TRAKSI') {
      let fb = this.builder.group({
        item_id: new FormControl(selectedItem),
        traksi_id: new FormControl(selectedTraksi),
        blok_id: new FormControl({ value: selectedBlok, disabled: "disabled" }),
        kegiatan_id: new FormControl(selectedKegiatan),
        qty: new FormControl(qty),
        ket: new FormControl(ket),

      });
      this.details.push(fb);
    } else {
      let fb = this.builder.group({
        item_id: new FormControl(selectedItem),
        traksi_id: new FormControl({ value: selectedTraksi, disabled: "disabled" }),
        blok_id: new FormControl( selectedBlok),
        kegiatan_id: new FormControl(selectedKegiatan),
        qty: new FormControl(qty),
        ket: new FormControl(ket),

      });
      this.details.push(fb);

    }

  }




  removeBlokItem(item) {
    let i = this.details.controls.indexOf(item);
    if (i != -1) {
      // let x=	this.details.controls.splice(i, 1);
      let items = this.entryForm.get('details') as FormArray;
      items.removeAt(i);
      let data = { details: items.value };
      this.updateForm(data);
    }
  }




  updateForm(data) {

  }
  recalculate() {
  }
  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();


  }
  valueChange($event) {
    // console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
}
