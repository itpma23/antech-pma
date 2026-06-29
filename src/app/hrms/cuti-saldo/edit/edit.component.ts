import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { HrmsCutiSaldoService } from 'src/app/shared/services/hrms_cuti_saldo.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { HrmsCutiSaldo } from 'src/app/shared/models/hrms_cuti_saldo.model';
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
  hrmsCutiSaldo: HrmsCutiSaldo;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private hrmsCutiSaldoService: HrmsCutiSaldoService,
    private karyawanService: KaryawanService,
    private translate: TranslateService,
    private GbmOrganisasiService: GbmOrganisasiService,

  ) {
    let toDate: Date = new Date();
    this.entryForm = this.builder.group({
      lokasi_id: new FormControl([], Validators.required),
      karyawan_id: new FormControl([], Validators.required),
      jumlah: new FormControl('', Validators.required),
      ket: new FormControl('', Validators.required),
      tanggal: new FormControl( Validators.required),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    console.log(this.hrmsCutiSaldo);
    
    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.hrmsCutiSaldo.tanggal)));
    this.entryForm.get('jumlah').patchValue(this.hrmsCutiSaldo.jumlah);
    this.entryForm.get('ket').patchValue(this.hrmsCutiSaldo.ket);

  }


  private loadSelect2(): void {
    let selectedKaryawan;
    this.karyawanService.getById(this.hrmsCutiSaldo.karyawan_id).subscribe(x => {
      this.dataSelectKaryawan = [];
      let d = x['data'];
        this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama + ' - '+ d.nip  });
        if (this.hrmsCutiSaldo.karyawan_id == d.id) {
          selectedKaryawan = { "id": d.id, "text":d.nama + ' - '+ d.nip  }
        }
      this.entryForm.get('karyawan_id').patchValue(selectedKaryawan);
    });


    let selectedMill;
    this.GbmOrganisasiService.getById(this.hrmsCutiSaldo.lokasi_id).subscribe(x => {
      this.dataSelectLokasi = [];
      let d=x['data']
      // x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
        if (this.hrmsCutiSaldo.lokasi_id == d.id) {
          selectedMill = { "id": d.id, "text": d.nama };
        }
      // });
      this.entryForm.get('lokasi_id').patchValue(selectedMill);
    });


  

    // this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {
    //   let lok_id = x.id;
    //   this.karyawanService.getByLokasiTugas(lok_id).subscribe(x => {
    //     this.dataSelectKaryawan = [];
    //     console.log(x);
    //     let kary = x['data'];
    //     kary.forEach(d => {
    //       if (d.lokasi_tugas_id == lok_id) {
    //         this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama + " - " + d.nip + " - " + d.sub_bagian_nama });
    //       }
    //       this.entryForm.get('karyawan_id').patchValue(selectedKaryawan);
    //     });
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
    console.log(frmData);
    this.hrmsCutiSaldoService.update(this.hrmsCutiSaldo.karyawan_id, frmData).subscribe(data => {
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
  changeSelected(e){
    console.log(e.target.checked);
    }
  valueChange($event) {
    console.log($event);
  }
}
