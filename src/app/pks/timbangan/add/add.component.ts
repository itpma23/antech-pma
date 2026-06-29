import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { PksTimbanganService } from 'src/app/shared/services/pks_timbangan.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { PksTimbangan } from 'src/app/shared/models/pks_timbangan.model';
import { formatDate } from '@angular/common';
import { isNullOrUndefined } from 'util';

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
  public dataSelectDivisi: any[] = [];
  public dataSelectRayon: any[] = [];



  public options: any;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private pksTimbanganService:PksTimbanganService,
    private invItemService:InvItemService,
    private gbmSupplierService:GbmSupplierService,
    private GbmOrganisasiService:GbmOrganisasiService


    ) {
      let toDate: Date = new Date();
      let time: Date = new Date();

    this.entryForm = this.builder.group({
      jumlah_item: new FormControl(0, Validators.required),
      jumlah_berondolan: new FormControl(0, Validators.required),

      berat_isi: new FormControl(0, Validators.required),
      berat_kosong: new FormControl(0, Validators.required),
      berat_bersih: new FormControl(0, Validators.required),
      berat_potongan: new FormControl(0, Validators.required),
      berat_terima: new FormControl(0, Validators.required),

      berat_potongan_persen : new FormControl(0,),

      tipe: new FormControl([],Validators.required),
      mill_id: new FormControl([], Validators.required),
      estate_id: new FormControl([], ),
      rayon_id: new FormControl([], ),
      // divisi_id: new FormControl([], ),
      item_id: new FormControl([], Validators.required),
      supplier_id: new FormControl([], ),
      transportir_id: new FormControl([], Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      jam_masuk: new FormControl(time, Validators.required),
      jam_keluar: new FormControl(time, Validators.required),
      no_tiket: new FormControl('', Validators.required),
      no_spat: new FormControl('', Validators.required),
      no_kendaraan: new FormControl('', Validators.required),
      nama_supir: new FormControl('', Validators.required),
      blok: new FormControl(''),
      keterangan: new FormControl(''),

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
      console.log(x);
      this.dataSelectMill=[];
      x.forEach(d => {
        this.dataSelectMill.push({"id":d.id,"text":d.nama});
      });

    });
    this.GbmOrganisasiService.getAllByType('ESTATE').subscribe(x=>{
      console.log(x);
      this.dataSelectEstate=[];
      x.forEach(d => {
        this.dataSelectEstate.push({"id":d.id,"text":d.nama});
      });

    });
    this.GbmOrganisasiService.getAllByType('AFDELING').subscribe(x=>{
      console.log(x);
      this.dataSelectRayon=[];
      x.forEach(d => {
        this.dataSelectRayon.push({"id":d.id,"text":d.nama});
      });
    });
    this.GbmOrganisasiService.getAllByType('AFDELING').subscribe(x=>{
      console.log(x);
      this.dataSelectDivisi=[];
      x.forEach(d => {
        this.dataSelectDivisi.push({"id":d.id,"text":d.nama});
      });
    });

    this.invItemService.getAllProduk().subscribe(x=>{

      this.dataSelectItem=[];
      x['data'].forEach(d => {
        this.dataSelectItem.push({"id":d.id,"text":d.nama});
      });

    });

    this.gbmSupplierService.getAll().subscribe(x=>{

      this.dataSelectSupplier=[];
      x['data'].forEach(d => {
        this.dataSelectSupplier.push({"id":d.id,"text":d.nama_supplier});
      });

    });

  }
  onSubmit(){
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let jam_masuk = formatDate(this.entryForm.get('jam_masuk').value, "HH:mm", "en_US");
    let jam_keluar = formatDate(this.entryForm.get('jam_keluar').value, "HH:mm", "en_US");
    // let supplier_id;
    // if (isNullOrUndefined(this.entryForm.get('supplier_id').value)!=true )  {
    //   if (isNullOrUndefined(this.entryForm.get('supplier_id').value!.id) ){
    //     supplier_id=null
    //   }else{
    //     supplier_id=this.entryForm.get('supplier_id').value.id;
    //   }

    // }else{
    //   supplier_id=null
    // }
    // let estate_id ;
    // if (isNullOrUndefined(this.entryForm.get('estate_id').value)!=true )  {
    //   if (isNullOrUndefined(this.entryForm.get('estate_id').value!.id) ){
    //     estate_id=null
    //   }else{
    //     estate_id=this.entryForm.get('estate_id').value.id;
    //   }

    // }else{
    //   estate_id=null
    // }
    // let divisi_id ;
    // if (isNullOrUndefined(this.entryForm.get('divisi_id').value)!=true )  {
    //   if (isNullOrUndefined(this.entryForm.get('divisi_id').value!.id) ){
    //     divisi_id=null
    //   }else{
    //     divisi_id=this.entryForm.get('divisi_id').value.id;
    //   }

    // }else{
    //   divisi_id=null
    // }
    let dataSubmit :PksTimbangan = {
      'mill_id': this.entryForm.get('mill_id').value.id,
      'estate_id': this.entryForm.get('estate_id').value.id,
      // 'divisi_id': this.entryForm.get('divisi_id').value.id,
      'rayon_id': this.entryForm.get('rayon_id').value.id,
      'supplier_id': this.entryForm.get('supplier_id').value.id,
      'transportir_id': this.entryForm.get('transportir_id').value.id,
      'jumlah_item':this.entryForm.get('jumlah_item').value,
      'item_id': this.entryForm.get('item_id').value.id,
      'tanggal': formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", "en_US"),
      'jam_masuk': jam_masuk,
      'jam_keluar':jam_keluar,
      'no_tiket': this.entryForm.get('no_tiket').value,
      'no_spat': this.entryForm.get('no_spat').value,
      'berat_bersih':this.entryForm.get('berat_bersih').value,
      'berat_kosong':this.entryForm.get('berat_kosong').value,
      'berat_isi':this.entryForm.get('berat_isi').value,
      'berat_potongan':this.entryForm.get('berat_potongan').value,
      'berat_potongan_persen':this.entryForm.get('berat_potongan_persen').value,
      'berat_terima':this.entryForm.get('berat_terima').value,
      'jumlah_berondolan':this.entryForm.get('jumlah_berondolan').value,
      'no_plat': this.entryForm.get('no_kendaraan').value,
      'nama_supir':this.entryForm.get('nama_supir').value,
      'keterangan':this.entryForm.get('keterangan').value,
      'blok':this.entryForm.get('blok').value,
      'tipe':this.entryForm.get('tipe').value.id,
      'uoid':'',


    };



    this.pksTimbanganService.create(dataSubmit).subscribe(data=>{
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
   totalKg() {

    let isi =  this.entryForm.get('berat_isi').value;
    let kosong =  this.entryForm.get('berat_kosong').value;

    // let potongan_kg = form.get('berat_potongan').value;

    let potongan_persen=  this.entryForm.get('berat_potongan_persen').value;

    let bersih = isi-kosong ;

    let pot_kg = (potongan_persen/100) * bersih;

    let terima = bersih - pot_kg ;
    this.entryForm.get('berat_potongan').patchValue(pot_kg.toFixed(0));
    this.entryForm.get('berat_bersih').patchValue(bersih);
    this.entryForm.get('berat_terima').patchValue(terima.toFixed(0));

  }
  valueChange($event){
    console.log($event);

  //  let selectedOptions = $event.target['options'];
  //  let selectedIndex = selectedOptions.selectedIndex;
  // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
}
