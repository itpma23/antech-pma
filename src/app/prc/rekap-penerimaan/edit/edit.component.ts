import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { PrcRekapService } from 'src/app/shared/services/prc_rekap.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { PrcKontrakService } from 'src/app/shared/services/prc_kontrak.service';
import { PrcRekap } from 'src/app/shared/models/prc_rekap.model';
import { PksTimbanganService } from 'src/app/shared/services/pks_timbangan.service';
import { isNull, isNumber } from 'util';

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
  rekapTimbangan;
  event: EventEmitter<any> = new EventEmitter();

  prcRekap: PrcRekap;
  dataSelectLokasi;
  dataSelectSupplier;
  dataSelectSpk;
  dataSelectItem;
  dataSelectMill;
  totalTagihan: number;
  totalBerat: number;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private bsModalRef1: BsModalRef,
    private bsModalService: BsModalService,
    private translate: TranslateService,
    private invItemService: InvItemService,
    private prcRekapService: PrcRekapService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private PrcKontrakService: PrcKontrakService,
    private gbmSupplier: GbmSupplierService,
    private pksTimbanganService: PksTimbanganService,
  ) {
    let toDate: Date = new Date();
    let time: Date = new Date();

    this.entryForm = this.builder.group({
      // divisi_id: new FormControl([], Validators.required),
      lokasi_id: new FormControl([], Validators.required),
      supplier_id: new FormControl([], Validators.required),
      spk_id: new FormControl([], Validators.required),

      no_rekap: new FormControl(''),
      tanggal: new FormControl(toDate, Validators.required),
      periode_kt_dari: new FormControl(toDate, Validators.required),
      periode_kt_sd: new FormControl(toDate, Validators.required),
      item_id: new FormControl(''),
      nama_produk: new FormControl(''),
      total_berat_terima: new FormControl(0,),
      // jumlah: new FormControl(0, Validators.required),
      sub_total: new FormControl(0,),
      // total_berat_tagihan: new FormControl(0, Validators.required),
      harga_satuan: new FormControl(0),
      // total_tagihan: new FormControl(0, Validators.required),
      potongan_persen: new FormControl(0),
      details: this.builder.array([]),
      // subTotal:[{value: 0, disabled: true}],


    });
  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    let date: Date = new Date();
    let strDate = formatDate(date, "yyyy-MM-dd", "en_US");

    this.entryForm.get('no_rekap').patchValue(this.prcRekap.no_rekap);
    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.prcRekap.tanggal)));
    this.entryForm.get('periode_kt_dari').patchValue(new Date(Date.parse(this.prcRekap.periode_kt_dari)));
    this.entryForm.get('periode_kt_sd').patchValue(new Date(Date.parse(this.prcRekap.periode_kt_sd)));
    this.entryForm.get('total_berat_terima').patchValue(this.prcRekap.total_berat_terima);
    this.entryForm.get('item_id').patchValue(this.prcRekap.item_id);
    this.entryForm.get('nama_produk').patchValue(this.prcRekap.nama_produk);
    // this.entryForm.get('jumlah').patchValue(this.prcRekap.jumlah);
    this.entryForm.get('sub_total').patchValue(this.prcRekap.sub_total);
    // this.entryForm.get('total_berat_tagihan').patchValue(this.prcRekap.total_berat_tagihan);
    // this.entryForm.get('harga_satuan').patchValue(this.prcRekap.harga_satuan);
    // this.entryForm.get('total_tagihan').patchValue(this.prcRekap.total_tagihan);

  }
  public options: any;

  private loadSelect2(): void {


    let selectMill;
    this.gbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
        if (this.prcRekap.lokasi_id == d.id) {
          selectMill = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectMill);

      // let dtl = [];
      console.log(this.prcRekap.detail);
      this.rekapTimbangan = this.prcRekap.detail;
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
      this.totalBeratTerima();
    });


    let selectedSupplier;
    this.gbmSupplier.getAll().subscribe(x => {
      this.dataSelectSupplier = [];
      x['data'].forEach(d => {
        this.dataSelectSupplier.push({ "id": d.id, "text": d.nama_supplier });
        if (this.prcRekap.supplier_id == d.id) {
          selectedSupplier = { "id": d.id, "text": d.nama_supplier }
        }
      });
      this.entryForm.get('supplier_id').patchValue(selectedSupplier);
    });


    // let selectedItem;
    // this.invItemService.getAll().subscribe(x => {
    //   this.dataSelectItem = [];
    //   x['data'].forEach(d => {
    //     this.dataSelectItem.push({ "id": d.id, "text": d.nama });
    //     if (this.prcRekap.item_id == d.id) {
    //       selectedItem = { "id": d.id, "text": d.nama }
    //     }
    //   });
    // });

    let selectedKontrak;
    this.PrcKontrakService.getAll().subscribe(x => {
      this.dataSelectSpk = [];
      x['data'].forEach(d => {
        this.dataSelectSpk.push({ "id": d.id, "text": d.no_spk });
        if (this.prcRekap.spk_id == d.id) {
          selectedKontrak = { "id": d.id, "text": d.no_spk }
        }
      });
      this.entryForm.get('spk_id').patchValue(selectedKontrak);
    });




  }
  onSubmit() {
    console.log(this.entryForm.value);

    this.isFormSubmitted = true;

    // if (this.entryForm.invalid) {
    //   return;
    // }

    let frmData = this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    frmData['periode_kt_dari'] = formatDate(this.entryForm.get('periode_kt_dari').value, "yyyy-MM-dd", 'en_US');
    frmData['periode_kt_sd'] = formatDate(this.entryForm.get('periode_kt_sd').value, "yyyy-MM-dd", 'en_US');

    frmData['detail'] = this.rekapTimbangan.map(a => {
      let data = { id: a['id'], harga: a['harga'], berat_terima: a['berat_terima'], berat_potongan: a['berat_potongan'], berat_potongan_persen: a['berat_potongan_persen'] };
      return data;
    });

    console.log(frmData);


    this.prcRekapService.update(this.prcRekap.id, frmData).subscribe(data => {
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
    let totalNilai = 0;
    this.rekapTimbangan.forEach(x => {
      totalBeratTerima += parseInt(x.berat_terima);
      totalNilai += (x.berat_terima * x.harga)
    });
    this.entryForm.get("total_berat_terima").patchValue(totalBeratTerima);

    let harga_satuan = this.entryForm.get("harga_satuan").value;
    let sub_total = parseInt(harga_satuan) * totalBeratTerima;

    this.entryForm.get("sub_total").patchValue(totalNilai);
  }

  showTimbanganPks() {
    // this.prcRekapService.get(this.prcRekap.id).subscribe(t => {
    //   this.rekapTimbangan = t['data'];
    //   this.totalBeratTerima();
    // });
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
    let selectedLok;
    this.dataSelectLokasi.forEach(a => {
      if (item['mill_id'] == a.id) {
        selectedLok = a;
      }
    });
    let toDate: Date = new Date();
    this.details.push(
      this.builder.group({
        dt_lokasi_id: new FormControl(selectedLok, Validators.required),
        no_kartu_timbang: new FormControl(item['no_surat'], Validators.required),
        dt_tanggal: new FormControl(toDate, Validators.required),
        // tara: new FormControl(item['tara_kirim'], Validators.required),
        // bruto: new FormControl(item['bruto_kirim'], Validators.required),
        // netto: new FormControl(item['netto_kirim'], Validators.required),
        tara_cust: new FormControl(item['tara_Supplier'], Validators.required),
        bruto_cust: new FormControl(item['bruto_Supplier'], Validators.required),
        netto_cust: new FormControl(item['netto_Supplier'], Validators.required),
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
    let selectedLok;
    this.dataSelectLokasi.forEach(a => {
      if (dt_lokasi_id == a.id) {
        selectedLok = a;
      }

    });
    let fb = this.builder.group({
      dt_lokasi_id: new FormControl(selectedLok),
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
    let x = this.rekapTimbangan.splice(i, 1);

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
    this.showTimbanganPks();

  }
  valueChange($event) {
    console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
  updatePotongan() {
    let pot_persen = this.entryForm.get('potongan_persen').value;
    console.log(pot_persen)
    if (isNull(pot_persen)) {
      return;
    }
    if (!isNumber(pot_persen)) {
      return;
    }

    this.rekapTimbangan.forEach(el => {
      let pot = el['berat_bersih'] * (pot_persen / 100);
      el['berat_potongan'] = pot.toFixed(0);
      el['berat_potongan_persen'] = (pot_persen / 100);
      el['berat_terima'] = (el['berat_bersih'] - pot).toFixed(0);


    });
    this.totalBeratTerima()
  }

  onHargaInput(p: any, event: any) {
    const hargaBaru = +event.target.value || 0;
    const berat = +p.berat_terima || 0;

    // update harga dan total di array langsung
    p.harga = hargaBaru;
    p.total = berat * hargaBaru;

    // kalau mau hitung total keseluruhan juga
    this.hitungTotalRekap();
  }

  hitungTotalRekap() {
    let totalSemua = 0;
    let totalBerat = 0;

    for (const item of this.rekapTimbangan) {
      totalSemua += +item.total || (+item.harga * +item.berat_terima) || 0;
      totalBerat += +item.berat_terima || 0;
    }

    this.totalTagihan = totalSemua;
    this.totalBerat = totalBerat;

    console.log("nilai total", totalSemua);


    this.entryForm.patchValue({
      sub_total: totalSemua
    }, { emitEvent: false }); // supaya nggak trigger valueChanges loop
  }
}
