import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { HrmsKaryawanGajiService } from 'src/app/shared/services/hrms_karyawan_gaji.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { HrmsKomponenGajiService } from 'src/app/shared/services/hrms_komponen_gaji.service';
import { HrmsKaryawanGaji } from 'src/app/shared/models/hrms_karyawan_gaji.model';
export class InvoiceItem {
  akun = '';
  nilai = 0;

}
declare var swal: any;
declare var $: any;
interface Tipe {
  value: string;
  viewValue: string;
}
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
  public dataSelectLokasi: any[] = [];
  dataSelectKomponenGaji;
  dataSelectKaryawan;
  karyawanGaji: HrmsKaryawanGaji;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private hrmsKaryawanGajiService: HrmsKaryawanGajiService,
    private karyawanService: KaryawanService,
    private translate: TranslateService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private hrmsKomponenGajiService: HrmsKomponenGajiService,

  ) {
    let toDate: Date = new Date();
    this.entryForm = this.builder.group({
      lokasi_id: new FormControl([], Validators.required),
      karyawan_id: new FormControl([], Validators.required),
      gapok: new FormControl('0', Validators.required),
      is_catu: new FormControl(false, Validators.required),
      tanggal_efektif_catu: new FormControl(toDate, Validators.required),
      // pph21: new FormControl('0', []),
      gapok_bpjs: new FormControl('0', ),
      gapok_bpjs_kes: new FormControl('0', ),
      pot_bpjs_jht: new FormControl(0, ),
      pot_bpjs_jp: new FormControl(0, ),
      pot_bpjs_kes: new FormControl(0, ),
      invoiceItems: this.builder.array([]),
      // subTotal:[{value: 0, disabled: true}],


    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    console.log(this.karyawanGaji);
    let tanggal = new Date(Date.parse(this.karyawanGaji['tanggal_efektif_catu'] ));
    this.entryForm.get('tanggal_efektif_catu').patchValue(tanggal);
    this.entryForm.get('gapok').patchValue(this.karyawanGaji.gapok);
    this.entryForm.get('is_catu').patchValue((this.karyawanGaji.is_catu==1)?true:false);
    this.entryForm.get('gapok_bpjs').patchValue(this.karyawanGaji.gapok_bpjs);
    this.entryForm.get('gapok_bpjs_kes').patchValue(this.karyawanGaji.gapok_bpjs_kes);
    this.entryForm.get('pot_bpjs_kes').patchValue(this.karyawanGaji.pot_bpjs_kes);
    this.entryForm.get('pot_bpjs_jht').patchValue(this.karyawanGaji.pot_bpjs_jht);
    this.entryForm.get('pot_bpjs_jp').patchValue(this.karyawanGaji.pot_bpjs_jp);

  }


  private loadSelect2(): void {
    let selectedKaryawan;


      this.hrmsKomponenGajiService.getAll().subscribe(x => {
      this.dataSelectKomponenGaji = [];
      let komp = x['data'];
      komp.forEach(d => {
        this.dataSelectKomponenGaji.push({ "id": d.id, "text": d.nama });
      });
      let dtl = [];
      dtl = this.karyawanGaji.detail;
      for (let index = 0; index < dtl.length; index++) {
        const d = dtl[index];
        let tanggal = new Date(Date.parse(d['tanggal_efektif'] ));
        this.addItem(d['tipe_gaji'], d['nilai'],tanggal);

      }

    });


    let selectedMill;
    this.GbmOrganisasiService.getById(this.karyawanGaji.lokasi_id).subscribe(x => {
      this.dataSelectLokasi = [];
      let d=x['data']
      // x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
        if (this.karyawanGaji.lokasi_id == d.id) {
          selectedMill = { "id": d.id, "text": d.nama };
        }
      // });
      this.entryForm.get('lokasi_id').patchValue(selectedMill);
    });


    this.karyawanService.getById(this.karyawanGaji.karyawan_id).subscribe(x => {
      this.dataSelectKaryawan = [];
      let d = x['data'];
        this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama + ' - '+ d.nip  });
        if (this.karyawanGaji.karyawan_id == d.id) {
          selectedKaryawan = { "id": d.id, "text":d.nama + ' - '+ d.nip  }
        }
      this.entryForm.get('karyawan_id').patchValue(selectedKaryawan);
    });

  }
  onSubmit() {
    console.log(this.entryForm.value);
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let frmData = this.entryForm.value;
    frmData['tanggal_efektif_catu']= formatDate(this.entryForm.get('tanggal_efektif_catu').value, "yyy-MM-dd", "en_US");
    this.entryForm.value.invoiceItems.forEach(element => {
      if (element.tanggal_efektif == '' || element.tanggal_efektif == null) {
        element.tanggal_efektif = null;
      } else {
        element.tanggal_efektif = formatDate(element.tanggal_efektif, "yyyy-MM-dd", 'en_US')
      }
    });
    console.log(frmData);
    this.hrmsKaryawanGajiService.update(this.karyawanGaji.karyawan_id, frmData).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Save!',
          text: 'Data has been Saved successfully.',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        this.event.emit('OK');
        this.bsModalRef.hide();
      }
    });
  }

  get invoiceItems(): FormArray {
    return this.entryForm.get('invoiceItems') as FormArray;
  };


  addItem(tipe_gaji = [], nilai = 0,tgl=new Date()) {
    // this.invoiceItems.push(this.builder.group(new InvoiceItem()));
    let selectedKomponenGaji=[];
    this.dataSelectKomponenGaji.forEach(a => {
      if (tipe_gaji == a.id) {
        selectedKomponenGaji = a;
      }

    });

    let fb = this.builder.group({
      komponenGaji: new FormControl(selectedKomponenGaji, []),
      nilai: new FormControl(nilai, []),
      tanggal_efektif: new FormControl(tgl, []),
    })


    this.invoiceItems.push(fb);
  }

  removeItem(item) {

    let i = this.invoiceItems.controls.indexOf(item);

    if (i != -1) {
      this.invoiceItems.controls.splice(i, 1);
      let items = this.entryForm.get('invoiceItems') as FormArray;
      let data = { invoiceItems: items };
      this.updateForm(data);
    }
  }
  updateForm(data) {
    const items = data.invoiceItems;
    let sub = 0;
    // for(let i of items){
    //   i.total = i.qty*i.cost;
    //   sub += i.total;
    // }
    // this.entryForm.value.subTotal = sub;
    // const tax = sub * (this.entryForm.value.taxPercent / 100);
    // this.entryForm.value.tax = tax;
    // this.entryForm.value.grantTotal = sub + tax;
  }
  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();


  }
  changeSelected(e){
    console.log(e.target.checked);
    }
  valueChange($event) {
    console.log($event);
  }
}
