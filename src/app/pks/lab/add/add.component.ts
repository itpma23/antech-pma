import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { PksLabService } from 'src/app/shared/services/pks_lab.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { PksTankiService } from 'src/app/shared/services/pks_tanki.service';
import { PksLab } from 'src/app/shared/models/pks_lab.model';
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


  public options: any;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private pksLabService:PksLabService,
    private invItemService:InvItemService,
    private gbmSupplierService:GbmSupplierService,
    private GbmOrganisasiService:GbmOrganisasiService,
    private PksTankiService:PksTankiService


    ) {
      let toDate: Date = new Date();
      let time: Date = new Date();

    this.entryForm = this.builder.group({
      mill_id: new FormControl([], Validators.required),
      tanki_id: new FormControl([], Validators.required),
      tanggal: new FormControl(toDate, Validators.required),

      ffa: new FormControl(0, Validators.required),
      moisture: new FormControl(0, Validators.required),
      // kadar_air: new FormControl(0, Validators.required),
      dirt: new FormControl(0, Validators.required),
      dobi: new FormControl(0, Validators.required),
      jumlah: new FormControl(0, Validators.required),
      // no_transaksi: new FormControl('', Validators.required),
      // tinggi: new FormControl(0, Validators.required),
      // suhu: new FormControl(0, Validators.required),
    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

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
    this.GbmOrganisasiService.getAllByType('ESTATE').subscribe(x=>{
      // console.log(x);
      this.dataSelectEstate=[];
      x.forEach(d => {
        this.dataSelectEstate.push({"id":d.id,"text":d.nama});
      });

    });

    this.invItemService.getAll().subscribe(x=>{
      // console.log(x);
      this.dataSelectItem=[];
      x['data'].forEach(d => {
        this.dataSelectItem.push({"id":d.id,"text":d.nama});
      });

    });

    this.gbmSupplierService.getAll().subscribe(x=>{
      // console.log(x);
      this.dataSelectSupplier=[];
      x['data'].forEach(d => {
        this.dataSelectSupplier.push({"id":d.id,"text":d.nama_supplier});
      });
    });

    this.PksTankiService.getAll().subscribe(x=>{
      // console.log(x);
      this.dataSelectTanki=[];
      x['data'].forEach(d => {
        this.dataSelectTanki.push({"id":d.id,"text":d.nama_tanki});
      });
    });

  }
  onSubmit(){
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    // let jam_masuk = formatDate(this.entryForm.get('jam_masuk').value, "HH:mm", "en_US");
    // let jam_keluar = formatDate(this.entryForm.get('jam_keluar').value, "HH:mm", "en_US");

    let dataSubmit :PksLab = {
      'mill_id': this.entryForm.get('mill_id').value.id,
      'tanki_id': this.entryForm.get('tanki_id').value.id,
      'tanggal': formatDate(this.entryForm.get('tanggal').value, "yyy-MM-dd", "en_US"),
      'ffa':this.entryForm.get('ffa').value,
      'moisture':this.entryForm.get('moisture').value,
      // 'kadar_air':this.entryForm.get('kadar_air').value,
      'dirt':this.entryForm.get('dirt').value,
      'dobi':this.entryForm.get('dobi').value,
      'jumlah':this.entryForm.get('jumlah').value,
      // 'no_transaksi':this.entryForm.get('no_transaksi').value,
      // 'tinggi':this.entryForm.get('tinggi').value,
      // 'suhu':this.entryForm.get('suhu').value,
    };



    this.pksLabService.create(dataSubmit).subscribe(data=>{
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
