import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';


import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { GbmSupplier } from 'src/app/shared/models/gbm_supplier.model';
import { GbmSupplierKelompokService } from 'src/app/shared/services/gbm_supplier_kelompok.service';
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';

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

  gbmSupplier: GbmSupplier;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private gbmSupplierService: GbmSupplierService,
    private authenticationService: AuthenticationService,
    private gbmSupplierKelompokService:GbmSupplierKelompokService,
    private AccAkunService:AccAkunService,
  ) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;
    this.entryForm = this.builder.group({
      acc_akun_id: new FormControl([], Validators.required),
      kelompok_id: new FormControl([], Validators.required),
      kode_supplier: new FormControl('', Validators.required),
      tipe_supplier: new FormControl([],Validators.required),
      tipe_pajak: new FormControl([],Validators.required),
      nama_supplier: new FormControl('', Validators.required),
      nama_bank: new FormControl(''),
      cabang_bank: new FormControl(''),
      no_rekening: new FormControl(''),
      atas_nama: new FormControl(''),
      npwp: new FormControl(''),
      alamat_npwp: new FormControl(''),
      alamat: new FormControl(''),
      no_telpon: new FormControl(''),
      contact_person: new FormControl(''),
      no_hp: new FormControl(''),
      tempo_pembayaran: new FormControl(0),
    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {


    console.log(this.gbmSupplier);
    this.entryForm.controls['kode_supplier'].patchValue(this.gbmSupplier.kode_supplier);
    this.entryForm.controls['nama_supplier'].patchValue(this.gbmSupplier.nama_supplier);
    this.entryForm.controls['nama_bank'].patchValue(this.gbmSupplier.nama_bank);
    this.entryForm.controls['cabang_bank'].patchValue(this.gbmSupplier.cabang_bank);
    this.entryForm.controls['no_rekening'].patchValue(this.gbmSupplier.no_rekening);
    this.entryForm.controls['atas_nama'].patchValue(this.gbmSupplier.atas_nama);
    this.entryForm.controls['npwp'].patchValue(this.gbmSupplier.npwp);
    this.entryForm.controls['alamat_npwp'].patchValue(this.gbmSupplier.alamat_npwp);
    this.entryForm.controls['alamat'].patchValue(this.gbmSupplier.alamat);
    this.entryForm.controls['no_hp'].patchValue(this.gbmSupplier.no_hp);
    this.entryForm.controls['no_telpon'].patchValue(this.gbmSupplier.no_telpon);
    this.entryForm.controls['contact_person'].patchValue(this.gbmSupplier.contact_person);
    this.entryForm.controls['tempo_pembayaran'].patchValue(this.gbmSupplier.tempo_pembayaran);



  }

  private loadSelect2(): void {

    this.dataSelectTipe = [
      { id: 'SP', text: 'SUPPLIER' },
      { id: 'KT', text: 'KONTRAKTOR' },
      { id: 'TR', text: 'TRANSPORTIR' },
      { id: 'PJ', text: 'PENYEDIA JASA' },
      { id: 'PJL', text: 'PENYEDIA JASA LOKAL' },
    ];
    let selectTipe;
    this.dataSelectTipe.forEach(a=>{
      if(a.id==this.gbmSupplier.tipe_supplier){
        selectTipe=a;
      }
    });
    this.entryForm.controls['tipe_supplier'].patchValue(selectTipe);

    this.dataSelectTipePajak = [
      { id: 'PKP', text: 'PKP' },
      { id: 'NON PKP', text: 'NON PKP' },
    ];
    let selectTipePajak;
    this.dataSelectTipePajak.forEach(a=>{
      if(a.id==this.gbmSupplier.tipe_pajak){
        selectTipePajak=a;
      }
    });
    this.entryForm.controls['tipe_pajak'].patchValue(selectTipePajak);


    let selectKelompok;
    this.gbmSupplierKelompokService.getAll().subscribe(x=>{
      console.log(x);
      this.dataSelectKelompok=[];
      x['data'].forEach(d => {
        this.dataSelectKelompok.push({"id":d.id,"text":d.nama_kelompok});
        if(d.id==this.gbmSupplier.kelompok_id){
          selectKelompok=d;
        }
      });
      this.entryForm.controls['kelompok_id'].patchValue(selectKelompok);
    });

    let selectAkun;
    this.AccAkunService.getAllSupplier().subscribe(x=>{
      console.log(x);
      this.dataSelectAkun=[];
      x['data'].forEach(d => {
        this.dataSelectAkun.push({"id":d.id,"text":d.kode+' - '+ d.nama});
        if(d.id==this.gbmSupplier.acc_akun_id){
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

    let dataSubmit :GbmSupplier = {
      'acc_akun_id': this.entryForm.get('acc_akun_id').value.id,
      'kelompok_id': this.entryForm.get('kelompok_id').value.id,
      'tipe_supplier': this.entryForm.get('tipe_supplier').value.id,
      'tipe_pajak': this.entryForm.get('tipe_pajak').value.id,
      'kode_supplier': this.entryForm.get('kode_supplier').value,
      'nama_supplier':this.entryForm.get('nama_supplier').value,
      'no_telpon': this.entryForm.get('no_telpon').value,
      'nama_bank': this.entryForm.get('nama_bank').value,
      'cabang_bank': this.entryForm.get('cabang_bank').value,
      'no_rekening': this.entryForm.get('no_rekening').value,
      'atas_nama': this.entryForm.get('atas_nama').value,
      'npwp': this.entryForm.get('npwp').value,
      'alamat_npwp': this.entryForm.get('alamat_npwp').value,
      'alamat': this.entryForm.get('alamat').value,
      'contact_person': this.entryForm.get('contact_person').value,
      'no_hp': this.entryForm.get('no_hp').value,
      'tempo_pembayaran': this.entryForm.get('tempo_pembayaran').value,
    };

    // console.log(dataSubmit);

    this.gbmSupplierService.update(this.gbmSupplier.id, dataSubmit).subscribe(data => {
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
