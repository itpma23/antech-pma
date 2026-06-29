import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate, formatNumber } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { AccApInvoiceService } from 'src/app/shared/services/acc_ap_invoice.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { AccKegiatanService } from 'src/app/shared/services/acc_kegiatan.service';
import { TrkKendaraanService } from 'src/app/shared/services/trk_kendaraan.service';
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { PrcPoService } from 'src/app/shared/services/prc_po.service';
import { AccApInvoice } from 'src/app/shared/models/acc_ap_invoice.model';
import { isNumber } from 'util';

declare var $: any;
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'faktur-cmp',
  templateUrl: 'faktur.component.html',
  styleUrls: ['faktur.component.css'],
})

export class FakturComponent implements OnInit, AfterViewInit {
  editor_modules: any;
  isFormSubmitted = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }

  entryForm: FormGroup;

  event: EventEmitter<any> = new EventEmitter();

  accApInvoice: AccApInvoice;
  dataSelectLokasi;
  dataSelectLokasiAfd;
  dataSelectGudang;
  dataSelectBlok;
  dataSelectMesin;
  dataSelectKegiatan;
  dataSelectKaryawan;
  dataSelectUom;
  dataSelectAkun;
  dataSelectjenis_invoice;
  dataSelectTraksi;
  dataSelectLokasiDetail: any[];
  dataSelectTipeJurnal: { id: string; text: string; }[];
  dataSelectSupplier: any[];
  dataSelectJenisInvoice: { id: string; text: string; }[];
  dataSelectPO: any[];

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private accApInvoiceService: AccApInvoiceService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private gbmSupplierService: GbmSupplierService,
    private prcPoService: PrcPoService,
    private accKegiatanService: AccKegiatanService,
    private trkKendaraanService: TrkKendaraanService,
    private accAkunService: AccAkunService,

    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();
    let time: Date = new Date();

    this.entryForm = this.builder.group({
      // tanggal: new FormControl(toDate, Validators.required),
      // tanggal_tempo: new FormControl(toDate, Validators.required),
      // tanggal_terima: new FormControl(toDate, Validators.required),
      // deskripsi: new FormControl(''),
      // no_invoice: new FormControl('', Validators.required),
      no_faktur_pajak: new FormControl('', Validators.required),
      // no_invoice_supplier: new FormControl('', Validators.required),
      // no_faktur_pajak: new FormControl(''),
      // lokasi_id: new FormControl([], Validators.required),
      // supplier_id: new FormControl([], Validators.required),
      // po_id: new FormControl([]),
      // jenis_invoice: new FormControl([], Validators.required),
      // nilai_invoice: new FormControl(0, Validators.required),
      // details: this.builder.array([])
    });
  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    // console.log(this.accApInvoice)
    // this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.accApInvoice.tanggal)));
    // this.entryForm.get('tanggal_tempo').patchValue(new Date(Date.parse(this.accApInvoice.tanggal_tempo)));
    // this.entryForm.get('tanggal_terima').patchValue(new Date(Date.parse(this.accApInvoice.tanggal_terima)));
    // this.entryForm.get('deskripsi').patchValue(this.accApInvoice.deskripsi);
    // this.entryForm.get('no_invoice').patchValue(this.accApInvoice.no_invoice);
    // this.entryForm.get('no_invoice_supplier').patchValue(this.accApInvoice.no_invoice_supplier);
    // this.entryForm.get('no_faktur_pajak').patchValue(this.accApInvoice.no_faktur_pajak);
    // this.entryForm.get('nilai_invoice').patchValue(this.accApInvoice.nilai_invoice);

    this.entryForm.get('no_faktur_pajak').patchValue(this.accApInvoice.no_faktur_pajak);


  }
  public options: any;

  private loadSelect2(): void {
    // this.dataSelectJenisInvoice = [
    //   { id: 'PO', text: 'PO' },
    //   { id: 'PO JASA', text: 'PO JASA' },
    //   { id: 'UANG MUKA PEMBELIAN', text: 'UANG MUKA PEMBELIAN' },
    //   { id: 'UANG MUKA KONTRAKTOR', text: 'UANG MUKA KONTRAKTOR' },
    //   { id: 'UANG MUKA OPERASIONAL', text: 'UANG MUKA OPERASIONAL' },
    //   { id: 'BIAYA ANGKUT', text: 'BIAYA ANGKUT' },
    //   { id: 'HUTANG LAINNYA', text: 'HUTANG LAINNYA' },
    //   { id: 'HUTANG RETENSI', text: 'HUTANG RETENSI' },
    //   { id: 'PEMBELIAN TBS', text: 'PEMBELIAN TBS' },
    //   { id: 'BIAYA NON PO', text: 'BIAYA NON PO' },
    // ];

    // let selectTipe;
    // this.dataSelectJenisInvoice.forEach(a => {
    //   if (a.id == this.accApInvoice.jenis_invoice) {
    //     selectTipe = a;
    //   }
    // });
    // this.entryForm.controls['jenis_invoice'].patchValue(selectTipe);


    // let selectLokasi;
    // this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
    //   this.dataSelectLokasi = [];
    //   x.forEach(d => {
    //     this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
    //     if (this.accApInvoice.lokasi_id == d.id) {
    //       selectLokasi = { "id": d.id, "text": d.nama }
    //     }
    //   });
    //   this.entryForm.get('lokasi_id').patchValue(selectLokasi);
    // });

    // let selectSupplier;
    // this.gbmSupplierService.getAll().subscribe(x => {
    //   this.dataSelectSupplier = [];
    //   let i = x['data'];
    //   i.forEach(d => {
    //     this.dataSelectSupplier.push({ "id": d.id, "text": d.nama_supplier });
    //     if (this.accApInvoice.supplier_id == d.id) {
    //       selectSupplier = { "id": d.id, "text": d.nama_supplier }
    //     }
    //   });
    //   this.entryForm.get('supplier_id').patchValue(selectSupplier);
    // });
    // let selectPO;
    // this.prcPoService.getAll().subscribe(x => {
    //   this.dataSelectPO = [];
    //   let i = x['data'];
    //   i.forEach(d => {
    //     this.dataSelectPO.push({ "id": d.id, "text": d.no_po + ' (' + d.tanggal+ ')' });
    //     if (this.accApInvoice.po_id == d.id) {
    //       selectPO = { "id": d.id, "text": d.nama }
    //     }
    //   });
    //   this.entryForm.get('po_id').patchValue(selectPO);
    // });


    // this.accAkunService.getAllDetail().subscribe(x => {
    //   this.dataSelectAkun = [];
    //   x['data'].forEach(d => {
    //     this.dataSelectAkun.push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
    //   });
    //   // this.trkKendaraanService.getAll().subscribe(x => {
    //   //   this.dataSelectTraksi = [];
    //   //   x['data'].forEach(d => {
    //   //     this.dataSelectTraksi.push({ "id": d.id, "text": d.nama });
    //   //   });

    //   // this.gbmOrganisasiService.getAllByType('BLOK_MESIN').subscribe(x => {
    //   //   this.dataSelectBlok = [];
    //   //   x.forEach(d => {
    //   //     this.dataSelectBlok.push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
    //   //   });

    //   // this.accKegiatanService.getAll().subscribe(x => {
    //   //   this.dataSelectKegiatan = [];
    //   //   x['data'].forEach(d => {
    //   //     this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama });
    //   //   });

    //   let dtl = [];
    //   dtl = this.accApInvoice.detail;
    //   for (let index = 0; index < dtl.length; index++) {
    //     const d = dtl[index];
    //     this.addBlok(d['acc_akun_id'], d['debet'], d['kredit'], d['ket']);
    //   }
    //   //   });
    //   // });
    //   // });
    // });



  }
  onSubmit() {


    this.isFormSubmitted = true;

    if (this.entryForm.invalid) {
      return;
    }

    let frmData = this.entryForm.value;

    // frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    // frmData['tanggal_tempo'] = formatDate(this.entryForm.get('tanggal_tempo').value, "yyyy-MM-dd", 'en_US');
    // frmData['tanggal_terima'] = formatDate(this.entryForm.get('tanggal_terima').value, "yyyy-MM-dd", 'en_US');
    // frmData['nilai_invoice'] = parseFloat(this.entryForm.get('nilai_invoice').value.replace(/[^\d\.\-]/g, ""));

    // this.entryForm.get('details').value.forEach(x => {
    //   if (!isNumber(x.debet)) {
    //     x.debet = parseFloat(x.debet.replace(/[^\d\.\-]/g, ""));
    //   }
    //   if (!isNumber(x.kredit)) {
    //     x.kredit = parseFloat(x.kredit.replace(/[^\d\.\-]/g, ""));
    //   }
    // });

  //  console.log(frmData);
    this.accApInvoiceService.updateFaktur(this.accApInvoice.id, frmData).subscribe(data => {
      // console.log(data);
      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Edit berhasil',
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

  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };

  addBlokNew() {
    this.details.push(this.builder.group({
      // lokasi_id: new FormControl([], Validators.required),
      acc_akun_id: new FormControl([], Validators.required),
      debet: new FormControl(0, Validators.required),
      kredit: new FormControl(0, Validators.required),
      // traksi_id: new FormControl([]),
      // blok_id: new FormControl([], ),
      // kegiatan_id: new FormControl([],),
      ket: new FormControl('',),
    }));
  }


  addBlok(acc_akun_id, debet, kredit, ket) {

    this.dataSelectBlok;
    this.dataSelectKegiatan;
    this.dataSelectUom;
    this.dataSelectAkun;
    let selectedLokasiDetail;
    // this.dataSelectLokasiDetail.forEach(a => {
    //   if (lokasi_id == a.id) {
    //     selectedLokasiDetail = a;
    //   }
    // });
    let selectedAkun;
    this.dataSelectAkun.forEach(a => {
      if (acc_akun_id == a.id) {
        selectedAkun = a;
      }
    });

    let selectedTraksi = [];
    // this.dataSelectTraksi.forEach(a => {
    //   if (traksi_id == a.id) {
    //     selectedTraksi = a;
    //   }
    // });
    // let selectedBlok=[];
    // this.dataSelectBlok.forEach(a => {
    //   if (blok_id == a.id) {
    //     selectedBlok = a;
    //   }
    // });
    // let selectedKegiatan=[];
    // this.dataSelectKegiatan.forEach(a => {
    //   if (kegiatan_id == a.id) {
    //     selectedKegiatan = a;
    //   }
    // });
    let sdebet;
    let skredit;
    if (!isNumber(debet)) {
      sdebet = parseFloat(debet.replace(/[^\d\.\-]/g, ""));
    }else{
      sdebet =debet;
    }
    if (!isNumber(kredit)) {
      skredit = parseFloat(kredit.replace(/[^\d\.\-]/g, ""));
    }else{
      skredit =kredit
    }
    let fb = this.builder.group({

      // lokasi_id: new FormControl(selectedLokasiDetail, Validators.required),
      acc_akun_id: new FormControl(selectedAkun, Validators.required),
      debet: new FormControl(formatNumber(sdebet, 'en_US', '1.2-2'), Validators.required),
      kredit: new FormControl(formatNumber(skredit, 'en_US', '1.2-2'), Validators.required),
      // traksi_id: new FormControl(selectedTraksi, ),
      // blok_id: new FormControl(selectedBlok, ),
      // kegiatan_id: new FormControl(selectedKegiatan),
      ket: new FormControl(ket,),

    });

    this.details.push(fb);
    this.hitungNilaiInvoice();
  }

  removeBlokItem(item) {
    let i = this.details.controls.indexOf(item);
    if (i != -1) {
      // let x=	this.details.controls.splice(i, 1);
      let items = this.entryForm.get('details') as FormArray;
      items.removeAt(i);
      let data = { details: items.value };
      this.updateForm(data);
    }
    this.hitungNilaiInvoice();
  }


  formatNumbering(form){
    let debet= form.get('debet').value
    let kredit= form.get('kredit').value
    if (!isNumber(debet)) {
      debet = parseFloat(debet.replace(/[^\d\.\-]/g, ""));
    }
    if (!isNumber(kredit)) {
      kredit = parseFloat(kredit.replace(/[^\d\.\-]/g, ""));
    }
    form.get('debet').patchValue(formatNumber(debet, 'en_US', '1.2-2'));
    form.get('kredit').patchValue(formatNumber(kredit, 'en_US', '1.2-2'));
    this.hitungNilaiInvoice();
  }
  hitungNilaiInvoice(){
    let dr = 0;
    let cr = 0;
    let jumlah = 0;
    // console.log(this.entryForm.get('details').value);
    this.entryForm.get('details').value.forEach(x=>{
      // console.log(x);
       if (isNumber(x.debet)){
        dr += x.debet;
       }else{
        dr += parseFloat(x.debet.replace(/[^\d\.\-]/g, ""));
       }
       if (isNumber(x.kredit)){
        cr += x.kredit;
       }else{
        cr += parseFloat(x.kredit.replace(/[^\d\.\-]/g, ""));
       }

    });
    jumlah=dr-cr;
    this.entryForm.get('nilai_invoice').patchValue(formatNumber(jumlah, 'en_US', '1.2-2'));

  }

  updateForm(data) {

  }
  recalculate() {
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
      text: "Data yang sudah diubah akan hilang!",
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


  }
  valueChange($event) {
    // console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
}
