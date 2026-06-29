import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';


import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { GbmCustomerService } from 'src/app/shared/services/gbm_customer.service';
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
import { GbmCustomer } from 'src/app/shared/models/gbm_customer.model';
// import { GbmCustomerKelompokService } from 'src/app/shared/services/gbm_customer_kelompok.service';

declare var $: any;
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'edit-cmp',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.css'],
})

export class EditComponent implements OnInit, AfterViewInit {
  isFormSubmitted = false;
  isChangePhoto = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();
  public dataSelectTipe: any[] = [];
  public dataSelectTipePajak: any[] = [];
  public dataSelectKelompok: any[] = [];
  public dataSelectAkun: any[] = [];

  gbmCustomer: GbmCustomer;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private gbmCustomerService: GbmCustomerService,
    private authenticationService: AuthenticationService,
    private AccAkunService:AccAkunService,
    // private gbmCustomerKelompokService:GbmCustomerKelompokService,
  ) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;
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


    console.log(this.gbmCustomer);
    this.entryForm.controls['kode_customer'].patchValue(this.gbmCustomer.kode_customer);
    this.entryForm.controls['nama_customer'].patchValue(this.gbmCustomer.nama_customer);
    this.entryForm.controls['no_npwp'].patchValue(this.gbmCustomer.no_npwp);
    this.entryForm.controls['alamat_npwp'].patchValue(this.gbmCustomer.alamat_npwp);
    this.entryForm.controls['alamat'].patchValue(this.gbmCustomer.alamat);
    this.entryForm.controls['no_hp'].patchValue(this.gbmCustomer.no_hp);
    this.entryForm.controls['no_telpon'].patchValue(this.gbmCustomer.no_telpon);
    this.entryForm.controls['contact_person'].patchValue(this.gbmCustomer.contact_person);



  }

  private loadSelect2(): void {

    this.dataSelectTipe = [
      { id: 'SP', text: 'SUPPLIER' },
      { id: 'KT', text: 'KONTRAKTOR' },
      { id: 'TR', text: 'TRANSPORTIR' },

    ];

    let selectTipe;
    this.dataSelectTipe.forEach(a=>{
      if(a.id==this.gbmCustomer.tipe_customer){
        selectTipe=a;
      }
    });


    this.dataSelectTipePajak = [
      { id: 'PKP', text: 'PKP' },
      { id: 'NON PKP', text: 'NON PKP' },
    ];
    let selectTipePajak;
    this.dataSelectTipePajak.forEach(a=>{
      if(a.id==this.gbmCustomer.tipe_pajak){
        selectTipePajak=a;
      }
    });
    this.entryForm.controls['tipe_pajak'].patchValue(selectTipePajak);

    // this.entryForm.controls['tipe_customer'].patchValue(selectTipe);
    let selectKelompok;
    // this.gbmCustomerKelompokService.getAll().subscribe(x=>{
    //   console.log(x);
    //   this.dataSelectKelompok=[];
    //   x['data'].forEach(d => {
    //     this.dataSelectKelompok.push({"id":d.id,"text":d.nama_kelompok});
    //     if(d.id==this.gbmCustomer.kelompok_id){
    //       selectKelompok=d;
    //     }
    //   });
    //   this.entryForm.controls['kelompok_id'].patchValue(selectKelompok);
    // });

    let selectAkun;
    this.AccAkunService.getAllDetail().subscribe(x=>{
      console.log(x);
      this.dataSelectAkun=[];
      x['data'].forEach(d => {
        this.dataSelectAkun.push({"id":d.id,"text":d.kode+' - '+ d.nama});
        if(d.id==this.gbmCustomer.acc_akun_id){
          selectAkun=d;
        }
      });
      this.entryForm.controls['acc_akun_id'].patchValue(selectAkun);
    });

  }
  onSubmit() {
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }

    let dataSubmit :GbmCustomer = {
      // 'tipe_customer': this.entryForm.get('tipe_customer').value.id,
      'acc_akun_id': this.entryForm.get('acc_akun_id').value.id,
      'tipe_pajak': this.entryForm.get('tipe_pajak').value.id,
      'kode_customer': this.entryForm.get('kode_customer').value,
      'nama_customer':this.entryForm.get('nama_customer').value,
      'no_telpon': this.entryForm.get('no_telpon').value,
      'no_npwp': this.entryForm.get('no_npwp').value,
      'alamat_npwp': this.entryForm.get('alamat_npwp').value,
      'alamat': this.entryForm.get('alamat').value,
      'contact_person': this.entryForm.get('contact_person').value,
      'no_hp': this.entryForm.get('no_hp').value,


    };

    this.gbmCustomerService.update(this.gbmCustomer.id, dataSubmit).subscribe(data => {

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



  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {

    this.loadSelect2();

  }
  valueChange($event) {
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
    this.isChangePhoto = true;
    console.log(this.isChangePhoto);
  }
}
