import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { InvPermintaanPindahGudangService } from 'src/app/shared/services/inv_permintaan_pindah_gudang.service';
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
  dataSelectPermintaan;
  dataSelectDariGudang: any[];
  dataSelectKeGudang: any[];
  tipe = "INT";
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private invPermintaanPindahGudangService: InvPermintaanPindahGudangService,
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
      nama_peminta: new FormControl([], Validators.required),
      dari_gudang_id: new FormControl([], Validators.required),
      ke_gudang_id: new FormControl([], Validators.required),
      inv_permintaan_pindah_gudang_id: new FormControl([]),
      tipe: new FormControl([], Validators.required),

      details: this.builder.array([])

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }
  public options: any;

  private loadSelect2(): void {

    this.dataSelectTipe = [
      { id: 'INT', text: 'INTERNAL' },
      { id: 'EXT', text: 'EKSTERNAL' },

    ];

    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });

      this.entryForm.controls['lokasi_id'].valueChanges.subscribe(l => {
        let lokasi_id = l.id;
        this.dataSelectKeGudang = [];
        this.dataSelectDariGudang = [];
        this.dataSelectKeGudang.length = 0;
        this.dataSelectDariGudang.length = 0;
        this.entryForm.controls['tipe'].patchValue({ id: 'INT', text: 'INTERNAL' });
        if (this.entryForm.controls['tipe'].value['id'] == 'EXT') {
          this.GbmOrganisasiService.getGudangByUnit(lokasi_id).subscribe(g => {
            console.log(g)
            this.dataSelectDariGudang = [];
            this.dataSelectDariGudang.length = 0;
            this.entryForm.controls['dari_gudang_id'].patchValue([])
            g.forEach(d => {
              this.dataSelectDariGudang.push({ "id": d.id, "text": d.nama });
            });
          });
          this.GbmOrganisasiService.getAllByType('GUDANG').subscribe(h => {
            this.dataSelectKeGudang = [];
            this.dataSelectKeGudang.length = 0;
            this.entryForm.controls['ke_gudang_id'].patchValue([])
            h.forEach(d => {
              // if (d['id'] != dari_gudang_id) {
              this.dataSelectKeGudang.push({ "id": d.id, "text": d.nama });
              // }
            });
          });
        } else {
          this.GbmOrganisasiService.getGudangCentralAndVirtualByUnit(lokasi_id).subscribe(v => {
            this.dataSelectKeGudang = [];
            this.dataSelectDariGudang = [];
            this.dataSelectKeGudang.length = 0;
            this.dataSelectDariGudang.length = 0;
            v.forEach(d => {
              this.dataSelectDariGudang.push({ "id": d.id, "text": d.nama });
              this.dataSelectKeGudang.push({ "id": d.id, "text": d.nama });
            });
          });

        }
        // this.GbmOrganisasiService.getGudangByUnit(lokasi_id).subscribe(x => {
        //   console.log(x)
        //   this.dataSelectDariGudang = [];
        //   x.forEach(d => {
        //     this.dataSelectDariGudang.push({ "id": d.id, "text": d.nama });
        //   });
        // this.entryForm.controls['dari_gudang_id'].valueChanges.subscribe(x => {
        //   let dari_gudang_id = this.entryForm.controls['dari_gudang_id'].value['id'];
        //   if (this.entryForm.controls['tipe'].value['id'] == 'EXT') {
        //     this.GbmOrganisasiService.getAllByType('GUDANG').subscribe(x => {
        //       this.dataSelectKeGudang = [];
        //       x.forEach(d => {
        //         if (d['id'] != dari_gudang_id) {
        //           this.dataSelectKeGudang.push({ "id": d.id, "text": d.nama });
        //         }
        //       });
        //     });
        //   } else {
        //     this.GbmOrganisasiService.getAllChildGudang(dari_gudang_id).subscribe(x => {
        //       this.dataSelectKeGudang = [];
        //       x.forEach(d => {
        //         this.dataSelectKeGudang.push({ "id": d.id, "text": d.nama });
        //       });
        //     });

        //   }
        // });
        this.entryForm.controls['tipe'].valueChanges.subscribe(x => {
          this.dataSelectKeGudang = [];
          this.dataSelectDariGudang = [];
          this.dataSelectKeGudang.length = 0;
          this.dataSelectDariGudang.length = 0;
          // let dari_gudang_id = this.entryForm.controls['dari_gudang_id'].value['id'];
          if (this.entryForm.controls['tipe'].value['id'] == 'EXT') {
            this.GbmOrganisasiService.getGudangByUnit(lokasi_id).subscribe(x => {
              // console.log(x)
              this.dataSelectDariGudang = [];
              x.forEach(d => {
                this.dataSelectDariGudang.push({ "id": d.id, "text": d.nama });
              });
            });
            this.GbmOrganisasiService.getAllByType('GUDANG').subscribe(x => {
              this.dataSelectKeGudang = [];
              x.forEach(d => {
                // if (d['id'] != dari_gudang_id) {
                this.dataSelectKeGudang.push({ "id": d.id, "text": d.nama });
                // }
              });
            });
          } else {
            this.GbmOrganisasiService.getGudangCentralAndVirtualByUnit(lokasi_id).subscribe(x => {
              this.dataSelectKeGudang = [];
              this.dataSelectDariGudang = [];
              this.dataSelectKeGudang.length = 0;
              this.dataSelectDariGudang.length = 0;
              x.forEach(d => {
                this.dataSelectDariGudang.push({ "id": d.id, "text": d.nama });
                this.dataSelectKeGudang.push({ "id": d.id, "text": d.nama });
              });
            });

          }
        });
      });
      

      // this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {
      //   let lokasi_id = x.id;
      //   // this.GbmOrganisasiService.getGudangByUnit(gd_id).subscribe(x => {
      //     this.GbmOrganisasiService.getGudangCentralAndVirtualByUnit(lokasi_id).subscribe(x => {
      //     console.log(x)
      //     this.dataSelectDariGudang = [];
      //     x.forEach(d => {
      //       this.dataSelectDariGudang.push({ "id": d.id, "text": d.nama });
      //     });
      //     this.entryForm.controls['dari_gudang_id'].valueChanges.subscribe(x => {
      //       let gudang_diminta_id = x['id'];
      //       this.invPermintaanPindahGudangService.getAllGudangDiminta(gudang_diminta_id).subscribe(x => {
      //         this.dataSelectPermintaan = [];
      //         let i = x['data'];
      //         i.forEach(d => {
      //           this.dataSelectPermintaan.push({ "id": d.id, "text": d.no_transaksi + "(" + d.tanggal + ")" });
      //         });
      //       });
      //       this.entryForm.controls['inv_permintaan_pindah_gudang_id'].valueChanges.subscribe(x => {
      //         this.tampilItemPermintaan()
      //       });
      //     });
      //   });
      // });

    });


    // this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x=>{
    //   this.dataSelectLokasi=[];
    //   x.forEach(d => {
    //     this.dataSelectLokasi.push({"id":d.id,"text":d.nama});
    //   });
    // });

    // this.GbmOrganisasiService.getAllByType('GUDANG').subscribe(x => {
    //   this.dataSelectDariGudang = [];
    //   x.forEach(d => {
    //     this.dataSelectDariGudang.push({ "id": d.id, "text": d.nama });
    //   });
    // });
    this.GbmOrganisasiService.getAllGudangCentralAndVirtual().subscribe(x => {
      this.dataSelectKeGudang = [];
      x.forEach(d => {
        this.dataSelectKeGudang.push({ "id": d.id, "text": d.nama });
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

    if (this.entryForm.controls['dari_gudang_id'].value['id'] == this.entryForm.controls['ke_gudang_id'].value['id']) {
      swal({
        title: 'Perhatian!',
        text: 'Gudang Tidak boleh sama!',
        type: 'warning',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      })
      return;
    }


    let frmData = this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    
    this.invPindahGudangService.create(frmData).subscribe(data => {
      // console.log(data);
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

  tampilItemPermintaan() {
    let permintaan_id = this.entryForm.get('inv_permintaan_pindah_gudang_id').value['id']
    this.invPermintaanPindahGudangService.getById(permintaan_id).subscribe(res => {
      console.log(res);
      if (!res) {
        this.details.clear();
        return

      }

      let dtl = [];
      // let selectDariGudang;
      //    this.dataSelectDariGudang.forEach(d => {
      //   if (res['data']['dari_gudang_id'] == d.id) {
      //     selectDariGudang = { "id": d.id, "text": d.nama }
      //   }
      // });
      // this.entryForm.get('dari_gudang_id').patchValue(selectDariGudang);
      this.tipe = res['data']['tipe'];
      let selectKeGudang;
      this.dataSelectKeGudang.forEach(d => {
        if (res['data']['dari_gudang_id'] == d.id) {
          selectKeGudang = { "id": d.id, "text": d.nama }
        }
        this.entryForm.get('ke_gudang_id').patchValue(selectKeGudang);
      });
      dtl = res['data']['detail'];
      this.details.clear();
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
