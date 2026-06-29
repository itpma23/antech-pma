import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { PksTimbanganKirim } from 'src/app/shared/models/pks_timbangan_kirim.model';
import { PksTimbanganKirimService } from 'src/app/shared/services/pks_timbangan_kirim.service';

import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmCustomerService } from 'src/app/shared/services/gbm_customer.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { PksTankiService } from 'src/app/shared/services/pks_tanki.service';
import { SlsIntruksiService } from 'src/app/shared/services/sls_intruksi.service';
declare var swal: any;

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
  event: EventEmitter<any> = new EventEmitter();

  dataSelectTipe;
  dataSelectMill;
  dataSelectItem;
  dataSelectCustomer;
  dataSelectTransportir;
  dataSelectTanki
  dataSelectIntruksi: any[];

  constructor(
    private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private PksTimbanganKirimService: PksTimbanganKirimService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private invItemService: InvItemService,
    private GbmCustomerService: GbmCustomerService,
    private gbmSupplierService: GbmSupplierService,
    private PksTankiService: PksTankiService,
    private SlsIntruksiService: SlsIntruksiService,

    private translate: TranslateService
  ) {
    let toDate: Date = new Date();
    let time: Date = new Date();

    this.entryForm = this.builder.group({

      mill_id: new FormControl([], Validators.required),
      item_id: new FormControl([], Validators.required),
      tanki_id: new FormControl([], Validators.required),
      transportir_id: new FormControl([], Validators.required),
      customer_id: new FormControl([], Validators.required),
      instruksi_id: new FormControl([], Validators.required),
      no_surat: new FormControl('', Validators.required),
      no_ktp_sim: new FormControl('', Validators.required),
      // tipe: new FormControl("", Validators.required),
      tanggal: new FormControl(toDate, Validators.required),

      no_tiket: new FormControl('', Validators.required),
      no_referensi: new FormControl('', []),
      no_do: new FormControl('',[]),
      no_kontrak: new FormControl('', []),
      no_kendaraan: new FormControl('', Validators.required),
      nama_supir: new FormControl('', Validators.required),

      jam_masuk: new FormControl(time, Validators.required),
      jam_keluar: new FormControl(time, Validators.required),

      ffa: new FormControl(0, Validators.required),
      dobi: new FormControl(0, Validators.required),
      mi: new FormControl(0, Validators.required),
      suhu: new FormControl(0, Validators.required),
      dirt: new FormControl(0, Validators.required),
      moisture: new FormControl(0, Validators.required),
      jumlah_segel: new FormControl(0, Validators.required),
      no_segel: new FormControl("", ),
      segel_1: new FormControl("", ),
      segel_2: new FormControl("", ),
      segel_3: new FormControl("", ),
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
    this.loadSelect2();
  }
  public dataSelect: any[] = [];
  public options: any;

  private loadSelect2(): void {
    let m = this.translate.instant('holidays.messages.update');

    this.dataSelectTipe = [
      { id: 'INT', text: 'INTERNAL' },
      { id: 'EXT', text: 'EXTERNAL' },
      { id: 'AFL', text: 'AFILIASI' },
    ];

    this.GbmOrganisasiService.getAllByType('MILL').subscribe(x => {
      this.dataSelectMill = [];
      x.forEach(d => {
        this.dataSelectMill.push({ "id": d.id, "text": d.nama });
      });
    });

    this.invItemService.getAllProduk().subscribe(x => {
      this.dataSelectItem = [];
      x['data'].forEach(d => {
        this.dataSelectItem.push({ "id": d.id, "text": d.nama });
      });
    });

    this.GbmCustomerService.getAll().subscribe(x => {
      this.dataSelectCustomer = [];
      x['data'].forEach(d => {
        this.dataSelectCustomer.push({ "id": d.id, "text": d.nama_customer });
      });
    });

    this.gbmSupplierService.getAll().subscribe(x => {

      this.dataSelectTransportir = [];
      x['data'].forEach(d => {
        this.dataSelectTransportir.push({ "id": d.id, "text": d.nama_supplier });
      });

    });

    this.PksTankiService.getAll().subscribe(x => {
      this.dataSelectTanki = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectTanki.push({ "id": d.id, "text": d.nama_tanki });
      });
    });


    this.entryForm.controls['customer_id'].valueChanges.subscribe(x=>{
      let customer_id = x.id;
      this.SlsIntruksiService.getAll().subscribe(x=>{
        this.dataSelectIntruksi=[];
        let i = x['data'];
        console.log(x);
        i.forEach(d => {
          if (d.id_customer == customer_id) {
            this.dataSelectIntruksi.push({"id":d.id,"text":d.no_transaksi+" - "+d.no_spk});
          }
        });
      });
    });

  }
  onSubmit() {
    console.log(this.entryForm.value)
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let jam_masuk = formatDate(this.entryForm.get('jam_masuk').value, "HH:mm", "en_US");
    let jam_keluar = formatDate(this.entryForm.get('jam_keluar').value, "HH:mm", "en_US");

    // let frmData = this.entryForm.value;
    // frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    // frmData['jam_masuk'] = formatDate(this.entryForm.get('jam_masuk').value, "HH:mm", "en_US");
    // frmData['jam_keluar'] = formatDate(this.entryForm.get('jam_keluar').value, "HH:mm", "en_US");
    let dataSubmit :any = {
      'mill_id': this.entryForm.get('mill_id').value.id,
      'customer_id': this.entryForm.get('customer_id').value.id,
      'tangki_id': this.entryForm.get('tanki_id').value.id,
      'transportir_id': this.entryForm.get('transportir_id').value.id,
      'instruksi_id': this.entryForm.get('instruksi_id').value.id,
      'item_id': this.entryForm.get('item_id').value.id,
      'tanggal': formatDate(this.entryForm.get('tanggal').value, "yyy-MM-dd", "en_US"),
      'jam_masuk': jam_masuk,
      'jam_keluar':jam_keluar,
      'no_tiket': this.entryForm.get('no_tiket').value,
      'no_surat': this.entryForm.get('no_surat').value,
      'no_referensi': this.entryForm.get('no_referensi').value,
      'netto_kirim':this.entryForm.get('netto_kirim').value,
      'tara_kirim':this.entryForm.get('tara_kirim').value,
      'bruto_kirim':this.entryForm.get('bruto_kirim').value,
      'no_kendaraan': this.entryForm.get('no_kendaraan').value,
      'nama_supir':this.entryForm.get('nama_supir').value,
      'no_ktp_sim':this.entryForm.get('no_ktp_sim').value,
      'keterangan':this.entryForm.get('keterangan').value,
      'no_do_timbangan':this.entryForm.get('no_do').value,
      'no_kontrak_timbangan':this.entryForm.get('no_kontrak').value,
      'ffa':this.entryForm.get('ffa').value,
      'dobi':this.entryForm.get('dobi').value,
      'dirt':this.entryForm.get('dirt').value,
      'moisture':this.entryForm.get('moisture').value,
      'suhu':this.entryForm.get('suhu').value,
      'jumlah_segel':this.entryForm.get('jumlah_segel').value,
      'no_segel':this.entryForm.get('no_segel').value,
      'segel_1':this.entryForm.get('segel_1').value,
      'segel_2':this.entryForm.get('segel_2').value,
      'segel_3':this.entryForm.get('segel_3').value,
      'segel_4':this.entryForm.get('segel_4').value,
      'segel_5':this.entryForm.get('segel_5').value,


      'tipe':"",
      'uoid':'',


    };

    // console.log(frmData);
    this.PksTimbanganKirimService.create(dataSubmit).subscribe(data => {
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
    console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
}
