import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

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

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'add-cmp',
  templateUrl: 'add.component.html',
  styleUrls: ['add.component.css'],
})

export class AddComponent implements OnInit, AfterViewInit {
  editor_modules: any;
  isFormSubmitted = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }

  entryForm: FormGroup;
  categories: any[] = [];
  event: EventEmitter<any> = new EventEmitter();

  dataSelectMill;
  dataSelectTanki;
  dataSelectCustomer;
  dataSelectProduk;
  dataSelectIntruksi;
  dataSelectKontrak;
  dataSelectTransport;

  timbangan = [];

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private bsModalRef1: BsModalRef,
    private bsModalService: BsModalService,

    private PksSjppService: PksSjppService,
    private PksTankiService: PksTankiService,
    private InvItemService: InvItemService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private SlsIntruksiService: SlsIntruksiService,
    private SlsKontrakService: SlsKontrakService,
    private PksTransportService: PksTransportService,
    private PksLabService: PksLabService,
    private GbmCustomerService: GbmCustomerService,
    private PksTimbanganKirimService: PksTimbanganKirimService,

    private translate: TranslateService
  ) {
    let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      tanggal: new FormControl(toDate, Validators.required),

      mill_id: new FormControl([], Validators.required),
      intruksi_id: new FormControl([], Validators.required),
      customer_id: new FormControl([], Validators.required),

      no_surat: new FormControl('(Auto Generate)', Validators.required),
      no_ktp_sim: new FormControl('', Validators.required),
      alamat_pengiriman: new FormControl(null, Validators.required),

      pks_timbangan_kirim_id: new FormControl(null, Validators.required),

      // tanki_id: new FormControl([], Validators.required),
      // produk_id: new FormControl([], Validators.required),
      // kontrak_id: new FormControl([], Validators.required),
      // transport_id: new FormControl([], Validators.required),
      // lab_id: new FormControl([], Validators.required),

      ffa: new FormControl(0, Validators.required),
      moisture: new FormControl(0, Validators.required),
      dirt: new FormControl(0, Validators.required),
      dobi: new FormControl(0, Validators.required),

      no_segel: new FormControl('', Validators.required),

      // segel_1: new FormControl(null, Validators.required),
      // segel_2: new FormControl(null, Validators.required),
      // segel_3: new FormControl(null, Validators.required),

      // nama_pelanggan: new FormControl(null, Validators.required),

      // no_polisi: new FormControl(null, Validators.required),
      // nama_pengemudi: new FormControl(null, Validators.required),
      // berat_kirim: new FormControl(0, Validators.required),

      // no_kendaraan: new FormControl(null, Validators.required),
      // no_kartu_timbang: new FormControl(null, Validators.required),
      // tara_kirim: new FormControl(0, Validators.required),
      // bruto_kirim: new FormControl(0, Validators.required),
      // netto_kirim: new FormControl(0, Validators.required),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    this.loadSelect2();
    this.formChange();

  }
  public dataSelect: any[] = [];
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
    let m = this.translate.instant('holidays.messages.update');

    this.GbmOrganisasiService.getAllByType('MILL').subscribe(x=>{
      // console.log(x);
      this.dataSelectMill=[];
      x.forEach(d => {
        this.dataSelectMill.push({"id":d.id,"text":d.nama});
      });

    });

    this.PksTankiService.getAll().subscribe(x=>{
      this.dataSelectTanki=[];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectTanki.push({"id":d.id,"text":d.nama_tanki});
      });
    });

    this.GbmCustomerService.getAll().subscribe(x=>{
      this.dataSelectCustomer=[];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectCustomer.push({"id":d.id,"text":"("+d.kode_customer+") "+d.nama_customer});
      });
    });

    this.InvItemService.getAll().subscribe(x=>{
      this.dataSelectProduk=[];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectProduk.push({"id":d.id,"text":d.nama});
      });
    });


    // this.PksSjppService.getAll().subscribe(x=>{
    // });

    this.entryForm.controls['customer_id'].valueChanges.subscribe(x=>{
      let customer_id = x.id;
      this.SlsIntruksiService.getAll().subscribe(x=>{
        this.dataSelectIntruksi=[];
        let i = x['data'];
        console.log(x);
        i.forEach(d => {
          if (d.id_customer == customer_id) {
            this.dataSelectIntruksi.push({"id":d.id,"text":d.no_transaksi+" - "+d.no_spk+" - "+d.nama_customer});
          }
        });
      });
    });

    this.SlsKontrakService.getAll().subscribe(x=>{
      this.dataSelectKontrak=[];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectKontrak.push({"id":d.id,"text":d.no_spk});
      });
    });

    this.PksTransportService.getAll().subscribe(x=>{
      this.dataSelectTransport=[];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectTransport.push({"id":d.id,"text":d.kode});
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
          //PksTimbanganKirim: t['data'],
          intruksi_id: this.entryForm.get("intruksi_id").value['id'],
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




  onSubmit() {
    this.isFormSubmitted = true;
    console.log(this.entryForm);
    if (this.entryForm.invalid) {
      return;
    }

    let frmData = this.entryForm.value;
    frmData['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');

    console.log(frmData);
    this.PksSjppService.create(frmData).subscribe(data => {
      if (data['status'] == 'OK') {
        // console.log('ok');
        this.event.emit('OK');
        this.bsModalRef.hide();
      }
    });
  }

  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.entryForm.patchValue({
      img: file
    });
    this.entryForm.get('img').updateValueAndValidity()
    // // console.log(file);
  }
  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {

    this.editor_modules = {
      toolbar: {
        container: [
          [{ 'font': [] }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'header': 1 }, { 'header': 2 }],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'align': [] }],
          ['link', 'image']
        ]
      },

      imageResize: true
    };
  }
  valueChange($event) {
    // console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
}
