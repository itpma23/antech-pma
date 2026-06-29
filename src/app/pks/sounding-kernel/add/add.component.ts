import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { PksSoundingKernelService } from 'src/app/shared/services/pks_sounding_kernel.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import {PksTankiService } from 'src/app/shared/services/pks_tanki.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
// import { SlsKontrak } from 'src/app/shared/models/sls_kontrak.model';
import { formatDate } from '@angular/common';
import { PksSoundingService } from 'src/app/shared/services/pks_sounding.service';

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
  public dataSelectTanki: any[] = [];
  public dataSelectMill: any[] = [];


  public options: any;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private pksSoundingKernelService:PksSoundingKernelService,
    private pksTankiService:PksTankiService,
    private pksSoundingService: PksSoundingKernelService,
    private gbmOrganisasiService:GbmOrganisasiService


    ) {
      let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      // name: new FormControl('',Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      tanki_id: new FormControl([], Validators.required),
      mill_id: new FormControl([], Validators.required),
      hasil_ukur_a: new FormControl(0, Validators.required),
      hasil_ukur_b: new FormControl(0, Validators.required),
      hasil_ukur_c: new FormControl(0, Validators.required),
      hasil_ukur_d: new FormControl(0, Validators.required),

      stok_a: new FormControl(0, Validators.required),
      stok_b: new FormControl(0,Validators.required),
      stok_c: new FormControl(0,Validators.required),
      stok_d: new FormControl(0,Validators.required),

      hasil_sounding: new FormControl(0,Validators.required),


    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }


  private loadSelect2(): void {

    this.gbmOrganisasiService.getAllByType('MILL').subscribe(x=>{
      // console.log(x);
      this.dataSelectMill=[];
      x.forEach(d => {
        this.dataSelectMill.push({"id":d.id,"text":d.nama});
      });

    });

    this.pksTankiService.getAll().subscribe(x=>{
      console.log(x);
      this.dataSelectTanki=[];
      x['data'].forEach(d => {
        if (d.produk=='PK'){
          this.dataSelectTanki.push({"id":d.id,"text":d.nama_tanki});
        }

      });

    });

    // this.gbmOrganisasiService.getAllByType('MILL').subscribe(x=>{
    //   console.log(x);
    //   this.dataSelectMill=[];
    //   x.forEach(d => {
    //     this.dataSelectMill.push({"id":d.id,"text":d.nama});
    //   });

    // });

  }
  onSubmit(){
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let dataSubmit = this.entryForm.value;



    this.pksSoundingKernelService.create(dataSubmit).subscribe(data=>{
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


  processSounding(){
    let data = {
      hasil_ukur_A: this.entryForm.get("hasil_ukur_a").value,
      hasil_ukur_B: this.entryForm.get("hasil_ukur_b").value,
      hasil_ukur_C: this.entryForm.get("hasil_ukur_c").value,
      hasil_ukur_D: this.entryForm.get("hasil_ukur_d").value,
    };
    this.pksSoundingService.processSoundingKernel(data).subscribe(x=> {
      console.log(data);
      this.entryForm.get("stok_a").patchValue(x['data'].jumlah_stok_A);
      this.entryForm.get("stok_b").patchValue(x['data'].jumlah_stok_B);
      this.entryForm.get("stok_c").patchValue(x['data'].jumlah_stok_C);
      this.entryForm.get("stok_d").patchValue(x['data'].jumlah_stok_D);
      this.entryForm.get("hasil_sounding").patchValue(
        (x['data'].total_stok).toFixed(2)
      );
    });
  }
  onClose(){
    this.bsModalRef.hide();
  }

  ngOnInit() {

     this.loadSelect2();

   }
  valueChange($event){
    // console.log($event);
    // this.jumlah1($event);
    // this.jumlah2($event);
  }
}
