import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { GbmSupplierKelompokService } from 'src/app/shared/services/gbm_supplier_kelompok.service';
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
import { GbmSupplier } from 'src/app/shared/models/gbm_supplier.model';
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
    private gbmSupplierService:GbmSupplierService,
    private gbmSupplierKelompokService:GbmSupplierKelompokService,
    private AccAkunService:AccAkunService,



    ) {
    this.entryForm = this.builder.group({
      acc_akun_id: new FormControl([], Validators.required),
      kelompok_id: new FormControl([], Validators.required),
      kode_supplier: new FormControl('AUTONUMBER', Validators.required),
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

  }


  private loadSelect2(): void {



    this.dataSelectTipe = [
      { id: 'SP', text: 'SUPPLIER' },
      { id: 'KT', text: 'KONTRAKTOR' },
      { id: 'TR', text: 'TRANSPORTIR' },
      { id: 'PJ', text: 'PENYEDIA JASA' },
      { id: 'PJL', text: 'PENYEDIA JASA LOKAL' },
    ];

    this.dataSelectTipePajak = [
      { id: 'PKP', text: 'PKP' },
      { id: 'NON PKP', text: 'NON PKP' },
    ];

    this.gbmSupplierKelompokService.getAll().subscribe(x=>{
      console.log(x);
      this.dataSelectKelompok=[];
      x['data'].forEach(d => {
        this.dataSelectKelompok.push({"id":d.id,"text":d.nama_kelompok});
      });

    });

    this.AccAkunService.getAllSupplier().subscribe(x=>{
      console.log(x);
      this.dataSelectAkun=[];
      x['data'].forEach(d => {
        this.dataSelectAkun.push({"id":d.id,"text":d.kode+' - '+ d.nama});
      });
    });


  }
  onSubmit(){
    this.isFormSubmitted = true;
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

    this.gbmSupplierService.create(dataSubmit).subscribe(data=>{
      console.log(data);
      if( data['status']=='OK'){
        swal({
          title: 'Info!',
          text: 'Data berhasil disimpan dengan kode:'+data['data'],
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
