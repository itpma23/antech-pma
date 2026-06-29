import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { HrmsCatuBerasService } from 'src/app/shared/services/hrms_catu_beras.service';
// import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
// import { PksPengolahanService } from 'src/app/shared/services/pks_pengolahan.service';
// import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
// import { SlsKontrak } from 'src/app/shared/models/sls_kontrak.model';
import { formatDate } from '@angular/common';

declare var swal: any;
@Component({
    moduleId: module.id,
    selector: 'add-cmp',
    templateUrl: 'add.component.html',
    styleUrls: ['add.component.css'],
})

export class AddComponent implements OnInit,AfterViewInit{
  isFormSubmitted=false;

	datepickerConfig = {
		dateInputFormat: 'DD-MM-YYYY',
		containerClass: 'theme-red',
  
	
}
  entryForm: FormGroup;
  event: EventEmitter<any>=new EventEmitter();

  public dataSelectLokasi: any[] = [];
  // public dataSelectPengolahan: any[] = [];
  public dataSelectSupplier: any[] = [];
  public dataSelectTipe: any[] = [];


  public options: any;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private hrmsCatuBerasService:HrmsCatuBerasService,
    // private gbmSupplierService:GbmSupplierService,
    // private GbmOrganisasiService:GbmOrganisasiService


    ) {
      let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      
      
      status_karyawan:  new FormControl([],Validators.required),
      // tanggal: new FormControl(toDate, Validators.required),
      jumlah_kg: new FormControl(null, Validators.required),
      jumlah_rupiah: new FormControl(null, Validators.required),


    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }


  private loadSelect2(): void {

    this.dataSelectTipe = [
      { id: 'TK/0', text: 'TK/0' },
      { id: 'TK/1', text: 'TK/1' },
      { id: 'TK/2', text: 'TK/2' },
      { id: 'TK/3', text: 'TK/3' },
      { id: 'K/0', text: 'K/0' },
      { id: 'K/1', text: 'K/1' },
      { id: 'K/2', text: 'K/2' },
      { id: 'K/3', text: 'K/3' },
    ];

    // this.GbmOrganisasiService.getAllByType('MILL').subscribe(x=>{
    //   console.log(x);
    //   this.dataSelectLokasi=[];
    //   x.forEach(d => {
    //     this.dataSelectLokasi.push({"id":d.id,"text":d.nama});
    //   });

    // });


  

  }
  onSubmit(){
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let dataSubmit = this.entryForm.value;
    // dataSubmit['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');



    this.hrmsCatuBerasService.create(dataSubmit).subscribe(data=>{
      // console.log(data);
      if( data['status']=='OK'){
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Simpan berhasil',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })

        this.event.emit('OK');
        this.bsModalRef.hide();
      }else{
        swal({
          title: 'Perhatian!',
          text: 'Proses Simpan Gagal' ,
          type: 'warning',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
      }
    });
  }

  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.entryForm.patchValue({
      img: file
    });
    this.entryForm.get('img').updateValueAndValidity()
    console.log(file);
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
}
