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
import { EstSpkService } from 'src/app/shared/services/est_spk.service';
import { isNumber } from 'util';
import { TradingApInvoiceService } from 'src/app/shared/services/trading_ap_invoice.service';
import { TradingPoService } from 'src/app/shared/services/trading_po.service';

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

  entryForm: FormGroup;

  event: EventEmitter<any> = new EventEmitter();


  dataSelectLokasi;
  dataSelectLokasiAfd;

    dataSelectAkunKredit: any[];

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
  dataSelectSupplier: any[];
  dataSelectJenisInvoice: { id: string; text: string; }[];
  dataSelectPO: any[];
  dataSelectTermin: any[];

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private accApInvoiceService: TradingApInvoiceService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private gbmSupplierService: GbmSupplierService,
    private prcPoService: TradingPoService,
    private accKegiatanService: AccKegiatanService,
    private trkKendaraanService: TrkKendaraanService,
    private accAkunService: AccAkunService,

    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();
    this.entryForm = this.builder.group({

      tanggal: new FormControl(toDate, Validators.required),
      tanggal_tempo: new FormControl(toDate, Validators.required),
      tanggal_terima: new FormControl(toDate, Validators.required),
      deskripsi: new FormControl(''),
      no_referensi: new FormControl('', Validators.required),
      no_invoice: new FormControl('<OTOMATIS>', Validators.required),
      no_invoice_supplier: new FormControl('', Validators.required),
      no_faktur_pajak: new FormControl(''),
      lokasi_id: new FormControl([], Validators.required),
      supplier_id: new FormControl([], Validators.required),
      po_id: new FormControl([]),
            acc_akun_id_kredit: new FormControl([], Validators.required),

      jenis_invoice: new FormControl([], Validators.required),
      nilai_invoice: new FormControl(0, Validators.required),
      termin_id: new FormControl([]),
      details: this.builder.array([])

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }
  public options: any;

  private loadSelect2(): void {

    this.dataSelectJenisInvoice = [
      { id: 'PO', text: 'PO' },
      { id: 'PO JASA', text: 'PO JASA' },
      { id: 'UANG MUKA PEMBELIAN', text: 'UANG MUKA PEMBELIAN' },
      { id: 'UANG MUKA KONTRAKTOR', text: 'UANG MUKA KONTRAKTOR' },
      { id: 'UANG MUKA OPERASIONAL', text: 'UANG MUKA OPERASIONAL' },
      { id: 'BIAYA ANGKUT', text: 'BIAYA ANGKUT' },
      { id: 'HUTANG LAINNYA', text: 'HUTANG LAINNYA' },
      { id: 'HUTANG RETENSI', text: 'HUTANG RETENSI' },
      { id: 'PEMBELIAN TBS', text: 'PEMBELIAN TBS' },
      { id: 'BIAYA NON PO', text: 'BIAYA NON PO' },
    ];

    this.dataSelectTermin = [
      { id: 'CASH', text: 'CASH' },
      { id: 'DP', text: 'DP (Uang Muka)' },
      { id: 'TERMIN I', text: 'TERMIN I' },
      { id: 'TERMIN II', text: 'TERMIN II' },
      { id: 'TERMIN III', text: 'TERMIN III' },
      { id: 'TERMIN IV', text: 'TERMIN IV' },
      { id: 'TERMIN V', text: 'TERMIN V' },
      { id: 'TERMIN VI', text: 'TERMIN VI' },
      { id: 'TERMIN VII', text: 'TERMIN VII' },
      { id: 'TERMIN VIII', text: 'TERMIN VIII' },
      { id: 'TERMIN IX', text: 'TERMIN IX' },
      { id: 'TERMIN X', text: 'TERMIN X' },
      { id: '30 DAYS', text: '30 DAYS' },
    ];

    // this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
    //   this.dataSelectLokasiDetail = [];
    //   x.forEach(d => {
    //     this.dataSelectLokasiDetail.push({ "id": d.id, "text": d.nama });
    //   });
    // });

    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
    });

    this.gbmSupplierService.getAll().subscribe(x => {
      this.dataSelectSupplier = [];
      let i = x['data'];
      console.log(x);
      i.forEach(d => {
        this.dataSelectSupplier.push({ "id": d.id, "text": d.nama_supplier });
      });
      this.entryForm.controls['supplier_id'].valueChanges.subscribe(x => {
        let supplier_id = x.id;
        this.prcPoService.getAllPOReleaseBySupplier(supplier_id).subscribe(x => {
          this.dataSelectPO = [];
          let i = x['data'];
          i.forEach(d => {
            this.dataSelectPO.push({ "id": d.id, "text": d.no_po + ' (' + d.tanggal + ')' });
          });
        });
      });

      this.entryForm.controls['tanggal'].valueChanges.subscribe(x => {
        let tgl = formatDate(x, "yyyy-MM-dd", 'en_US').split('-', 3);
        let supplier_id = this.entryForm.get('supplier_id').value.id;
        this.gbmSupplierService.getById(supplier_id).subscribe(x => {
          let tgl_jatuh_tempo = parseInt(tgl[2]) + parseInt(x['data'].tempo_pembayaran);
          this.entryForm.get('tanggal_tempo').patchValue(new Date(Date.parse(tgl[0] + '-' + tgl[1] + '-' + tgl_jatuh_tempo)));
        });
      });
    });


    // this.accKegiatanService.getAll().subscribe(x => {
    //   this.dataSelectKegiatan = [];
    //   let i = x['data'];
    //   i.forEach(d => {
    //     this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama });
    //   });
    // });

    // this.karyawanService.getAll().subscribe(x=>{
    //   this.dataSelectKaryawan=[];
    //   let i = x['data'];
    //   i.forEach(d => {
    //     this.dataSelectKaryawan.push({"id":d.id,"text":d.nama});
    //   });
    // });



    this.accAkunService.getAllDetail().subscribe(x => {
      this.dataSelectAkun = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectAkun.push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
      });
    });

        this.accApInvoiceService.getAllAkunKreditSalesInvoice().subscribe(x => {
      this.dataSelectAkunKredit = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectAkunKredit.push({ "id": d.acc_akun_id, "text": d.kode_akun + ' - ' + d.nama_akun });
      });
    });


    // this.trkKendaraanService.getAll().subscribe(x => {
    //   this.dataSelectTraksi = [];
    //   let i = x['data'];
    //   i.forEach(d => {
    //     this.dataSelectTraksi.push({ "id": d.id, "text": d.nama });
    //   });
    // });

    // this.GbmOrganisasiService.getAllByType('BLOK_MESIN').subscribe(x => {
    //   this.dataSelectBlok = [];
    //   x.forEach(d => {
    //     this.dataSelectBlok.push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
    //   });
    // });

  }
  onSubmit() {
    this.isFormSubmitted = true;
    console.log(this.entryForm);
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


    let frmData = this.entryForm.value;
    frmData['nilai_invoice'] = parseFloat(this.entryForm.get('nilai_invoice').value.replace(/[^\d\.\-]/g, ""));
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    frmData['tanggal_tempo'] = formatDate(this.entryForm.get('tanggal_tempo').value, "yyyy-MM-dd", 'en_US');
    frmData['tanggal_terima'] = formatDate(this.entryForm.get('tanggal_terima').value, "yyyy-MM-dd", 'en_US');

    this.entryForm.get('details').value.forEach(x => {
      if (!isNumber(x.debet)) {
        x.debet = parseFloat(x.debet.replace(/[^\d\.\-]/g, ""));
      }
      if (!isNumber(x.kredit)) {
        x.kredit = parseFloat(x.kredit.replace(/[^\d\.\-]/g, ""));
      }
    });


    this.accApInvoiceService.create(frmData).subscribe(data => {
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


  addBlokItem() {
    this.details.push(this.builder.group({
      // lokasi_id: new FormControl([], Validators.required),
      acc_akun_id: new FormControl([], Validators.required),
      debet: new FormControl(0, Validators.required),
      kredit: new FormControl(0, Validators.required),
      // traksi_id: new FormControl([],),
      // blok_id: new FormControl([],),
      // kegiatan_id: new FormControl([],),
      ket: new FormControl('', Validators.required),
    }));
  }

  addBlok(acc_akun_id, debet, kredit, ket) {

    // this.dataSelectBlok;
    // this.dataSelectKegiatan;
    // this.dataSelectUom;
    this.dataSelectAkun;
    // let selectedLokasiDetail;
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

    // let selectedTraksi = [];
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
    } else {
      sdebet = debet;
    }
    if (!isNumber(kredit)) {
      skredit = parseFloat(kredit.replace(/[^\d\.\-]/g, ""));
    } else {
      skredit = kredit
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

  removeBlokItem(blok) {
    let i = this.details.controls.indexOf(blok);
    if (i != -1) {
      let detail = this.entryForm.get('details') as FormArray;
      detail.removeAt(i);
      let data = { details: detail.value };
      this.updateForm(data);
    }
    this.hitungNilaiInvoice();
  }
  tampilItemPoGrn() {
    let po_id = this.entryForm.get('po_id').value['id']
    this.prcPoService.getAllDetailSdhTerima(po_id).subscribe(res => {
      console.log(res);
      let dtl = [];
      dtl = res['data']['dtl'];
      let akun_penerimaan_po = res['data']['AKUN_PENERIMAAN_BARANG_PO'];
      let akun_ppn = res['data']['AKUN_PPN'];
      let akun_diskon = res['data']['AKUN_DISKON'];
      let akun_ppbkb = res['data']['AKUN_PPBKB'];
      let akun_pph = res['data']['AKUN_PPH'];
      let akun_biaya_kirim = res['data']['AKUN_BIAYA_KIRIM'];
      let akun_biaya_lain = res['data']['AKUN_BIAYA_LAIN'];
      let po_ht = res['data']['PO_HT'];
      this.details.clear();
      console.log(dtl);
      if (dtl.length > 0) {
        for (let index = 0; index < dtl.length; index++) {
          const d = dtl[index];
          this.addBlok(akun_penerimaan_po, parseFloat(d['qty_sudah_terima']) * parseFloat(d['harga']), 0, d['nama_item'] + ' ' + d['qty'] + ' ' + d['uom']);
        }
        if (po_ht['diskon'] > 0) {
          this.addBlok(akun_diskon, 0, parseFloat(po_ht['diskon']), ' Diskon');
        }
        if (po_ht['biaya_kirim'] > 0) {
          this.addBlok(akun_biaya_kirim, parseFloat(po_ht['biaya_kirim']), 0, ' Biaya Kirim');
        }
        if (po_ht['ppn'] > 0) {
          this.addBlok(akun_ppn, parseFloat(po_ht['ppn']) / 100 * parseFloat(po_ht['sub_total']), 0, ' PPN');
        }
        if (po_ht['pph'] > 0) {
          this.addBlok(akun_pph, 0, parseFloat(po_ht['pph']) / 100 * parseFloat(po_ht['sub_total']), ' PPH');
        }
        if (po_ht['ppbkb'] > 0) {
          this.addBlok(akun_ppbkb, parseFloat(po_ht['ppbkb']) / 100 * parseFloat(po_ht['sub_total']), 0, ' PPBKB');
        }
        if (po_ht['biaya_lain'] > 0) {
          this.addBlok(akun_biaya_lain, parseFloat(po_ht['biaya_lain']), 0, ' Biaya Lain');
        }
      }
      this.hitungNilaiInvoice();
    })

  }
  tampilItemPoOnly() {
    let po_id = this.entryForm.get('po_id').value['id']
    this.prcPoService.getAllDetailPoOnly(po_id).subscribe(res => {
      console.log(res);
      let dtl = [];
      dtl = res['data']['dtl'];
      let akun_penerimaan_po = res['data']['AKUN_PENERIMAAN_BARANG_PO'];
      let akun_ppn = res['data']['AKUN_PPN'];
      let akun_diskon = res['data']['AKUN_DISKON'];
      let akun_ppbkb = res['data']['AKUN_PPBKB'];
      let akun_pph = res['data']['AKUN_PPH'];
      let akun_biaya_kirim = res['data']['AKUN_BIAYA_KIRIM'];
      let akun_biaya_lain = res['data']['AKUN_BIAYA_LAIN'];
      let po_ht = res['data']['PO_HT'];
      this.details.clear();
      console.log(dtl);
      if (dtl.length > 0) {
        for (let index = 0; index < dtl.length; index++) {
          const d = dtl[index];
          this.addBlok(akun_penerimaan_po, parseFloat(d['qty']) * parseFloat(d['harga']), 0, d['nama_item'] + ' ' + d['qty'] + ' ' + d['uom']);
        }
        if (po_ht['diskon'] > 0) {
          this.addBlok(akun_diskon, 0, parseFloat(po_ht['diskon']), ' Diskon');
        }
        if (po_ht['biaya_kirim'] > 0) {
          this.addBlok(akun_biaya_kirim, parseFloat(po_ht['biaya_kirim']), 0, ' Biaya Kirim');
        }
        if (po_ht['ppn'] > 0) {
          this.addBlok(akun_ppn, parseFloat(po_ht['ppn']) / 100 * parseFloat(po_ht['sub_total']), 0, ' PPN');
        }
        if (po_ht['pph'] > 0) {
          this.addBlok(akun_pph, 0, parseFloat(po_ht['pph']) / 100 * parseFloat(po_ht['sub_total']), ' PPH');
        }
        if (po_ht['ppbkb'] > 0) {
          this.addBlok(akun_ppbkb, parseFloat(po_ht['ppbkb']) / 100 * parseFloat(po_ht['sub_total']), 0, ' PPBKB');
        }
        if (po_ht['biaya_lain'] > 0) {
          this.addBlok(akun_biaya_lain, parseFloat(po_ht['biaya_lain']), 0, ' Biaya Lain');
        }
      }
      this.hitungNilaiInvoice();
    })

  }
  updateForm(data) {

  }
  hitungNilaiInvoice() {
    let dr = 0;
    let cr = 0;
    let jumlah = 0;
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
    jumlah = dr - cr;
    this.entryForm.get('nilai_invoice').patchValue(formatNumber(jumlah, 'en_US', '1.2-2'));

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
    this.hitungNilaiInvoice();
  }
  recalculate() {


  }
  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();


  }
  valueChange($event) {

  }
  onPoChange(event: any) {
    const selectedPO = event;
    if (selectedPO && selectedPO.id) {
      this.prcPoService.getAllPenerimaanPOReleaseByidPo(selectedPO.id).subscribe((res: any) => {
        const data = res && res.data && res.data[0];
        console.log(data.no_transaksi)
        if (data && data.no_transaksi) {
          this.entryForm.patchValue({ no_referensi: data.no_transaksi });
        } else {
          this.entryForm.patchValue({ no_referensi: '' });
        }
      });
    } else {
      this.entryForm.patchValue({ no_referensi: '' });
    }
  }


}
