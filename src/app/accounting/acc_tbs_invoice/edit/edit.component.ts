import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { PrcRekapService } from 'src/app/shared/services/prc_rekap.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { AccTbsInvoiceService } from 'src/app/shared/services/acc_tbs_invoice.service';
import { AccTbsInvoice } from 'src/app/shared/models/acc_tbs_invoice.model';
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

  accTbsInvoice: AccTbsInvoice;
  dataSelectLokasi;
  dataSelectSupplier;
  dataSelectRekap;
  dataSelectItem;
  showRekapWarning: boolean = false;
  dataSelectMill;
  originalRekapIds: number[];
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private bsModalRef1: BsModalRef,
    private bsModalService: BsModalService,
    private translate: TranslateService,
    private invItemService: InvItemService,
    private accTbsInvoiceService: AccTbsInvoiceService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private prcRekapService: PrcRekapService,
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
      // periode_kt_dari: new FormControl(toDate, Validators.required),
      // periode_kt_sd: new FormControl(toDate, Validators.required),
      // item_id: new FormControl('', Validators.required),
      total_berat_terima: new FormControl(0, Validators.required),
      jumlah: new FormControl(0,),
      sub_total: new FormControl(0, Validators.required),
      total_berat_tagihan: new FormControl(0,),
      harga_satuan: new FormControl(0,),
      total_tagihan: new FormControl(0,),
      ppn: new FormControl(0, Validators.required),
      pph: new FormControl(0, Validators.required),
      details: this.builder.array([]),

    });
  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    let date: Date = new Date();
    let strDate = formatDate(date, "yyyy-MM-dd", "en_US");

    this.entryForm.get('no_invoice').patchValue(this.accTbsInvoice.no_invoice);
    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.accTbsInvoice.tanggal)));
    this.entryForm.get('tanggal_tempo').patchValue(new Date(Date.parse(this.accTbsInvoice.tanggal_tempo)));
    // this.entryForm.get('periode_kt_dari').patchValue(new Date(Date.parse(this.accTbsInvoice.periode_kt_dari)));
    // this.entryForm.get('periode_kt_sd').patchValue(new Date(Date.parse(this.accTbsInvoice.periode_kt_sd)));
    // this.entryForm.get('total_berat_terima').patchValue(this.accTbsInvoice.total_berat_terima);
    // this.entryForm.get('item_id').patchValue(this.accTbsInvoice.item_id);
    // this.entryForm.get('nama_produk').patchValue(this.accTbsInvoice.nama_produk);
    // this.entryForm.get('jumlah').patchValue(this.accTbsInvoice.jumlah);
    this.entryForm.get('sub_total')
      .patchValue(Math.floor(this.accTbsInvoice.sub_total));

    this.entryForm.get('total_berat_tagihan')
      .patchValue(Math.floor(this.accTbsInvoice.total_berat_tagihan));

    this.entryForm.get('ppn')
      .patchValue(Math.floor(this.accTbsInvoice.ppn));

    this.entryForm.get('pph')
      .patchValue(Math.floor(this.accTbsInvoice.pph));

    // this.entryForm.get('harga_satuan').patchValue(this.accTbsInvoice.harga_satuan);
    // this.entryForm.get('total_tagihan').patchValue(this.accTbsInvoice.total_tagihan);

  }
  public options: any;

  private loadSelect2(): void {


    let selectMill;
    this.gbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
        if (this.accTbsInvoice.lokasi_id == d.id) {
          selectMill = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectMill);

      // let dtl = [];
      this.rekapTimbangan = this.accTbsInvoice.detail.map((d: any) => ({
        id: d.id,
        rekap_id: d.rekap_id,
        no_rekap: d.no_rekap,
        tanggal: d.tanggal, // BIARKAN STRING APA ADANYA
        qty: Number(d.qty),
        harga: Number(d.harga),
        jumlah: Number(d.qty) * Number(d.harga),
        pekerjaan: d.pekerjaan  // SUDAH STRING, JANGAN DIUBAH
      }));
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
        if (this.accTbsInvoice.supplier_id == d.id) {
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
    //     if (this.accTbsInvoice.item_id == d.id) {
    //       selectedItem = { "id": d.id, "text": d.nama }
    //     }
    //   });
    // });


    let selectedRekap = [];
    this.prcRekapService.getAll().subscribe(x => {

      // Build dropdown data
      this.dataSelectRekap = x['data'].map(d => ({
        id: d.id,
        text: d.no_rekap + ' - spk:' + d.no_spk
      }));


      if (this.accTbsInvoice.rekap_list && this.accTbsInvoice.rekap_list.length > 0) {
        this.accTbsInvoice.rekap_list.forEach((r: any) => {
          selectedRekap.push({
            id: r.id,
            text: r.no_rekap
          });
        });
      }

      this.entryForm.get('rekap_id').patchValue(selectedRekap);

    });

    this.entryForm.get('rekap_id').valueChanges.subscribe((val: any[]) => {

      const newIds = val.map(x => x.id);

      // Bandingkan dengan original
      const same =
        newIds.length === this.originalRekapIds.length &&
        newIds.every(id => this.originalRekapIds.includes(id));

      if (!same) {
        // Rekap berubah!
        this.showRekapWarning = true;
      } else {
        // Masih sama seperti awal
        this.showRekapWarning = false;
      }

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

    frmData['detail'] = this.rekapTimbangan.map(a => {
      let data = { id: a['id'], qty: a['qty'], harga: a['harga'], uom: 'Kg', pekerjaan: a['pekerjaan'] };
      return data;
    });
    console.log(frmData);
    this.accTbsInvoiceService.update(this.accTbsInvoice.id, frmData).subscribe(data => {
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
    let totalBerat = 0;
    let totalNilai = 0;

    for (let i = 0; i < this.rekapTimbangan.length; i++) {
      const r = this.rekapTimbangan[i];
      totalBerat += Number(r.qty);
      totalNilai += Number(r.qty) * Number(r.harga);
    }

    totalBerat = Math.floor(totalBerat);
    totalNilai = Math.floor(totalNilai);

    // simpan total berat
    this.entryForm.get("total_berat_terima").patchValue(totalBerat);

    // hitung pajak
    let ppn = Math.floor((Number(this.entryForm.get("ppn").value) / 100) * totalNilai);
    let pph = Math.floor((Number(this.entryForm.get("pph").value) / 100) * totalNilai);

    // set ke form
    this.entryForm.get("sub_total").patchValue(totalNilai);
    this.entryForm.get("total_tagihan").patchValue(Math.floor(totalNilai + ppn - pph));
  }

  // showTimbanganPks() {
  //   // this.accTbsInvoiceService.get(this.accTbsInvoice.id).subscribe(t => {
  //   //   this.rekapTimbangan = t['data'];
  //   //   this.totalBeratTerima();
  //   // });
  //   let rekap_ids = this.entryForm.get('rekap_id').value;
  //   console.log(rekap_ids);
  //   this.prcRekapService.getRekapPerTanggalMulti(rekap_ids)
  //     .subscribe(t => {
  //       this.rekapTimbangan = t['data'];
  //       console.log(this.rekapTimbangan);
  //       this.totalBeratTerima();
  //       this.showRekapWarning = false; // <-- reset warning
  //     });
  // }

  // showTimbanganPks() {
  //   const rekap_ids = this.entryForm.get('rekap_id').value;

  //   this.prcRekapService.getRekapPerTanggalMulti(rekap_ids)
  //     .subscribe(t => {
  //       const raw = t['data'];

  //       // PASTIKAN raw ADA dan BUKAN NULL
  //       if (!raw || raw.length === 0) {
  //         this.rekapTimbangan = [];
  //         this.totalBeratTerima();
  //         return;
  //       }

  //       // PROSES TANPA OPTIONAL CHAINING
  //       this.rekapTimbangan = raw.map(function (x: any) {
  //         return {
  //           id: x['id'] ? x['id'] : null,
  //           rekap_id: x['rekap_id'],
  //           no_rekap: x['no_rekap'],
  //           tanggal: x['tanggal'],         // <- STRING RENTANG TANGGAL
  //           qty: Number(x['berat_terima']),
  //           harga: Number(x['harga']),
  //           jumlah: Number(x['berat_terima']) * Number(x['harga']),
  //           pekerjaan: 'Pembelian TBS Periode ' + x['tanggal']
  //         };
  //       });

  //       // HITUNG SUMMARY
  //       this.totalBeratTerima();
  //       this.showRekapWarning = false;
  //     });
  // }

    showTimbanganPKS() {
    let rekap_ids = this.entryForm.get('rekap_id').value;

    this.prcRekapService.getRekapPerTanggalMulti(rekap_ids)
      .subscribe(t => {
        const raw = t['data'];

        // proses per rekap
        this.rekapTimbangan = this.groupByRekap(raw);

        // update summary total
        this.totalBeratTerima();

        this.showRekapWarning = false;
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
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();
    //this.showTimbanganPks();
    this.showRekapWarning = false;

    this.originalRekapIds = this.accTbsInvoice.rekap_list.map(r => r.id);


  }
  valueChange($event) {
    console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }

  groupByRekap(raw) {
    const grouped = {};

    for (let i = 0; i < raw.length; i++) {
      const r = raw[i];
      const key = r.rekap_id;

      if (!grouped[key]) {
        grouped[key] = {
          rekap_id: r.rekap_id,
          no_rekap: r.no_rekap,
          tanggal_mulai: r.tanggal,
          tanggal_akhir: r.tanggal,
          qty: 0,
          totalNilai: 0
        };
      }

      // update tanggal awal–akhir
      if (r.tanggal < grouped[key].tanggal_mulai) grouped[key].tanggal_mulai = r.tanggal;
      if (r.tanggal > grouped[key].tanggal_akhir) grouped[key].tanggal_akhir = r.tanggal;

      // akumulasi qty dan nilai
      grouped[key].qty += parseFloat(r.berat_terima);
      grouped[key].totalNilai += (parseFloat(r.berat_terima) * parseFloat(r.harga));
    }

    // convert ke array + hitung harga rata-rata
    const final = [];
    for (const key in grouped) {
      const g = grouped[key];
      const hargaRata = g.totalNilai / g.qty;
      const hargaRataLabel = Math.floor(g.totalNilai / g.qty);

      final.push({
        rekap_id: g.rekap_id,
        no_rekap: g.no_rekap,
        tanggal: g.tanggal_mulai + " - " + g.tanggal_akhir,
        pekerjaan: 'Pembelian TBS Periode ' + g.tanggal_mulai + " - " + g.tanggal_akhir,
        qty: g.qty,
        harga: hargaRata,
        jumlah: g.qty * hargaRata
      });
    }

    return final;
  }
}
