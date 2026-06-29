import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";
import {  InvKategoriService } from 'src/app/shared/services/inv_kategori.service';
import {  AccAkunService } from 'src/app/shared/services/acc_akun.service';
import { InvKategori } from 'src/app/shared/models/inv_kategori.model';
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
  public dataSelectAkun: any[] = [];
  categories: any[] = [];
  event: EventEmitter<any>=new EventEmitter();
  invKategori:InvKategori;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private invKategoriService:InvKategoriService,
    private accAkunService:AccAkunService,
    private authenticationService: AuthenticationService,
    ) {
      this.dbName= this.authenticationService.getUserDB();
      this.pathName= this.authenticationService.getUserPath();
      this.PATH_URL=SERVER_PATH_URL;
      this.entryForm = this.builder.group({

        kode: new FormControl(null, Validators.required),
        nama: new FormControl(null, Validators.required),
        acc_akun_id: new FormControl([], Validators.required),

      });




  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {


     this.entryForm.controls['nama'].patchValue(this.invKategori.nama);
     this.entryForm.controls['kode'].patchValue(this.invKategori.kode);




  }
  private loadSelect2(): void {



    let selectAkun;
    this.accAkunService.getAllDetail().subscribe(x => {

      this.dataSelectAkun = [];
      x['data'].forEach(d => {
        this.dataSelectAkun.push({ "id": d.id, "text":d.kode+" - "+d.nama });
      });

      this.dataSelectAkun.forEach(a => {
        if (a.id == this.invKategori.acc_akun_id) {
          selectAkun = a;
        }
        this.entryForm.controls['acc_akun_id'].patchValue(selectAkun);
      });

    });
  }


  onSubmit(){
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }
    let dataSubmit = this.entryForm.value;

     console.log(dataSubmit);

    this.invKategoriService.update(this.invKategori.id,dataSubmit).subscribe(data=>{
      if (data['status'] == 'OK') {
        swal({
          title: 'Info!',
          text: 'Data berhasil disimpan',
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

  updatePhoto(){
    let frmData=new FormData();
    frmData.append("userfile", this.entryForm.get('img').value);
    this.invKategoriService.updatePhoto(this.invKategori.id,frmData).subscribe(data=>{
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

    // console.log(this.akun);
    // this.entryForm = this.builder.group({
    //   nip: new FormControl(this.akun.nip,[Validators.required]),
    //   nama: new FormControl(this.akun.nama, [Validators.required]),
    //   jenis_kelamin: new FormControl(this.akun.jenis_kelamin, [Validators.required]),
    //   tgl_lahir:   new FormControl(new Date(Date.parse(this.akun.tgl_lahir)), Validators.required),
    //   tempat_lahir: new FormControl(this.akun.tempat_lahir, []),
    //   alamat: new FormControl(this.akun.alamat, []),
    //   username: new FormControl(this.akun.username, []),
    //   password: new FormControl(this.akun.password, []),
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
