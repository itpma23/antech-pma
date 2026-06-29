import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { InvPenerimaanPindahGudangService } from 'src/app/shared/services/inv_penerimaan_pindah_gudang.service';
import { InvPindahGudangService } from 'src/app/shared/services/inv_pindah_gudang.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { AccKegiatanKelompokService } from 'src/app/shared/services/acc_kegiatan_kelompok.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmUomService } from 'src/app/shared/services/gbm_uom.service';

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


  dataSelectLokasi;
  dataSelectLokasiAfd;
  dataSelectGudang;
  dataSelectBlok;
  dataSelectKegiatan;
  dataSelectKaryawan;
  dataSelectUom;
  dataSelectItem;
  dataSelectTipe;
  dataSelectTraksi;
  dataSelectPindahGudang;
  dataSelectDariGudang: any[];
  dataSelectKeGudang: any[];
  tipe: any;

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private invPenerimaanPindahGudangService: InvPenerimaanPindahGudangService,
    private invPindahGudangService: InvPindahGudangService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private accKegiatanKelompokService: AccKegiatanKelompokService,
    private karyawanService: KaryawanService,
    private gbmUomService: GbmUomService,
    private invItemService: InvItemService,

    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();
    this.entryForm = this.builder.group({

      no_transaksi: new FormControl('(AutoNumber)'),
      tanggal: new FormControl(toDate, Validators.required),
      catatan: new FormControl(''),
      lokasi_id: new FormControl([], Validators.required),
      dari_gudang_id: new FormControl([], Validators.required),
      gudang_id: new FormControl([], Validators.required),
      inv_pindah_gudang_id: new FormControl([], Validators.required),


      details: this.builder.array([])

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }
  public options: any;

  private loadSelect2(): void {

    this.dataSelectTipe = [
      { id: '1', text: 'LANGSUNG' },
      { id: '2', text: 'TIDK LANGSUNG' },

    ];


    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });

      this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {
        let lokasi_id = x.id;
        // console.log(x)
        // this.GbmOrganisasiService.getGudangByUnit(gd_id).subscribe(x => {
          this.GbmOrganisasiService.getGudangCentralAndVirtualByUnit(lokasi_id).subscribe(x => {
          // console.log(x)
          this.dataSelectKeGudang = [];
          x.forEach(d => {
            this.dataSelectKeGudang.push({ "id": d.id, "text": d.nama });
          });
          this.entryForm.controls['gudang_id'].valueChanges.subscribe(x => {
            let gd_id = this.entryForm.controls['gudang_id'].value['id'];
            this.invPindahGudangService.getAllBlmTerima(gd_id).subscribe(x => {
              console.log(x);
              this.dataSelectPindahGudang = [];
              let i = x['data'];
              i.forEach(d => {
                this.dataSelectPindahGudang.push({ "id": d.id, "text": d.no_transaksi + "(" + d.tanggal + ")" });
              });
              this.invPindahGudangService.getAllBlmTerima(gd_id).subscribe(x => {
                console.log(x);
                this.dataSelectPindahGudang = [];
                let i = x['data'];
                i.forEach(d => {
                  this.dataSelectPindahGudang.push({ "id": d.id, "text": d.no_transaksi + "(" + d.tanggal + ")" });
                });
              });
              this.entryForm.controls['inv_pindah_gudang_id'].valueChanges.subscribe(x => {
                this.tampilItemPindahGudang();
              });
            });


          });
        });

      });
    });

    this.GbmOrganisasiService.getAllGudangCentralAndVirtual().subscribe(x => {
      this.dataSelectDariGudang = [];
      x.forEach(d => {
        this.dataSelectDariGudang.push({ "id": d.id, "text": d.nama });
      });
    });



    // this.karyawanService.getAll().subscribe(x=>{
    //   this.dataSelectKaryawan=[];
    //   let i = x['data'];
    //   i.forEach(d => {
    //     this.dataSelectKaryawan.push({"id":d.id,"text":d.nama});
    //   });
    // });



    this.invItemService.getAll().subscribe(x => {
      this.dataSelectItem = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectItem.push({ "id": d.id, "text": d.kode + ' - ' + d.nama + "(" + d.uom + ")" });
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
    frmData['tipe'] = this.tipe;

    // // console.log(frmData);
    this.invPenerimaanPindahGudangService.create(frmData).subscribe(data => {
      // console.log(data);
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


  addBlokItem() {
    this.details.push(this.builder.group({
      item_id: new FormControl([], Validators.required),
      // uom_id: new FormControl([], Validators.required),
      qty: new FormControl('', Validators.required),
      ket: new FormControl(''),
    }));
  }


  removeBlokItem(blok) {
    let i = this.details.controls.indexOf(blok);
    if (i != -1) {
      let detail = this.entryForm.get('details') as FormArray;
      detail.removeAt(i);
      let data = { details: detail.value };
      this.updateForm(data);
    }
  }
  addBlokPermintaan(item_id, qty, ket) {


    this.dataSelectItem;

    let selectedItem;
    this.dataSelectItem.forEach(a => {
      if (item_id == a.id) {
        selectedItem = a;
      }
    });


    let fb = this.builder.group({

      item_id: new FormControl(selectedItem),

      qty: new FormControl(qty),
      ket: new FormControl(ket),

    });

    this.details.push(fb);
  }

  tampilItemPindahGudang() {
    let pindah_gudang_id = this.entryForm.get('inv_pindah_gudang_id').value['id']
    this.invPindahGudangService.getById(pindah_gudang_id).subscribe(res => {
      console.log(res);
      let dtl = [];
      let selectDariGudang;
      this.tipe = res['data']['tipe'];
      this.dataSelectDariGudang.forEach(d => {

        if (res['data']['dari_gudang_id'] == d.id) {
          selectDariGudang = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('dari_gudang_id').patchValue(selectDariGudang);

      let selectKeGudang;
      this.dataSelectKeGudang.forEach(d => {

        if (res['data']['ke_gudang_id'] == d.id) {
          selectKeGudang = { "id": d.id, "text": d.nama }
        }

        this.entryForm.get('gudang_id').patchValue(selectKeGudang);
      });
      dtl = res['data']['detail'];
      for (let index = 0; index < dtl.length; index++) {
        const d = dtl[index];
        this.addBlokPermintaan(d['item_id'], d['qty'], d['ket']);
      }

    })

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

  }
}
