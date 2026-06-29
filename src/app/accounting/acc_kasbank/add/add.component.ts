import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';



import { formatDate, formatNumber } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { AccKasbankService } from 'src/app/shared/services/acc_kasbank.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { AccKegiatanService } from 'src/app/shared/services/acc_kegiatan.service';
import { TrkKendaraanService } from 'src/app/shared/services/trk_kendaraan.service';
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
import { AccApInvoiceService } from 'src/app/shared/services/acc_ap_invoice.service';
import { EstSpkBappKendaraanService } from 'src/app/shared/services/est_spk_bapp_kendaraan.service';
import { EstSpkBAService } from 'src/app/shared/services/est_spk_ba.service';
import { AccSalesInvoiceService } from 'src/app/shared/services/acc_sales_invoice.service';
import { AccTbsInvoiceService } from 'src/app/shared/services/acc_tbs_invoice.service';
import { AccAngkutInvoiceService } from 'src/app/shared/services/acc_angkut_invoice.service';
import { LookupInvoiceSupplierComponent } from '../lookup-invoice-supplier/lookup-invoice-supplier.component';
import { LookupInvoiceTbsComponent } from '../lookup-invoice-tbs/lookup-invoice-tbs.component';

import { isNumber } from 'util';
import { LookupInvoiceCustomerComponent } from '../lookup-invoice-customer/lookup-invoice-customer.component';
import { LookupBappComponent } from '../lookup-bapp/lookup-bapp.component';
import { AccPermintaanDanaService } from 'src/app/shared/services/acc_permintaan_dana.service';
import { LookupBappKebunComponent } from '../lookup-bapp-kebun/lookup-bapp-kebun.component';
import { LookupInvoiceAngkutCpoComponent } from '../lookup-invoice-angkut-cpo/lookup-invoice-angkut-cpo.component';
import { ImportComponent } from '../import/import.component';
import { LookupKuitansiTbsComponent } from '../lookup-kuitansi-tbs/lookup-kuitansi-tbs.component';
import { AccKuitansiPembelianTbsService } from 'src/app/shared/services/acc_kuitansi_pembelian_tbs.service';
import { AccPermohonanBayarV2Service, JurnalPermohonanResponse } from 'src/app/shared/services/acc_permohonan_bayar_v2.service';
import { LookupUangMukaComponent } from '../lookup-uang-muka/lookup-uang-muka.component';
import { AccUangMukaService } from 'src/app/shared/services/acc_uang_muka.service';
import { LookupPermintaanDanaComponent } from '../lookup-permintaan-dana/lookup-permintaan-dana.component';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { LookupPermohonanComponent } from '../lookup-permohonan-pembayaran/lookup-permohonan-pembayaran.component';
declare var $: any;
declare var swal: any;

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
  ketDetail = '';
  entryForm: FormGroup;

  event: EventEmitter<any> = new EventEmitter();

  awalanHeading = "heading_";
  awalanCollapse = "collapse_";
  sumberDoc = '';
  dataSelectLokasi;
  dataSelectLokasiAfd;
  dataSelectGudang;
  dataSelectBlok;
  dataSelectMesin;
  dataSelectKegiatan;
  dataSelectKaryawan;
  dataSelectUom;
  dataSelectAkun;
  dataSelecttipe_jurnal;
  dataSelectTraksi;
  dataSelectLokasiDetail: any[];
  dataSelectTipeJurnal: { id: string; text: string; }[];
  dataSelectAkunKasbank: any[];
  dataSelectTipePembayaran: { id: string; text: string; }[];
  dataSelectSumberDokumen: { id: string; text: string; }[];
  dataSelectPermintaan: any[];
  dataSelectPermohonan: any[];
  permohonanIds: number[] = [];
  dataSelectSupplier: any[];
  bsModalRef2: BsModalRef;
  showPermohonanBayar: boolean;
  selectedJenisPermohonan: string = null;

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private bsModalRef1: BsModalRef,
    private bsModalService: BsModalService,
    private accKasbankService: AccKasbankService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private GbmSupplierService: GbmSupplierService,
    private accKegiatanService: AccKegiatanService,
    private trkKendaraanService: TrkKendaraanService,
    private accAkunService: AccAkunService,
    private accApInvoiceService: AccApInvoiceService,
    private accSalesInvoiceService: AccSalesInvoiceService,
    private accPermintaanDanaService: AccPermintaanDanaService,
    private estBappSpkKendaraanService: EstSpkBappKendaraanService,
    private estBaKebunService: EstSpkBAService,
    private accTbsInvoiceService: AccTbsInvoiceService,
    private accKuitansiPembelianTbsService: AccKuitansiPembelianTbsService,
    private accPermohonanPembayaranV2Service: AccPermohonanBayarV2Service,
    private accAngkutInvoiceService: AccAngkutInvoiceService,
    private accUangMukaService: AccUangMukaService,
    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();
    this.entryForm = this.builder.group({

      tanggal: new FormControl(toDate, Validators.required),
      keterangan: new FormControl(''),
      no_transaksi: new FormControl('<OTOMATIS>'),
      no_referensi: new FormControl(''),
      lokasi_id: new FormControl([], Validators.required),
      supplier_id: new FormControl([]),
      ref_id: new FormControl(''),
      akun_kasbank_id: new FormControl([], Validators.required),
      permintaan_id: new FormControl([]),
      permohonan_id: new FormControl([], []),
      tipe_jurnal: new FormControl([], Validators.required),
      sumber_dokumen: new FormControl([], Validators.required),
      tipe_bayar: new FormControl([], Validators.required),
      nilai: new FormControl(0, Validators.required),
      details: this.builder.array([])

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }
  public options: any;

  private loadSelect2(): void {

    this.dataSelectTipeJurnal = [
      { id: 'in', text: 'PENERIMAAN' },
      { id: 'out', text: 'PEMBAYARAN/PENGELUARAN' },

    ];
    this.dataSelectTipePembayaran = [
      { id: 'CASH', text: 'CASH' },
      { id: 'TRANSFER', text: 'TRANSFER' },
      { id: 'GIRO', text: 'GIRO' },
      { id: 'CHEQUE', text: 'CHEQUE' },

    ];
    this.dataSelectSumberDokumen = [
      { id: 'NONE', text: 'NONE' },
      { id: 'INVOICE_AP', text: 'INVOICE AP/PEMBELIAN (SUPPLIER)' },
      { id: 'INVOICE_AR', text: 'INVOICE AR/PENJUALAN (CUSTOMER)' },
      { id: 'BAPP_SEWA_KENDARAAN', text: 'BAPP SPK SEWA KENDARAAN' },
      { id: 'INVOICE_TBS', text: 'INVOICE PEMBELIAN TBS' },
      { id: 'BAPP_SPK_KEBUN', text: 'BAPP SPK KEBUN' },
      { id: 'INVOICE_ANGKUT_CPO', text: 'INVOICE ANGKUT CPO/PK' },
      { id: 'KUITANSI_PEMBELIAN_TBS', text: 'KUITANSI PEMBELIAN TBS' },
      { id: 'PERMINTAAN_DANA', text: 'PERMINTAAN DANA' },
      { id: 'UANG_MUKA', text: 'UANG MUKA' },

    ];

    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasiDetail = [];
      x.forEach(d => {
        this.dataSelectLokasiDetail.push({ "id": d.id, "text": d.nama });
      });
    });

    this.GbmSupplierService.getAll().subscribe(x => {
      this.dataSelectSupplier = [];
      let i = x['data'];
      console.log(x);
      i.forEach(d => {
        this.dataSelectSupplier.push({ "id": d.id, "text": d.nama_supplier });
      });
    })


    this.GbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
    });

    this.accAkunService.getAllKasbankByAccess().subscribe(x => {
      this.dataSelectAkunKasbank = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectAkunKasbank.push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
      });
    });
    this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {
      let lokasi_id = x.id;
      this.accPermintaanDanaService.getAllByUnit(lokasi_id).subscribe(x => {
        this.dataSelectPermintaan = [];
        x['data'].forEach(d => {
          this.dataSelectPermintaan.push({ "id": d.id, "text": d.no_transaksi + '(' + d.tanggal + ')' });
        });
      });



    });

    this.entryForm.controls['supplier_id'].valueChanges.subscribe(x => {

      // reset permohonan
      this.entryForm.get('permohonan_id').patchValue('');
      this.permohonanIds = [];
      this.dataSelectPermohonan = [];

      // reset jenis permohonan
      this.selectedJenisPermohonan = null;

      // unlock sumber dokumen
      this.entryForm.get('sumber_dokumen').enable();
      this.entryForm.get('sumber_dokumen').patchValue([]);

      // reset detail jurnal
      const dt = this.entryForm.get('details') as FormArray;
      while (dt.length !== 0) {
        dt.removeAt(0);
      }

      // reset nilai
      this.entryForm.get('nilai').patchValue(0);

      if (!x) return;

      let supplier_id = null;

      if (typeof x === 'object' && x.id) {
        supplier_id = x.id;
      }
      else if (typeof x === 'number') {
        supplier_id = x;
      }

      if (!supplier_id) return;

      this.loadPermohonanSupplier(supplier_id);

    });
    this.accKegiatanService.getAll().subscribe(x => {
      this.dataSelectKegiatan = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama + " (" + d.kode + ")" });
      });
    });





    this.accAkunService.getAllDetail().subscribe(x => {
      this.dataSelectAkun = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectAkun.push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
      });
    });


    this.trkKendaraanService.getAll().subscribe(x => {
      this.dataSelectTraksi = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectTraksi.push({ "id": d.id, "text": d.kode + '-' + d.nama + '(' + d.traksi + ')' });
      });
    });

    this.GbmOrganisasiService.getAllByType('BLOK_MESIN').subscribe(x => {
      this.dataSelectBlok = [];
      x.forEach(d => {
        this.dataSelectBlok.push({ "id": d.id, "text": d.kode + ' - ' + d.nama + '(' + d.nama_parent + ')' });
      });
    });

  }
  onSubmitClear() {
    this.isFormSubmitted = true;

    if (this.entryForm.invalid) {
      swal({
        title: 'Perhatian!',
        text: 'Data belum lengkap!',
        type: 'warning',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      })
      return;
    }

    let frmData = this.entryForm.getRawValue();
        frmData['permohonan_ids'] = this.permohonanIds;

    frmData['nilai'] = parseFloat(this.entryForm.get('nilai').value.replace(/[^\d\.\-]/g, ""));
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');

    this.entryForm.get('details').value.forEach(x => {
      if (!isNumber(x.debet)) {
        x.debet = parseFloat(x.debet.replace(/[^\d\.\-]/g, ""));
      }
      if (!isNumber(x.kredit)) {
        x.kredit = parseFloat(x.kredit.replace(/[^\d\.\-]/g, ""));
      }
    });

    this.accKasbankService.create(frmData).subscribe(data => {
      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Data berhasil disimpan dengan Nomor:' + data['data'],
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        // this.bsModalRef.hide();
        this.isFormSubmitted = false;

        let date: Date = new Date();
        let strDate = formatDate(date, "yyyy-MM-dd", "en_US");

        this.entryForm.get('tanggal').patchValue(new Date(Date.parse(strDate)));
        this.entryForm.get('keterangan').patchValue('');
        this.entryForm.get('no_transaksi').patchValue('(AutoNumber)');
        this.entryForm.get('no_referensi').patchValue('');
        this.entryForm.get('ref_id').patchValue('');
        this.entryForm.controls['tipe_jurnal'].patchValue({});
        this.entryForm.controls['tipe_bayar'].patchValue({});
        this.entryForm.controls['sumber_dokumen'].patchValue({});
        // this.entryForm.get('lokasi_id').patchValue({});
        this.entryForm.get('permintaan_id').patchValue({});
        this.entryForm.get('akun_kasbank_id').patchValue({});
        // this.entryForm.get('details').patchValue([]);
        let dt = this.entryForm.get('details') as FormArray;
        let data_val = dt.value;
        console.log(data_val);
        for (let i of data_val) {
          console.log(i)
          dt.removeAt(i);

        }
        this.event.emit('OK');
        return;
      } else {
        swal({
          title: 'Proses Simpan Gagal!',
          text: '' + data['data'],
          type: 'warning',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
      }
    });
  }
  onSubmit() {
    this.isFormSubmitted = true;

    if (this.entryForm.invalid) {
      swal({
        title: 'Perhatian!',
        text: 'Data belum lengkap!',
        type: 'warning',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      })
      return;
    }


    let frmData = this.entryForm.getRawValue();
    console.log(frmData);
    frmData['permohonan_ids'] = this.permohonanIds;
    frmData['nilai'] = parseFloat(this.entryForm.get('nilai').value.replace(/[^\d\.\-]/g, ""));
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');

    this.entryForm.get('details').value.forEach(x => {
      if (!isNumber(x.debet)) {
        x.debet = parseFloat(x.debet.replace(/[^\d\.\-]/g, ""));
      }
      if (!isNumber(x.kredit)) {
        x.kredit = parseFloat(x.kredit.replace(/[^\d\.\-]/g, ""));
      }
    });


    // // console.log(frmData);
    this.accKasbankService.create(frmData).subscribe(data => {
      // console.log(data);
      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Data berhasil disimpan dengan Nomor:' + data['data'],
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })

        this.event.emit('OK');
        this.bsModalRef.hide();
      } else {
        swal({
          title: 'Proses Simpan Gagal!',
          text: '' + data['data'],
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

  addInvoiceSupplier() {
    this.accApInvoiceService.getAllOutstandingInvoice().subscribe(t => {
      console.log(t);
      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        class: "modal-lg ",
        initialState: {
          apInvoice: t['data']
        }
      };
      this.bsModalRef1 = this.bsModalService.show(LookupInvoiceSupplierComponent, modalConfig);
      this.bsModalRef1.content.event.subscribe(item => {
        console.log(item)
        let id_akun_supplier = item['akun_supplier_id']; //
        if (item == null) {

        } else {

          /* clear detail */
          let dt = this.entryForm.get('details') as FormArray;
          let data_val = dt.value;
          console.log(data_val);


          for (let i of data_val) {
            console.log(i)
            // dt.removeAt(i);  // UTK KOSONGKAN ISI DATA DULU
            // this.ketDetail=this.ketDetail+', '+item['no_invoice']
          }
          /* end clear detail */
          this.ketDetail = this.ketDetail + ', ' + item['no_invoice']
          // this.ketDetail='Pembayaran Hutang No Inv:'+this.ketDetail+ ', '+item['nama_supplier'];
          this.entryForm.get('ref_id').patchValue(item['id']);
          // this.entryForm.get('keterangan').patchValue('Pembayaran Hutang No Inv:' + item['no_invoice'] + ', Supp:' + item['nama_supplier']);
          this.entryForm.get('keterangan').patchValue(this.ketDetail);
          // let lokasi_id= this.entryForm.get('lokasi_id').value['id']
          let lokasi_id = item['lokasi_id']
          this.accAkunService.getAllByLokasiId(lokasi_id).subscribe(x => {
            // console.log(x)

            this.dataSelectAkun[lokasi_id] = [];
            let i = x['data'];
            i.forEach(d => {
              this.dataSelectAkun[lokasi_id].push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
            });
            this.addBlok(item['lokasi_id'], id_akun_supplier, null, null, null, item['sisa'], 0, 'Pembayaran Invoice No:' + item['no_invoice'] + ', ' + item['nama_supplier'], item['invoice_id'])

          });

        }

      });

    });

  }
  addInvoiceCustomer() {
    this.accSalesInvoiceService.getAllOutstandingInvoice().subscribe(t => {
      console.log(t);
      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        class: "modal-lg ",
        initialState: {
          apInvoice: t['data']
        }
      };
      this.bsModalRef1 = this.bsModalService.show(LookupInvoiceCustomerComponent, modalConfig);
      this.bsModalRef1.content.event.subscribe(item => {
        console.log(item)
        let id_akun_customer = item['akun_customer_id']; // pantek sementara utk akun supplier
        if (item == null) {

        } else {
          /* clear detail */
          let dt = this.entryForm.get('details') as FormArray;
          let data_val = dt.value;
          console.log(data_val);
          let ket = '';
          for (let i of data_val) {
            console.log(i)
            //  dt.removeAt(i);  // UTK KOSONGKAN ISI DATA DULU
            //  ket=ket+', '+item['no_invoice']
          }
          /* end clear detail */
          // ket='Pembayaran Piutang No Inv:'+ket+ ' '+item['nama_customer'];
          this.ketDetail = this.ketDetail + ', ' + item['no_invoice']
          this.entryForm.get('ref_id').patchValue(item['id']);
          this.entryForm.get('keterangan').patchValue(this.ketDetail);
          //  let lokasi_id= this.entryForm.get('lokasi_id').value['id']
          let lokasi_id = item['lokasi_id']
          this.accAkunService.getAllByLokasiId(lokasi_id).subscribe(x => {
            console.log(x)
            console.log(lokasi_id)
            this.dataSelectAkun[lokasi_id] = [];
            let i = x['data'];
            i.forEach(d => {

              this.dataSelectAkun[lokasi_id].push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
            });
            this.addBlok(item['lokasi_id'], id_akun_customer, null, null, null, 0, item['sisa'], 'Pembayaran Invoice Penjualan No:' + item['no_invoice'] + ', ' + item['nama_customer'], item['invoice_id'])

          });
        }

      });

    });

  }

  addBappSewaKendaraan() {
    this.estBappSpkKendaraanService.getAllOutstanding().subscribe(t => {
      console.log(t);
      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        class: "modal-lg ",
        initialState: {
          apInvoice: t['data']
        }
      };
      this.bsModalRef1 = this.bsModalService.show(LookupBappComponent, modalConfig);
      this.bsModalRef1.content.event.subscribe(item => {
        console.log(item)
        let id_akun_supplier = item['akun_supplier_id']; //
        if (item == null) {

        } else {

          /* clear detail */
          let dt = this.entryForm.get('details') as FormArray;
          let data_val = dt.value;
          console.log(data_val);


          for (let i of data_val) {
            console.log(i)
            // dt.removeAt(i);  // UTK KOSONGKAN ISI DATA DULU
            // this.ketDetail=this.ketDetail+', '+item['no_invoice']
          }
          /* end clear detail */
          this.ketDetail = this.ketDetail + ', ' + item['no_bapp']
          // this.ketDetail='Pembayaran Hutang No Inv:'+this.ketDetail+ ', '+item['nama_supplier'];
          this.entryForm.get('ref_id').patchValue(item['id']);
          // this.entryForm.get('keterangan').patchValue('Pembayaran Hutang No Inv:' + item['no_invoice'] + ', Supp:' + item['nama_supplier']);
          this.entryForm.get('keterangan').patchValue(this.ketDetail);
          // let lokasi_id= this.entryForm.get('lokasi_id').value['id']
          let lokasi_id = item['lokasi_id']
          this.accAkunService.getAllByLokasiId(lokasi_id).subscribe(x => {
            // console.log(x)

            this.dataSelectAkun[lokasi_id] = [];
            let i = x['data'];
            i.forEach(d => {
              this.dataSelectAkun[lokasi_id].push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
            });
            this.addBlok(item['lokasi_id'], id_akun_supplier, null, null, null, item['sisa'], 0, 'Pembayaran BAPP No.:' + item['no_bapp'] + ', ' + item['nama_kontraktor'], item['invoice_id'])

          });

        }

      });

    });

  }
  addBappSpkKebun() {
    this.estBaKebunService.getAllOutstanding().subscribe(t => {
      console.log(t);
      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        class: "modal-lg ",
        initialState: {
          apInvoice: t['data']
        }
      };
      this.bsModalRef1 = this.bsModalService.show(LookupBappKebunComponent, modalConfig);
      this.bsModalRef1.content.event.subscribe(item => {
        console.log(item)
        let id_akun_supplier = item['akun_supplier_id']; //
        if (item == null) {

        } else {

          /* clear detail */
          let dt = this.entryForm.get('details') as FormArray;
          let data_val = dt.value;
          console.log(data_val);


          for (let i of data_val) {
            console.log(i)
            // dt.removeAt(i);  // UTK KOSONGKAN ISI DATA DULU
            // this.ketDetail=this.ketDetail+', '+item['no_invoice']
          }
          /* end clear detail */
          this.ketDetail = this.ketDetail + ', ' + item['no_transaksi']
          // this.ketDetail='Pembayaran Hutang No Inv:'+this.ketDetail+ ', '+item['nama_supplier'];
          this.entryForm.get('ref_id').patchValue(item['id']);
          // this.entryForm.get('keterangan').patchValue('Pembayaran Hutang No Inv:' + item['no_invoice'] + ', Supp:' + item['nama_supplier']);
          this.entryForm.get('keterangan').patchValue(this.ketDetail);
          // let lokasi_id= this.entryForm.get('lokasi_id').value['id']
          let lokasi_id = item['lokasi_id']
          this.accAkunService.getAllByLokasiId(lokasi_id).subscribe(x => {
            // console.log(x)

            this.dataSelectAkun[lokasi_id] = [];
            let i = x['data'];
            i.forEach(d => {
              this.dataSelectAkun[lokasi_id].push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
            });
            this.addBlok(item['lokasi_id'], id_akun_supplier, null, null, null, item['sisa'], 0, 'Pembayaran BAPP No.:' + item['no_transaksi'] + ', ' + item['nama_kontraktor'], item['invoice_id'])

          });

        }

      });

    });

  }

  addInvoiceTBS() {
    this.accTbsInvoiceService.getAllOutstanding().subscribe(t => {
      console.log(t);
      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        class: "modal-lg ",
        initialState: {
          apInvoice: t['data']
        }
      };
      this.bsModalRef1 = this.bsModalService.show(LookupInvoiceTbsComponent, modalConfig);
      this.bsModalRef1.content.event.subscribe(item => {
        console.log(item)
        let id_akun_supplier = item['akun_supplier_id']; //
        if (item == null) {

        } else {

          /* clear detail */
          let dt = this.entryForm.get('details') as FormArray;
          let data_val = dt.value;
          console.log(data_val);


          for (let i of data_val) {
            console.log(i)
            // dt.removeAt(i);  // UTK KOSONGKAN ISI DATA DULU
            // this.ketDetail=this.ketDetail+', '+item['no_invoice']
          }
          /* end clear detail */
          this.ketDetail = this.ketDetail + ', ' + item['no_invoice']
          // this.ketDetail='Pembayaran Hutang No Inv:'+this.ketDetail+ ', '+item['nama_supplier'];
          this.entryForm.get('ref_id').patchValue(item['id']);
          // this.entryForm.get('keterangan').patchValue('Pembayaran Hutang No Inv:' + item['no_invoice'] + ', Supp:' + item['nama_supplier']);
          this.entryForm.get('keterangan').patchValue(this.ketDetail);
          // let lokasi_id= this.entryForm.get('lokasi_id').value['id']
          let lokasi_id = item['lokasi_id']
          this.accAkunService.getAllByLokasiId(lokasi_id).subscribe(x => {
            // console.log(x)

            this.dataSelectAkun[lokasi_id] = [];
            let i = x['data'];
            i.forEach(d => {
              this.dataSelectAkun[lokasi_id].push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
            });
            this.addBlok(item['lokasi_id'], id_akun_supplier, null, null, null, item['sisa'], 0, 'Pembayaran Invoice No.:' + item['no_invoice'] + ', Supplier:' + item['nama_kontraktor'], item['invoice_id'])

          });

        }

      });

    });

  }
  addInvoiceAngkutCpo() {
    this.accAngkutInvoiceService.getAllOutstanding().subscribe(t => {
      console.log(t);
      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        class: "modal-lg ",
        initialState: {
          apInvoice: t['data']
        }
      };
      this.bsModalRef1 = this.bsModalService.show(LookupInvoiceAngkutCpoComponent, modalConfig);
      this.bsModalRef1.content.event.subscribe(item => {
        console.log(item)
        let id_akun_supplier = item['akun_supplier_id']; //
        if (item == null) {

        } else {

          /* clear detail */
          let dt = this.entryForm.get('details') as FormArray;
          let data_val = dt.value;
          console.log(data_val);


          for (let i of data_val) {
            console.log(i)
            // dt.removeAt(i);  // UTK KOSONGKAN ISI DATA DULU
            // this.ketDetail=this.ketDetail+', '+item['no_invoice']
          }
          /* end clear detail */
          this.ketDetail = this.ketDetail + ', ' + item['no_invoice']
          // this.ketDetail='Pembayaran Hutang No Inv:'+this.ketDetail+ ', '+item['nama_supplier'];
          this.entryForm.get('ref_id').patchValue(item['id']);
          // this.entryForm.get('keterangan').patchValue('Pembayaran Hutang No Inv:' + item['no_invoice'] + ', Supp:' + item['nama_supplier']);
          this.entryForm.get('keterangan').patchValue(this.ketDetail);
          // let lokasi_id= this.entryForm.get('lokasi_id').value['id']
          let lokasi_id = item['lokasi_id']
          this.accAkunService.getAllByLokasiId(lokasi_id).subscribe(x => {
            // console.log(x)

            this.dataSelectAkun[lokasi_id] = [];
            let i = x['data'];
            i.forEach(d => {
              this.dataSelectAkun[lokasi_id].push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
            });
            this.addBlok(item['lokasi_id'], id_akun_supplier, null, null, null, item['sisa'], 0, 'Pembayaran Invoice No.:' + item['no_invoice'] + ', Transportir:' + item['nama_kontraktor'], item['invoice_id'])

          });

        }

      });

    });

  }
  addBlokItem() {
    let selectedLokasiDetail: any = [];
    let lokasi_id = this.entryForm.get('lokasi_id').value['id'];
    let keterangan = this.entryForm.get('keterangan').value;
    this.dataSelectLokasiDetail.forEach(a => {
      if (lokasi_id == a.id) {
        selectedLokasiDetail = a;
      }
    });
    this.accAkunService.getAllByLokasiId(lokasi_id).subscribe(x => {
      console.log(x)
      this.dataSelectAkun[lokasi_id] = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectAkun[lokasi_id].push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
      });
    });
    this.details.push(this.builder.group({
      lokasi_id: new FormControl(selectedLokasiDetail, Validators.required),
      acc_akun_id: new FormControl([], Validators.required),
      debet: new FormControl(0, Validators.required),
      kredit: new FormControl(0, Validators.required),
      traksi_id: new FormControl([],),
      blok_id: new FormControl([],),
      kegiatan_id: new FormControl([]),
      ket: new FormControl(keterangan,),
    }));
  }
  addBlok(lokasi_id, acc_akun_id, traksi_id, blok_id, kegiatan_id, debet, kredit, ket, invoice_id) {

    this.dataSelectBlok;
    this.dataSelectKegiatan;
    this.dataSelectUom;
    this.dataSelectAkun;
    let selectedLokasiDetail = { id: null, text: '' };
    this.dataSelectLokasiDetail.forEach(a => {
      if (lokasi_id == a.id) {
        selectedLokasiDetail = a;
      }
    });
    let selectedAkun = { id: null, text: '' };
    console.log(acc_akun_id);
    this.dataSelectAkun.forEach(a => {
      if (acc_akun_id == a.id) {
        selectedAkun = a;
      }
    });

    let selectedTraksi = [];
    this.dataSelectTraksi.forEach(a => {
      if (traksi_id == a.id) {
        selectedTraksi = a;
      }
    });
    let selectedBlok = [];
    this.dataSelectBlok.forEach(a => {
      if (blok_id == a.id) {
        selectedBlok = a;
      }
    });
    let selectedKegiatan = [];
    this.dataSelectKegiatan.forEach(a => {
      if (kegiatan_id == a.id) {
        selectedKegiatan = a;
      }
    });
    let sdebet;
    let skredit;
    if (!isNumber(debet)) {
      sdebet = parseFloat(debet.replace(/[^\d\.\-]/g, ""));
    } else {
      sdebet = debet;
    }
    if (!isNumber(kredit)) {
      skredit = parseFloat(kredit.replace(/[^\d\.\-]/g, ""));
    } else {
      skredit = kredit
    }
    let fb = this.builder.group({

      lokasi_id: new FormControl(selectedLokasiDetail, Validators.required),
      acc_akun_id: new FormControl(selectedAkun, Validators.required),
      debet: new FormControl(formatNumber(sdebet, 'en_US', '1.2-2'), Validators.required),
      kredit: new FormControl(formatNumber(skredit, 'en_US', '1.2-2'), Validators.required),
      traksi_id: new FormControl(selectedTraksi,),
      blok_id: new FormControl(selectedBlok,),
      kegiatan_id: new FormControl(selectedKegiatan),
      ket: new FormControl(ket,),
      invoice_id: new FormControl(invoice_id,)

    });

    this.details.push(fb);
    this.hitungNilai();
  }

  removeBlokItem(blok) {
    let i = this.details.controls.indexOf(blok);
    if (i != -1) {
      let detail = this.entryForm.get('details') as FormArray;
      detail.removeAt(i);
      let data = { details: detail.value };
      this.updateForm(data);
    }
    this.hitungNilai();
  }


  updateForm(data) {

  }
  recalculate() {


  }
  hitungNilai() {
    let dr = 0;
    let cr = 0;
    let jumlah = 0;
    let tipe = this.entryForm.get('tipe_jurnal').value['id']
    // console.log(this.entryForm.get('details').value);
    this.entryForm.get('details').value.forEach(x => {
      // console.log(x);
      if (isNumber(x.debet)) {
        dr += x.debet;
      } else {
        dr += parseFloat(x.debet.replace(/[^\d\.\-]/g, ""));
      }
      if (isNumber(x.kredit)) {
        cr += x.kredit;
      } else {
        cr += parseFloat(x.kredit.replace(/[^\d\.\-]/g, ""));
      }

    });
    // console.log(tipe)
    if (tipe == 'in') {
      jumlah = cr - dr;
    } else {
      jumlah = dr - cr;
    }

    this.entryForm.get('nilai').patchValue(formatNumber(jumlah, 'en_US', '1.2-2'));

  }

  formatNumbering(form) {
    let debet = form.get('debet').value
    let kredit = form.get('kredit').value
    if (!isNumber(debet)) {
      debet = parseFloat(debet.replace(/[^\d\.\-]/g, ""));
    }
    if (!isNumber(kredit)) {
      kredit = parseFloat(kredit.replace(/[^\d\.\-]/g, ""));
    }
    form.get('debet').patchValue(formatNumber(debet, 'en_US', '1.2-2'));
    form.get('kredit').patchValue(formatNumber(kredit, 'en_US', '1.2-2'));
    this.hitungNilai();
  }
  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {

    this.loadSelect2();

    setTimeout(() => {

      const supplier = this.entryForm.get('supplier_id').value;

      if (!supplier) return;

      let supplier_id = null;

      if (typeof supplier === 'object' && supplier.id) {
        supplier_id = supplier.id;
      }
      else if (typeof supplier === 'number') {
        supplier_id = supplier;
      }

      if (supplier_id) {
        this.loadPermohonanSupplier(supplier_id);
      }

    }, 300);

  }

  SumberDokumenChange($event) {

    this.sumberDoc = $event.id;
    console.log(this.sumberDoc);
  }
  TipeChange(event: any) {
    this.hitungNilai();
    this.showPermohonanBayar = false;

    let tipe = '';

    // kalau event object hasil select2 { id, text }
    if (event && typeof event === 'object' && event.hasOwnProperty('id')) {
      tipe = event.id;
    }
    // kalau event langsung string ('in' atau 'out')
    else if (typeof event === 'string') {
      tipe = event;
    }

    if (tipe === 'out') {
      this.showPermohonanBayar = true;
    } else {
      this.showPermohonanBayar = false;
      const permohonanField = this.entryForm.get('permohonan_id');
      if (permohonanField) permohonanField.setValue(null);
    }
  }

  LokasiDtlChange(blok) {
    let lokasi_id = blok.get('lokasi_id').value['id'];
    console.log(lokasi_id);
    this.accAkunService.getAllByLokasiId(lokasi_id).subscribe(x => {
      console.log(x)
      this.dataSelectAkun[lokasi_id] = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectAkun[lokasi_id].push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
      });
    });

  }
  valueChange($event) {

  }
  import() {
    let modalConfig = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true,
      //size: 'lg',
      class: "modal-lg ",

    };
    this.bsModalRef2 = this.bsModalService.show(ImportComponent, modalConfig);
    this.bsModalRef2.content.event.subscribe(result => {
      if (result.status == 'OK') {
        let dtl = result.data;

        this.accAkunService.getAllDetail().subscribe(x => {
          // console.log(x)
          for (let index = 0; index < dtl.length; index++) {
            const d = dtl[index];
            let lokasi_id = d['lokasi_id'];
            this.dataSelectAkun[lokasi_id] = [];
            let i = x['data'];
            i.forEach(d => {
              this.dataSelectAkun[lokasi_id].push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
            });
            this.addBlok(d['lokasi_id'], d['acc_akun_id'], null, null, null, d['debet'], d['kredit'], d['ket'], null)
          }
          this.hitungNilai();
        });



      }
    });
  }
  addDetail(lokasi_id, acc_akun_id, traksi_id, blok_id, kegiatan_id, debet, kredit, ket) {

    this.dataSelectBlok;
    this.dataSelectKegiatan;
    this.dataSelectUom;
    this.dataSelectAkun;
    let selectedLokasiDetail;
    this.dataSelectLokasiDetail.forEach(a => {
      if (lokasi_id == a.id) {
        selectedLokasiDetail = a;
      }
    });
    let selectedAkun;
    this.dataSelectAkun.forEach(a => {
      if (acc_akun_id == a.id) {
        selectedAkun = a;
      }
    });

    let selectedTraksi = [];
    this.dataSelectTraksi.forEach(a => {
      if (traksi_id == a.id) {
        selectedTraksi = a;
      }
    });
    let selectedBlok = [];
    this.dataSelectBlok.forEach(a => {
      if (blok_id == a.id) {
        selectedBlok = a;
      }
    });
    let selectedKegiatan = [];
    this.dataSelectKegiatan.forEach(a => {
      if (kegiatan_id == a.id) {
        selectedKegiatan = a;
      }
    });

    let fb = this.builder.group({

      lokasi_id: new FormControl(selectedLokasiDetail, Validators.required),
      acc_akun_id: new FormControl(selectedAkun, Validators.required),
      debet: new FormControl(debet, Validators.required),
      kredit: new FormControl(kredit, Validators.required),
      traksi_id: new FormControl(selectedTraksi,),
      blok_id: new FormControl(selectedBlok,),
      kegiatan_id: new FormControl(selectedKegiatan,),
      ket: new FormControl(ket,),

    });

    this.details.push(fb);
    this.formatNumbering(fb);
  }

  addKuitansiTBS() {
    this.accKuitansiPembelianTbsService.getAllKuitansiPosting().subscribe(t => {
      console.log(t);
      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        class: "modal-lg",
        initialState: {
          apInvoice: t['data'] // data dari acc_tbs_kuitansi_ht
        }
      };
      this.bsModalRef1 = this.bsModalService.show(LookupKuitansiTbsComponent, modalConfig);

      this.bsModalRef1.content.event.subscribe(item => {
        if (!item) return;

        // update keterangan
        this.ketDetail = this.ketDetail + ', ' + item['no_kuitansi'];
        this.entryForm.get('ref_id').patchValue(item['id']);
        this.entryForm.get('keterangan').patchValue(this.ketDetail);

        let lokasi_id = item['lokasi_id'];
        let id_akun_supplier = item['akun_supplier_id']; //

        // ambil akun terkait lokasi
        this.accAkunService.getAllByLokasiId(lokasi_id).subscribe(x => {
          this.dataSelectAkun[lokasi_id] = [];
          x['data'].forEach(d => {
            this.dataSelectAkun[lokasi_id].push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
          });

          // tambah blok/detail untuk kuitansi
          this.addBlok(
            item['lokasi_id'],
            id_akun_supplier,
            null,
            null,
            null,
            item['total_tagihan'], // nilai
            0,
            'Pembayaran Kuitansi No.:' + item['no_kuitansi'] + ', Supplier:' + item['nama_kontraktor'],
            item['id']
          );
        });
      });
    });
  }
  addPermintaanDana() {
    this.accPermintaanDanaService.getPermintaanDana().subscribe(t => {
      console.log(t);
      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        class: "modal-lg",
        initialState: {
          apInvoice: t['data'] // data dari acc_tbs_kuitansi_ht
        }
      };
      this.bsModalRef1 = this.bsModalService.show(LookupPermintaanDanaComponent, modalConfig);

      this.bsModalRef1.content.event.subscribe(item => {
        if (!item) return;

        // update keterangan
        this.ketDetail = this.ketDetail + ', ' + item['no_transaksi'];
        this.entryForm.get('ref_id').patchValue(item['id']);
        this.entryForm.get('keterangan').patchValue(this.ketDetail);

        let lokasi_id = item['lokasi_id'];
        let id_akun_supplier = item['akun_supplier_id']; //

        // ambil akun terkait lokasi
        this.accAkunService.getAllByLokasiId(lokasi_id).subscribe(x => {
          this.dataSelectAkun[lokasi_id] = [];
          x['data'].forEach(d => {
            this.dataSelectAkun[lokasi_id].push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
          });

          // tambah blok/detail untuk kuitansi
          this.addBlok(
            item['lokasi_id'],
            id_akun_supplier,
            null,
            null,
            null,
            item['nilai'], // nilai
            0,
            'Permintaan Dana No.:' + item['no_transaksi'],
            item['id']
          );
        });
      });
    });
  }
  addUangMuka() {
    this.accUangMukaService.getUangMuka().subscribe(t => {
      console.log(t);
      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        class: "modal-lg",
        initialState: {
          apInvoice: t['data'] // data dari acc_tbs_kuitansi_ht
        }
      };
      this.bsModalRef1 = this.bsModalService.show(LookupUangMukaComponent, modalConfig);

      this.bsModalRef1.content.event.subscribe(item => {
        if (!item) return;

        // update keterangan
        this.ketDetail = this.ketDetail + ', ' + item['no_transaksi'];
        this.entryForm.get('ref_id').patchValue(item['id']);
        this.entryForm.get('keterangan').patchValue(this.ketDetail);

        let lokasi_id = item['lokasi_id'];
        let id_akun_supplier = 2945; //

        // ambil akun terkait lokasi
        this.accAkunService.getAllByLokasiId(lokasi_id).subscribe(x => {
          this.dataSelectAkun[lokasi_id] = [];
          x['data'].forEach(d => {
            this.dataSelectAkun[lokasi_id].push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
          });

          // tambah blok/detail untuk kuitansi
          this.addBlok(
            item['lokasi_id'],
            id_akun_supplier,
            null,
            null,
            null,
            item['nilai'], // nilai
            0,
            'Pembayaran Uang Muka No.:' + item['no_transaksi'],
            item['id']
          );
        });
      });
    });
  }


  addPermohonan(item) {

    if (!item) return;

    if (this.permohonanIds.includes(item.id)) {
      return;
    }

    this.permohonanIds.push(item.id);

    let current = this.entryForm.get('permohonan_id').value || '';

    let text = item.no_transaksi + ' (' + item.tanggal + ')';

    if (current !== '') {
      current += '\n' + text;
    } else {
      current = text;
    }

    this.entryForm.get('permohonan_id').patchValue(current);

  }

  lookupPermohonan() {

    const supplier = this.entryForm.get('supplier_id').value;
    console.log(supplier);

    if (
      !supplier ||
      (Array.isArray(supplier) && supplier.length === 0) ||
      (typeof supplier === 'object' && !supplier.id)
    ) {
      swal({
        title: 'Perhatian!',
        text: 'Pilih supplier terlebih dahulu',
        type: 'warning',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      });
      return;
    }

    let modalConfig = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-lg",
      initialState: {
        supplier_id: supplier.id,
        jenis_invoice: this.selectedJenisPermohonan   // ← FILTER JENIS
      }
    };

    this.bsModalRef1 = this.bsModalService.show(LookupPermohonanComponent, modalConfig);

    this.bsModalRef1.content.event.subscribe(item => {

      if (!item) return;

      this.addPermohonan(item);

      this.processPermohonan(item);

    });

  }

  processPermohonan(item) {

    if (!item) return;

    // =============================
    // VALIDASI JENIS HARUS SAMA
    // =============================
    if (this.selectedJenisPermohonan && item.jenis_invoice !== this.selectedJenisPermohonan) {

      swal({
        title: 'Tidak diperbolehkan',
        text: 'Permohonan harus dengan jenis invoice yang sama',
        type: 'warning',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      });

      return;
    }

    // =============================
    // SET JENIS PERTAMA
    // =============================
    if (!this.selectedJenisPermohonan) {

      this.selectedJenisPermohonan = item.jenis_invoice;

      let sumber = null;

      switch (item.jenis_invoice) {

        case 'PO':
        case 'PO JASA':
        case 'HUTANG LAINNYA':
          sumber = 'INVOICE_AP';
          break;

        case 'PEMBELIAN TBS':
          sumber = 'INVOICE_TBS';
          break;

        case 'BIAYA ANGKUT':
          sumber = 'INVOICE_ANGKUT_CPO';
          break;

        case 'PERMINTAAN DANA':
          sumber = 'PERMINTAAN_DANA';
          break;

        case 'UANG MUKA':
          sumber = 'UANG_MUKA';
          break;

        default:
          sumber = 'NONE';
          break;
      }

      const selected = this.dataSelectSumberDokumen.find(x => x.id === sumber);

      if (selected) {

        this.entryForm.get('sumber_dokumen').patchValue(selected);

        // LOCK FIELD
        this.entryForm.get('sumber_dokumen').disable();

      }

    }

    // =============================
    // LOAD JURNAL PERMOHONAN
    // =============================

    const permohonanId = item.id;

    this.accPermohonanPembayaranV2Service
      .getJurnalPermohonan(permohonanId)
      .subscribe((res: JurnalPermohonanResponse) => {

        if (!res || res.status !== 'OK') return;

        const d = res.data;

        const lokasi_id = d.lokasi_id;
        const akun_supplier_id = d.akun_supplier_id;

        let ket = 'Permohonan Pembayaran dengan Nomor ' + d.no_permohonan;

        if (d.referensi) {
          ket += ' ( Invoice: ' + d.referensi + ' )';
        }

        // ======================================
        // JIKA ADA LOKASI (AUTO LOAD AKUN)
        // ======================================
        if (lokasi_id) {

          this.accAkunService.getAllByLokasiId(lokasi_id).subscribe((x: any) => {

            this.dataSelectAkun[lokasi_id] = [];

            x['data'].forEach(a => {
              this.dataSelectAkun[lokasi_id].push({
                id: a.id,
                text: a.kode + ' - ' + a.nama
              });
            });

            this.addBlok(
              lokasi_id,
              akun_supplier_id ? akun_supplier_id : null,
              null,
              null,
              null,
              d.nilai,
              0,
              ket,
              d.ref_id ? d.ref_id : d.permohonan_id
            );

          });

        }

        // ======================================
        // JURNAL MANUAL (LOKASI BELUM ADA)
        // ======================================
        else {

          this.addBlok(
            {},
            akun_supplier_id ? akun_supplier_id : null,
            null,
            null,
            null,
            d.nilai,
            0,
            ket,
            d.permohonan_id
          );

        }

      });

  }

  loadPermohonanSupplier(supplier_id) {

    if (!supplier_id) return;

    this.accPermohonanPembayaranV2Service
      .getAllBySupplier(supplier_id)
      .subscribe(res => {

        this.dataSelectPermohonan = [];

        if (!res || !res['data']) return;

        res['data'].forEach(d => {
          this.dataSelectPermohonan.push({
            id: d.id,
            no_transaksi: d.no_transaksi,
            tanggal: d.tanggal,
            text: d.no_transaksi + ' (' + d.tanggal + ')'
          });
        });

      });

  }

  removePermohonan(id: number) {

    // =========================
    // HAPUS DARI ARRAY ID
    // =========================
    this.permohonanIds =
      this.permohonanIds.filter(x => x !== id);

    // =========================
    // AMBIL DATA PERMOHONAN
    // =========================
    const permohonan =
      this.dataSelectPermohonan.find(x => x.id == id);

    // =========================
    // HAPUS DETAIL JURNAL
    // =========================
    const details =
      this.entryForm.get('details') as FormArray;

    for (let i = details.length - 1; i >= 0; i--) {

      const row = details.at(i);

      const invoice_id =
        row.get('invoice_id').value;

      // =========================
      // HAPUS JIKA invoice_id = permohonan_id
      // =========================
      if (invoice_id == id) {

        details.removeAt(i);
        continue;

      }

      // =========================
      // FALLBACK:
      // HAPUS JIKA invoice_id = ref_id
      // =========================
      if (
        permohonan &&
        permohonan.ref_id &&
        invoice_id == permohonan.ref_id
      ) {

        details.removeAt(i);

      }

    }

    // =========================
    // REBUILD TEXTAREA
    // =========================
    let text = '';

    this.dataSelectPermohonan.forEach(p => {

      if (this.permohonanIds.includes(p.id)) {

        if (text !== '') {
          text += '\n';
        }

        text +=
          p.no_transaksi +
          ' (' + p.tanggal + ')';

      }

    });

    this.entryForm
      .get('permohonan_id')
      .patchValue(text);

    // =========================
    // RESET JENIS JIKA KOSONG
    // =========================
    if (this.permohonanIds.length == 0) {

      this.selectedJenisPermohonan = null;

      this.entryForm
        .get('sumber_dokumen')
        .enable();

    }

    this.hitungNilai();

  }
}
