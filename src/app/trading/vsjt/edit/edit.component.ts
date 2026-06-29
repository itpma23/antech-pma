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
import { mixinDisabled } from '@angular/material';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'edit-cmp',
  styleUrls: ['edit.component.css'],
  templateUrl: 'edit.component.html'
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
  PksSjpp: any = [];
  dbName;
  pathName;
  PATH_URL;

  dataSelectMill;
  dataSelectTanki;
  dataSelectProduk;
  dataSelectIntruksi;
  dataSelectKontrak;
  dataSelectTransport;

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private bsModalRef1: BsModalRef,
    private bsModalService: BsModalService,

    private PksSjppService: PksSjppService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private SlsIntruksiService: SlsIntruksiService,

    private authenticationService: AuthenticationService,
  ) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;

    let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      tanggal: new FormControl({ value: toDate, disabled: true }),

      mill_id: new FormControl([], Validators.required),
      intruksi_id: new FormControl([], Validators.required),

      nama_pelanggan: new FormControl({ value: '', disabled: true }),
      alamat_pengiriman: new FormControl({ value: '', disabled: true }),

      no_surat: new FormControl({ value: '', disabled: true }),
      no_tiket: new FormControl({ value: '', disabled: true }),

      tanggal_customer: new FormControl(toDate, Validators.required),
      ffa_customer: new FormControl(0, Validators.required),
      dirt_customer: new FormControl(0, Validators.required),
      dobi_customer: new FormControl(0, Validators.required),
      moist_customer: new FormControl(0, Validators.required),
      tara_customer: new FormControl(0, Validators.required),
      bruto_customer: new FormControl(0, Validators.required),
      netto_customer: new FormControl(0, Validators.required),

    });




  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {

    this.entryForm.controls['mill_id'].patchValue(this.PksSjpp.tanki_id);
    this.entryForm.controls['intruksi_id'].patchValue(this.PksSjpp.intruksi_id);


    this.entryForm.controls['no_surat'].patchValue(this.PksSjpp.no_surat_jalan);
    this.entryForm.controls['no_tiket'].patchValue(this.PksSjpp.no_tiket);
    this.entryForm.controls['alamat_pengiriman'].patchValue(this.PksSjpp.alamat_pengiriman);
    this.entryForm.controls['nama_pelanggan'].patchValue(this.PksSjpp.nama_customer);


    if (this.PksSjpp.tanggal_terima) {
      this.entryForm.get('tanggal_customer').patchValue(new Date(Date.parse(this.PksSjpp.tanggal_terima)));
    }
    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.PksSjpp.tanggal_surat_jalan)));
    if (this.PksSjpp.tara_customer == null) {
      this.PksSjpp.tara_customer = this.PksSjpp.tara_kirim;
    }

    if (this.PksSjpp.bruto_customer == null) {
      this.PksSjpp.bruto_customer = this.PksSjpp.bruto_kirim;
    }

    if (this.PksSjpp.ffa_customer == null) {
      this.PksSjpp.ffa_customer = this.PksSjpp.ffa;
    }

    if (this.PksSjpp.dirt_customer == null) {
      this.PksSjpp.dirt_customer = this.PksSjpp.dirt;
    }

    if (this.PksSjpp.moist_customer == null) {
      this.PksSjpp.moist_customer = this.PksSjpp.moisture;
    }

    if (this.PksSjpp.dobi_customer == null) {
      this.PksSjpp.dobi_customer = this.PksSjpp.dobi;
    }
    if (this.PksSjpp.netto_customer == null) {
      this.PksSjpp.netto_customer =  this.PksSjpp.bruto_customer - this.PksSjpp.tara_customer;
    }



    this.entryForm.controls['moist_customer'].patchValue(this.PksSjpp.moist_customer);
    this.entryForm.controls['ffa_customer'].patchValue(this.PksSjpp.ffa_customer);
    this.entryForm.controls['dirt_customer'].patchValue(this.PksSjpp.dirt_customer);
    this.entryForm.controls['dobi_customer'].patchValue(this.PksSjpp.dobi_customer);
    this.entryForm.controls['tara_customer'].patchValue(this.PksSjpp.tara_customer);
    this.entryForm.controls['bruto_customer'].patchValue(this.PksSjpp.bruto_customer);
    this.entryForm.controls['netto_customer'].patchValue(this.PksSjpp.netto_customer);

  }
  public options: any;

  private formChange(): void {

    // let idIntruksi;
    // this.entryForm.controls['intruksi_id'].valueChanges.subscribe(x=> {
    //   idIntruksi = x.id;
    //   this.SlsIntruksiService.getAll().subscribe(x=> {
    //     x['data'].forEach(x=> {
    //       if (idIntruksi == x.id) {
    //         // this.GbmCustomerService.getById(x.cust).subscribe(x=> {
    //         //   this.entryForm.get('nama_pelanggan').patchValue(x['data'].nama_customer);
    //         // });
    //         this.entryForm.get('alamat_pengiriman').patchValue(x.alamat_pengiriman);
    //       }
    //     });
    //   });
    // });

  }

  private loadSelect2(): void {

    let selectedMill;
    this.GbmOrganisasiService.getAllByType('HO').subscribe(x => {
      this.dataSelectMill = [];
      x.forEach(d => {
        this.dataSelectMill.push({ "id": d.id, "text": d.nama });
        if (this.PksSjpp.mill_id == d.id) {
          selectedMill = { "id": d.id, "text": d.nama };
        }
      });
      this.entryForm.get('mill_id').patchValue(selectedMill);
    });

    let selectedIntruksi;
    this.SlsIntruksiService.getAll().subscribe(x => {
      this.dataSelectIntruksi = [];
      x['data'].forEach(d => {
        this.dataSelectIntruksi.push({ "id": d.id, "text": d.no_transaksi });
        if (this.PksSjpp.instruksi_id == d.id) {
          selectedIntruksi = { "id": d.id, "text": d.no_transaksi }
        }
      });
      this.entryForm.get('intruksi_id').patchValue(selectedIntruksi);
    });


  }







  onSubmit() {
    console.log(this.entryForm.value);

    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }


    let frmData = this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    frmData['tanggal_customer'] = formatDate(this.entryForm.get('tanggal_customer').value, "yyyy-MM-dd", 'en_US');

    console.log(frmData);
    this.PksSjppService.update(this.PksSjpp.id, frmData).subscribe(data => {
      if (data['status'] == 'OK') {
        this.event.emit('OK');
        this.bsModalRef.hide();
      }
    });
  }

  hitungnetto() {
    let bruto = this.entryForm.get("bruto_customer").value;
    let tara = this.entryForm.get("tara_customer").value;
    this.entryForm.get('netto_customer').patchValue(bruto - tara);
  }



  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.formChange();
    this.loadSelect2();

  }
  valueChange($event) {
    // console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }

}
