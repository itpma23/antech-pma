import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";

import { PksTankiFormula1 } from 'src/app/shared/models/pks_tanki_formula1.model';
import { PksTankiService } from 'src/app/shared/services/pks_tanki.service';
import { PksTankiFormula1Service } from 'src/app/shared/services/pks_tanki_formula1.service';
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
  PksTankiFormula1:PksTankiFormula1;
  dbName;
  pathName;
  PATH_URL;

  dataSelectTanki;

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private PksTankiFormula1Service: PksTankiFormula1Service,
    private authenticationService: AuthenticationService,
    private PksTankiService: PksTankiService,
    ) {
      this.dbName= this.authenticationService.getUserDB();
      this.pathName= this.authenticationService.getUserPath();
      this.PATH_URL=SERVER_PATH_URL;

      let toDate: Date = new Date();

      this.entryForm = this.builder.group({

        // tanggal: new FormControl(toDate, Validators.required),

        tanki_id: new FormControl([], Validators.required),
        tinggi: new FormControl(null, Validators.required),
        hasil: new FormControl(null, Validators.required),
        cek: new FormControl(null, Validators.required),
        
      });




  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {

    this.entryForm.controls['tinggi'].patchValue(this.PksTankiFormula1.tinggi);
    this.entryForm.controls['hasil'].patchValue(this.PksTankiFormula1.hasil);
    this.entryForm.controls['cek'].patchValue(this.PksTankiFormula1.cek);
    
    // this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.PksTankiFormula1.tanggal)));


  }
  public options: any;


  private loadSelect2(): void {

    let selectedtanki;
    this.PksTankiService.getAll().subscribe(x=>{
      this.dataSelectTanki=[];
      x['data'].forEach(d => {
        this.dataSelectTanki.push({"id":d.id,"text":d.nama_tanki});
        if (this.PksTankiFormula1.tanki_id == d.id) {
          selectedtanki = { "id": d.id, "text": d.nama_tanki }
        }
      });
      this.entryForm.get('tanki_id').patchValue(selectedtanki);
    });
    
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

    
    this.PksTankiFormula1Service.update(this.PksTankiFormula1.id,frmData).subscribe(data=>{
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
    this.PksTankiFormula1Service.updatePhoto(this.PksTankiFormula1.id,frmData).subscribe(data=>{
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

    // console.log(this.PksTankiFormula1);
    // this.entryForm = this.builder.group({
    //   nip: new FormControl(this.PksTankiFormula1.nip,[Validators.required]),
    //   nama: new FormControl(this.PksTankiFormula1.nama, [Validators.required]),
    //   jenis_kelamin: new FormControl(this.PksTankiFormula1.jenis_kelamin, [Validators.required]),
    //   tgl_lahir:   new FormControl(new Date(Date.parse(this.PksTankiFormula1.tgl_lahir)), Validators.required),
    //   tempat_lahir: new FormControl(this.PksTankiFormula1.tempat_lahir, []),
    //   alamat: new FormControl(this.PksTankiFormula1.alamat, []),
    //   username: new FormControl(this.PksTankiFormula1.username, []),
    //   password: new FormControl(this.PksTankiFormula1.password, []),
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
