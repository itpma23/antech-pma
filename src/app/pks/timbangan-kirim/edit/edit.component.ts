import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";

import { formatDate } from '@angular/common';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SERVER_PATH_URL } from 'src/app/app.constants';

import { PksTimbanganKirim } from 'src/app/shared/models/pks_timbangan_kirim.model';
import { PksTimbanganKirimService } from 'src/app/shared/services/pks_timbangan_kirim.service';

import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmCustomerService } from 'src/app/shared/services/gbm_customer.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { PksTankiService } from 'src/app/shared/services/pks_tanki.service';
import { SlsIntruksiService } from 'src/app/shared/services/sls_intruksi.service';
declare var swal: any;

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
  PksTimbanganKirim:PksTimbanganKirim;
  dbName;
  pathName;
  PATH_URL;

  dataSelectTipe;
  dataSelectMill;
  dataSelectEstate;
  dataSelectItem;
  dataSelectCustomer;
  dataSelectTanki;
  dataselectTransportir;
  dataSelectIntruksi: any[];

  constructor(
    private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private PksTimbanganKirimService: PksTimbanganKirimService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private invItemService:InvItemService,
    private GbmCustomerService:GbmCustomerService,
    private PksTankiService:PksTankiService,
    private GbmSupplierService:GbmSupplierService,
    private SlsIntruksiService: SlsIntruksiService,
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
        tangki_id: new FormControl([], Validators.required),
        transportir_id: new FormControl([], Validators.required),
        customer_id: new FormControl([], Validators.required),
        instruksi_id: new FormControl([], Validators.required),
        no_surat: new FormControl('', Validators.required),
        no_ktp_sim: new FormControl('', Validators.required),
        tanggal: new FormControl(toDate, Validators.required),

        no_tiket: new FormControl(null, Validators.required),
        no_referensi: new FormControl(''),
        no_do_timbangan: new FormControl(''),
        no_kontrak_timbangan: new FormControl(''),
        no_kendaraan: new FormControl(null, Validators.required),
        nama_supir: new FormControl(null, Validators.required),

        jam_masuk: new FormControl(time, Validators.required),
        jam_keluar: new FormControl(time, Validators.required),

        ffa: new FormControl(0, Validators.required),
        dobi: new FormControl(0, Validators.required),
        suhu: new FormControl(0, Validators.required),
        dirt: new FormControl(0, Validators.required),
        moisture: new FormControl(0, Validators.required),
        mi: new FormControl(0, Validators.required),

        jumlah_segel: new FormControl(0, Validators.required),
        no_segel: new FormControl("" ),
        segel_1: new FormControl("" ),
        segel_2: new FormControl(""),
        segel_3: new FormControl("" ),
        segel_4: new FormControl("", ),
        segel_5: new FormControl("", ),

        tara_kirim: new FormControl(0, Validators.required),
        bruto_kirim: new FormControl(0, Validators.required),
        netto_kirim: new FormControl(0, Validators.required),

        keterangan: new FormControl(""),

      });




  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {

    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.PksTimbanganKirim.tanggal)));

    console.log(this.PksTimbanganKirim);
    // this.entryForm.controls['kode'].patchValue(this.PksTimbanganKirim.kode);

    let date: Date = new Date();
    let strDate = formatDate(date, "yyyy-MM-dd", "en_US");
    this.entryForm.get('jam_masuk').patchValue(strDate + " " + this.PksTimbanganKirim['jam_masuk']);
    this.entryForm.get('jam_keluar').patchValue(strDate + " " + this.PksTimbanganKirim['jam_keluar']);

    this.entryForm.controls['no_tiket'].patchValue(this.PksTimbanganKirim.no_tiket);
    this.entryForm.controls['no_referensi'].patchValue(this.PksTimbanganKirim.no_referensi);
    this.entryForm.controls['no_do_timbangan'].patchValue(this.PksTimbanganKirim.no_do_timbangan);
    this.entryForm.controls['no_kontrak_timbangan'].patchValue(this.PksTimbanganKirim.no_kontrak_timbangan);
    this.entryForm.controls['no_kendaraan'].patchValue(this.PksTimbanganKirim.no_kendaraan);
    this.entryForm.controls['nama_supir'].patchValue(this.PksTimbanganKirim.nama_supir);
    this.entryForm.controls['no_ktp_sim'].patchValue(this.PksTimbanganKirim.no_ktp_sim);
    this.entryForm.controls['no_surat'].patchValue(this.PksTimbanganKirim.no_surat);
    // this.entryForm.controls['jumlah_item'].patchValue(this.PksTimbanganKirim.jumlah_item);
    // this.entryForm.controls['jumlah_berondolan'].patchValue(this.PksTimbanganKirim.jumlah_berondolan);

    this.entryForm.controls['ffa'].patchValue(this.PksTimbanganKirim.ffa);
    this.entryForm.controls['dobi'].patchValue(this.PksTimbanganKirim.dobi);
    this.entryForm.controls['suhu'].patchValue(this.PksTimbanganKirim.suhu);
    this.entryForm.controls['dirt'].patchValue(this.PksTimbanganKirim.dirt);
    this.entryForm.controls['moisture'].patchValue(this.PksTimbanganKirim.moisture);

    this.entryForm.controls['jumlah_segel'].patchValue(this.PksTimbanganKirim.jumlah_segel);
    this.entryForm.controls['no_segel'].patchValue(this.PksTimbanganKirim.no_segel);
    this.entryForm.controls['segel_1'].patchValue(this.PksTimbanganKirim.segel_1);
    this.entryForm.controls['segel_2'].patchValue(this.PksTimbanganKirim.segel_2);
    this.entryForm.controls['segel_3'].patchValue(this.PksTimbanganKirim.segel_3);

    this.entryForm.controls['segel_4'].patchValue(this.PksTimbanganKirim.segel_4);
    this.entryForm.controls['segel_5'].patchValue(this.PksTimbanganKirim.segel_5);

    this.entryForm.controls['tara_kirim'].patchValue(this.PksTimbanganKirim.tara_kirim);
    this.entryForm.controls['netto_kirim'].patchValue(this.PksTimbanganKirim.netto_kirim);
    this.entryForm.controls['bruto_kirim'].patchValue(this.PksTimbanganKirim.bruto_kirim);

    this.entryForm.controls['keterangan'].patchValue(this.PksTimbanganKirim.keterangan);
  }
  public options: any;


  private loadSelect2(): void {

    // this.dataSelectTipe = [
    //   { id: 'INT', text: 'INTERNAL' },
    //   { id: 'EXT', text: 'EXTERNAL' },
    //   { id: 'AFL', text: 'AFILIASI' },
    // ];

    // let selectTipe;
    // this.dataSelectTipe.forEach(a => {
    //   if (a.id == this.PksTimbanganKirim.tipe) {
    //     selectTipe = a;
    //   }
    // });
    // this.entryForm.controls['tipe'].patchValue(selectTipe);


    let selectMill;
    this.GbmOrganisasiService.getAllByType('MILL').subscribe(x => {
      this.dataSelectMill = [];
      x.forEach(d => {
        this.dataSelectMill.push({ "id": d.id, "text": d.nama });
      });
      this.dataSelectMill.forEach(a => {
        if (a.id == this.PksTimbanganKirim.mill_id) {
          selectMill = a;
        }
      });
      this.entryForm.controls['mill_id'].patchValue(selectMill);
    });


    let selectItem;
    this.invItemService.getAllProduk().subscribe(x => {
      this.dataSelectItem = [];
      x['data'].forEach(d => {
        this.dataSelectItem.push({ "id": d.id, "text": d.nama });
        if (d.id == this.PksTimbanganKirim.item_id) {
          selectItem = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.controls['item_id'].patchValue(selectItem);
    });

    let selectTanki;
    this.PksTankiService.getAll().subscribe(x => {
      this.dataSelectTanki = [];
      x['data'].forEach(d => {
        this.dataSelectTanki.push({ "id": d.id, "text": d.nama_tanki });
        if (d.id == this.PksTimbanganKirim.tangki_id) {
          selectTanki = { "id": d.id, "text": d.nama_tanki }
        }
      });
      this.entryForm.controls['tangki_id'].patchValue(selectTanki);
    });

    let selectTransportir;
    this.GbmSupplierService.getAll().subscribe(x => {
      this.dataselectTransportir = [];
      x['data'].forEach(d => {
        this.dataselectTransportir.push({ "id": d.id, "text": d.nama_supplier });
        if (d.id == this.PksTimbanganKirim.transportir_id) {
          selectTransportir = { "id": d.id, "text": d.nama_supplier }
        }
      });
      this.entryForm.controls['transportir_id'].patchValue(selectTransportir);
    });

    let selectCustomer;
    this.GbmCustomerService.getAll().subscribe(x => {
      this.dataSelectCustomer = [];
      x['data'].forEach(d => {
        this.dataSelectCustomer.push({ "id": d.id, "text": d.nama_customer });
        if (this.PksTimbanganKirim.customer_id == d.id) {
          selectCustomer = { "id": d.id, "text": d.nama_customer }
        }
      });
      this.entryForm.controls['customer_id'].patchValue(selectCustomer);
    });
    let selectInstruksi;
    this.SlsIntruksiService.getAll().subscribe(x=>{
      this.dataSelectIntruksi=[];
      let i = x['data'];
      console.log(x);
      i.forEach(d => {
          this.dataSelectIntruksi.push({"id":d.id,"text":d.no_transaksi+" - "+d.no_spk});
          if (this.PksTimbanganKirim.instruksi_id == d.id) {
            selectInstruksi = {"id":d.id,"text":d.no_transaksi+" - "+d.no_spk}
          }
      });
      this.entryForm.controls['instruksi_id'].patchValue(selectInstruksi);
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
    frmData['sjpp_id']=this.PksTimbanganKirim.sjpp_id
    this.PksTimbanganKirimService.update(this.PksTimbanganKirim.id,frmData).subscribe(data=>{
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


  onClose(){
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();

    // console.log(this.PksTimbanganKirim);
    // this.entryForm = this.builder.group({
    //   nip: new FormControl(this.PksTimbanganKirim.nip,[Validators.required]),
    //   nama: new FormControl(this.PksTimbanganKirim.nama, [Validators.required]),
    //   jenis_kelamin: new FormControl(this.PksTimbanganKirim.jenis_kelamin, [Validators.required]),
    //   tgl_lahir:   new FormControl(new Date(Date.parse(this.PksTimbanganKirim.tgl_lahir)), Validators.required),
    //   tempat_lahir: new FormControl(this.PksTimbanganKirim.tempat_lahir, []),
    //   alamat: new FormControl(this.PksTimbanganKirim.alamat, []),
    //   username: new FormControl(this.PksTimbanganKirim.username, []),
    //   password: new FormControl(this.PksTimbanganKirim.password, []),
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
