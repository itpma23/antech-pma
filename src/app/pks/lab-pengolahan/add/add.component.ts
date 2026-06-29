import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { PksLabPengolahanService } from 'src/app/shared/services/pks_lab_pengolahan.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { PksPengolahanService } from 'src/app/shared/services/pks_pengolahan.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
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
   
    // n1 = 0;
    // n2 = 0;
    // n3 = 0;
    // n4 = 0;
    // n5 = 0;
    // get jml1() {
    //   return this.mass * this.height;
    // }
	
}
  entryForm: FormGroup;
  event: EventEmitter<any>=new EventEmitter();

  public dataSelectLokasi: any[] = [];
  public dataSelectPengolahan: any[] = [];
  public dataSelectMill: any[] = [];


  public options: any;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private pksLabPengolahanService:PksLabPengolahanService,
    private gbmSupplierService:GbmSupplierService,
    private gbmOrganisasiService:GbmOrganisasiService


    ) {
      let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      no_transaksi: new FormControl('(Auto Generate)'),
      tanggal: new FormControl(toDate, Validators.required),
      mill_id: new FormControl([], Validators.required),
      
      cpo_moisture: new FormControl(0, Validators.required),
      cpo_dobi: new FormControl(0, Validators.required),
      cpo_ffa: new FormControl(0, Validators.required),
      cpo_dirt: new FormControl(0, Validators.required),
      
      kernel_moisture: new FormControl(0, Validators.required),
      kernel_dobi: new FormControl(0,Validators.required),
      kernel_ffa: new FormControl(0,Validators.required),
      kernel_dirt: new FormControl(0,Validators.required),
      
      cpo_los_fruit: new FormControl(0,Validators.required),
      cpo_los_press: new FormControl(0,Validators.required),
      cpo_los_nut: new FormControl(0,Validators.required),
      cpo_los_e_bunch: new FormControl(0,Validators.required),
      cpo_los_effluent: new FormControl(0,Validators.required),
      jml: new FormControl(0),
      jml1: new FormControl(0),

      
      kernel_los_fruit: new FormControl(0,Validators.required),
      kernel_los_fiber_cyclone: new FormControl(0,Validators.required),
      kernel_los_ltds1: new FormControl(0,Validators.required),
      kernel_los_ltds2: new FormControl(0,Validators.required),
      kernel_los_claybath: new FormControl(0,Validators.required),


    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }


  private loadSelect2(): void {

    // this.GbmOrganisasiService.getAllByType('MILL').subscribe(x=>{
    //   console.log(x);
    //   this.dataSelectLokasi=[];
    //   x.forEach(d => {
    //     this.dataSelectLokasi.push({"id":d.id,"text":d.nama});
    //   });

    // });

    // this.pksPengolahanService.getAll().subscribe(x=>{
    //   console.log(x);
    //   this.dataSelectPengolahan=[];
    //   x['data'].forEach(d => {
    //     this.dataSelectPengolahan.push({"id":d.id,"text":d.no_transaksi});
    //   });

    // });

    this.gbmOrganisasiService.getAllByType('MILL').subscribe(x=>{
      console.log(x);
      this.dataSelectMill=[];
      x.forEach(d => {
        this.dataSelectMill.push({"id":d.id,"text":d.nama});
      });

    });

  }
  onSubmit(){
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let dataSubmit = this.entryForm.value;



    this.pksLabPengolahanService.create(dataSubmit).subscribe(data=>{
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

  jumlah1(e){
    // let jml1 = this.entryForm.get('cpo_los_fruit').value + this.entryForm.get('cpo_los_press').value
    // this.entryForm.get('jml').patchValue(jml1)
    var n1 = this.entryForm.get('cpo_los_fruit').value;
    var n2 = this.entryForm.get('cpo_los_press').value;
    var n3 = this.entryForm.get('cpo_los_nut').value;
    var n4 = this.entryForm.get('cpo_los_e_bunch').value;
    var n5 = this.entryForm.get('cpo_los_effluent').value;
    this.entryForm.get('jml').patchValue( n1 + n2 + n3 + n4 + n5 );
  }

  jumlah2(e){
    // let jml1 = this.entryForm.get('cpo_los_fruit').value + this.entryForm.get('cpo_los_press').value
    // this.entryForm.get('jml').patchValue(jml1)
    var n1 = this.entryForm.get('kernel_los_fruit').value;
    var n2 = this.entryForm.get('kernel_los_fiber_cyclone').value;
    var n3 = this.entryForm.get('kernel_los_ltds1').value;
    var n4 = this.entryForm.get('kernel_los_ltds2').value;
    var n5 = this.entryForm.get('kernel_los_claybath').value;
    this.entryForm.get('jml1').patchValue( n1 + n2 + n3 + n4 + n5 );
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
    // console.log($event);
    this.jumlah1($event);
    this.jumlah2($event);
  }
}
