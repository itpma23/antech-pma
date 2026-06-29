import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { PksSoundingService } from 'src/app/shared/services/pks_sounding.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { PksTankiService } from 'src/app/shared/services/pks_tanki.service';
import { PksSounding } from 'src/app/shared/models/pks_sounding.model';
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
  public dataSelectMill: any[] = [];
  public dataSelectEstate: any[] = [];
  public dataSelectItem: any[] = [];
  public dataSelectSupplier: any[] = [];
  public dataSelectTanki: any[] = [];
  public dataTankiDetail: any[] = [];


  public options: any;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private pksSoundingService:PksSoundingService,
    private GbmOrganisasiService:GbmOrganisasiService,
    private PksTankiService:PksTankiService


    ) {
      let toDate: Date = new Date();
      let time: Date = new Date();

    this.entryForm = this.builder.group({
      mill_id: new FormControl([], Validators.required),
      tanki_id: new FormControl([], Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      no_transaksi: new FormControl('(Auto Generate)'),
      sounding: new FormControl(0, Validators.required),
      meja_ukur: new FormControl(0, Validators.required),
      tinggi: new FormControl(0, Validators.required),
      hasil_1: new FormControl(0, Validators.required),
      hasil_2: new FormControl(0, Validators.required),
      hasil_total: new FormControl(0, Validators.required),
      suhu: new FormControl(0, Validators.required),
      cal: new FormControl(0, Validators.required),
      density: new FormControl(0, Validators.required),
      // kg: new FormControl(0, Validators.required),
    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    this.valueChange();
  }


  private loadSelect2(): void {


    this.dataSelectTipe = [
      { id: 'INT', text: 'INTERNAL' },
      { id: 'EXT', text: 'EXTERNAL' },
      { id: 'AFL', text: 'AFILIASI' },

    ];



    this.GbmOrganisasiService.getAllByType('MILL').subscribe(x=>{
      // console.log(x);
      this.dataSelectMill=[];
      x.forEach(d => {
        this.dataSelectMill.push({"id":d.id,"text":d.nama});
      });

    });
    // this.GbmOrganisasiService.getAllByType('ESTATE').subscribe(x=>{
    //   // console.log(x);
    //   this.dataSelectEstate=[];
    //   x.forEach(d => {
    //     this.dataSelectEstate.push({"id":d.id,"text":d.nama});
    //   });

    // });

    // this.invItemService.getAll().subscribe(x=>{
    //   // console.log(x);
    //   this.dataSelectItem=[];
    //   x['data'].forEach(d => {
    //     this.dataSelectItem.push({"id":d.id,"text":d.nama});
    //   });

    // });

    // this.gbmSupplierService.getAll().subscribe(x=>{
    //   // console.log(x);
    //   this.dataSelectSupplier=[];
    //   x['data'].forEach(d => {
    //     this.dataSelectSupplier.push({"id":d.id,"text":d.nama_supplier});
    //   });
    // });

    this.PksTankiService.getAll().subscribe(x=>{
      // console.log(x['data']);
      this.dataSelectTanki=[];
      x['data'].forEach(d => {
        if (d.produk=='CPO'){
           this.dataSelectTanki.push({"id":d.id,"text":d.nama_tanki});
        }
      });
    });

  }



  processSounding(){
    let data = {
      tanki_id: this.entryForm.get("tanki_id").value.id,
      sounding: this.entryForm.get("sounding").value,
      suhu: this.entryForm.get("suhu").value,
    };
    console.log(data);
    this.pksSoundingService.processSounding(data).subscribe(x=> {

      this.entryForm.get("meja_ukur").patchValue(x['data'].meja_ukur);
      this.entryForm.get("tinggi").patchValue(x['data'].tinggi);
      this.entryForm.get("density").patchValue(x['data'].density);
      this.entryForm.get("hasil_1").patchValue(x['data'].hasil_1);
      this.entryForm.get("hasil_2").patchValue(x['data'].hasil_2);
      this.entryForm.get("hasil_total").patchValue(
        (x['data'].hasil_total).toFixed(2)
      );
      this.entryForm.get("cal").patchValue(x['data'].cal);


      console.log(x);
    });
  }



  onSubmit(){
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    // let jam_masuk = formatDate(this.entryForm.get('jam_masuk').value, "HH:mm", "en_US");
    // let jam_keluar = formatDate(this.entryForm.get('jam_keluar').value, "HH:mm", "en_US");

    let frmData = this.entryForm.value;
    frmData['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');

    // let dataSubmit :PksSounding = {
    //   'mill_id': this.entryForm.get('mill_id').value.id,
    //   'tanki_id': this.entryForm.get('tanki_id').value.id,
    //   'no_transaksi':this.entryForm.get('no_transaksi').value,
    //   // 'estate_id': this.entryForm.get('estate_id').value.id,
    //   // 'supplier_id': this.entryForm.get('supplier_id').value.id,
    //   // 'jumlah_item':this.entryForm.get('jumlah_item').value,
    //   // 'item_id': this.entryForm.get('item_id').value.id,
    //   'tanggal': formatDate(this.entryForm.get('tanggal').value, "yyy-MM-dd", "en_US"),
    //   // 'jam_masuk': jam_masuk,
    //   // 'jam_keluar':jam_keluar,
    //   // 'no_tiket': this.entryForm.get('no_tiket').value,
    //   // 'no_spat': this.entryForm.get('no_spat').value,
    //   // 'berat_bersih':this.entryForm.get('berat_bersih').value,
    //   'tinggi':this.entryForm.get('tinggi').value,
    //   'tinggi':this.entryForm.get('tinggi').value,
    //   'suhu':this.entryForm.get('suhu').value,
    //   // 'berat_kosong':this.entryForm.get('berat_kosong').value,
    //   // 'berat_isi':this.entryForm.get('berat_isi').value,
    //   // 'jumlah_berondolan':this.entryForm.get('jumlah_berondolan').value,
    //   // 'no_plat': this.entryForm.get('no_kendaraan').value,
    //   // 'nama_supir':this.entryForm.get('nama_supir').value,
    //   // 'keterangan':this.entryForm.get('keterangan').value,
    //   // 'tipe':this.entryForm.get('tipe').value.id,
    // };


    console.log(frmData);
    this.pksSoundingService.create(frmData).subscribe(data=>{
      // console.log(data);
      if( data['status']=='OK'){
        console.log(data);
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
          text: 'Proses Simpan Gagal:'+data['data'] ,
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
  valueChange(){
    // this.entryForm.controls['tanki_id'].valueChanges.subscribe(val=> {
    //   this.getTankiDetail(val['id']);
    // });
    // this.entryForm.controls['tinggi'].valueChanges.subscribe(val=> {
    //   this.getVolume();
    // });
  }

  getTankiDetail(id) {
    // this.PksTankiService.getAllDetail(id).subscribe(x=>{
    //   this.dataTankiDetail = x;
    // });
  }

  getVolume() {
    let tinggi = this.entryForm.controls['tinggi'].value;

    this.entryForm.controls['volume'].patchValue(0);
    this.dataTankiDetail['data'].forEach(d => {
      if (tinggi>=d.tinggi_dari && tinggi<=d.tinggi_sd) {
        this.entryForm.controls['volume'].patchValue(d.volume);
      //   console.log(d.volume);
      }
    });
  }
}
