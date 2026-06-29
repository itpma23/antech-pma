import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";

import { HrmsJenisAbsensi } from 'src/app/shared/models/hrms_jenis_absensi.model';
import { HrmsJenisAbsensiService } from 'src/app/shared/services/hrms_jenis_absensi.service';
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
  HrmsJenisAbsensi:HrmsJenisAbsensi;
  dbName;
  pathName;
  PATH_URL;
  dataSelectTipe;

  // dataSelectTanki;

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private HrmsJenisAbsensiService: HrmsJenisAbsensiService,
    private authenticationService: AuthenticationService,
    ) {
      this.dbName= this.authenticationService.getUserDB();
      this.pathName= this.authenticationService.getUserPath();
      this.PATH_URL=SERVER_PATH_URL;

      let toDate: Date = new Date();

      this.entryForm = this.builder.group({

        // tanggal: new FormControl(toDate, Validators.required),

        kode: new FormControl('', Validators.required),
        keterangan: new FormControl('', Validators.required),
        tipe: new FormControl([], Validators.required),
        jumlah_hk: new FormControl(0, Validators.required),

      });




  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {

    this.entryForm.controls['kode'].patchValue(this.HrmsJenisAbsensi.kode);
    this.entryForm.controls['keterangan'].patchValue(this.HrmsJenisAbsensi.keterangan);
    // this.entryForm.controls['tipe'].patchValue(this.HrmsJenisAbsensi.tipe);
    this.entryForm.controls['jumlah_hk'].patchValue(this.HrmsJenisAbsensi.jumlah_hk);

    // this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.HrmsJenisAbsensi.tanggal)));


  }
  public options: any;


  private loadSelect2(): void {

    this.dataSelectTipe = [
      { id: 'DIBAYAR', text: 'Dibayar' },
      { id: 'TIDAK_DIBAYAR', text: 'Tidak Dibayar' },
    ];

    this.dataSelectTipe.forEach(x=> {
      if (x.id == this.HrmsJenisAbsensi.tipe) {
        this.entryForm.controls['tipe'].patchValue(x);
      }
    });

    // let selectedtanki;
    // this.PksTankiService.getAll().subscribe(x=>{
    //   this.dataSelectTanki=[];
    //   x['data'].forEach(d => {
    //     this.dataSelectTanki.push({"id":d.id,"text":d.nama_tanki});
    //     if (this.HrmsJenisAbsensi.tanki_id == d.id) {
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
    // frmData['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');


    this.HrmsJenisAbsensiService.update(this.HrmsJenisAbsensi.id,frmData).subscribe(data=>{
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
    this.HrmsJenisAbsensiService.updatePhoto(this.HrmsJenisAbsensi.id,frmData).subscribe(data=>{
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

    // console.log(this.HrmsJenisAbsensi);
    // this.entryForm = this.builder.group({
    //   nip: new FormControl(this.HrmsJenisAbsensi.nip,[Validators.required]),
    //   nama: new FormControl(this.HrmsJenisAbsensi.nama, [Validators.required]),
    //   jenis_kelamin: new FormControl(this.HrmsJenisAbsensi.jenis_kelamin, [Validators.required]),
    //   tgl_lahir:   new FormControl(new Date(Date.parse(this.HrmsJenisAbsensi.tgl_lahir)), Validators.required),
    //   tempat_lahir: new FormControl(this.HrmsJenisAbsensi.tempat_lahir, []),
    //   alamat: new FormControl(this.HrmsJenisAbsensi.alamat, []),
    //   username: new FormControl(this.HrmsJenisAbsensi.username, []),
    //   password: new FormControl(this.HrmsJenisAbsensi.password, []),
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
