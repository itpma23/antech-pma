import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { SlsIntruksiService } from 'src/app/shared/services/sls_intruksi.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { SlsKontrakService } from 'src/app/shared/services/sls_kontrak.service';
import { GbmCustomerService } from 'src/app/shared/services/gbm_customer.service';
import { SlsIntruksi } from 'src/app/shared/models/sls_intruksi.model';
import { formatDate } from '@angular/common';
import { TradingIntruksiService } from 'src/app/shared/services/trading_intruksi.service';

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

  public dataKontrak: any[] = [];

  public dataSelectTipe: any[] = [];
  public dataSelectMill: any[] = [];
  public dataSelectKontrak: any[] = [];
  public dataSelectItem: any[] = [];
  public dataSelectCustomer: any[] = [];
  public dataSelectSupplier: any[] = [];


  public options: any;
  dataSelectLokasi: any[];


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private slsIntruksiService:TradingIntruksiService,
    private invItemService:InvItemService,
    private slsKontrakService:SlsKontrakService,
    private GbmOrganisasiService:GbmOrganisasiService,
    private GbmCustomerService: GbmCustomerService,


    ) {
      let toDate: Date = new Date();
      let time: Date = new Date();

    this.entryForm = this.builder.group({
      sales_lokasi_id: new FormControl([], Validators.required),
      kepada_lokasi_id: new FormControl([], Validators.required),
      customer_id: new FormControl([], Validators.required),
      spk_id: new FormControl([], Validators.required),
      no_transaksi: new FormControl('AUTONUMBER', Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      alamat_pengiriman: new FormControl('', Validators.required),
      keterangan: new FormControl('', Validators.required),
      pic: new FormControl('', Validators.required),
      periode_kirim_awal: new FormControl(toDate, Validators.required),
      periode_kirim_akhir: new FormControl(toDate, Validators.required),
      // produk_id: new FormControl([], Validators.required),
      jumlah: new FormControl(0, Validators.required),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }


  private loadSelect2(): void {

    this.GbmOrganisasiService.getAllByType('HO').subscribe(x=>{
      console.log(x);
      this.dataSelectMill=[];
      x.forEach(d => {
        this.dataSelectMill.push({"id":d.id,"text":d.nama});
      });

    });
    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x=>{
      console.log(x);
      this.dataSelectLokasi=[];
      x.forEach(d => {
        this.dataSelectLokasi.push({"id":d.id,"text":d.nama});
      });

    });

    let customer_id;
    this.entryForm.controls['customer_id'].valueChanges.subscribe(x => {
      customer_id = x.id;
      this.slsKontrakService.getAll().subscribe(x=>{
        console.log(x);
        this.dataSelectKontrak=[];
        x['data'].forEach(d => {
          if (d.customer_id == customer_id) {
            this.dataKontrak.push(d);
            this.dataSelectKontrak.push({"id":d.id,"text":d.no_spk});
          }
        });
      });
    });

    this.entryForm.controls['spk_id'].valueChanges.subscribe(x=> {
      let spk_id = x.id;
      this.dataKontrak.forEach(x=>{
        if (x.id == spk_id) {
          this.entryForm.get("alamat_pengiriman").patchValue(x.alamat_pengiriman);
          this.entryForm.get("keterangan").patchValue(x.keterangan);
          this.entryForm.get("pic").patchValue(x.pic);
          this.entryForm.get("jumlah").patchValue(x.jumlah);
          // this.entryForm.get("priode_kirim_awal").patchValue(formatDate(x.priode_kirim_awal, "yyy-MM-dd", "en_US"));
          // this.entryForm.get("priode_kirim_akhir").patchValue(formatDate(x.priode_kirim_akhir, "yyy-MM-dd", "en_US"));
        }
      });
    });

    
    this.GbmCustomerService.getAll().subscribe(x=>{
      console.log(x);
      this.dataSelectCustomer=[];
      x['data'].forEach(d => {
        this.dataSelectCustomer.push({"id":d.id,"text":d.kode_customer+" - "+d.nama_customer});
      });
    });

    this.invItemService.getAll().subscribe(x=>{
      console.log(x);
      this.dataSelectItem=[];
      x['data'].forEach(d => {
        this.dataSelectItem.push({"id":d.id,"text":d.nama});
      });

    });

  }
  onSubmit(){
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    let dataSubmit :SlsIntruksi = {
      'sales_lokasi_id': this.entryForm.get('sales_lokasi_id').value.id,
      'kepada_lokasi_id': this.entryForm.get('kepada_lokasi_id').value.id,
      'spk_id': this.entryForm.get('spk_id').value.id,
      'customer_id': this.entryForm.get('customer_id').value.id,
      'no_transaksi':this.entryForm.get('no_transaksi').value,
      'tanggal': formatDate(this.entryForm.get('tanggal').value, "yyy-MM-dd", "en_US"),
      'alamat_pengiriman': this.entryForm.get('alamat_pengiriman').value,
      'keterangan':this.entryForm.get('keterangan').value,
      'pic':this.entryForm.get('pic').value,
      'periode_kirim_awal': formatDate(this.entryForm.get('periode_kirim_awal').value, "yyy-MM-dd", "en_US"),
      'periode_kirim_akhir':formatDate(this.entryForm.get('periode_kirim_akhir').value, "yyy-MM-dd", "en_US"),
      // 'produk_id': this.entryForm.get('produk_id').value.id,
      'jumlah':this.entryForm.get('jumlah').value,

    };



    this.slsIntruksiService.create(dataSubmit).subscribe(data=>{
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
