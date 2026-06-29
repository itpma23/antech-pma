import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { HrmsCutiSaldoService } from 'src/app/shared/services/hrms_cuti_saldo.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
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
    private hrmsCutiSaldoService: HrmsCutiSaldoService,
    private karyawanService: KaryawanService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private translate: TranslateService,

  ) {
    let toDate: Date = new Date();
    this.entryForm = this.builder.group({
      lokasi_id: new FormControl([], Validators.required),
      karyawan_id: new FormControl([], Validators.required),
      jumlah: new FormControl('0', Validators.required),
      ket: new FormControl('', Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      // pph21: new FormControl('0', []),
      // lembur_perjam: new FormControl('0', ),
      // premi_jabotabek: new FormControl('0', ),
      // premi_non_jabotabek: new FormControl('0',),


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


    this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {
      let lok_id = x.id;
      this.karyawanService.getByLokasiTugas(lok_id).subscribe(x => {
        this.dataSelectKaryawan = [];
        console.log(x);
        let kary = x['data'];
        kary.forEach(d => {
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
    frmData['tanggal']= formatDate(this.entryForm.get('tanggal').value, "yyy-MM-dd", "en_US");
    this.hrmsCutiSaldoService.create(frmData).subscribe(data => {
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
