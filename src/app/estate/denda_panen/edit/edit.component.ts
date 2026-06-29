import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";
import { Akun } from 'src/app/shared/models/akun.model';
import { formatDate } from '@angular/common';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SERVER_PATH_URL } from 'src/app/app.constants';

import { EstDendaPanenService } from 'src/app/shared/services/est_denda_panen.service';
import { EstKodeDendaPanenService } from 'src/app/shared/services/est_kode_denda_panen.service';
import { EstDendaPanen } from 'src/app/shared/models/est_denda_panen.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';

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
  dataSelectKategori;
  dataSelectSatuan;
  event: EventEmitter<any>=new EventEmitter();
  dendaPanen:EstDendaPanen;
  dbName;
  pathName;
  PATH_URL;
  dataSelectKodeDendaPanen: any[];
  dataSelectEstate: any[];
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private estDendaPanenService: EstDendaPanenService,
    private estKodeDendaPanenService: EstKodeDendaPanenService,
    private gbmOrganisasiService:GbmOrganisasiService,

    ) {
      // this.dbName= this.authenticationService.getUserDB();
      // this.pathName= this.authenticationService.getUserPath();
      this.PATH_URL=SERVER_PATH_URL;
      let toDate: Date = new Date();
      this.entryForm = this.builder.group({
        lokasi_id: new FormControl([], Validators.required),
        tanggal_efektif: new FormControl(toDate, Validators.required),
        nilai: new FormControl(0, Validators.required),
        kode_denda_panen_id: new FormControl([], Validators.required),
        tipe: new FormControl([], Validators.required),


      });


  }
  get userControl() { return this.entryForm.controls; }
  private loadSelect2(): void {

    let selectedKodeDenda;
    this.estKodeDendaPanenService.getAll().subscribe(x => {
      this.dataSelectKodeDendaPanen = [];
     let data=x['data'];
      data.forEach(d => {
        this.dataSelectKodeDendaPanen.push({ "id": d.id, "text": d.nama });
        if (d.id==this.dendaPanen.kode_denda_panen_id){
          selectedKodeDenda={ "id": d.id, "text": d.nama };
        }

      });
      this.entryForm.controls['kode_denda_panen_id'].patchValue(selectedKodeDenda);
    });

    let selectedEstate;
    this.gbmOrganisasiService.getAllByType('ESTATE').subscribe(x => {
      this.dataSelectEstate = [];
      x.forEach(d => {
        this.dataSelectEstate.push({ "id": d.id, "text": d.nama });
        if (this.dendaPanen.lokasi_id == d.id) {
          selectedEstate = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectedEstate);
    });



  }
  ngAfterViewInit(): void {

     this.entryForm.controls['nilai'].patchValue(this.dendaPanen.nilai);
     this.entryForm.controls['tipe'].patchValue(this.dendaPanen.tipe);
      this.entryForm.controls['tanggal_efektif'].patchValue(new Date(Date.parse(this.dendaPanen.tanggal_efektif)));
  }


  onSubmit(){
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }
    let dataSubmit :EstDendaPanen = {
      'lokasi_id': this.entryForm.get('lokasi_id').value['id'],
      'tipe': this.entryForm.get('tipe').value,
      'kode_denda_panen_id': this.entryForm.get('kode_denda_panen_id').value['id'],
      'nilai': this.entryForm.get('nilai').value,
      'tanggal_efektif':formatDate(this.entryForm.get('tanggal_efektif').value, "yyyy-MM-dd", 'en_US')

    };

    this.estDendaPanenService.update(this.dendaPanen.id,dataSubmit).subscribe(data=>{
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
