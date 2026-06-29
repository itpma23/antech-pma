import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { PrcRekapAngkutService } from 'src/app/shared/services/prc_rekap_angkut.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { AccAngkutInvoiceService } from 'src/app/shared/services/acc_angkut_invoice.service';
import { AccAngkutInvoice } from 'src/app/shared/models/acc_angkut_invoice.model';
import { PksTimbanganService } from 'src/app/shared/services/pks_timbangan.service';
declare var $: any;
declare var swal: any;

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

  accAngkutInvoice: AccAngkutInvoice;
  dataSelectLokasi;
  dataSelectSupplier;
  dataSelectRekap;
  dataSelectItem;
  dataSelectMill;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private bsModalRef1: BsModalRef,
    private bsModalService: BsModalService,
    private translate: TranslateService,
    private invItemService: InvItemService,
    private accAngkutInvoiceService: AccAngkutInvoiceService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private prcRekapService: PrcRekapAngkutService,
    private gbmSupplier: GbmSupplierService,
    private pksTimbanganService: PksTimbanganService,
  ) {
    let toDate: Date = new Date();
    let time: Date = new Date();

    this.entryForm = this.builder.group({
      lokasi_id: new FormControl([], Validators.required),
      supplier_id: new FormControl([], Validators.required),
      rekap_id: new FormControl([], Validators.required),

      no_invoice: new FormControl(''),
      tanggal: new FormControl(toDate, Validators.required),
      tanggal_tempo: new FormControl(toDate, Validators.required),
      sumber_timbangan: new FormControl(''),
      // periode_kt_dari: new FormControl(toDate, Validators.required),
      // periode_kt_sd: new FormControl(toDate, Validators.required),
      // item_id: new FormControl('', Validators.required),
      harga_susut_per_kg: new FormControl(0,),
      total_berat_terima: new FormControl(0, Validators.required),
      jumlah: new FormControl(0,),
      sub_total: new FormControl(0, Validators.required),
      total_berat_tagihan: new FormControl(0,),
      harga_satuan: new FormControl(0,),
      total_tagihan: new FormControl(0,),
      potongan: new FormControl(0,),
      toleransi: new FormControl(0,),
      ppn: new FormControl(0, Validators.required),
      pph: new FormControl(0, Validators.required),
      keterangan: new FormControl('Angkut CPO/Kernel', Validators.required),
      details: this.builder.array([]),

    });
  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    let date: Date = new Date();
    let strDate = formatDate(date, "yyyy-MM-dd", "en_US");

    this.entryForm.get('no_invoice').patchValue(this.accAngkutInvoice.no_invoice);
    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.accAngkutInvoice.tanggal)));
    this.entryForm.get('tanggal_tempo').patchValue(new Date(Date.parse(this.accAngkutInvoice.tanggal_tempo)));
    // this.entryForm.get('periode_kt_dari').patchValue(new Date(Date.parse(this.accAngkutInvoice.periode_kt_dari)));
    // this.entryForm.get('periode_kt_sd').patchValue(new Date(Date.parse(this.accAngkutInvoice.periode_kt_sd)));
    // this.entryForm.get('total_berat_terima').patchValue(this.accAngkutInvoice.total_berat_terima);
    // this.entryForm.get('item_id').patchValue(this.accAngkutInvoice.item_id);
    this.entryForm.get('sumber_timbangan').patchValue(this.accAngkutInvoice.sumber_timbangan);
    // this.entryForm.get('jumlah').patchValue(this.accAngkutInvoice.jumlah);
    this.entryForm.get('total_berat_terima').patchValue(this.accAngkutInvoice.total_berat_terima);
    this.entryForm.get('sub_total').patchValue(this.accAngkutInvoice.sub_total);
    this.entryForm.get('potongan').patchValue(this.accAngkutInvoice.potongan);
    this.entryForm.get('total_berat_tagihan').patchValue(this.accAngkutInvoice.total_berat_tagihan);
    this.entryForm.get('ppn').patchValue(this.accAngkutInvoice.ppn);
    this.entryForm.get('pph').patchValue(this.accAngkutInvoice.pph);
    this.entryForm.get('harga_susut_per_kg').patchValue(this.accAngkutInvoice.harga_susut_per_kg);
    this.entryForm.get('toleransi').patchValue(this.accAngkutInvoice.toleransi);
    this.entryForm.get('total_tagihan').patchValue(this.accAngkutInvoice.total_tagihan);
    this.entryForm.get('harga_satuan').patchValue(this.accAngkutInvoice.harga_satuan);
    this.entryForm.get('keterangan').patchValue(this.accAngkutInvoice.keterangan);

  }
  public options: any;

  private loadSelect2(): void {


    let selectMill;
    this.gbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
        if (this.accAngkutInvoice.lokasi_id == d.id) {
          selectMill = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectMill);

      // let dtl = [];
      this.rekapTimbangan = this.accAngkutInvoice.detail;
      console.log(this.rekapTimbangan)
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
      // this.totalBeratTerima();
    });


    let selectedSupplier;
    this.gbmSupplier.getAll().subscribe(x => {
      this.dataSelectSupplier = [];
      x['data'].forEach(d => {
        this.dataSelectSupplier.push({ "id": d.id, "text": d.nama_supplier });
        if (this.accAngkutInvoice.supplier_id == d.id) {
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
    //     if (this.accAngkutInvoice.item_id == d.id) {
    //       selectedItem = { "id": d.id, "text": d.nama }
    //     }
    //   });
    // });

    let selectedRekap;
    this.prcRekapService.getById(this.accAngkutInvoice.rekap_id).subscribe(x => {
      this.dataSelectRekap = [];
      console.log(x)
      let d = x['data'];
      // x.forEach(d => {
      this.dataSelectRekap.push({ "id": d['id'], "text": d['no_rekap'] + ' - spk:' + d['no_spk'] });
      if (this.accAngkutInvoice.rekap_id == d['id']) {
        selectedRekap = { "id": d['id'], "text": d['no_rekap'] + ' - spk:' + d['no_spk'] }
      }
      // });
      this.entryForm.get('rekap_id').patchValue(selectedRekap);
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
    frmData['tanggal_tempo'] = formatDate(this.entryForm.get('tanggal_tempo').value, "yyyy-MM-dd", 'en_US');
    // frmData['tgl_mulai']=formatDate( this.entryForm.get('periode_kt_dari').value,"yyyy-MM-dd",'en_US');
    // frmData['tgl_sd']=formatDate( this.entryForm.get('periode_kt_sd').value,"yyyy-MM-dd",'en_US');

    // frmData['detail']=this.rekapTimbangan.map(a=>{
    //   let data={id: a['id'],sjpp_id: a['sjpp_id'],qty:a['qty'],harga:a['harga'],uom:'Kg',pekerjaan: a['pekerjaan']};
    //    return data;
    //   });
    let sumber_timbangan = this.entryForm.get("sumber_timbangan").value
    frmData['detail'] = this.rekapTimbangan.map(a => {
      let tgl;
      let berat = 0;
      if (sumber_timbangan == 'ext') {
        tgl = a.tanggal_terima;
        berat = a['netto_customer'];
      } else {
        tgl = a.tanggal_timbang;
        berat = a['netto_kirim'];
      }
      let data = {
        sjpp_id: a['sjpp_id'],
        qty: berat,
        harga: a['harga'], uom: 'Kg',
        pekerjaan: 'Angkut CPO/Kernel Periode: ' + tgl
      };
      return data;
    });

    console.log(frmData);
    this.accAngkutInvoiceService.update(this.accAngkutInvoice.id, frmData).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        // console.log('ok');
        swal({
          title: 'Info!',
          text: 'Data berhasil disimpan',
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
  totalBeratTerima() {
    let sumber_timbangan = this.entryForm.get("sumber_timbangan").value
    let totalBeratTerima = 0;
    let totalNilai = 0;
    let sub_total = 0;
    console.log(this.rekapTimbangan)
    let harga_susut = parseFloat(this.entryForm.get("harga_susut_per_kg").value)
    let toleransi = parseFloat(this.entryForm.get("toleransi").value)
    let total_susut = 0;
    if (sumber_timbangan == 'ext') {
      this.rekapTimbangan.forEach(x => {
         let susut = (x.netto_customer - x.netto_kirim)
        if (susut < 0) {
            let persen_susut = ((susut * -1) / x.netto_kirim) * 100
            // console.log((persen_susut));
            // console.log((toleransi));
            if (parseFloat(persen_susut.toFixed(2)) > parseFloat(toleransi.toFixed(2))) {
              let pot_susut = ((persen_susut - toleransi) / 100) * x.netto_kirim
              total_susut = total_susut + pot_susut
            }
        }
        if (x.netto_customer ) {
          totalBeratTerima += parseInt(x.netto_customer);
          sub_total += (x.netto_customer * x.harga)
        }
      });
    } else {
      this.rekapTimbangan.forEach(x => {
        let susut = 0
        totalBeratTerima += parseInt(x.netto_kirim);
        sub_total += (x.netto_kirim * x.harga)
      });
      total_susut = 0;
    }
    let potongan = total_susut * harga_susut;
    //let potongan=  parseFloat(this.entryForm.get("potongan").value)
    this.entryForm.get("potongan").patchValue(potongan);
    this.entryForm.get("total_berat_terima").patchValue(totalBeratTerima);
    totalNilai = sub_total - potongan
    let ppn_nilai = parseFloat(this.entryForm.get("ppn").value) / 100 * totalNilai;
    let pph_nilai = parseFloat(this.entryForm.get("pph").value) / 100 * totalNilai;
    let total_tagihan = totalNilai + ppn_nilai - pph_nilai;
    // let harga_satuan = this.entryForm.get("harga_satuan").value;
    // let sub_total = parseInt(harga_satuan) * totalBeratTerima;

    this.entryForm.get("sub_total").patchValue(sub_total);
    this.entryForm.get("total_tagihan").patchValue(total_tagihan);
  }
  totalBeratTerimaOld() {
    let totalBeratTerima = 0;
    let totalNilai = 0;
    let sub_total = 0;
    console.log(this, this.rekapTimbangan)
    this.rekapTimbangan.forEach(x => {
      totalBeratTerima += parseInt(x.qty);
      // totalNilai += (x.berat_terima * x.harga)
      sub_total += (x.qty * x.harga)
    });
    let potongan = parseFloat(this.entryForm.get("potongan").value)
    this.entryForm.get("total_berat_terima").patchValue(totalBeratTerima);
    totalNilai = sub_total - potongan
    let ppn_nilai = parseFloat(this.entryForm.get("ppn").value) / 100 * totalNilai;
    let pph_nilai = parseFloat(this.entryForm.get("pph").value) / 100 * totalNilai;
    let total_tagihan = totalNilai + ppn_nilai - pph_nilai;
    // let harga_satuan = this.entryForm.get("harga_satuan").value;
    // let sub_total = parseInt(harga_satuan) * totalBeratTerima;

    this.entryForm.get("sub_total").patchValue(sub_total);
    this.entryForm.get("total_tagihan").patchValue(total_tagihan);
  }
  showTimbanganPks() {
    // this.accAngkutInvoiceService.get(this.accAngkutInvoice.id).subscribe(t => {
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
    if (!this.entryForm.dirty) {
      // form belum diapa-apakan → langsung close
      this.bsModalRef.hide();
      return;
    }

    // form sudah ada isi / perubahan → munculkan swal
    let that = this;
    swal({
      title: 'Yakin akan Menutup?',
      text: "Data yang sudah diinput akan hilang!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      buttonsStyling: false
    }).then(function () {
      that.bsModalRef.hide();
    });
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
}
