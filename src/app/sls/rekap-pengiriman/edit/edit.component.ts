import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { SlsRekapService } from 'src/app/shared/services/sls_rekap.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmCustomerService } from 'src/app/shared/services/gbm_customer.service';
import { SlsKontrakService } from 'src/app/shared/services/sls_kontrak.service';
import { SlsRekap } from 'src/app/shared/models/sls_rekap.model';
import { PksVsjtService } from 'src/app/shared/services/pks_vsjt.service';
import { PksSjppService } from 'src/app/shared/services/pks_sjpp.service';
import { LookupTimbanganCustomerComponent } from '../lookup-timbangan-customer/lookup-timbangan-customer.component';
import { mixinDisabled } from '@angular/material';


declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'edit-cmp',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.css'],
})

export class EditComponent implements OnInit, AfterViewInit {
  editor_modules: any;
  isFormSubmitted = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }

  entryForm: FormGroup;
  rekapSj;
  event: EventEmitter<any> = new EventEmitter();

  slsRekap: SlsRekap;
  dataSelectLokasi;
  dataSelectCustomer;
  dataSelectSpk;
  dataSelectItem;
  dataSelectMill;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private bsModalRef1: BsModalRef,
    private bsModalService: BsModalService,
    private translate: TranslateService,
    private invItemService: InvItemService,
    private slsRekapService: SlsRekapService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private slsKontrakService: SlsKontrakService,
    private gbmCustomer: GbmCustomerService,
    private pksVsjtService: PksVsjtService,
    private pksSjppService: PksSjppService,
  ) {
    let toDate: Date = new Date();
    let time: Date = new Date();

    this.entryForm = this.builder.group({
      // divisi_id: new FormControl([], Validators.required),
      lokasi_id: new FormControl([], Validators.required),
      customer_id: new FormControl([], Validators.required),
      spk_id: new FormControl([], Validators.required),

      no_rekap: new FormControl(''),
      tanggal: new FormControl(toDate, Validators.required),
      periode_kt_dari: new FormControl(toDate, Validators.required),
      periode_kt_sd: new FormControl(toDate, Validators.required),
      item_id: new FormControl('', Validators.required),
      nama_produk: new FormControl(''),
      total_berat_terima: new FormControl(0, Validators.required),
      // jumlah: new FormControl(0, Validators.required),
      sub_total: new FormControl(0, Validators.required),
      // total_berat_tagihan: new FormControl(0, Validators.required),
      harga_satuan: new FormControl(0, Validators.required),
      // total_tagihan: new FormControl(0, Validators.required),

      details: this.builder.array([]),
      // subTotal:[{value: 0, disabled: true}],


    });
  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    console.log(this.slsRekap);
    let date: Date = new Date();
    let strDate = formatDate(date, "yyyy-MM-dd", "en_US");

    this.entryForm.get('no_rekap').patchValue(this.slsRekap.no_rekap);
    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.slsRekap.tanggal)));
    this.entryForm.get('periode_kt_dari').patchValue(new Date(Date.parse(this.slsRekap.periode_kt_dari)));
    this.entryForm.get('periode_kt_sd').patchValue(new Date(Date.parse(this.slsRekap.periode_kt_sd)));
    this.entryForm.get('total_berat_terima').patchValue(this.slsRekap.total_berat_terima);
    this.entryForm.get('item_id').patchValue(this.slsRekap.item_id);
    this.entryForm.get('nama_produk').patchValue(this.slsRekap.nama_produk);
    // this.entryForm.get('jumlah').patchValue(this.slsRekap.jumlah);
    this.entryForm.get('sub_total').patchValue(this.slsRekap.sub_total);
    // this.entryForm.get('total_berat_tagihan').patchValue(this.slsRekap.total_berat_tagihan);
    this.entryForm.get('harga_satuan').patchValue(this.slsRekap.harga_satuan);
    // this.entryForm.get('total_tagihan').patchValue(this.slsRekap.total_tagihan);

  }
  public options: any;

  private loadSelect2(): void {
    // let selectedDivisi;
    // this.gbmOrganisasiService.getAllByType('AFDELING').subscribe(x=>{
    //   this.dataSelectDivisi=[];
    //   x.forEach(d => {
    //     this.dataSelectDivisi.push({"id":d.id,"text":d.nama});
    //     if (this.slsRekap.divisi_id == d.id) {
    //       selectedDivisi = { "id": d.id, "text": d.nama }
    //     }
    //   });
    //   this.entryForm.get('divisi_id').patchValue(selectedDivisi);
    // });

    // this.gbmOrganisasiService.getAllByType('BLOK').subscribe(x=>{
    //   this.dataSelectBlok=[];
    //   x.forEach(d => {
    //     this.dataSelectBlok.push({"id":d.id,"text":d.nama});
    //   });
    //   let dtl = [];
    //   dtl = this.slsRekap.detail;
    //   for (let index = 0; index < dtl.length; index++) {
    //     const d = dtl[index];
    //     this.addBlok(d['blok_id'], d['mesin_id'],  d['station_id'], d['keterangan']);
    //   }
    // });

    let selectMill;
    this.gbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
        if (this.slsRekap.lokasi_id == d.id) {
          selectMill = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectMill);

      // let dtl = [];
      // dtl = this.slsRekap.detail;
      // for (let index = 0; index < dtl.length; index++) {
      //   const d = dtl[index];
      //   this.addBlok(
      //     d['dt_lokasi_id'],
      //     d['no_kartu_timbang'],
      //     d['dt_tanggal'],
      //     // d['bruto'],
      //     // d['tara'],
      //     // d['netto'],
      //     d['bruto_cust'],
      //     d['tara_cust'],
      //     d['netto_cust']);
      // }
    });


    let selectedCustomer;
    this.gbmCustomer.getAll().subscribe(x => {
      this.dataSelectCustomer = [];
      x['data'].forEach(d => {
        this.dataSelectCustomer.push({ "id": d.id, "text": d.nama_customer });
        if (this.slsRekap.customer_id == d.id) {
          selectedCustomer = { "id": d.id, "text": d.nama_customer }
        }
      });
      this.entryForm.get('customer_id').patchValue(selectedCustomer);
    });


    let selectedItem;
    this.invItemService.getAll().subscribe(x => {
      this.dataSelectItem = [];
      x['data'].forEach(d => {
        this.dataSelectItem.push({ "id": d.id, "text": d.nama });
        if (this.slsRekap.item_id == d.id) {
          selectedItem = { "id": d.id, "text": d.nama }
        }
      });
    });

    let selectedKontrak;
    this.slsKontrakService.getAll().subscribe(x => {
      this.dataSelectSpk = [];
      x['data'].forEach(d => {
        this.dataSelectSpk.push({ "id": d.id, "text": d.no_spk });
        if (this.slsRekap.spk_id == d.id) {
          selectedKontrak = { "id": d.id, "text": d.no_spk }
        }
      });
      this.entryForm.get('spk_id').patchValue(selectedKontrak);
    });




  }
  onSubmit() {
    console.log(this.entryForm.value);

    this.isFormSubmitted = true;

    if (this.entryForm.invalid) {
      return;
    }

    let frmData = this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    frmData['periode_kt_dari'] = formatDate(this.entryForm.get('periode_kt_dari').value, "yyyy-MM-dd", 'en_US');
    frmData['periode_kt_sd'] = formatDate(this.entryForm.get('periode_kt_sd').value, "yyyy-MM-dd", 'en_US');

    frmData['suratjalan'] = this.rekapSj.map(a => a['id']);


    this.slsRekapService.update(this.slsRekap.id, frmData).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        console.log('ok');
        this.event.emit('OK');
        this.bsModalRef.hide();
      }
    });
  }

  totalBeratTerima() {
    let totalBeratTerima = 0;

    this.rekapSj.forEach(x => {
      const netto = (x.netto_customer != null && x.netto_customer !== undefined)
        ? x.netto_customer
        : 0;

      totalBeratTerima += parseInt(netto);
    });

    this.entryForm.get("total_berat_terima").patchValue(totalBeratTerima);

    const harga_satuan = this.entryForm.get("harga_satuan").value;
    const sub_total = parseInt(harga_satuan ? harga_satuan : 0) * totalBeratTerima;

    this.entryForm.get("sub_total").patchValue(sub_total);
  }


  showSuratJalanTervalidasi() {
    // let spk_id=this.entryForm.get('spk_id').value.id;
    // this.pksSjppService.getRekapKirim(spk_id).subscribe(t => {
    //   this.rekapSj = t['data'];
    //   // this.totalBeratTerima();
    // });
    this.pksSjppService.getRekapById(this.slsRekap.id).subscribe(t => {
      this.rekapSj = t['data'];
      this.totalBeratTerima();
    });
  }


  showTimbangan() {
    this.pksVsjtService.getAll().subscribe(t => {

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        class: "modal-lg ",
        initialState: {
          PksVsjt: t['data']
        }
      };
      this.bsModalRef1 = this.bsModalService.show(LookupTimbanganCustomerComponent, modalConfig);
      this.bsModalRef1.content.event.subscribe(item => {
        // this.addBlok();
        if (item == null) {
        } else {
          this.showNotification('top', 'right', "No Timbangan " + item['no_surat'] + " ", 2);


          this.addBlokNew(item);
          // this.entryForm.get('tara').patchValue(item['tara_kirim']);

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

  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };
  addBlokNew(item = '') {
    // this.details.push(this.builder.group(new InvoiceBlok()));
    let selectedMesin;
    this.dataSelectLokasi.forEach(a => {
      if (item['mill_id'] == a.id) {
        selectedMesin = a;
      }
    });
    let toDate: Date = new Date();
    this.details.push(
      this.builder.group({
        dt_lokasi_id: new FormControl(selectedMesin, Validators.required),
        no_kartu_timbang: new FormControl(item['no_surat'], Validators.required),
        dt_tanggal: new FormControl(toDate, Validators.required),
        // tara: new FormControl(item['tara_kirim'], Validators.required),
        // bruto: new FormControl(item['bruto_kirim'], Validators.required),
        // netto: new FormControl(item['netto_kirim'], Validators.required),
        tara_cust: new FormControl(item['tara_customer'], Validators.required),
        bruto_cust: new FormControl(item['bruto_customer'], Validators.required),
        netto_cust: new FormControl(item['netto_customer'], Validators.required),
      }
      ));

  }
  // netto: new FormControl({value:item['netto_kirim'], disabled:true}),
  // {value:'(Auto Generate)', disabled:true}

  // addBlok() {

  //   this.details.push(this.builder.group({
  //     blok: new FormControl([], Validators.required),
  //     jumlah_janjang: new FormControl('0', Validators.required),
  //     brondolan: new FormControl('0', Validators.required),
  //   }));

  // }
  addBlok(dt_lokasi_id, no_kartu_timbang, dt_tanggal, bruto_cust = 0, tara_cust = 0, netto_cust = 0, berat_terima = 0) {
    // this.details.push(this.builder.group(new InvoiceItem()));
    let selectedMesin;
    this.dataSelectLokasi.forEach(a => {
      if (dt_lokasi_id == a.id) {
        selectedMesin = a;
      }

    });
    let fb = this.builder.group({
      dt_lokasi_id: new FormControl(selectedMesin),
      no_kartu_timbang: new FormControl(no_kartu_timbang),
      dt_tanggal: new FormControl(dt_tanggal),
      // bruto: new FormControl(bruto),
      // netto: new FormControl(netto),
      // tara: new FormControl(tara),
      bruto_cust: new FormControl(bruto_cust),
      netto_cust: new FormControl(netto_cust),
      tara_cust: new FormControl(tara_cust),

    });

    this.details.push(fb);
  }

  removeBlok(i) {
    let x = this.rekapSj.splice(i, 1);

    this.totalBeratTerima();

    let index = this.details.controls.indexOf(i);
    if (index != -1) {
      //  let x=	this.details.controls.splice(i, 1);
      let bloks = this.entryForm.get('details') as FormArray;
      bloks.removeAt(i);
      let data = { details: bloks.value };
      this.updateForm(data);
    }
  }

  // removeBlok(item) {
  //   let i = this.details.controls.indexOf(item);
  //   if(i != -1) {
  //   // let x=	this.details.controls.splice(i, 1);
  //     let items = this.entryForm.get('details') as FormArray;
  //     items.removeAt(i);
  //   	let data = {details: items.value};
  //   	this.updateForm(data);
  //   }
  // }
  updateForm(data) {
    const items = data.details;
    console.log(items);
    let sub = 0;
    for (let i of items) {
      sub = sub + parseFloat(i.qty);

    }
    console.log(sub);
  }
  recalculate() {
    let items = this.entryForm.get('details') as FormArray;
    let data = { details: items.value };
    this.updateForm(data);


  }
  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();
    this.showSuratJalanTervalidasi();

  }
  valueChange($event) {
    console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
}
