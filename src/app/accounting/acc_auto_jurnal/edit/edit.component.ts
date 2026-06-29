import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";
import { AccAutoJurnalService } from 'src/app/shared/services/acc_auto_jurnal.service';
import { AccAutoJurnal } from 'src/app/shared/models/acc_auto_jurnal.model';
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
import { formatDate } from '@angular/common';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { isNullOrUndefined } from 'util';

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
  categories: any[] = [];
  event: EventEmitter<any>=new EventEmitter();
  AccAutoJurnal:AccAutoJurnal;
  dbName;
  pathName;
  PATH_URL;

  public dataSelectAkun: any[] = [];

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private AccAutoJurnalService:AccAutoJurnalService,
    private authenticationService: AuthenticationService,
    private AccAkunService:AccAkunService,
    ) {
      this.dbName= this.authenticationService.getUserDB();
      this.pathName= this.authenticationService.getUserPath();
      this.PATH_URL=SERVER_PATH_URL;

      this.entryForm = this.builder.group({
        acc_akun_id: new FormControl([]),
        acc_akun_id_debet: new FormControl([]),
        acc_akun_id_kredit: new FormControl([]),
        kode: new FormControl(null, Validators.required),
        ket: new FormControl(null, Validators.required),
      });




  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {

     this.entryForm.controls['kode'].patchValue(this.AccAutoJurnal.kode);
     this.entryForm.controls['ket'].patchValue(this.AccAutoJurnal.ket);


  }
  private loadSelect2(): void {
    let selectAkun=[];
    let selectAkunDebet=[];
    let selectAkunKredit=[];
    this.AccAkunService.getAllDetail().subscribe(x=>{
      console.log(x);
      this.dataSelectAkun=[];
      x['data'].forEach(d => {
        this.dataSelectAkun.push({"id":d.id,"text":d.kode+ ' - '+ d.nama});
        if(d.id==this.AccAutoJurnal.acc_akun_id){
          selectAkun=d;
        }
        if(d.id==this.AccAutoJurnal.acc_akun_id_debet){
          selectAkunDebet=d;
        }
        if(d.id==this.AccAutoJurnal.acc_akun_id_kredit){
          selectAkunKredit=d;
        }
      });
      this.entryForm.controls['acc_akun_id'].patchValue(selectAkun);
      this.entryForm.controls['acc_akun_id_debet'].patchValue(selectAkunDebet);
      this.entryForm.controls['acc_akun_id_kredit'].patchValue(selectAkunKredit);
    });
  }

  onSubmit(){
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }
    let akun_id;
    if (isNullOrUndefined(this.entryForm.get('acc_akun_id').value) != true) {
      if (isNullOrUndefined(this.entryForm.get('acc_akun_id').value!.id)) {
        akun_id = null
      } else {
        akun_id = this.entryForm.get('acc_akun_id').value.id;
      }

    } else {
      akun_id = null
    }

    let akun_id_debet;
    if (isNullOrUndefined(this.entryForm.get('acc_akun_id_debet').value) != true) {
      if (isNullOrUndefined(this.entryForm.get('acc_akun_id_debet').value!.id)) {
        akun_id_debet = null
      } else {
        akun_id_debet = this.entryForm.get('acc_akun_id_debet').value.id;
      }

    } else {
      akun_id_debet = null
    }
    let akun_id_kredit;
    if (isNullOrUndefined(this.entryForm.get('acc_akun_id_kredit').value) != true) {
      if (isNullOrUndefined(this.entryForm.get('acc_akun_id_kredit').value!.id)) {
        akun_id_kredit = null
      } else {
        akun_id_kredit = this.entryForm.get('acc_akun_id_kredit').value.id;
      }

    } else {
      akun_id_kredit = null
    }
    let dataSubmit :AccAutoJurnal = {
      'acc_akun_id': akun_id,
      'acc_akun_id_debet': akun_id_debet,
      'acc_akun_id_kredit': akun_id_kredit,
      'kode': this.entryForm.get('kode').value,
      'ket': this.entryForm.get('ket').value,
    };

    this.AccAutoJurnalService.update(this.AccAutoJurnal.id,dataSubmit).subscribe(data=>{
      console.log(data);
      if( data['status']=='OK'){
        console.log('ok');
        this.event.emit('OK');
        this.bsModalRef.hide();
      }
    });
  }


  onClose(){
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();
    // console.log(this.AccAutoJurnal);
    // this.entryForm = this.builder.group({
    //   nip: new FormControl(this.AccAutoJurnal.nip,[Validators.required]),
    //   nama: new FormControl(this.AccAutoJurnal.nama, [Validators.required]),
    //   jenis_kelamin: new FormControl(this.AccAutoJurnal.jenis_kelamin, [Validators.required]),
    //   tgl_lahir:   new FormControl(new Date(Date.parse(this.AccAutoJurnal.tgl_lahir)), Validators.required),
    //   tempat_lahir: new FormControl(this.AccAutoJurnal.tempat_lahir, []),
    //   alamat: new FormControl(this.AccAutoJurnal.alamat, []),
    //   username: new FormControl(this.AccAutoJurnal.username, []),
    //   password: new FormControl(this.AccAutoJurnal.password, []),
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
