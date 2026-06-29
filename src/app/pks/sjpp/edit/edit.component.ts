import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";

import { PksSjpp } from 'src/app/shared/models/pks_sjpp.model';
import { PksSjppService } from 'src/app/shared/services/pks_sjpp.service';

import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { GbmCustomerService } from 'src/app/shared/services/gbm_customer.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { PksTankiService } from 'src/app/shared/services/pks_tanki.service';
import { PksTransportService } from 'src/app/shared/services/pks_transport.service';
import { PksLabService } from 'src/app/shared/services/pks_lab.service';
import { SlsKontrakService } from 'src/app/shared/services/sls_kontrak.service';
import { SlsIntruksiService } from 'src/app/shared/services/sls_intruksi.service';

import { PksTimbanganKirimService } from 'src/app/shared/services/pks_timbangan_kirim.service';

import { LookupTimbanganKirimComponent } from '../lookup-timbangan-kirim/lookup-timbangan-kirim.component';

import { formatDate } from '@angular/common';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SERVER_PATH_URL } from 'src/app/app.constants';

declare var $: any;

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
  PksSjpp:PksSjpp;
  dbName;
  pathName;
  PATH_URL;

  dataSelectMill;
  dataSelectTanki;
  dataSelectProduk;
  dataSelectIntruksi;
  dataSelectKontrak;
  dataSelectTransport;
  dataSelectCustomer;

  timbangan = [];

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private bsModalRef1: BsModalRef,
    private bsModalService: BsModalService,

    private PksSjppService:PksSjppService,
    private PksTankiService: PksTankiService,
    private InvItemService: InvItemService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private SlsIntruksiService: SlsIntruksiService,
    private SlsKontrakService: SlsKontrakService,
    private PksTransportService: PksTransportService,
    private PksLabService: PksLabService,
    private GbmCustomerService: GbmCustomerService,
    private PksTimbanganKirimService: PksTimbanganKirimService,

    private authenticationService: AuthenticationService,
    ) {
      this.dbName= this.authenticationService.getUserDB();
      this.pathName= this.authenticationService.getUserPath();
      this.PATH_URL=SERVER_PATH_URL;

      let toDate: Date = new Date();

      this.entryForm = this.builder.group({
        pks_timbangan_kirim_id: new FormControl(null, Validators.required),

        tanggal: new FormControl(toDate, Validators.required),

        mill_id: new FormControl([], Validators.required),
        // tanki_id: new FormControl([], Validators.required),
        // produk_id: new FormControl([], Validators.required),
        intruksi_id: new FormControl([], Validators.required),
        customer_id: new FormControl([]),
        // kontrak_id: new FormControl([], Validators.required),
        // transport_id: new FormControl([], Validators.required),
        // lab_id: new FormControl([], Validators.required),

        ffa: new FormControl(0, Validators.required),
        moisture: new FormControl(0, Validators.required),
        dirt: new FormControl(0, Validators.required),
        dobi: new FormControl(0, Validators.required),

        // segel_1: new FormControl(null, Validators.required),
        // segel_2: new FormControl(null, Validators.required),
        // segel_3: new FormControl(null, Validators.required),

        // nama_pelanggan: new FormControl(null, Validators.required),
        alamat_pengiriman: new FormControl(null, Validators.required),

        no_surat: new FormControl('(Auto Generate)', Validators.required),
        no_ktp_sim: new FormControl('', Validators.required),
        no_segel: new FormControl('', Validators.required),
        // no_polisi: new FormControl(null, Validators.required),
        // nama_pengemudi: new FormControl(null, Validators.required),
        // berat_kirim: new FormControl(0, Validators.required),

        // no_kendaraan: new FormControl(null, Validators.required),
        // no_kartu_timbang: new FormControl(null, Validators.required),
        // tara_kirim: new FormControl(null, Validators.required),
        // bruto_kirim: new FormControl(null, Validators.required),
        // netto_kirim: new FormControl(null, Validators.required),

      });




  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {
    this.entryForm.controls['pks_timbangan_kirim_id'].patchValue(this.PksSjpp.pks_timbangan_kirim_id);

    this.entryForm.controls['mill_id'].patchValue(this.PksSjpp.mill_id);
    // this.entryForm.controls['tanki_id'].patchValue(this.PksSjpp.tanki_id);
    // this.entryForm.controls['produk_id'].patchValue(this.PksSjpp.produk_id);
    this.entryForm.controls['intruksi_id'].patchValue(this.PksSjpp.intruksi_id);
    // this.entryForm.controls['kontrak_id'].patchValue(this.PksSjpp.kontrak_id);
    // this.entryForm.controls['transport_id'].patchValue(this.PksSjpp.transport_id);
    // this.entryForm.controls['lab_id'].patchValue(this.PksSjpp.lab_id);

    this.entryForm.controls['ffa'].patchValue(this.PksSjpp.ffa);
    this.entryForm.controls['moisture'].patchValue(this.PksSjpp.moisture);
    this.entryForm.controls['dirt'].patchValue(this.PksSjpp.dirt);
    this.entryForm.controls['dobi'].patchValue(this.PksSjpp.dobi);

    this.entryForm.controls['no_surat'].patchValue(this.PksSjpp.no_surat);
    this.entryForm.controls['no_ktp_sim'].patchValue(this.PksSjpp.no_ktp_sim);
    this.entryForm.controls['no_segel'].patchValue(this.PksSjpp.no_segel);
    // this.entryForm.controls['no_polisi'].patchValue(this.PksSjpp.no_polisi);
    // this.entryForm.controls['nama_pengemudi'].patchValue(this.PksSjpp.nama_pengemudi);
    // this.entryForm.controls['berat_kirim'].patchValue(this.PksSjpp.berat_kirim);

    // this.entryForm.controls['no_kendaraan'].patchValue(this.PksSjpp.no_kendaraan);
    // this.entryForm.controls['no_kartu_timbang'].patchValue(this.PksSjpp.no_kartu_timbang);
    // this.entryForm.controls['tara_kirim'].patchValue(this.PksSjpp.tara_kirim);
    // this.entryForm.controls['bruto_kirim'].patchValue(this.PksSjpp.bruto_kirim);
    // this.entryForm.controls['netto_kirim'].patchValue(this.PksSjpp.netto_kirim);

    // this.entryForm.controls['nama_pelanggan'].patchValue(this.PksSjpp.nama_pelanggan);
    this.entryForm.controls['alamat_pengiriman'].patchValue(this.PksSjpp.alamat_pengiriman);

    // this.entryForm.controls['segel_1'].patchValue(this.PksSjpp.segel_1);
    // this.entryForm.controls['segel_2'].patchValue(this.PksSjpp.segel_2);
    // this.entryForm.controls['segel_3'].patchValue(this.PksSjpp.segel_3);

    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.PksSjpp.tanggal)));


  }
  public options: any;

  private formChange(): void {

    let idIntruksi;
    this.entryForm.controls['intruksi_id'].valueChanges.subscribe(x=> {
      idIntruksi = x.id;
      this.SlsIntruksiService.getAll().subscribe(x=> {
        // console.log(x);
        x['data'].forEach(x=> {
          if (idIntruksi == x.id) {
            // this.GbmCustomerService.getById(x.cust).subscribe(x=> {
            //   this.entryForm.get('nama_pelanggan').patchValue(x['data'].nama_customer);
            // });
            this.entryForm.get('alamat_pengiriman').patchValue(x.alamat_pengiriman);
          }
        });
      });
    });

  }

  getPremi( data ) {
    let tanki_id;
    let tanggal_pengiriman;

    tanki_id = this.entryForm.controls['tanki_id'].value['id'];
    tanggal_pengiriman = formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');

    this.PksLabService.getAll().subscribe(x=> {
      x['data'].forEach(x=> {
        // console.log(x);
        if (tanki_id==x.tanki_id && tanggal_pengiriman==x.tanggal) {
          // console.log('match case');
          this.entryForm.get('lab_id').patchValue(x.id);
          this.entryForm.get('ffa').patchValue(x.ffa);
          this.entryForm.get('kadar_air_cpo').patchValue(x.kadar_air_cpo);
          this.entryForm.get('kadar_air_kernel').patchValue(x.kadar_air_cpo);
          this.entryForm.get('dirt').patchValue(x.dirt);
          this.entryForm.get('dobi').patchValue(x.dobi);
        }
      });
    });
  }

  private loadSelect2(): void {

    let selectedMill;
    this.GbmOrganisasiService.getAllByType('MILL').subscribe(x=>{
      this.dataSelectMill=[];
      x.forEach(d => {
        this.dataSelectMill.push({"id":d.id,"text":d.nama});
        if (this.PksSjpp.mill_id == d.id) {
          selectedMill = { "id": d.id, "text": d.nama };
        }
      });
      this.entryForm.get('mill_id').patchValue(selectedMill);
    });

    // let selectedtanki;
    // this.PksTankiService.getAll().subscribe(x=>{
    //   this.dataSelectTanki=[];
    //   x['data'].forEach(d => {
    //     this.dataSelectTanki.push({"id":d.id,"text":d.nama_tanki});
    //     if (this.PksSjpp.tanki_id == d.id) {
    //       selectedtanki = { "id": d.id, "text": d.nama_tanki }
    //     }
    //   });
    //   this.entryForm.get('tanki_id').patchValue(selectedtanki);
    // });

    // let selectedProduk;
    // this.InvItemService.getAll().subscribe(x=>{
    //   this.dataSelectProduk=[];
    //   x['data'].forEach(d => {
    //     this.dataSelectProduk.push({"id":d.id,"text":d.nama});
    //     if (this.PksSjpp.produk_id == d.id) {
    //       selectedProduk = { "id": d.id, "text": d.nama }
    //     }
    //   });
    //   this.entryForm.get('produk_id').patchValue(selectedProduk);
    // });

    let selectedIntruksi;
    this.SlsIntruksiService.getAll().subscribe(x=>{
      this.dataSelectIntruksi=[];
      x['data'].forEach(d => {
        this.dataSelectIntruksi.push({"id":d.id,"text":d.no_transaksi+" - "+d.no_spk+" - "+d.nama_customer});
        if (this.PksSjpp.intruksi_id == d.id) {
          selectedIntruksi = { "id": d.id, "text":d.no_transaksi+" - "+d.no_spk+" - "+d.nama_customer  }
        }
      });
      this.entryForm.get('intruksi_id').patchValue(selectedIntruksi);
    });

    let selectedCustomer;
    this.GbmCustomerService.getAll().subscribe(x=>{
      this.dataSelectCustomer=[];
      x['data'].forEach(d => {
        this.dataSelectCustomer.push({ "id": d.id, "text":"("+d.kode_customer+") "+d.nama_customer });
        console.log('DATA CUSTOMER =>',this.PksSjpp.customer_id);
        if (this.PksSjpp.customer_id == d.id) {
          selectedCustomer = { "id": d.id, "text":"("+d.kode_customer+") "+d.nama_customer  }
        }
      });
      this.entryForm.get('customer_id').patchValue(selectedCustomer);
    });

    // let selectedKontrak;
    // this.SlsKontrakService.getAll().subscribe(x=>{
    //   this.dataSelectKontrak=[];
    //   x['data'].forEach(d => {
    //     this.dataSelectKontrak.push({"id":d.id,"text":d.no_spk});
    //     if (this.PksSjpp.kontrak_id == d.id) {
    //       selectedKontrak = { "id": d.id, "text": d.no_spk }
    //     }
    //   });
    //   this.entryForm.get('kontrak_id').patchValue(selectedKontrak);
    // });

    // let selectedTransport;
    // this.PksTransportService.getAll().subscribe(x=>{
    //   this.dataSelectTransport=[];
    //   x['data'].forEach(d => {
    //     this.dataSelectTransport.push({"id":d.id,"text":d.kode});
    //     if (this.PksSjpp.transport_id == d.id) {
    //       selectedTransport = { "id": d.id, "text": d.kode }
    //     }
    //   });
    //   this.entryForm.get('transport_id').patchValue(selectedTransport);
    // });


  }


  onTimbanganExists() {
    this.entryForm.controls['pks_timbangan_kirim_id'].valueChanges.subscribe(x => {
      this.PksTimbanganKirimService.getById(x).subscribe(timbangan => {
        this.timbangan = timbangan['data'];
        this.entryForm.get('no_segel').patchValue(this.timbangan['no_segel']);
        this.entryForm.get('ffa').patchValue(this.timbangan['ffa']);
        this.entryForm.get('moisture').patchValue(this.timbangan['moisture']);
        this.entryForm.get('dirt').patchValue(this.timbangan['dirt']);
        this.entryForm.get('dobi').patchValue(this.timbangan['dobi']);
      });
    });
  }
  showTimbangan() {
    this.PksTimbanganKirimService.getAll().subscribe(t => {

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        class: "modal-lg ",
        initialState: {
          PksTimbanganKirim: t['data']
        }
      };
      this.bsModalRef1 = this.bsModalService.show(LookupTimbanganKirimComponent, modalConfig);
      this.bsModalRef1.content.event.subscribe(item => {
        if (item == null) {
        } else {
          this.showNotification('top', 'right', "No Timbangan " + item['no_tiket'] + " ", 2);

          this.timbangan = item;
          this.entryForm.get('pks_timbangan_kirim_id').patchValue( item['id'] );

          // this.entryForm.get('no_kartu_timbang').patchValue(item['no_tiket']);

          // this.entryForm.get('tara_kirim').patchValue(item['tara_kirim']);
          // this.entryForm.get('bruto_kirim').patchValue(item['bruto_kirim']);
          // this.entryForm.get('netto_kirim').patchValue(item['netto_kirim']);

          // this.entryForm.get('nama_pengemudi').patchValue(item['nama_supir']);
          // this.entryForm.get('no_kendaraan').patchValue(item['no_kendaraan']);
          // this.entryForm.get('no_polisi').patchValue(item['no_kendaraan']);

          // this.entryForm.get('pks_timbangan_kirim_id').patchValue( item['id'] );

          // let berat_bersih=parseFloat(item['berat_bersih']);
          // let items = this.entryForm.get('details') as FormArray;
          // let totJanjang=0;
          // for (let c of items.controls) {
          //   totJanjang=totJanjang+parseFloat(c.get('jumlah_janjang').value);
          // }
          // for (let c of items.controls) {
          //   c.get('kg_pabrik').patchValue((c.get('jumlah_janjang').value)/totJanjang * berat_bersih);
          //   c.get('bjr_pabrik').patchValue((c.get('kg_pabrik').value)/(c.get('jumlah_janjang').value));
          // }
        }
      });
    });
  }
  showNotification(from, align, message, color = 4) {
    var type = ['', 'info', 'success', 'warning', 'danger', 'rose', 'primary'];
    console.log(type[color]);
    $.notify({
      icon: "notifications",
      message: message
    }, {
      type: type[color],
      timer: 3000,
      placement: {
        from: from,
        align: align
      }
    });
  }



  onSubmit(){
    // console.log(this.entryForm.value);

    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }


    let frmData = this.entryForm.value;
    frmData['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');

    console.log(frmData);
    
    this.PksSjppService.updateSjpp(this.PksSjpp.id,frmData).subscribe(data=>{
      console.log(data);
      if( data['status']=='OK'){
        // console.log('ok');
        this.event.emit('OK');
        this.bsModalRef.hide();
      }
    });
  }


  onClose(){
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.onTimbanganExists();
    this.formChange();
    this.loadSelect2();

    // // console.log(this.PksSjpp);
    // this.entryForm = this.builder.group({
    //   nip: new FormControl(this.PksSjpp.nip,[Validators.required]),
    //   nama: new FormControl(this.PksSjpp.nama, [Validators.required]),
    //   jenis_kelamin: new FormControl(this.PksSjpp.jenis_kelamin, [Validators.required]),
    //   tgl_lahir:   new FormControl(new Date(Date.parse(this.PksSjpp.tgl_lahir)), Validators.required),
    //   tempat_lahir: new FormControl(this.PksSjpp.tempat_lahir, []),
    //   alamat: new FormControl(this.PksSjpp.alamat, []),
    //   username: new FormControl(this.PksSjpp.username, []),
    //   password: new FormControl(this.PksSjpp.password, []),
    // });


  }
  valueChange($event){
    // console.log($event);

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
    // console.log(this.isChangePhoto);
 }
}
