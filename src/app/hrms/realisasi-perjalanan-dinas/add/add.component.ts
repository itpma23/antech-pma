import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { HrmsPerjalananDinasService } from 'src/app/shared/services/hrms_perjalanan_dinas.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { HrmsRealisasiPerjalananDinasService } from 'src/app/shared/services/hrms_realisasi_perjalanan_dinas.service';
import { InvPermintaanBarangService } from 'src/app/shared/services/inv_permintaan_barang.service';
import { HrmsKomponenPerjalananService } from 'src/app/shared/services/hrms_komponen_perjalanan.service';
import { HrmsRealisasiPerjalananDinas } from 'src/app/shared/models/hrms_realisasi_perjalanan_dinas.model';

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

  hrmsRealisasiPerjalananDinas: HrmsRealisasiPerjalananDinas;
  dataSelectLokasi;
  dataSelectDariLokasi;
  dataSelectKeLokasi;
  dataSelectKaryawan;
  dataSelectKomponen;
  dataSelectPermintaan;
  dataSelectPerjalananDinas;

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private invPermintaanBarangService: InvPermintaanBarangService,
    private hrmsPerjalananDinasService: HrmsPerjalananDinasService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private karyawanService: KaryawanService,
    private hrmsRealisasiPerjalananDinasService: HrmsRealisasiPerjalananDinasService,
    private hrmsKomponenPerjalananService: HrmsKomponenPerjalananService,

    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();
    this.entryForm = this.builder.group({

      no_transaksi: new FormControl('(AutoNumber)'),
      tanggal: new FormControl(toDate, Validators.required),
      catatan: new FormControl(''),
      lokasi_id: new FormControl([], Validators.required),
      perjalanan_dinas_id: new FormControl([],),
      dari_lokasi_id: new FormControl([], ),
      ke_lokasi_id: new FormControl([],),
      karyawan_id: new FormControl([], Validators.required),

      details: this.builder.array([])
    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }
  public options: any;

  private loadSelect2(): void {

    // this.gbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
    //   this.dataSelectLokasi = [];
    //   x.forEach(d => {
    //     this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
    //   });
    //   this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {
        
    //     let org_id = x.id;
    //     this.invPermintaanBarangService.getAllBelumPemakaianByLokasi(org_id).subscribe(x => {
    //       this.dataSelectPermintaan = [];
    //       let i = x['data'];
    //       i.forEach(d => {
    //         this.dataSelectPermintaan.push({ "id": d.id, "text": d.no_transaksi });
    //       });
    //     });

    //     this.entryForm.controls['inv_permintaan_id'].valueChanges.subscribe(x => {
    //       // this.tampilItemPermintaan();
    //     });

    //   });
    // });

    // this.hrmsPerjalananDinasService.getAll().subscribe(x => {
    //   this.dataSelectPerjalananDinas = [];
    //   let i = x['data'];
    //   i.forEach(d => {
    //     this.dataSelectPerjalananDinas.push({ "id": d.id, "text": d.no_transaksi });
    //   });
    // });


    this.gbmOrganisasiService.getAllByType('UNIT').subscribe(x=>{
      this.dataSelectLokasi=[];
      x.forEach(d => {
        this.dataSelectLokasi.push({"id":d.id,"text":d.nama});
      });
    });

    this.karyawanService.getAll().subscribe(x => {
      this.dataSelectKaryawan = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama });
      });
    });

    this.hrmsKomponenPerjalananService.getAll().subscribe(x => {
      this.dataSelectKomponen = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectKomponen.push({ "id": d.id, "text": d.nama });
      });
    });

    this.hrmsPerjalananDinasService.getAll().subscribe(x => {
      this.dataSelectPerjalananDinas = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectPerjalananDinas.push({ "id": d.id, "text": d.no_transaksi });
      });
      this.entryForm.controls['perjalanan_dinas_id'].valueChanges.subscribe(x => {
        this.tampilItemPermintaan();
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
    this.hrmsRealisasiPerjalananDinasService.create(frmData).subscribe(data => {
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
      this.details.push(this.builder.group({
        komponen_perjalanan_dinas_id: new FormControl([],Validators.required),
        nilai: new FormControl('1', Validators.required),
        ket: new FormControl('', Validators.required),
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

  addBlokPermintaan(  komponen_perjalanan_dinas_id, nilai, ket) {

    
    let selectKomponen=[];
    this.dataSelectKomponen.forEach(a => {
      if (komponen_perjalanan_dinas_id == a.id) {
        selectKomponen = a;
      }
    });

    let fb = this.builder.group({
      komponen_perjalanan_dinas_id: new FormControl(selectKomponen),
      nilai: new FormControl(nilai),
      ket: new FormControl(ket),

    });

    this.details.push(fb);
  }

  tampilItemPermintaan() {

    let perjalanan_dinas_id = this.entryForm.get('perjalanan_dinas_id').value['id']
    this.hrmsPerjalananDinasService.getById(perjalanan_dinas_id).subscribe(res => {
      this.details.clear();
      let dtl = [];
      dtl = res['data']['detail'];
      for (let index = 0; index < dtl.length; index++) {
        const d = dtl[index];
        this.addBlokPermintaan(d['komponen_perjalanan_dinas_id'], d['nilai'], d['ket']);
      }

      let selectLokasi:any=[];
      this.dataSelectLokasi=[];
      this.gbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
        this.dataSelectLokasi = [];
        x.forEach(d => {
          this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
          if (res['data']['lokasi_id'] == d.id) {
            console.log(d);
            selectLokasi = { "id": d.id, "text": d.nama }
          }
        });
        this.entryForm.get('lokasi_id').patchValue(selectLokasi);
      });

      let selectDariLokasi:any=[];
      this.dataSelectDariLokasi=[];
      this.gbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
        this.dataSelectDariLokasi = [];
        x.forEach(d => {
          this.dataSelectDariLokasi.push({ "id": d.id, "text": d.nama });
          if (res['data']['dari_lokasi_id'] == d.id) {
            console.log(d);
            selectDariLokasi = { "id": d.id, "text": d.nama }
          }
        });
        this.entryForm.get('dari_lokasi_id').patchValue(selectDariLokasi);
      });

      let selectKeLokasi:any=[];
      this.dataSelectKeLokasi=[];
      this.gbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
        this.dataSelectKeLokasi = [];
        x.forEach(d => {
          this.dataSelectKeLokasi.push({ "id": d.id, "text": d.nama });
          if (res['data']['ke_lokasi_id'] == d.id) {
            console.log(d);
            selectKeLokasi = { "id": d.id, "text": d.nama }
          }
        });
        this.entryForm.get('ke_lokasi_id').patchValue(selectKeLokasi);
      });
      

      let selectKaryawan;
      this.karyawanService.getAll().subscribe(x => {
        this.dataSelectKaryawan = [];
        x['data'].forEach(d => {
          this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama });
          if (res['data']['karyawan_id'] == d.id) {
            selectKaryawan = { "id": d.id, "text": d.nama }
          }
        });
        this.entryForm.get('karyawan_id').patchValue(selectKaryawan);
      });

     

      this.entryForm.controls['catatan'].patchValue(res['data']['catatan']);

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
