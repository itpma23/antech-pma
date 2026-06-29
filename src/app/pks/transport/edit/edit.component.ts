import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";

import { PksTransport } from 'src/app/shared/models/pks_transport.model';
import { PksTransportService } from 'src/app/shared/services/pks_transport.service';
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
  PksTransport:PksTransport;
  dbName;
  pathName;
  PATH_URL;

  // dataSelectTanki;

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private PksTransportService: PksTransportService,
    private authenticationService: AuthenticationService,
    ) {
      this.dbName= this.authenticationService.getUserDB();
      this.pathName= this.authenticationService.getUserPath();
      this.PATH_URL=SERVER_PATH_URL;

      let toDate: Date = new Date();

      this.entryForm = this.builder.group({

        // tanggal: new FormControl(toDate, Validators.required),

        kode: new FormControl('', Validators.required),
        nama: new FormControl('', Validators.required),
        alamat: new FormControl('', Validators.required),
        npwp: new FormControl('', Validators.required),
        
      });




  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {

    this.entryForm.controls['kode'].patchValue(this.PksTransport.kode);
    this.entryForm.controls['nama'].patchValue(this.PksTransport.nama);
    this.entryForm.controls['alamat'].patchValue(this.PksTransport.alamat);
    this.entryForm.controls['npwp'].patchValue(this.PksTransport.npwp);
    
    // this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.PksTransport.tanggal)));


  }
  public options: any;


  private loadSelect2(): void {

    // let selectedtanki;
    // this.PksTankiService.getAll().subscribe(x=>{
    //   this.dataSelectTanki=[];
    //   x['data'].forEach(d => {
    //     this.dataSelectTanki.push({"id":d.id,"text":d.nama_tanki});
    //     if (this.PksTransport.tanki_id == d.id) {
    //       selectedtanki = { "id": d.id, "text": d.nama_tanki }
    //     }
    //   });
    //   this.entryForm.get('tanki_id').patchValue(selectedtanki);
    // });
    
  }


  onSubmit(){
    console.log(this.entryForm.value);

    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }
    
    
    let frmData = this.entryForm.value;
    frmData['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');

    
    this.PksTransportService.update(this.PksTransport.id,frmData).subscribe(data=>{
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
    this.PksTransportService.updatePhoto(this.PksTransport.id,frmData).subscribe(data=>{
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

    // console.log(this.PksTransport);
    // this.entryForm = this.builder.group({
    //   nip: new FormControl(this.PksTransport.nip,[Validators.required]),
    //   nama: new FormControl(this.PksTransport.nama, [Validators.required]),
    //   jenis_kelamin: new FormControl(this.PksTransport.jenis_kelamin, [Validators.required]),
    //   tgl_lahir:   new FormControl(new Date(Date.parse(this.PksTransport.tgl_lahir)), Validators.required),
    //   tempat_lahir: new FormControl(this.PksTransport.tempat_lahir, []),
    //   alamat: new FormControl(this.PksTransport.alamat, []),
    //   username: new FormControl(this.PksTransport.username, []),
    //   password: new FormControl(this.PksTransport.password, []),
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
