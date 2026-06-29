import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';


import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';;
import { PksTimbangan } from 'src/app/shared/models/pks_timbangan.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { PksTimbanganService } from 'src/app/shared/services/pks_timbangan.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { isNull, isNullOrUndefined } from 'util';
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
  public dataSelectMill: any[] = [];
  public dataSelectEstate: any[] = [];
  public dataSelectItem: any[] = [];
  public dataSelectSupplier: any[] = [];
  public dataSelectTransportir: any[] = [];
  public dataSelectDivisi: any[] = [];
  public dataSelectRayon: any[] = [];

  pksTimbangan: PksTimbangan;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private pksTimbanganService: PksTimbanganService,
    private invItemService: InvItemService,
    private gbmSupplierService: GbmSupplierService,
    private GbmOrganisasiService: GbmOrganisasiService


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

      tipe: new FormControl([], Validators.required),
      mill_id: new FormControl([], Validators.required),
      estate_id: new FormControl([] ),
      rayon_id: new FormControl([] ),
      // divisi_id: new FormControl([], Validators.required),
      blok: new FormControl(''),
      item_id: new FormControl([], Validators.required),
      supplier_id: new FormControl([]),
      transportir_id: new FormControl([], Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      jam_masuk: new FormControl(time, Validators.required),
      jam_keluar: new FormControl(time, Validators.required),
      no_tiket: new FormControl('', Validators.required),
      no_spat: new FormControl('', Validators.required),
      no_kendaraan: new FormControl('', Validators.required),
      nama_supir: new FormControl('', Validators.required),
      // tahun_tanam: new FormControl('', Validators.required),
      keterangan: new FormControl(''),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

    console.log(this.pksTimbangan);
    let date: Date = new Date();
    let strDate = formatDate(date, "yyyy-MM-dd", "en_US");
    let tanggal = new Date(Date.parse(this.pksTimbangan['tanggal']));


    this.entryForm.get('jam_masuk').patchValue(strDate + " " + this.pksTimbangan['jam_masuk']);
    this.entryForm.get('jam_keluar').patchValue(strDate + " " + this.pksTimbangan['jam_keluar']);
    this.entryForm.get('tanggal').patchValue(tanggal);
    this.entryForm.controls['no_tiket'].patchValue(this.pksTimbangan.no_tiket);
    this.entryForm.controls['no_spat'].patchValue(this.pksTimbangan.no_spat);
    this.entryForm.controls['keterangan'].patchValue(this.pksTimbangan.keterangan);
    this.entryForm.controls['no_kendaraan'].patchValue(this.pksTimbangan.no_plat);
    this.entryForm.controls['nama_supir'].patchValue(this.pksTimbangan.nama_supir);
    this.entryForm.controls['jumlah_item'].patchValue(this.pksTimbangan.jumlah_item);
    this.entryForm.controls['jumlah_berondolan'].patchValue(this.pksTimbangan.jumlah_berondolan);
    this.entryForm.controls['berat_bersih'].patchValue(this.pksTimbangan.berat_bersih);
    this.entryForm.controls['berat_potongan_persen'].patchValue(this.pksTimbangan.berat_potongan_persen);
    this.entryForm.controls['berat_isi'].patchValue(this.pksTimbangan.berat_isi);
    this.entryForm.controls['berat_kosong'].patchValue(this.pksTimbangan.berat_kosong);
    this.entryForm.controls['berat_potongan'].patchValue(this.pksTimbangan.berat_potongan);
    this.entryForm.controls['berat_terima'].patchValue(this.pksTimbangan.berat_terima);
    this.entryForm.controls['blok'].patchValue(this.pksTimbangan.blok);

    this.totalKg();


  }
  private loadSelect2(): void {


    this.dataSelectTipe = [
      { id: 'INT', text: 'INTERNAL' },
      { id: 'EXT', text: 'EXTERNAL' },
      { id: 'AFL', text: 'AFILIASI' },

    ];

    let selectTipe;
    this.dataSelectTipe.forEach(a => {
      if (a.id == this.pksTimbangan.tipe) {
        selectTipe = a;
      }
    });
    this.entryForm.controls['tipe'].patchValue(selectTipe);
    let selectMill;
    this.GbmOrganisasiService.getAllByType('MILL').subscribe(x => {
      console.log(x);
      this.dataSelectMill = [];
      x.forEach(d => {
        this.dataSelectMill.push({ "id": d.id, "text": d.nama });
      });

      this.dataSelectMill.forEach(a => {
        if (a.id == this.pksTimbangan.mill_id) {
          selectMill = a;
        }

      });
      this.entryForm.controls['mill_id'].patchValue(selectMill);

    });

    let selectEstate=[];
    this.GbmOrganisasiService.getAllByType('ESTATE').subscribe(x => {
      console.log(x);
      this.dataSelectEstate = [];
      x.forEach(d => {
        this.dataSelectEstate.push({ "id": d.id, "text": d.nama });
      });

      this.dataSelectEstate.forEach(a => {
        if (a.id == this.pksTimbangan.estate_id) {
          selectEstate = a;
        }

      });
      this.entryForm.controls['estate_id'].patchValue(selectEstate);

    });

    let selectRayon=[];
    this.GbmOrganisasiService.getAllByType('AFDELING').subscribe(x => {
      this.dataSelectRayon = [];
      x.forEach(d => {
        this.dataSelectRayon.push({ "id": d.id, "text": d.nama });
      });
      this.dataSelectRayon.forEach(a => {
        if (a.id == this.pksTimbangan.rayon_id) {
          selectRayon = a;
        }
      });
      this.entryForm.controls['rayon_id'].patchValue(selectRayon);
    });

    let selectDivisi=[];
    // this.GbmOrganisasiService.getAllByType('AFDELING').subscribe(x => {
    //   console.log(x);
    //   this.dataSelectDivisi = [];
    //   x.forEach(d => {
    //     this.dataSelectDivisi.push({ "id": d.id, "text": d.nama });
    //   });
    //   this.dataSelectDivisi.forEach(a => {
    //     if (a.id == this.pksTimbangan.divisi_id) {
    //       selectDivisi = a;
    //     }
    //   });
    //   this.entryForm.controls['divisi_id'].patchValue(selectDivisi);
    // });
    let selectItem=[];
    this.invItemService.getAllProduk().subscribe(x => {
      console.log(x);
      this.dataSelectItem = [];
      x['data'].forEach(d => {
        this.dataSelectItem.push({ "id": d.id, "text": d.nama });
      });


      this.dataSelectItem.forEach(a => {
        if (a.id == this.pksTimbangan.item_id) {
          selectItem = a;
        }

      });
      this.entryForm.controls['item_id'].patchValue(selectItem);

    });
    let selectSupplier=[];
    this.gbmSupplierService.getAll().subscribe(x => {

      this.dataSelectSupplier = [];
      x['data'].forEach(d => {
        this.dataSelectSupplier.push({ "id": d.id, "text": d.nama_supplier });
      });

      this.dataSelectSupplier.forEach(a => {
        if (a.id == this.pksTimbangan.supplier_id) {
          selectSupplier = a;
        }
        this.entryForm.controls['supplier_id'].patchValue(selectSupplier);
      });

    });

    let selectTransportir=[];
    this.gbmSupplierService.getAll().subscribe(x => {

      this.dataSelectTransportir = [];
      x['data'].forEach(d => {
        this.dataSelectTransportir.push({ "id": d.id, "text": d.nama_supplier });
      });

      this.dataSelectTransportir.forEach(a => {
        if (a.id == this.pksTimbangan.transportir_id) {
          selectTransportir = a;
        }
        this.entryForm.controls['transportir_id'].patchValue(selectTransportir);
      });

    });




  }

  onSubmit() {
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    // let frmData=new FormData();
    // if (this.entryForm.invalid) {
    //   return;
    // }

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
    let dataSubmit: PksTimbangan = {
      'mill_id': this.entryForm.get('mill_id').value.id,
      'estate_id': this.entryForm.get('estate_id').value.id,
      'rayon_id':this.entryForm.get('rayon_id').value? this.entryForm.get('rayon_id').value.id:null,
      // 'divisi_id': this.entryForm.get('divisi_id').value.id,
      'supplier_id': this.entryForm.get('supplier_id').value? this.entryForm.get('supplier_id').value.id:null,
      'transportir_id': this.entryForm.get('transportir_id').value.id,
      'jumlah_item': this.entryForm.get('jumlah_item').value,
      'item_id': this.entryForm.get('item_id').value.id,
      'tanggal': formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", "en_US"),
      'jam_masuk': jam_masuk,
      'jam_keluar': jam_keluar,
      'no_tiket': this.entryForm.get('no_tiket').value,
      'no_spat': this.entryForm.get('no_spat').value,
      'berat_bersih': this.entryForm.get('berat_bersih').value,
      'berat_kosong': this.entryForm.get('berat_kosong').value,
      'berat_isi': this.entryForm.get('berat_isi').value,
      'berat_potongan': this.entryForm.get('berat_potongan').value,
      'berat_potongan_persen': this.entryForm.get('berat_potongan_persen').value,
      'berat_terima': this.entryForm.get('berat_terima').value,
      'jumlah_berondolan': this.entryForm.get('jumlah_berondolan').value,
      'no_plat': this.entryForm.get('no_kendaraan').value,
      'nama_supir': this.entryForm.get('nama_supir').value,
      'keterangan': this.entryForm.get('keterangan').value,
      'blok': this.entryForm.get('blok').value,
      'tipe': this.entryForm.get('tipe').value.id,


    };
    console.log(dataSubmit);
    this.pksTimbanganService.update(this.pksTimbangan.id, dataSubmit).subscribe(data => {

      if (data['status'] == 'OK') {
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
      } else {
        swal({
          title: 'Perhatian!',
          text: 'Proses Simpan Gagal',
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
