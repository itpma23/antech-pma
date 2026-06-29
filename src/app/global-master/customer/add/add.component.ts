import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { GbmCustomerService } from 'src/app/shared/services/gbm_customer.service';
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
// import { GbmCustomerKelompokService } from 'src/app/shared/services/gbm_customer_kelompok.service';
import { GbmCustomer } from 'src/app/shared/models/gbm_customer.model';
import { formatDate } from '@angular/common';

declare var $: any;
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
		containerClass: 'theme-red'
	}
  entryForm: FormGroup;
  event: EventEmitter<any>=new EventEmitter();

  public dataSelectTipe: any[] = [];
  public dataSelectTipePajak: any[] = [];
  public dataSelectKelompok: any[] = [];
  public dataSelectAkun: any[] = [];


  public options: any;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private gbmCustomerService:GbmCustomerService,
    private AccAkunService:AccAkunService,
    // private gbmCustomerKelompokService:GbmCustomerKelompokService,



    ) {
    this.entryForm = this.builder.group({
      acc_akun_id: new FormControl([], Validators.required),
      tipe_pajak: new FormControl([], Validators.required),
      kode_customer: new FormControl('', Validators.required),
      // tipe_customer: new FormControl([],Validators.required),
      nama_customer: new FormControl('', Validators.required),
      no_npwp: new FormControl(''),
      alamat_npwp: new FormControl(''),
      alamat: new FormControl(''),
      no_telpon: new FormControl(''),
      contact_person: new FormControl(''),
      no_hp: new FormControl(''),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }


  private loadSelect2(): void {



    this.dataSelectTipe = [
      { id: 'SP', text: 'SUPPLIER' },
      { id: 'KT', text: 'KONTRAKTOR' },
      { id: 'TR', text: 'TRANSPORTIR' },
    ];

    this.dataSelectTipePajak = [
      { id: 'PKP', text: 'PKP' },
      { id: 'NON PKP', text: 'NON PKP' },
    ];


    // this.gbmCustomerKelompokService.getAll().subscribe(x=>{
    //   console.log(x);
    //   this.dataSelectKelompok=[];
    //   x['data'].forEach(d => {
    //     this.dataSelectKelompok.push({"id":d.id,"text":d.nama_kelompok});
    //   });
    // });

    this.AccAkunService.getAllDetail().subscribe(x=>{
      console.log(x);
      this.dataSelectAkun=[];
      x['data'].forEach(d => {
        this.dataSelectAkun.push({"id":d.id,"text" :d.kode+' - '+ d.nama});
      });
    });


  }
  onSubmit(){
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    let dataSubmit :GbmCustomer = {
      // 'tipe_customer': this.entryForm.get('tipe_customer').value.id,
      'acc_akun_id': this.entryForm.get('acc_akun_id').value.id,
      'kode_customer': this.entryForm.get('kode_customer').value,
      'nama_customer':this.entryForm.get('nama_customer').value,
      'tipe_pajak': this.entryForm.get('tipe_pajak').value.id,
      'no_telpon': this.entryForm.get('no_telpon').value,
      'no_npwp': this.entryForm.get('no_npwp').value,
      'alamat_npwp': this.entryForm.get('alamat_npwp').value,
      'alamat': this.entryForm.get('alamat').value,
      'contact_person': this.entryForm.get('contact_person').value,
      'no_hp': this.entryForm.get('no_hp').value,


    };



    this.gbmCustomerService.create(dataSubmit).subscribe(data=>{
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
