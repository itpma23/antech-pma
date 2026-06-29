import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";
import { AccInterUnitService } from 'src/app/shared/services/acc_inter_unit.service';
import { AccInterUnit } from 'src/app/shared/models/acc_inter_unit.model';
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { formatDate } from '@angular/common';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SERVER_PATH_URL } from 'src/app/app.constants';

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
  AccInterUnit:AccInterUnit;
  dbName;
  pathName;
  PATH_URL;

  public dataSelectAkun: any[] = [];
  public dataSelectLokasi: any[] = [];
  public dataSelectLokasi2: any[] = [];

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private AccInterUnitService:AccInterUnitService,
    private authenticationService: AuthenticationService,
    private AccAkunService:AccAkunService,
    private GbmOrganisasiService:GbmOrganisasiService,
    ) {
      this.dbName= this.authenticationService.getUserDB();
      this.pathName= this.authenticationService.getUserPath();
      this.PATH_URL=SERVER_PATH_URL;

      this.entryForm = this.builder.group({
        lokasi_id: new FormControl([], Validators.required),
        lokasi_id_2: new FormControl([], Validators.required),
        acc_akun_id: new FormControl([], Validators.required),
        tipe: new FormControl('', Validators.required),
      });




  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {

     this.entryForm.controls['tipe'].patchValue(this.AccInterUnit.tipe);
    //  this.entryForm.controls['ket'].patchValue(this.AccInterUnit.ket);


  }
  private loadSelect2(): void {


    let selectLokasi;
    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
        if (this.AccInterUnit.lokasi_id == d.id) {
          selectLokasi = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectLokasi);
    });

    let selectLokasi2;
    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi2 = [];
      x.forEach(d => {
        this.dataSelectLokasi2.push({ "id": d.id, "text": d.nama });
        if (this.AccInterUnit.lokasi_id_2 == d.id) {
          selectLokasi2 = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_id_2').patchValue(selectLokasi2);
    });


    let selectAkun;
    this.AccAkunService.getAllDetail().subscribe(x=>{
      console.log(x);
      this.dataSelectAkun=[];
      x['data'].forEach(d => {
        this.dataSelectAkun.push({"id":d.id,"text":d.kode+ ' - '+ d.nama});
        if(d.id==this.AccInterUnit.acc_akun_id){
          selectAkun=d;
        }
      });
      this.entryForm.controls['acc_akun_id'].patchValue(selectAkun);
    });
  }

  onSubmit(){
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }
    let dataSubmit :AccInterUnit = {
      'acc_akun_id': this.entryForm.get('acc_akun_id').value.id,
      'lokasi_id': this.entryForm.get('lokasi_id').value.id,
      'lokasi_id_2': this.entryForm.get('lokasi_id_2').value.id,
      'tipe': this.entryForm.get('tipe').value,
    };

    this.AccInterUnitService.update(this.AccInterUnit.id,dataSubmit).subscribe(data=>{
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
    // console.log(this.AccInterUnit);
    // this.entryForm = this.builder.group({
    //   nip: new FormControl(this.AccInterUnit.nip,[Validators.required]),
    //   nama: new FormControl(this.AccInterUnit.nama, [Validators.required]),
    //   jenis_kelamin: new FormControl(this.AccInterUnit.jenis_kelamin, [Validators.required]),
    //   tgl_lahir:   new FormControl(new Date(Date.parse(this.AccInterUnit.tgl_lahir)), Validators.required),
    //   tempat_lahir: new FormControl(this.AccInterUnit.tempat_lahir, []),
    //   alamat: new FormControl(this.AccInterUnit.alamat, []),
    //   username: new FormControl(this.AccInterUnit.username, []),
    //   password: new FormControl(this.AccInterUnit.password, []),
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
