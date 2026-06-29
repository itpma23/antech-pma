import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { HrmsKaryawanGaji } from 'src/app/shared/models/hrms_karyawan_gaji.model';
import { HrmsKaryawanGajiService } from 'src/app/shared/services/hrms_karyawan_gaji.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { HrmsKomponenGaji } from 'src/app/shared/models/hrms_komponen_gaji.model';
import { HrmsKomponenGajiService } from 'src/app/shared/services/hrms_komponen_gaji.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
export class InvoiceItem {
  akun = '';
  nilai = 0;

}
declare var $: any;
declare var swal: any;
interface Tipe {
  value: string;
  viewValue: string;
}
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
  public dataSelectLokasi: any[] = [];
  dataSelectKomponenGaji;
  dataSelectKaryawan;
  isCatu;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private hrmsKaryawanGajiService: HrmsKaryawanGajiService,
    private karyawanService: KaryawanService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private translate: TranslateService,
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

      pot_bpjs_jht: new FormControl(2, ),
      pot_bpjs_jp: new FormControl(1, ),
      pot_bpjs_kes: new FormControl(1, ),
      // premi_non_jabotabek: new FormControl('0',),
      invoiceItems: this.builder.array([]),
      // subTotal:[{value: 0, disabled: true}],


    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }
  public dataSelect: any[] = [];
  public options: any;

  private loadSelect2(): void {

    this.GbmOrganisasiService.getAllByType("UNIT").subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
    });

    this.hrmsKomponenGajiService.getAll().subscribe(x => {
      this.dataSelectKomponenGaji = [];
      let komp = x['data'];
      komp.forEach(d => {
        this.dataSelectKomponenGaji.push({ "id": d.id, "text": d.nama });
      });
    });

    this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {
      let lok_id = x.id;
      this.karyawanService.getByLokasiTugas(lok_id).subscribe(x => {
        this.dataSelectKaryawan = [];
        console.log(x);
        let kary = x['data'];
        kary.forEach(d => {
          // beforeDataSelectKaryawan.push({ "id": d.id, "text": d.nama+" - "+d.nik_ktp+" - "+d.sub_bagian_nama });
          if (d.lokasi_tugas_id == lok_id) {
            this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama + " - " + d.nip + " - " + d.sub_bagian_nama });
          }
        });
      });
    });
    // this.karyawanService.getAll().subscribe(x => {
    //   this.dataSelectKaryawan = [];
    //   let peng = x['data'];
    //   peng.forEach(d => {
    //     this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama + ' - '+ d.nip });
    //   });
    // });

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
    this.hrmsKaryawanGajiService.create(frmData).subscribe(data => {
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

  addItem() {
    // this.invoiceItems.push(this.builder.group(new InvoiceItem()));

    this.invoiceItems.push(this.builder.group({
      komponenGaji: new FormControl([], []),
      nilai: new FormControl('', []),
      tanggal_efektif: new FormControl('', []),
    }));

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
  changeSelected(e) {
    console.log(e.target.checked);
  }
  valueChange($event) {


  }
}
