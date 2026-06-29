import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { EstPremiBasisPanenService } from 'src/app/shared/services/est_premi_basis_panen.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';

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
  public dataSelectPengolahan: any[] = [];
  public dataSelectBlok: any[] = [];


  public options: any;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private estPremiBasisPanenService:EstPremiBasisPanenService,
    private gbmOrganisasiService:GbmOrganisasiService


    ) {
      let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      tanggal_efektif: new FormControl(toDate, Validators.required),
      blok_id: new FormControl([], Validators.required),

      bjr_dari: new FormControl(0),
      bjr_sd: new FormControl(0),
      basis_jjg: new FormControl(0, Validators.required),
      basis_jjg_jumat: new FormControl(0, Validators.required),
      premi_basis: new FormControl(0, Validators.required),

      lebih_basis1: new FormControl(0, Validators.required),
      premi_lebih_basis1: new FormControl(0, Validators.required),
      lebih_basis2: new FormControl(0,Validators.required),
      premi_lebih_basis2: new FormControl(0,Validators.required),
      lebih_basis3: new FormControl(0,Validators.required),
      premi_lebih_basis3: new FormControl(0,Validators.required),

      premi_brondolan: new FormControl(0,Validators.required),
      hk_luas_panen: new FormControl(0,Validators.required),


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

    this.gbmOrganisasiService.getAllByType('BLOK').subscribe(x=>{
      // console.log(x);
      this.dataSelectBlok=[];
      x.forEach(d => {
        this.dataSelectBlok.push({"id":d.id,"text":d.kode+"("+d.nama+")"});
      });

    });

  }
  onSubmit(){
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let dataSubmit = this.entryForm.value;



    this.estPremiBasisPanenService.create(dataSubmit).subscribe(data=>{
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
