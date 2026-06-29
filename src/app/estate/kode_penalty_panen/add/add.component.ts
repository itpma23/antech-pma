import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { EstKodeDendaPanenService } from 'src/app/shared/services/est_kode_denda_panen.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';

import { formatDate } from '@angular/common';
import { EstKodePenaltyPanenService } from 'src/app/shared/services/est_kode_penalty_panen.service';
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';

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
  public dataSelectSupplier: any[] = [];
  public dataSelectAkun: any[] = [];


  public options: any;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private estKodeDendaPanenService:EstKodePenaltyPanenService,
    private accAkunService: AccAkunService, 


    ) {
      let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      // tanggal_efektif: new FormControl(toDate, Validators.required),
      // supplier_id: new FormControl([], Validators.required),
      kode: new FormControl('', Validators.required),
      nama: new FormControl('', Validators.required),
      keterangan: new FormControl(''),
      acc_akun_id: new FormControl([], Validators.required),


    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

    this.loadSelect2();
  }


   private loadSelect2(): void {

    // let m = this.translate.instant('holidays.messages.update');


    this.accAkunService.getAllDetail().subscribe(x=>{
      console.log(x);
      this.dataSelectAkun=[];
      x['data'].forEach(d => {
        this.dataSelectAkun.push({"id":d.id,"text":d.kode+" - "+d.nama});
      });

    });
  }
  onSubmit(){
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let dataSubmit = this.entryForm.value;

    console.log(this.entryForm.value);



    this.estKodeDendaPanenService.create(dataSubmit).subscribe(data=>{
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
