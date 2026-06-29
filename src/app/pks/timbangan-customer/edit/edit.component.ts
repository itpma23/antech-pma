import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";

import { formatDate } from '@angular/common';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SERVER_PATH_URL } from 'src/app/app.constants';

import { PksTimbanganCustomer } from 'src/app/shared/models/pks_timbangan_customer.model';
import { PksTimbanganCustomerService } from 'src/app/shared/services/pks_timbangan_customer.service';

import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmCustomerService } from 'src/app/shared/services/gbm_customer.service';

@Component({
  moduleId: module.id,
  selector: 'edit-cmp',
  styleUrls: ['edit.component.css'],
  templateUrl: 'edit.component.html'
})

export class EditComponent implements OnInit,AfterViewInit{
  isFormSubmitted=false;
  isChangePhoto=false;
	datepickerConfig = {
		dateInputFormat: 'DD-MM-YYYY',
		containerClass: 'theme-red'
	}
  entryForm: FormGroup;
  categories: any[] = [];
  event: EventEmitter<any>=new EventEmitter();
  PksTimbanganCustomer:PksTimbanganCustomer;
  dbName;
  pathName;
  PATH_URL;

  dataSelectTipe;
  dataSelectMill;
  dataSelectEstate;
  dataSelectItem;
  dataSelectCustomer;

  constructor(
    private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private PksTimbanganCustomerService: PksTimbanganCustomerService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private invItemService:InvItemService,
    private GbmCustomerService:GbmCustomerService,

    private authenticationService: AuthenticationService
    ) {
      this.dbName= this.authenticationService.getUserDB();
      this.pathName= this.authenticationService.getUserPath();
      this.PATH_URL=SERVER_PATH_URL;

      let toDate: Date = new Date();
      let time: Date = new Date();


      this.entryForm = this.builder.group({

        mill_id: new FormControl([], Validators.required),
        item_id: new FormControl([], Validators.required),
        estate_id: new FormControl([], Validators.required),
        customer_id: new FormControl([], Validators.required),

        tipe: new FormControl([], Validators.required),
        tanggal: new FormControl(toDate, Validators.required),

        no_tiket: new FormControl(null, Validators.required),
        no_referensi: new FormControl(null, Validators.required),
        no_kendaraan: new FormControl(null, Validators.required),
        nama_supir: new FormControl(null, Validators.required),

        jam_masuk: new FormControl(time, Validators.required),
        jam_keluar: new FormControl(time, Validators.required),

        jumlah_item: new FormControl(0, Validators.required),
        jumlah_berondolan: new FormControl(0, Validators.required),

        tara_kirim: new FormControl(0, Validators.required),
        bruto_kirim: new FormControl(0, Validators.required),
        netto_kirim: new FormControl(0, Validators.required),

        keterangan: new FormControl(null, Validators.required),

      });




  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {

    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.PksTimbanganCustomer.tanggal)));

    // console.log(this.PksTimbanganCustomer);
    // this.entryForm.controls['kode'].patchValue(this.PksTimbanganCustomer.kode);

    let date: Date = new Date();
    let strDate = formatDate(date, "yyyy-MM-dd", "en_US");
    this.entryForm.get('jam_masuk').patchValue(strDate + " " + this.PksTimbanganCustomer['jam_masuk']);
    this.entryForm.get('jam_keluar').patchValue(strDate + " " + this.PksTimbanganCustomer['jam_keluar']);

    this.entryForm.controls['no_tiket'].patchValue(this.PksTimbanganCustomer.no_tiket);
    this.entryForm.controls['no_referensi'].patchValue(this.PksTimbanganCustomer.no_referensi);
    this.entryForm.controls['keterangan'].patchValue(this.PksTimbanganCustomer.keterangan);
    this.entryForm.controls['no_kendaraan'].patchValue(this.PksTimbanganCustomer.no_kendaraan);
    this.entryForm.controls['nama_supir'].patchValue(this.PksTimbanganCustomer.nama_supir);
    this.entryForm.controls['jumlah_item'].patchValue(this.PksTimbanganCustomer.jumlah_item);
    this.entryForm.controls['jumlah_berondolan'].patchValue(this.PksTimbanganCustomer.jumlah_berondolan);
    this.entryForm.controls['netto_kirim'].patchValue(this.PksTimbanganCustomer.netto_kirim);
    this.entryForm.controls['tara_kirim'].patchValue(this.PksTimbanganCustomer.tara_kirim);
    this.entryForm.controls['bruto_kirim'].patchValue(this.PksTimbanganCustomer.bruto_kirim);


  }
  public options: any;


  private loadSelect2(): void {

    this.dataSelectTipe = [
      { id: 'INT', text: 'INTERNAL' },
      { id: 'EXT', text: 'EXTERNAL' },
      { id: 'AFL', text: 'AFILIASI' },
    ];

    let selectTipe;
    this.dataSelectTipe.forEach(a => {
      if (a.id == this.PksTimbanganCustomer.tipe) {
        selectTipe = a;
      }
    });
    this.entryForm.controls['tipe'].patchValue(selectTipe);


    let selectMill;
    this.GbmOrganisasiService.getAllByType('MILL').subscribe(x => {
      this.dataSelectMill = [];
      x.forEach(d => {
        this.dataSelectMill.push({ "id": d.id, "text": d.nama });
      });
      this.dataSelectMill.forEach(a => {
        if (a.id == this.PksTimbanganCustomer.mill_id) {
          selectMill = a;
        }
      });
      this.entryForm.controls['mill_id'].patchValue(selectMill);
    });

    let selectEstate;
    this.GbmOrganisasiService.getAllByType('ESTATE').subscribe(x => {
      this.dataSelectEstate = [];
      x.forEach(d => {
        this.dataSelectEstate.push({ "id": d.id, "text": d.nama });
      });
      this.dataSelectEstate.forEach(a => {
        if (a.id == this.PksTimbanganCustomer.estate_id) {
          selectEstate = a;
        }
      });
      this.entryForm.controls['estate_id'].patchValue(selectEstate);
    });

    let selectItem;
    this.invItemService.getAll().subscribe(x => {
      this.dataSelectItem = [];
      x['data'].forEach(d => {
        this.dataSelectItem.push({ "id": d.id, "text": d.nama });
        if (d.id == this.PksTimbanganCustomer.item_id) {
          selectItem = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.controls['item_id'].patchValue(selectItem);
    });

    let selectCustomer;
    this.GbmCustomerService.getAll().subscribe(x => {
      this.dataSelectCustomer = [];
      x['data'].forEach(d => {
        this.dataSelectCustomer.push({ "id": d.id, "text": d.nama_customer });
        if (this.PksTimbanganCustomer.customer_id == d.id) {
          selectCustomer = { "id": d.id, "text": d.nama_customer }
        }
      });
      this.entryForm.controls['customer_id'].patchValue(selectCustomer);
    });

  }


  onSubmit(){
    console.log(this.entryForm.value);

    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }


    let frmData = this.entryForm.value;
    frmData['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');
    frmData['jam_masuk']=formatDate(this.entryForm.get('jam_masuk').value, "HH:mm", "en_US");
    frmData['jam_keluar']=formatDate(this.entryForm.get('jam_keluar').value, "HH:mm", "en_US");


    this.PksTimbanganCustomerService.update(this.PksTimbanganCustomer.id,frmData).subscribe(data=>{
      console.log(data);
      if( data['status']=='OK'){
        console.log('ok');
        this.event.emit('OK');
        this.bsModalRef.hide();
      }
    });
  }


  onClose(){
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();

    // console.log(this.PksTimbanganCustomer);
    // this.entryForm = this.builder.group({
    //   nip: new FormControl(this.PksTimbanganCustomer.nip,[Validators.required]),
    //   nama: new FormControl(this.PksTimbanganCustomer.nama, [Validators.required]),
    //   jenis_kelamin: new FormControl(this.PksTimbanganCustomer.jenis_kelamin, [Validators.required]),
    //   tgl_lahir:   new FormControl(new Date(Date.parse(this.PksTimbanganCustomer.tgl_lahir)), Validators.required),
    //   tempat_lahir: new FormControl(this.PksTimbanganCustomer.tempat_lahir, []),
    //   alamat: new FormControl(this.PksTimbanganCustomer.alamat, []),
    //   username: new FormControl(this.PksTimbanganCustomer.username, []),
    //   password: new FormControl(this.PksTimbanganCustomer.password, []),
    // });


  }
  valueChange($event){
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
    this.isChangePhoto=true;
    console.log(this.isChangePhoto);
 }
}
