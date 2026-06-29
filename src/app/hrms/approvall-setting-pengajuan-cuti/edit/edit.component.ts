import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";

import { HrmsApprovallSettingPengajuanCuti } from 'src/app/shared/models/hrms_approvall_setting_pengajuan_cuti.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { HrmsApprovallSettingPengajuanCutiService } from 'src/app/shared/services/hrms_approvall_setting_pengajuan_cuti.service';
import { formatDate } from '@angular/common';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SERVER_PATH_URL } from 'src/app/app.constants';

declare var swal: any;

@Component({
  moduleId: module.id,
  selector: 'edit-cmp',
  styleUrls: ['edit.component.css'],
  templateUrl: 'edit.component.html'
})

export class EditComponent implements OnInit,AfterViewInit{
  isFormSubmitted=false;
  isChangePhoto=false;
	datepickerConfig = {
		dateInputFormat: 'DD-MM-YYYY',
		containerClass: 'theme-red'
	}
  entryForm: FormGroup;
  event: EventEmitter<any>=new EventEmitter();
  HrmsApprovallSettingPengajuanCuti:HrmsApprovallSettingPengajuanCuti;
  dbName;
  pathName;
  PATH_URL;

  dataSelectLokasi;
  dataSelectKode;
  dataSelectKaryawan;

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private hrmsApprovallSettingPengajuanCutiService: HrmsApprovallSettingPengajuanCutiService,
    private authenticationService: AuthenticationService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private KaryawanService: KaryawanService,
    ) {
      this.dbName= this.authenticationService.getUserDB();
      this.pathName= this.authenticationService.getUserPath();
      this.PATH_URL=SERVER_PATH_URL;

      let toDate: Date = new Date();

      this.entryForm = this.builder.group({

        // tanggal: new FormControl(toDate, Validators.required),

        lokasi_id: new FormControl([], Validators.required),
        kode_id: new FormControl([], Validators.required),
        karyawan_id: new FormControl([], Validators.required),
        is_finish: new FormControl(0, Validators.required),
        // min_amount: new FormControl(0, Validators.required),
        // max_amount: new FormControl(0, Validators.required),

      });




  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {

    // this.entryForm.controls['awal'].patchValue(this.HrmsApprovallSettingPengajuanCuti.awal);
    // this.entryForm.controls['akhir'].patchValue(this.HrmsApprovallSettingPengajuanCuti.akhir);

    // this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.HrmsApprovallSettingPengajuanCuti.tanggal)));


  }
  public options: any;


  private loadSelect2(): void {

    let selectedLokasi;
    this.GbmOrganisasiService.getAllByType("SUBBAGIAN").subscribe(x=>{
      this.dataSelectLokasi=[];
      x.forEach(d => {
        this.dataSelectLokasi.push({"id":d.id,"text":d.nama});
        if (this.HrmsApprovallSettingPengajuanCuti.lokasi_id == d.id) {
          selectedLokasi = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectedLokasi);
    });

    let selectedKaryawan;
    this.KaryawanService.getAll().subscribe(x=>{
      this.dataSelectKaryawan=[];
      x['data'].forEach(d => {
        this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama +"("+ d.lokasi_tugas_nama+') - '+ d.sub_bagian_nama });
        if (this.HrmsApprovallSettingPengajuanCuti.karyawan_id == d.id) {
          selectedKaryawan = { "id": d.id, "text": d.nama +"("+ d.lokasi_tugas_nama+') - '+ d.sub_bagian_nama }
        }
      });
      this.entryForm.get('karyawan_id').patchValue(selectedKaryawan);
    });

    this.dataSelectKode = [
      { id: 'PC1', text: 'PC1' },
      { id: 'PC2', text: 'PC2' },
      { id: 'PC3', text: 'PC3' },
      { id: 'PC4', text: 'PC4' },
      { id: 'PC5', text: 'PC5' },
      { id: 'PC6', text: 'PC6' },
    ];

    let selectedKode;
    this.dataSelectKode.forEach(d => {
      if (this.HrmsApprovallSettingPengajuanCuti.kode == d.id) {
        selectedKode = { "id": d.id, "text": d.text }
      }
    });
    this.entryForm.get('kode_id').patchValue(selectedKode);
    this.entryForm.get('is_finish').patchValue(this.HrmsApprovallSettingPengajuanCuti.is_finish==true?1:0);
    // this.entryForm.get('min_amount').patchValue(this.HrmsApprovallSettingPengajuanCuti.min_amount);
    // this.entryForm.get('max_amount').patchValue(this.HrmsApprovallSettingPengajuanCuti.max_amount);


  }


  onSubmit(){
    console.log(this.entryForm.value);

    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }


    let frmData = this.entryForm.value;
    // frmData['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');


    this.hrmsApprovallSettingPengajuanCutiService.update(this.HrmsApprovallSettingPengajuanCuti.id,frmData).subscribe(data=>{
      if( data['status']=='OK'){
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
      }else{
        swal({
          title: 'Perhatian!',
          text: 'Proses Edit Gagal' ,
          type: 'warning',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
      }
    });
  }


  onClose(){
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();


  }
  valueChange($event){
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
    this.isChangePhoto=true;
    console.log(this.isChangePhoto);
 }
}
