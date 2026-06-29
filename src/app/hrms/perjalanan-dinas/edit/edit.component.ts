import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate,formatNumber } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { HrmsPerjalananDinasService } from 'src/app/shared/services/hrms_perjalanan_dinas.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { HrmsPerjalananDinas } from 'src/app/shared/models/hrms_perjalanan_dinas.model';
import { HrmsKomponenPerjalananService } from 'src/app/shared/services/hrms_komponen_perjalanan.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';

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

  hrmsPerjalananDinas: HrmsPerjalananDinas;
  dataSelectLokasi;
  dataSelectKaryawan;
  dataSelectItem;

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private hrmsPerjalananDinasService: HrmsPerjalananDinasService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private hrmsKomponenPerjalananService: HrmsKomponenPerjalananService,
    private karyawanService: KaryawanService,

    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();
    let time: Date = new Date();

    this.entryForm = this.builder.group({
      tanggal: new FormControl(toDate, Validators.required),
      catatan: new FormControl(''),
      no_transaksi: new FormControl(''),
      lokasi_id: new FormControl([], Validators.required),
      dari_lokasi_id: new FormControl([],),
      ke_lokasi_id: new FormControl([],),
      karyawan_id: new FormControl([], Validators.required),


      details: this.builder.array([])


    });
  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.hrmsPerjalananDinas.tanggal)));
    this.entryForm.get('catatan').patchValue(this.hrmsPerjalananDinas.catatan);
    this.entryForm.get('no_transaksi').patchValue(this.hrmsPerjalananDinas.no_transaksi);


  }
  public options: any;

  private loadSelect2(): void {



    let selectLokasi;
    this.gbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
        if (this.hrmsPerjalananDinas.lokasi_id == d.id) {
          selectLokasi = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectLokasi);
    });

    let selectDariLokasi;
    this.gbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
        if (this.hrmsPerjalananDinas.dari_lokasi_id == d.id) {
          selectDariLokasi = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('dari_lokasi_id').patchValue(selectDariLokasi);
    });

    let selectKeLokasi;
    this.gbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
        if (this.hrmsPerjalananDinas.ke_lokasi_id == d.id) {
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
        if (this.hrmsPerjalananDinas.karyawan_id == d.id) {
          selectKaryawan = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('karyawan_id').patchValue(selectKaryawan);


    });



    this.hrmsKomponenPerjalananService.getAll().subscribe(x => {
      this.dataSelectItem = [];
      x['data'].forEach(d => {
        this.dataSelectItem.push({ "id": d.id, "text": d.nama });
      });

            let dtl = [];
            dtl = this.hrmsPerjalananDinas.detail;
            for (let index = 0; index < dtl.length; index++) {
              const d = dtl[index];
              this.addBlok(d['komponen_perjalanan_dinas_id'], d['nilai'], d['ket']);
            }
       
    });



  }
  onSubmit() {


    this.isFormSubmitted = true;

    if (this.entryForm.invalid) {
      return;
    }

    let frmData = this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    this.hrmsPerjalananDinasService.update(this.hrmsPerjalananDinas.id, frmData).subscribe(data => {
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
    this.details.push(this.builder.group({
      komponen_perjalanan_dinas_id: new FormControl([],Validators.required),
      nilai: new FormControl('1', Validators.required),
      ket: new FormControl('', Validators.required),
    }));
  }


  addBlok(komponen_perjalanan_dinas_id, nilai, ket) {

    this.dataSelectItem;

    let selectedItem = [];
    this.dataSelectItem.forEach(a => {
      if (komponen_perjalanan_dinas_id == a.id) {
        selectedItem = a;
      }
    });
 

    this.details.push(this.builder.group({
      komponen_perjalanan_dinas_id: new FormControl(selectedItem, Validators.required),
      nilai: new FormControl((nilai), Validators.required),
      ket: new FormControl(ket),
    }));

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
