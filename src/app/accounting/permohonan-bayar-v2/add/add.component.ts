import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate, formatNumber } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { AccPermohonanBayarService } from '../../../shared/services/acc_permohonan_bayar.service';
import { GbmSupplierService } from '../../../shared/services/gbm_supplier.service';
import { isNullOrUndefined, isNumber, isString } from 'util';
import { PrcPoService } from 'src/app/shared/services/prc_po.service';
import { PrcKontrakAngkutService } from 'src/app/shared/services/prc_kontrak_angkut.service';
import { AccTbsInvoiceService } from 'src/app/shared/services/acc_tbs_invoice.service';
import { AccUangMukaService } from 'src/app/shared/services/acc_uang_muka.service';
import { ToastrService } from 'ngx-toastr';
import { AccApInvoiceService } from 'src/app/shared/services/acc_ap_invoice.service';
import { AccPermohonanBayarV2Service } from 'src/app/shared/services/acc_permohonan_bayar_v2.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { AccPermintaanDanaService } from 'src/app/shared/services/acc_permintaan_dana.service';

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


  dataSelectSupplier;
  dataSelectJenisInvoice: { id: string; text: string; }[];
  dataSelectSpk;
  dataSelectBlok;
  datasupplier: any[];
  dataSelectPO: any[];
  dataSelectUangMuka: any[];
  dataSelectBiayaAngkut: any[];
  dataSelectPembelianTbs: any[];
  dataSelectHutang: any[];
  dataSelectKaryawan: any[];
  dataSelectPermintaanDana: any[];
  showSupplier: boolean = true;
  public autoTax = true;
  showKaryawan: boolean = false;

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private accPermohonanBayarService: AccPermohonanBayarV2Service,
    private GbmSupplierService: GbmSupplierService,
    private prcPoService: PrcPoService,
    private prcKontrakAngkutService: PrcKontrakAngkutService,
    private accTbsInvoiceService: AccTbsInvoiceService,
    private accUangMukaService: AccUangMukaService,
    private accApInvoiceService: AccApInvoiceService,
    private accPermintaanDanaService: AccPermintaanDanaService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private karyawanService: KaryawanService,
  ) {
    let toDate: Date = new Date();
    this.entryForm = this.builder.group({

      supplier: new FormControl('',),
      txt_biaya_lain: new FormControl('Biaya Lain',),
      supplier_id: new FormControl([],),
      karyawan_id: new FormControl([],),
      no_transaksi: new FormControl('Autonumber'),
      no_referensi: new FormControl(''),
      diminta_oleh: new FormControl(''),
      divisi: new FormControl(''),
      periode: new FormControl(''),
      tanggal: new FormControl(toDate, Validators.required),
      tanggal_tempo: new FormControl(toDate, Validators.required),
      ket: new FormControl(''),
      catatan: new FormControl(''),
      jenis_invoice: new FormControl([], Validators.required),
      noTipe_id: new FormControl([]),
      nama_bank: new FormControl(''),
      no_rek: new FormControl(''),
      atas_nama: new FormControl(''),

      subtotal: new FormControl(0),
      diskon: new FormControl(0),
      dpp: new FormControl(0),
      disc_nilai: new FormControl(0),
      pph: new FormControl(0),
      pph_nilai: new FormControl(0),
      ppn: new FormControl(0),
      ppn_nilai: new FormControl(0),
      ppnbm: new FormControl(0),
      ppnbm_nilai: new FormControl(0),
      biaya_lain: new FormControl(0),
      total: new FormControl(0),



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
      { id: 'UANG MUKA', text: 'UANG MUKA' },// ambil dari data acc_uang_muka
      { id: 'BIAYA ANGKUT', text: 'BIAYA ANGKUT' }, // ambil dari acc_angkut_invoice_ht
      { id: 'HUTANG LAINNYA', text: 'HUTANG LAINNYA' },
      { id: 'HUTANG RETENSI', text: 'HUTANG RETENSI' },
      { id: 'PEMBELIAN TBS', text: 'PEMBELIAN TBS' }, // acc_tbs
      { id: 'BIAYA NON PO', text: 'BIAYA NON PO' },
      { id: 'PINDAH BUKU', text: 'PINDAH BUKU' },
      { id: 'PERMINTAAN DANA', text: 'PERMINTAAN DANA' },
    ];

    this.karyawanService.getAllAktif().subscribe(x => {
      this.dataSelectKaryawan = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" });
      })
      this.entryForm.controls['karyawan_id'].valueChanges.subscribe(val => {
        if (val && val.id) {
          this.tampilDataKaryawan();
        }
      });
    });
    this.GbmSupplierService.getAll().subscribe(x => {
      this.dataSelectSupplier = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectSupplier.push({ "id": d.id, "text": d.nama_supplier + '-' + d.kode_supplier });

      });
      this.entryForm.get('jenis_invoice').valueChanges.subscribe(val => {
        const jenis = val ? val.id : '';
        if (['BIAYA NON PO'].indexOf(jenis) !== -1) {
          this.toastr.info('Wajib mengisi No Referensi', 'Informasi');
        }
      });

      this.entryForm.controls['supplier_id'].valueChanges.subscribe(x => {
        let supplier_id = x.id;
        this.prcPoService.getAllPoReleaseRecieveBySupplier(supplier_id).subscribe(x => {
          this.dataSelectPO = [];
          let i = x['data'];
          i.forEach(d => {
            this.dataSelectPO.push({ "id": d.id, "text": d.no_po + ' (' + d.no_penerimaan + ')' + ' (' + d.tanggal + ')', no_invoice: d.no_invoice });
          });
        });


        this.accApInvoiceService.getHutangByIdSupplier(supplier_id).subscribe(x => {
          this.dataSelectHutang = [];
          let i = x['data'];
          i.forEach(d => {
            this.dataSelectHutang.push({ "id": d.id, "text": d.no_invoice + ' (' + d.tanggal + ')' });
          });
        })


        this.prcKontrakAngkutService.getAllBiayaAngkut(supplier_id).subscribe(x => {
          this.dataSelectBiayaAngkut = [];
          let i = x['data'];
          i.forEach(d => {
            this.dataSelectBiayaAngkut.push({ "id": d.id, "text": d.no_spk + ' (' + d.no_invoice + ') ' + ' (' + d.tanggal + ')' });
          });
        });

        this.accPermintaanDanaService.getPermintaanDana().subscribe(x => {
          this.dataSelectPermintaanDana = [];
          let i = x['data'];
          i.forEach(d => {
            this.dataSelectPermintaanDana.push({ "id": d.id, "text": d.no_transaksi + ' (' + d.tanggal + ')' });
          });
        })

        this.accUangMukaService.getUangMuka().subscribe(x => {
          this.dataSelectUangMuka = [];

          let data = [];

          if (x && x['data'] && Array.isArray(x['data'])) {
            data = x['data'];
          }

          for (let d of data) {
            this.dataSelectUangMuka.push({
              id: d.id,
              text: d.no_transaksi + ' (' + d.tanggal + ')'
            });
          }
        });


        this.accTbsInvoiceService.getTbsbySupplierId(supplier_id).subscribe(x => {
          this.dataSelectPembelianTbs = [];

          let data = [];

          if (x && x['data'] && Array.isArray(x['data'])) {
            data = x['data'];
          }

          for (let d of data) {
            this.dataSelectPembelianTbs.push({
              id: d.id,
              text: d.no_invoice + ' (' + d.tanggal + ')'
            });
          }
        });



        this.tampildataSupp();
      });
    });

    let jenis = this.entryForm.controls['jenis_invoice'].value['id'];
    if (jenis == 'PO') {
      this.entryForm.controls['noTipe_id'].valueChanges.subscribe(x => {
        let idPO = x.id;

      });
    }




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


    let frmData = this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal')!.value, "yyyy-MM-dd", 'en_US');
    frmData['tanggal_tempo'] = formatDate(this.entryForm.get('tanggal_tempo')!.value, "yyyy-MM-dd", 'en_US');
    frmData['subtotal'] = parseFloat(this.entryForm.get('subtotal').value.replace(/[^\d\.\-]/g, ""));
    frmData['diskon'] = parseFloat(this.entryForm.get('diskon').value.replace(/[^\d\.\-]/g, ""));
    frmData['dpp'] = parseFloat(this.entryForm.get('dpp').value.replace(/[^\d\.\-]/g, ""));
    frmData['ppn'] = parseFloat(this.entryForm.get('ppn').value.replace(/[^\d\.\-]/g, ""));
    frmData['ppnbm'] = parseFloat(this.entryForm.get('ppnbm').value.replace(/[^\d\.\-]/g, ""));
    frmData['biaya_lain'] = parseFloat(this.entryForm.get('biaya_lain').value.replace(/[^\d\.\-]/g, ""));
    frmData['pph'] = parseFloat(this.entryForm.get('pph').value.replace(/[^\d\.\-]/g, ""));
    frmData['total'] = parseFloat(this.entryForm.get('total').value.replace(/[^\d\.\-]/g, ""));

    this.entryForm.get('details').value.forEach(x => {
      if (!isNumber(x.jumlah)) {
        x.jumlah = parseFloat(x.jumlah.replace(/[^\d\.\-]/g, ""));
      }
    });
    //  console.log(frmData);
    this.accPermohonanBayarService.create(frmData).subscribe(data => {
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
    let toDate: Date = new Date();
    let harga = 0;

    this.details.push(this.builder.group({

      keterangan: new FormControl('',),
      x_qty: new FormControl(0,),
      qty: new FormControl(0,),
      harga: new FormControl(harga,),
      x_harga: new FormControl(harga,),
      diskon: new FormControl(0),
      x_diskon: new FormControl(0,),
      jumlah: new FormControl(0,),

    }));
  }


  removeBlokItem(blok) {
    let i = this.details.controls.indexOf(blok);
    if (i != -1) {
      let detail = this.entryForm.get('details') as FormArray;
      detail.removeAt(i);
      let data = { details: detail.value };
      this.updateForm(data);
    }

    this.totalHarga(blok);

  }

  // totalHarga(form) {
  //   let qty = form.get('x_qty').value;
  //   if (isString(qty)) {
  //     qty = parseFloat(qty.replace(/[^\d\.\-]/g, ""));
  //   }
  //   qty = isNaN(qty) ? 0 : qty;
  //   form.get('x_qty').patchValue(formatNumber(qty, 'en_US', '1.2-2'));
  //   form.get('qty').patchValue(qty);

  //   let harga = form.get('x_harga').value;
  //   if (isString(harga)) {
  //     harga = parseFloat(harga.replace(/[^\d\.\-]/g, ""));
  //   }
  //   harga = isNaN(harga) ? 0 : harga;
  //   form.get('x_harga').patchValue(formatNumber(harga, 'en_US', '1.2-2'));
  //   form.get('harga').patchValue(harga);

  //   let diskon = form.get('x_diskon').value;
  //   if (isString(diskon)) {
  //     diskon = parseFloat(diskon.replace(/[^\d\.\-]/g, ""));
  //   }
  //   diskon = isNaN(diskon) ? 0 : diskon;
  //   form.get('x_diskon').patchValue(formatNumber(diskon, 'en_US', '1.2-2'));
  //   form.get('diskon').patchValue(diskon);

  //   let total = (qty * harga) - diskon;
  //   total = isNaN(total) ? 0 : total;

  //   form.get('jumlah').patchValue(formatNumber(total, 'en_US', '1.2-2'));
  //       this.totalGrand();
  //   this.calc_pph();
  // }


  // totalSub() {
  //   let subTotal = 0;
  //   this.entryForm.get('details').value.forEach(x => {
  //     // console.log(x);
  //     if (isNumber(x.jumlah)) {
  //       subTotal += x.jumlah;
  //     } else {
  //       subTotal += parseFloat(x.jumlah.replace(/[^\d\.\-]/g, ""));
  //     }

  //   });
  //   this.entryForm.get('subtotal').patchValue(formatNumber(subTotal, 'en_US', '1.2-2'));

  //   // this.calc_pph();
  // }

  totalHarga(form) {
    var qty = form.get('x_qty').value;
    var harga = form.get('x_harga').value;
    var diskon = form.get('x_diskon').value;

    // Fungsi bantu untuk parse angka
    function parseNum(val) {
      if (val === null || val === undefined || val === '') return 0;
      if (typeof val === 'string') {
        val = val.replace(/[^\d.-]/g, '');
      }
      var num = parseFloat(val);
      return isNaN(num) || !isFinite(num) ? 0 : num;
    }

    qty = parseNum(qty);
    harga = parseNum(harga);
    diskon = parseNum(diskon);

    // Patch ke form (diformat angka)
    form.get('x_qty').patchValue(formatNumber(qty, 'en_US', '1.2-2'));
    form.get('qty').patchValue(qty);

    form.get('x_harga').patchValue(formatNumber(harga, 'en_US', '1.2-2'));
    form.get('harga').patchValue(harga);

    form.get('x_diskon').patchValue(formatNumber(diskon, 'en_US', '1.2-2'));
    form.get('diskon').patchValue(diskon);

    // Hitung total aman
    var total = (qty * harga) - diskon;
    if (isNaN(total) || !isFinite(total)) {
      total = 0;
    }

    form.get('jumlah').patchValue(formatNumber(total, 'en_US', '1.2-2'));

    // Hitung subtotal dan pajak
    if (typeof this.totalSub === 'function') {
      this.totalSub();
    }
    if (typeof this.calc_pph === 'function') {
      this.calc_pph();
    }
  }


  totalSub() {
    var subTotal = 0;
    var details = this.entryForm.get('details').value || [];

    for (var i = 0; i < details.length; i++) {
      var x = details[i];
      var jml = x.jumlah;

      if (jml === null || jml === undefined || jml === '') continue;

      if (typeof jml === 'string') {
        jml = jml.replace(/[^\d.-]/g, '');
      }

      var num = parseFloat(jml);
      if (!isNaN(num) && isFinite(num)) {
        subTotal += num;
      }
    }

    if (isNaN(subTotal) || !isFinite(subTotal)) {
      subTotal = 0;
    }

    this.entryForm.get('subtotal').patchValue(formatNumber(subTotal, 'en_US', '1.2-2'));
  }


  // totalGrand() {
  //   let subTotal = this.entryForm.get('subtotal').value;
  //   subTotal = isNumber(subTotal) ? subTotal : parseFloat(subTotal.replace(/[^\d\.\-]/g, ""));

  //   let diskon = this.entryForm.get('diskon').value;
  //   diskon = isNumber(diskon) ? diskon : parseFloat(diskon.replace(/[^\d\.\-]/g, ""));

  //   let biaya_lain = this.entryForm.get('biaya_lain').value;
  //   biaya_lain = isNumber(biaya_lain) ? biaya_lain : parseFloat(biaya_lain.replace(/[^\d\.\-]/g, ""));

  //   // let dpp = this.entryForm.get('dpp').value;
  //   // dpp = isNumber(dpp) ? dpp : parseFloat(dpp.replace(/[^\d\.\-]/g, ""));
  //   let dpp = subTotal - diskon;

  //   let grandTotal = 0;
  //   let ppn = parseFloat(this.entryForm.get('ppn').value);
  //   let ppnTotal = 0;

  //   let ppnbm = parseFloat(this.entryForm.get('ppnbm').value);
  //   let ppnbmTotal = 0;


  //   let pph = parseFloat(this.entryForm.get('pph').value);
  //   let pphTotal = 0;
  //   if (!isNumber(pph)) {
  //     pph = 0;
  //     pphTotal = 0;
  //   } else {
  //     pphTotal = (pph / 100) * (dpp);

  //   }
  //   if (!isNumber(ppn)) {
  //     ppn = 0;
  //     ppnTotal = 0;
  //   } else {
  //     ppnTotal = (ppn / 100) * (dpp);

  //   }
  //   if (!isNumber(ppnbm)) {
  //     ppnbm = 0;
  //     ppnbmTotal = 0;
  //   } else {
  //     ppnbmTotal = (ppnbm / 100) * (dpp);

  //   }
  //   // subTotal = subTotal - diskon;


  //   grandTotal = (dpp) + (ppnTotal + ppnbmTotal + biaya_lain - pphTotal);


  //   this.entryForm.get('diskon').patchValue(formatNumber(diskon, 'en_US', '1.2-2'));
  //   this.entryForm.get('biaya_lain').patchValue(formatNumber(biaya_lain, 'en_US', '1.2-2'));
  //   this.entryForm.get('dpp').patchValue(formatNumber(dpp, 'en_US', '1.2-2'));

  //   this.entryForm.get('pph').patchValue(formatNumber(pph, 'en_US', '1.2-2'));
  //   this.entryForm.get('ppn').patchValue(formatNumber(ppn, 'en_US', '1.2-2'));
  //   this.entryForm.get('ppnbm').patchValue(formatNumber(ppnbm, 'en_US', '1.2-2'));
  //   this.entryForm.get('pph_nilai').patchValue(formatNumber(pphTotal, 'en_US', '1.2-2'));
  //   this.entryForm.get('ppn_nilai').patchValue(formatNumber(ppnTotal, 'en_US', '1.2-2'));
  //   this.entryForm.get('ppnbm_nilai').patchValue(formatNumber(ppnbmTotal, 'en_US', '1.2-2'));

  //   this.entryForm.get('total').patchValue(formatNumber(grandTotal, 'en_US', '1.2-2'));
  // }

  // totalGrand() {
  //   // Helper aman untuk parse angka
  //   function parseNum(val) {
  //     if (val === null || val === undefined || val === '') return 0;
  //     if (typeof val === 'string') {
  //       val = val.replace(/[^\d.-]/g, '');
  //     }
  //     var num = parseFloat(val);
  //     return isNaN(num) || !isFinite(num) ? 0 : num;
  //   }

  //   // Ambil nilai dari form dengan aman
  //   var subTotal = parseNum(this.entryForm.get('subtotal').value);
  //   var diskon = parseNum(this.entryForm.get('diskon').value);
  //   var biaya_lain = parseNum(this.entryForm.get('biaya_lain').value);
  //   var dpp = subTotal - diskon;

  //   // Pastikan DPP minimal 0
  //   if (isNaN(dpp) || !isFinite(dpp) || dpp < 0) dpp = 0;

  //   // Pajak & potongan
  //   var ppn = parseNum(this.entryForm.get('ppn').value);
  //   var ppnbm = parseNum(this.entryForm.get('ppnbm').value);
  //   var pph = parseNum(this.entryForm.get('pph').value);

  //   var ppnTotal = (ppn / 100) * dpp;
  //   var ppnbmTotal = (ppnbm / 100) * dpp;
  //   var pphTotal = (pph / 100) * dpp;

  //   // Amankan nilai pajak
  //   if (!isFinite(ppnTotal)) ppnTotal = 0;
  //   if (!isFinite(ppnbmTotal)) ppnbmTotal = 0;
  //   if (!isFinite(pphTotal)) pphTotal = 0;

  //   // Hitung Grand Total
  //   var grandTotal = (dpp + ppnTotal + ppnbmTotal + biaya_lain) - pphTotal;
  //   if (isNaN(grandTotal) || !isFinite(grandTotal)) grandTotal = 0;

  //   // Format dan patch ulang ke form
  //   this.entryForm.get('diskon').patchValue(formatNumber(diskon, 'en_US', '1.2-2'));
  //   this.entryForm.get('biaya_lain').patchValue(formatNumber(biaya_lain, 'en_US', '1.2-2'));
  //   this.entryForm.get('dpp').patchValue(formatNumber(dpp, 'en_US', '1.2-2'));

  //   this.entryForm.get('pph').patchValue(formatNumber(pph, 'en_US', '1.2-2'));
  //   this.entryForm.get('ppn').patchValue(formatNumber(ppn, 'en_US', '1.2-2'));
  //   this.entryForm.get('ppnbm').patchValue(formatNumber(ppnbm, 'en_US', '1.2-2'));

  //   this.entryForm.get('pph_nilai').patchValue(formatNumber(pphTotal, 'en_US', '1.2-2'));
  //   this.entryForm.get('ppn_nilai').patchValue(formatNumber(ppnTotal, 'en_US', '1.2-2'));
  //   this.entryForm.get('ppnbm_nilai').patchValue(formatNumber(ppnbmTotal, 'en_US', '1.2-2'));

  //   this.entryForm.get('total').patchValue(formatNumber(grandTotal, 'en_US', '1.2-2'));
  // }

  totalGrand() {

  const parseNum = (val: any): number => {
    if (val === null || val === undefined || val === '') {
      return 0;
    }

    if (typeof val === 'string') {
      val = val.replace(/[^\d.-]/g, '');
    }

    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  };

  let subtotal = parseNum(this.entryForm.get('subtotal').value);
  let diskon = parseNum(this.entryForm.get('diskon').value);
  let biayaLain = parseNum(this.entryForm.get('biaya_lain').value);

  let dpp = subtotal - diskon;

  if (dpp < 0) {
    dpp = 0;
  }

  let ppn = parseNum(this.entryForm.get('ppn').value);
  let ppnbm = parseNum(this.entryForm.get('ppnbm').value);
  let pph = parseNum(this.entryForm.get('pph').value);

  let ppnTotal = 0;
  let ppnbmTotal = 0;
  let pphTotal = 0;

  if (this.autoTax) {

    // ===========================
    // AUTO HITUNG PAJAK
    // ===========================

    ppnTotal = dpp * ppn / 100;
    ppnbmTotal = dpp * ppnbm / 100;
    pphTotal = dpp * pph / 100;

    this.entryForm.patchValue({
      ppn_nilai: formatNumber(ppnTotal, 'en_US', '1.2-2'),
      ppnbm_nilai: formatNumber(ppnbmTotal, 'en_US', '1.2-2'),
      pph_nilai: formatNumber(pphTotal, 'en_US', '1.2-2')
    }, { emitEvent: false });

  } else {

    // ===========================
    // MANUAL
    // ===========================

    ppnTotal = parseNum(this.entryForm.get('ppn_nilai').value);
    ppnbmTotal = parseNum(this.entryForm.get('ppnbm_nilai').value);
    pphTotal = parseNum(this.entryForm.get('pph_nilai').value);

  }

  let grandTotal =
      dpp
      + ppnTotal
      + ppnbmTotal
      + biayaLain
      - pphTotal;

  this.entryForm.patchValue({

    diskon: formatNumber(diskon, 'en_US', '1.2-2'),
    biaya_lain: formatNumber(biayaLain, 'en_US', '1.2-2'),
    dpp: formatNumber(dpp, 'en_US', '1.2-2'),

    ppn: formatNumber(ppn, 'en_US', '1.2-2'),
    ppnbm: formatNumber(ppnbm, 'en_US', '1.2-2'),
    pph: formatNumber(pph, 'en_US', '1.2-2'),

    total: formatNumber(grandTotal, 'en_US', '1.2-2')

  }, { emitEvent: false });

}


  calc_pph() {
    let subTotal = this.entryForm.get('subtotal').value;
    subTotal = isNumber(subTotal) ? subTotal : parseFloat(subTotal.replace(/[^\d\.\-]/g, ""));
    let pph_show = this.entryForm.get('pph_nilai').value;
    pph_show = isNumber(pph_show) ? pph_show : parseFloat(pph_show.replace(/[^\d\.\-]/g, ""));

    let pphPercent = 0;

    pphPercent = (pph_show / parseFloat(subTotal)) * 100;
    // pphPercent.toFixed(4);
    // this.entryForm.get('pph').patchValue(pphPercent);
    this.entryForm.get('pph').patchValue(formatNumber(pphPercent, 'en_US', '1.2-2'));


    this.totalGrand();
  }

  tampildataSupp() {

    let supplierValue = this.entryForm.get('supplier_id').value;
    let supplier_id = (supplierValue && supplierValue.id) ? supplierValue.id : 0;
    this.GbmSupplierService.getById(supplier_id).subscribe(res => {
      this.entryForm.controls['supplier'].patchValue(res['data']['nama_supplier']);
      this.entryForm.controls['nama_bank'].patchValue(res['data']['nama_bank']);
      this.entryForm.controls['no_rek'].patchValue(res['data']['no_rekening']);
      this.entryForm.controls['atas_nama'].patchValue(res['data']['atas_nama']);
    })
  }

  tampilDataKaryawan() {
    let karyawanValue = this.entryForm.get('karyawan_id').value;
    console.log('karyawan id selected', karyawanValue)

    let karyawan_id = (karyawanValue && karyawanValue.id) ? karyawanValue.id : 0;

    this.karyawanService.getById(karyawan_id).subscribe(res => {
      this.entryForm.controls['supplier'].patchValue(res['data']['nama']);
      this.entryForm.controls['nama_bank'].patchValue(res['data']['nama_bank']);
      this.entryForm.controls['no_rek'].patchValue(res['data']['no_rek_bank']);
      this.entryForm.controls['atas_nama'].patchValue(res['data']['atas_nama']);
    })

  }

  updateForm(data) {

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

  // helper function untuk buat FormGroup
  // helper function untuk buat FormGroup + PPN
  createDetailForm(response: any) {
    // qty
    const qty = (response && response.qty !== undefined && response.qty !== null) ? Number(response.qty) : 0;

    // harga
    let harga = 0;
    if (response && response.harga !== undefined && response.harga !== null) {
      harga = Number(response.harga);
    } else if (response && response.nilai !== undefined && response.nilai !== null) {
      harga = Number(response.nilai);
    }

    // diskon
    const diskon = (response && response.diskon !== undefined && response.diskon !== null) ? Number(response.diskon) : 0;

    // keterangan (tanpa optional chaining / ??)
    let keterangan = '';
    if (response) {
      if (response.ket !== undefined && response.ket !== null) {
        keterangan = response.ket;
      } else if (response.keterangan !== undefined && response.keterangan !== null) {
        keterangan = response.keterangan;
      }
    }

    const ppn = false; // default unchecked
    const total = Math.round((qty * harga - diskon) * (ppn ? 1.11 : 1));

    const group = this.builder.group({
      keterangan: new FormControl(keterangan),
      x_qty: new FormControl(formatNumber(qty, 'en_US', '1.2-2')),
      qty: new FormControl(qty),
      harga: new FormControl(harga),
      x_harga: new FormControl(formatNumber(harga, 'en_US', '1.2-2')),
      diskon: new FormControl(diskon),
      x_diskon: new FormControl(formatNumber(diskon, 'en_US', '1.2-2')),
      jumlah: new FormControl(formatNumber(total, 'en_US', '1.2-2')),
      ppn: new FormControl(ppn)
    });

    // subscribe perubahan setiap field agar total otomatis
    group.valueChanges.subscribe(val => {
      const tQty = parseFloat((val.x_qty || '0').toString().replace(/[^\d.\-]/g, '')) || 0;
      const tHarga = parseFloat((val.x_harga || '0').toString().replace(/[^\d.\-]/g, '')) || 0;
      const tDiskon = parseFloat((val.x_diskon || '0').toString().replace(/[^\d.\-]/g, '')) || 0;
      const tPPN = val.ppn ? 1.11 : 1;
      const tTotal = Math.round((tQty * tHarga - tDiskon) * tPPN);

      group.patchValue({
        x_qty: formatNumber(tQty, 'en_US', '1.2-2'),
        qty: tQty,
        x_harga: formatNumber(tHarga, 'en_US', '1.2-2'),
        harga: tHarga,
        x_diskon: formatNumber(tDiskon, 'en_US', '1.2-2'),
        diskon: tDiskon,
        jumlah: formatNumber(tTotal, 'en_US', '1.2-2')
      }, { emitEvent: false });

      this.totalSub(); // update subtotal
      this.totalGrand();
    });

    return group;
  }




  // Contoh penggunaan di semua onchange
  onPoChange(event: any) {
    this.details.clear();

    // cari PO yang dipilih
    const selectedPO = this.dataSelectPO.find((po: any) => po.id === event.id);
    if (selectedPO && selectedPO.no_invoice) {
      this.entryForm.patchValue({
        no_referensi: selectedPO.no_invoice
      });
    }


    this.prcPoService.getDetailPo(event.id).subscribe((res: any) => {
      if (res.status === 'OK' && Array.isArray(res.data)) {
        res.data.forEach((poDetail: any) => this.details.push(this.createDetailForm(poDetail)));
      }
      this.totalSub(); // hitung subtotal setelah semua masuk
      this.totalGrand();
    });
  }

  onPermintaanDanaChange(event: any) {
    this.details.clear();

    // cari Permintaan Dana yang dipilih
    const selectedPermintaanDana = this.dataSelectPermintaanDana.find((pd: any) => pd.id === event.id);
    if (selectedPermintaanDana && selectedPermintaanDana.no_transaksi) {
      this.entryForm.patchValue({
        no_referensi: selectedPermintaanDana.no_transaksi
      });
    }

    this.accPermintaanDanaService.getById(event.id).subscribe((res: any) => {
      if (res.status === 'OK' && res.data) {
        // kalau res.data array
        if (Array.isArray(res.data)) {
          res.data.forEach((poDetail: any) => {
            this.details.push(this.createDetailForm(poDetail));
          });
        } else {
          // kalau res.data single object
          const data = { ...res.data, qty: res.data.qty || 1 };
          this.details.push(this.createDetailForm(data));
        }
      } else {
        // kalau tidak ada data, tambahkan 1 baris default
        this.details.push(this.createDetailForm({ qty: 1 }));
      }

      this.totalSub();
      this.totalGrand();
    });
  }


  onSpkChange(event: any) {
    this.details.clear();
    this.prcKontrakAngkutService.getAllBiayaAngkutDetail(event.id).subscribe((res: any) => {
      res.data.forEach((response: any) => this.details.push(this.createDetailForm(response)));
      this.totalSub();
      this.totalGrand();
    });
  }

  onUangMukaChange(event: any) {
    this.details.clear();

    this.accUangMukaService.getById(event.id).subscribe((res: any) => {
      if (res.status === 'OK' && res.data) {
        // tambahin property qty = 1
        const data = { ...res.data, qty: 1 };

        this.details.push(this.createDetailForm(data));
      } else {
        // kalau gak ada data, kasih default qty 1
        this.details.push(this.createDetailForm({ qty: 1 }));
      }

      this.totalSub();
      this.totalGrand();
    });
  }




  onPembelianTbsChange(event: any) {
    this.details.clear();
    this.accTbsInvoiceService.getDetailById(event.id).subscribe((res: any) => {
      if (res.status === 'OK' && Array.isArray(res.data)) {
        res.data.forEach((response: any) => this.details.push(this.createDetailForm(response)));
      }
      this.totalSub();
      this.totalGrand();
    });
  }

  onInvoiceHutang(event: any) {
    this.details.clear();
    this.accApInvoiceService.getHutangPoById(event.id).subscribe((res: any) => {
      if (res.status === 'OK' && Array.isArray(res.data)) {
        res.data.forEach((response: any) => this.details.push(this.createDetailForm(response)));
      }
      this.totalSub();
      this.totalGrand();
    });
  }

  onPenerimaChange(event: any) {
    const value = event.target.value;

    if (value === 'supplier') {
      this.showSupplier = true;
      this.showKaryawan = false;

      // kosongkan karyawan_id tanpa reset form
      this.entryForm.get('karyawan_id').patchValue([]);
    } else if (value === 'karyawan') {
      this.showSupplier = false;
      this.showKaryawan = true;

      // kosongkan supplier_id tanpa reset form
      this.entryForm.get('supplier_id').patchValue([]);
    }
  }




}
