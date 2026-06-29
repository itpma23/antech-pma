import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { HrmsCatuBeras } from 'src/app/shared/models/hrms_catu_beras.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { HrmsCatuBerasService } from 'src/app/shared/services/hrms_catu_beras.service';
declare var $: any;
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'edit-cmp',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.css'],
})

export class EditComponent implements OnInit, AfterViewInit {
  isFormSubmitted = false;
  isChangePhoto = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();
  public dataSelectLokasi: any[] = [];
  public dataSelectTipe: any[] = [];

  hrmsCatuBeras: HrmsCatuBeras;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private hrmsCatuBerasService: HrmsCatuBerasService,



  ) {

    let toDate: Date = new Date();
    this.entryForm = this.builder.group({

      status_karyawan:  new FormControl([],Validators.required),
      jumlah_kg: new FormControl(0, Validators.required),
      jumlah_rupiah: new FormControl(0, Validators.required),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    console.log(this.hrmsCatuBeras);

    // this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.hrmsCatuBeras.tanggal)));
    this.entryForm.controls['jumlah_kg'].patchValue(this.hrmsCatuBeras.jumlah_kg);
    this.entryForm.controls['jumlah_rupiah'].patchValue(this.hrmsCatuBeras.jumlah_rupiah);


  }
  private loadSelect2(): void {




    this.dataSelectTipe = [
      { id: 'TK/0', text: 'TK/0' },
      { id: 'TK/1', text: 'TK/1' },
      { id: 'TK/2', text: 'TK/2' },
      { id: 'TK/3', text: 'TK/3' },
      { id: 'K/0', text: 'K/0' },
      { id: 'K/1', text: 'K/1' },
      { id: 'K/2', text: 'K/2' },
      { id: 'K/3', text: 'K/3' },
    ];
      let selectTipe;
    this.dataSelectTipe.forEach(a => {
      if (a.id == this.hrmsCatuBeras.status_karyawan) {
        selectTipe = a;
      }
    });
    this.entryForm.controls['status_karyawan'].patchValue(selectTipe);


  }

  onSubmit() {
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    // let frmData=new FormData();
    // if (this.entryForm.invalid) {
    //   return;
    // }
    let dataSubmit = this.entryForm.value;
    // dataSubmit['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');
    console.log(this.entryForm.value);

    console.log(dataSubmit);
    this.hrmsCatuBerasService.update(this.hrmsCatuBeras.id, dataSubmit).subscribe(data => {

      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Simpan berhasil',
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



  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {

    this.loadSelect2();

  }
  valueChange($event) {
    console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.entryForm.patchValue({
      img: file
    });
    this.entryForm.get('img').updateValueAndValidity();
    this.isChangePhoto = true;
    console.log(this.isChangePhoto);
  }
}
