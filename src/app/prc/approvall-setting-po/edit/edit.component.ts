import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";

import { PrcApprovallSettingPo } from 'src/app/shared/models/prc_approvall_setting_po.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { PrcApprovallSettingPoService } from 'src/app/shared/services/prc_approvall_setting_po.service';
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
  PrcApprovallSettingPo:PrcApprovallSettingPo;
  dbName;
  pathName;
  PATH_URL;

  dataSelectLokasi;
  dataSelectKode;
  dataSelectKaryawan;

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private prcApprovallSettingPoService: PrcApprovallSettingPoService,
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
        min_amount: new FormControl(0, Validators.required),
      max_amount: new FormControl(0, Validators.required),

      });




  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {

    // this.entryForm.controls['awal'].patchValue(this.PrcApprovallSettingPo.awal);
    // this.entryForm.controls['akhir'].patchValue(this.PrcApprovallSettingPo.akhir);

    // this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.PrcApprovallSettingPo.tanggal)));


  }
  public options: any;


  private loadSelect2(): void {

    let selectedLokasi;
    this.GbmOrganisasiService.getAllByType("UNIT").subscribe(x=>{
      this.dataSelectLokasi=[];
      x.forEach(d => {
        this.dataSelectLokasi.push({"id":d.id,"text":d.nama});
        if (this.PrcApprovallSettingPo.lokasi_id == d.id) {
          selectedLokasi = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectedLokasi);
    });

    let selectedKaryawan;
    this.KaryawanService.getAll().subscribe(x=>{
      this.dataSelectKaryawan=[];
      x['data'].forEach(d => {
        this.dataSelectKaryawan.push({"id":d.id,"text":d.nama});
        if (this.PrcApprovallSettingPo.karyawan_id == d.id) {
          selectedKaryawan = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('karyawan_id').patchValue(selectedKaryawan);
    });

    this.dataSelectKode = [
      { id: 'PO1', text: 'PO1' },
      { id: 'PO2', text: 'PO2' },
      { id: 'PO3', text: 'PO3' },
      { id: 'PO4', text: 'PO4' },
      { id: 'PO5', text: 'PO5' },
      { id: 'PO6', text: 'PO6' },
    ];

    let selectedKode;
    this.dataSelectKode.forEach(d => {
      if (this.PrcApprovallSettingPo.kode == d.id) {
        selectedKode = { "id": d.id, "text": d.text }
      }
    });
    this.entryForm.get('kode_id').patchValue(selectedKode);
    this.entryForm.get('is_finish').patchValue(this.PrcApprovallSettingPo.is_finish==true?1:0);
    this.entryForm.get('min_amount').patchValue(this.PrcApprovallSettingPo.min_amount);
    this.entryForm.get('max_amount').patchValue(this.PrcApprovallSettingPo.max_amount);


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


    this.prcApprovallSettingPoService.update(this.PrcApprovallSettingPo.id,frmData).subscribe(data=>{
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
