import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";

import { PrcApprovallSetting } from 'src/app/shared/models/prc_approvall_setting.model';
import { PksTankiService } from 'src/app/shared/services/pks_tanki.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { PrcApprovallSettingService } from 'src/app/shared/services/prc_approvall_setting.service';
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
  PrcApprovallSetting:PrcApprovallSetting;
  dbName;
  pathName;
  PATH_URL;

  dataSelectLokasi;
  dataSelectKode;
  dataSelectKaryawan;

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private PrcApprovallSettingService: PrcApprovallSettingService,
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
        is_ready_po: new FormControl(0, Validators.required),

      });




  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {

    // this.entryForm.controls['awal'].patchValue(this.PrcApprovallSetting.awal);
    // this.entryForm.controls['akhir'].patchValue(this.PrcApprovallSetting.akhir);

    // this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.PrcApprovallSetting.tanggal)));


  }
  public options: any;


  private loadSelect2(): void {

    let selectedLokasi;
    this.GbmOrganisasiService.getAllByType("UNIT").subscribe(x=>{
      this.dataSelectLokasi=[];
      x.forEach(d => {
        this.dataSelectLokasi.push({"id":d.id,"text":d.nama});
        if (this.PrcApprovallSetting.lokasi_id == d.id) {
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
        if (this.PrcApprovallSetting.karyawan_id == d.id) {
          selectedKaryawan = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('karyawan_id').patchValue(selectedKaryawan);
    });

    this.dataSelectKode = [
      { id: 'PP1', text: 'PP1' },
      { id: 'PP2', text: 'PP2' },
      { id: 'PP3', text: 'PP3' },
      { id: 'PP4', text: 'PP4' },
      { id: 'PP5', text: 'PP5' },
      { id: 'PP6', text: 'PP6' },
    ];
    let selectedKode;
    this.dataSelectKode.forEach(d => {
      if (this.PrcApprovallSetting.kode == d.id) {
        selectedKode = { "id": d.id, "text": d.text }
      }
    });
    this.entryForm.get('kode_id').patchValue(selectedKode);
    this.entryForm.get('is_ready_po').patchValue(this.PrcApprovallSetting.is_ready_po==true?1:0);


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


    this.PrcApprovallSettingService.update(this.PrcApprovallSetting.id,frmData).subscribe(data=>{
      console.log(data);
      if( data['status']=='OK'){
        console.log('ok');
        this.event.emit('OK');
        this.bsModalRef.hide();
      }
    });
  }

  updatePhoto(){
    let frmData=new FormData();
    frmData.append("userfile", this.entryForm.get('img').value);
    this.PrcApprovallSettingService.updatePhoto(this.PrcApprovallSetting.id,frmData).subscribe(data=>{
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

    // console.log(this.PrcApprovallSetting);
    // this.entryForm = this.builder.group({
    //   nip: new FormControl(this.PrcApprovallSetting.nip,[Validators.required]),
    //   nama: new FormControl(this.PrcApprovallSetting.nama, [Validators.required]),
    //   jenis_kelamin: new FormControl(this.PrcApprovallSetting.jenis_kelamin, [Validators.required]),
    //   tgl_lahir:   new FormControl(new Date(Date.parse(this.PrcApprovallSetting.tgl_lahir)), Validators.required),
    //   tempat_lahir: new FormControl(this.PrcApprovallSetting.tempat_lahir, []),
    //   alamat: new FormControl(this.PrcApprovallSetting.alamat, []),
    //   username: new FormControl(this.PrcApprovallSetting.username, []),
    //   password: new FormControl(this.PrcApprovallSetting.password, []),
    // });


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
