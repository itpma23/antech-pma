import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { InvPermintaanBarangService } from 'src/app/shared/services/inv_permintaan_barang.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { AccKegiatanKelompokService } from 'src/app/shared/services/acc_kegiatan_kelompok.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmUomService } from 'src/app/shared/services/gbm_uom.service';
import { AccKegiatanService } from 'src/app/shared/services/acc_kegiatan.service';

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
  dataSelectLokasiTraksi;
  dataSelectGudang;
  dataSelectBlok;
  dataSelectMesin;
  dataSelectKegiatan;
  dataSelectKaryawan;
  dataSelectUom;
  dataSelectItem;
  dataSelectTipe;
  dataSelectTraksi;

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private invPermintaanBarangService: InvPermintaanBarangService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private accKegiatanService: AccKegiatanService,
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
      // nama_tanki: new FormControl(''),
      lokasi_id: new FormControl([], Validators.required),
      lokasi_afd_id: new FormControl([], ),
      lokasi_traksi_id: new FormControl([],),
      gudang_id: new FormControl([], Validators.required),
      karyawan_id: new FormControl([], Validators.required),
      tipe: new FormControl([], Validators.required),


      details: this.builder.array([])

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }
  public options: any;

  private loadSelect2(): void {

    this.GbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });

      this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {
        let gd_id = x.id;
        this.GbmOrganisasiService.getGudangByUnit(gd_id).subscribe(x => {
          console.log(x)
          this.dataSelectGudang = [];
          x.forEach(d => {
            this.dataSelectGudang.push({ "id": d.id, "text": d.nama });
          });
          this.entryForm.controls['gudang_id'].valueChanges.subscribe(x => {

          });
        });

        let afdst_id = x.id;
        this.GbmOrganisasiService.getAfdStByUnit(afdst_id).subscribe(x => {
          this.dataSelectLokasiAfd = [];
          console.log(x);
          x.forEach(d => {
            this.dataSelectLokasiAfd.push({ "id": d.id, "text": d.nama });
          });
          this.entryForm.controls['lokasi_afd_id'].valueChanges.subscribe(af=> {
            console.log(af)
            let afd_id=af.id;
            this.GbmOrganisasiService.getBlokByAfdeling(afd_id).subscribe(b => {
              this.dataSelectBlok = [];
              // console.log(b);
              b.forEach(d => {
                this.dataSelectBlok.push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
              });
            });

          });
        });

        let trk_parent_id = x.id;
        this.GbmOrganisasiService.getTraksiByUnit(trk_parent_id).subscribe(x => {
          this.dataSelectLokasiTraksi = [];
          x.forEach(d => {
            this.dataSelectLokasiTraksi.push({ "id": d.id, "text": d.nama });
          });
        });

      });

    });

    this.dataSelectTipe = [
      { id: 'TRAKSI', text: 'TRAKSI' },
      { id: 'UNIT', text: 'UNIT' },
      // { id: 'WORKSHOP', text: 'WORKSHOP' },
    ];
    this.entryForm.get('tipe').valueChanges.subscribe(x=> {
      if (x.id == 'TRAKSI') {
        this.entryForm.controls['lokasi_afd_id'].disable();
        this.entryForm.controls['lokasi_afd_id'].patchValue([]);
        this.entryForm.controls['lokasi_traksi_id'].enable();
        this.entryForm.controls['lokasi_traksi_id'].patchValue([]);

        this.details.controls.forEach(x=> {
          x.get('blok_id').disable();
          x.get('blok_id').patchValue([]);
          x.get('traksi_id').enable();
          x.get('traksi_id').patchValue([]);
        });
      }else if (x.id == 'UNIT'){
        this.entryForm.controls['lokasi_traksi_id'].disable();
        this.entryForm.controls['lokasi_traksi_id'].patchValue([]);
        this.entryForm.controls['lokasi_afd_id'].enable();
        this.entryForm.controls['lokasi_afd_id'].patchValue([]);

        this.details.controls.forEach(x=> {
          x.get('blok_id').enable();
          x.get('blok_id').patchValue([]);
          x.get('traksi_id').disable();
          x.get('traksi_id').patchValue([]);
        });
      }else{

      }
    });



    // this.GbmOrganisasiService.getAllByType('AFDELING_STASIUN').subscribe(x=>{
    //   this.dataSelectLokasiAfd=[];
    //   x.forEach(d => {
    //     this.dataSelectLokasiAfd.push({"id":d.id,"text":d.nama});
    //   });
    // });

    // this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x=>{
    //   this.dataSelectLokasi=[];
    //   x.forEach(d => {
    //     this.dataSelectLokasi.push({"id":d.id,"text":d.nama});
    //   });
    // });

    // this.GbmOrganisasiService.getAllByType('GUDANG').subscribe(x=>{
    //   this.dataSelectGudang=[];
    //   x.forEach(d => {
    //     this.dataSelectGudang.push({"id":d.id,"text":d.nama});
    //   });
    // });

    this.accKegiatanService.getAllbyTipe('BAHAN').subscribe(x => {
      this.dataSelectKegiatan = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama });
      });
    });

    this.karyawanService.getAll().subscribe(x => {
      this.dataSelectKaryawan = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama });
      });
    });



    this.invItemService.getAll().subscribe(x => {
      this.dataSelectItem = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectItem.push({ "id": d.id, "text": d.kode + ' - ' + d.nama + "(" + d.uom + ")" });
      });
    });


    this.invPermintaanBarangService.getTraksi().subscribe(x => {
      this.dataSelectTraksi = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectTraksi.push({ "id": d.id, "text": d.nama });
      });
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
    frmData['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');
  //  console.log(frmData);
    this.invPermintaanBarangService.create(frmData).subscribe(data => {
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
    if (this.entryForm.get('tipe').value.id == 'TRAKSI') {
      this.details.push(this.builder.group({
        qty: new FormControl('1', Validators.required),
        item_id: new FormControl({value:[]}),
        blok_id: new FormControl({value:[], disabled:'disabled'}),
        traksi_id: new FormControl({value:[]}),
        kegiatan_id: new FormControl({value:[]}),
        ket: new FormControl('', Validators.required),
      }));
    }else {
      this.details.push(this.builder.group({
        qty: new FormControl('1', Validators.required),
        item_id: new FormControl({value:[]}),
        blok_id: new FormControl({value:[]}),
        traksi_id: new FormControl({value:[], disabled:'disabled'}),
        kegiatan_id: new FormControl({value:[]}),
        ket: new FormControl('', Validators.required),
      }));
    }
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
