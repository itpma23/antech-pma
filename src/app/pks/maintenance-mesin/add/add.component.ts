import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { PksMaintenanceMesinService } from 'src/app/shared/services/pks_maintenance_mesin.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { PksPengolahanService } from 'src/app/shared/services/pks_pengolahan.service';
import { PksJenisMaintenanceService } from 'src/app/shared/services/pks_jenis_maintenance.service';
import { SlsKontrak } from 'src/app/shared/models/sls_kontrak.model';
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

  // public dataSelectLokasi: any[] = [];
  // public dataSelectPengolahan: any[] = [];
  public dataSelectMesin: any[] = [];
  public dataSelectJenis: any[] = [];


  public options: any;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private pksMaintenanceMesinService:PksMaintenanceMesinService,
    private pksJenisMaintenanceService:PksJenisMaintenanceService,
    private GbmOrganisasiService:GbmOrganisasiService


    ) {
      let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      // tanggal_efektif: new FormControl(toDate, Validators.required),
      mesin_id: new FormControl([], Validators.required),
      jenis_mesin_id: new FormControl([], Validators.required),
      hm_km: new FormControl(0, Validators.required),
      hm_km_maintenance: new FormControl(0, Validators.required),
      ket: new FormControl('', Validators.required),


    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }


  private loadSelect2(): void {

    this.GbmOrganisasiService.getAllByType('MESIN').subscribe(x=>{
      this.dataSelectMesin=[];
      x.forEach(d => {
        this.dataSelectMesin.push({"id":d.id,"text":d.kode+" - "+d.nama});
      });
    });

    // this.GbmOrganisasiService.getAllByType('MILL').subscribe(x=>{
    //   console.log(x);
    //   this.dataSelectLokasi=[];
    //   x.forEach(d => {
    //     this.dataSelectLokasi.push({"id":d.id,"text":d.nama});
    //   });

    // });

    this.pksJenisMaintenanceService.getAll().subscribe(x=>{
      console.log(x);
      this.dataSelectJenis=[];
      x['data'].forEach(d => {
        this.dataSelectJenis.push({"id":d.id,"text":d.kode+" - "+d.keterangan});
      });

    });

    // this.gbmSupplierService.getAll().subscribe(x=>{
    //   console.log(x);
    //   this.dataSelectSupplier=[];
    //   x['data'].forEach(d => {
    //     this.dataSelectSupplier.push({"id":d.id,"text":d.nama_supplier});
    //   });

    // });

  }
  onSubmit(){
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let dataSubmit = this.entryForm.value;



    this.pksMaintenanceMesinService.create(dataSubmit).subscribe(data=>{
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
