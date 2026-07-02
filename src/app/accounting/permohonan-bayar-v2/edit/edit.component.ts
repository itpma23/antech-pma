import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate, formatNumber } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { AccPermohonanBayarService } from '../../../shared/services/acc_permohonan_bayar.service';
import { AccPermohonanBayar } from '../../../shared/models/acc_permohonan_bayar.model';
import { GbmSupplierService } from '../../../shared/services/gbm_supplier.service';
import { isNullOrUndefined, isNumber, isString } from 'util';
import { ToastrService } from 'ngx-toastr';
import { AccApInvoiceService } from 'src/app/shared/services/acc_ap_invoice.service';
import { AccTbsInvoiceService } from 'src/app/shared/services/acc_tbs_invoice.service';
import { AccUangMukaService } from 'src/app/shared/services/acc_uang_muka.service';
import { PrcKontrakAngkutService } from 'src/app/shared/services/prc_kontrak_angkut.service';
import { PrcPoService } from 'src/app/shared/services/prc_po.service';
import { AccPermohonanBayarV2Service } from 'src/app/shared/services/acc_permohonan_bayar_v2.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { AccPermintaanDanaService } from 'src/app/shared/services/acc_permintaan_dana.service';

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

  event: EventEmitter<any> = new EventEmitter();
  accPermohonanBayar: AccPermohonanBayar;
  dataSelectSupplier;
  dataSelectJenisInvoice: { id: string; text: string; }[];
  dataSelectSpk;
  dataSelectBlok;
  datasupplier: any[];
  dataSelectPO: any[];
  dataSelectUangMuka: any[];
  dataSelectBiayaAngkut: any[];
  dataSelectPembelianTbs: any[];
  dataSelectPermintaanDana: any[];
  dataSelectHutang: any[];
  dataSelectKaryawan: any[];
  showSupplier: boolean = true;

  public autoTax = false;
  showKaryawan: boolean = false;

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private accPermohonanBayarService: AccPermohonanBayarV2Service,
    private gbmSupplierService: GbmSupplierService,
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
    let time: Date = new Date();

    this.entryForm = this.builder.group({

      supplier: new FormControl('',),
      txt_biaya_lain: new FormControl('Biaya Lain',),
      supplier_id: new FormControl([],),
      karyawan_id: new FormControl([],),
      no_transaksi: new FormControl(''),
      no_referensi: new FormControl(''),
      diminta_oleh: new FormControl(''),
      divisi: new FormControl(''),
      periode: new FormControl(''),
      tanggal: new FormControl(toDate, Validators.required),
      tanggal_tempo: new FormControl(toDate, Validators.required),
      ket: new FormControl(''),
      catatan: new FormControl(''),
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
      jenis_invoice: new FormControl([], Validators.required),
      noTipe_id: new FormControl([]),

      details: this.builder.array([])


    });
  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

    this.entryForm.get('tanggal')!.patchValue(new Date(Date.parse(this.accPermohonanBayar.tanggal)));
    this.entryForm.get('tanggal_tempo')!.patchValue(new Date(Date.parse(this.accPermohonanBayar.tanggal_tempo)));
    this.entryForm.get('no_transaksi')!.patchValue(this.accPermohonanBayar.no_transaksi);
    this.entryForm.get('no_referensi')!.patchValue(this.accPermohonanBayar.no_referensi);
    this.entryForm.get('txt_biaya_lain')!.patchValue(this.accPermohonanBayar.txt_biaya_lain);
    this.entryForm.get('diminta_oleh')!.patchValue(this.accPermohonanBayar.diminta_oleh);
    this.entryForm.get('divisi')!.patchValue(this.accPermohonanBayar.divisi);
    this.entryForm.get('periode')!.patchValue(this.accPermohonanBayar.periode);
    this.entryForm.get('ket')!.patchValue(this.accPermohonanBayar.ket);
    this.entryForm.get('catatan')!.patchValue(this.accPermohonanBayar.catatan);
    this.entryForm.get('supplier')!.patchValue(this.accPermohonanBayar.supplier);

    this.entryForm.get('nama_bank')!.patchValue(this.accPermohonanBayar.nama_bank);
    this.entryForm.get('no_rek')!.patchValue(this.accPermohonanBayar.no_rek);
    this.entryForm.get('atas_nama')!.patchValue(this.accPermohonanBayar.atas_nama);

    this.entryForm.get('subtotal')!.patchValue(this.accPermohonanBayar.subtotal);
    this.entryForm.get('diskon')!.patchValue(this.accPermohonanBayar.diskon);
    this.entryForm.get('dpp')!.patchValue(this.accPermohonanBayar.dpp);
    this.entryForm.get('ppn')!.patchValue(this.accPermohonanBayar.ppn);
    this.entryForm.get('ppnbm')!.patchValue(this.accPermohonanBayar.ppnbm);
    this.entryForm.get('biaya_lain')!.patchValue(this.accPermohonanBayar.biaya_lain);
    this.entryForm.get('pph')!.patchValue(this.accPermohonanBayar.pph);
    this.entryForm.get('total')!.patchValue(this.accPermohonanBayar.total);

    let supplier_id = this.accPermohonanBayar.supplier_id
    let karyawan_id = this.accPermohonanBayar.karyawan_id

    if (supplier_id && supplier_id !== 0) {
      // tampilkan supplier
      this.showSupplier = true;
      this.showKaryawan = false;
      this.entryForm.get('supplier_id').patchValue({ id: supplier_id });

      // ambil data supplier
      this.gbmSupplierService.getById(supplier_id).subscribe(res => {
        const data = res['data'] || {};
        this.entryForm.get('supplier').patchValue(data['nama_supplier'] || '');
        this.entryForm.get('nama_bank').patchValue(data['nama_bank'] || '');
        this.entryForm.get('no_rek').patchValue(data['no_rekening'] || '');
        this.entryForm.get('atas_nama').patchValue(data['atas_nama'] || '');
      });

    } else if (karyawan_id && karyawan_id !== 0) {
      // tampilkan karyawan
      this.showSupplier = false;
      this.showKaryawan = true;
      this.entryForm.get('karyawan_id').patchValue({ id: karyawan_id });

      // ambil data karyawan
      this.karyawanService.getById(karyawan_id).subscribe(res => {
        const data = res['data'] || {};
        this.entryForm.get('supplier').patchValue(data['nama'] || '');
        this.entryForm.get('nama_bank').patchValue(data['nama_bank'] || '');
        this.entryForm.get('no_rek').patchValue(data['no_rek_bank'] || '');
        this.entryForm.get('atas_nama').patchValue(data['atas_nama'] || '');
      });
    } else {
      // fallback kalau dua-duanya kosong
      this.showSupplier = false;
      this.showKaryawan = false;
    }

    this.totalSub();

    if (this.autoTax) {
      this.totalGrand();
    }
  }
  public options: any;

  private loadSelect2(): void {
    this.dataSelectJenisInvoice = [
      { id: 'PO', text: 'PO' },
      { id: 'PO JASA', text: 'PO JASA' },
      { id: 'UANG MUKA', text: 'UANG MUKA' },
      { id: 'BIAYA ANGKUT', text: 'BIAYA ANGKUT' },
      { id: 'HUTANG LAINNYA', text: 'HUTANG LAINNYA' },
      { id: 'HUTANG RETENSI', text: 'HUTANG RETENSI' },
      { id: 'PEMBELIAN TBS', text: 'PEMBELIAN TBS' },
      { id: 'BIAYA NON PO', text: 'BIAYA NON PO' },
      { id: 'PINDAH BUKU', text: 'PINDAH BUKU' },
      { id: 'PERMINTAAN DANA', text: 'PERMINTAAN DANA' },
    ];
    let selectKaryawan;
    this.karyawanService.getAllAktif().subscribe(x => {
      this.dataSelectKaryawan = [];
      let i = x['data'];
      i.forEach(d => {

        if (this.accPermohonanBayar.karyawan_id == d.id) {
          selectKaryawan = { "id": d.id, "text": d.nama }
        }
        this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama + " - " + d.nip + "  (" + d.sub_bagian_nama + ")" });
      })
      this.entryForm.controls['karyawan_id'].valueChanges.subscribe(val => {
        if (val && val.id) {
          this.tampilDataKaryawan();
        }
      });
    });

    let selectTipe;
    this.dataSelectJenisInvoice.forEach(a => {
      if (a.id == this.accPermohonanBayar.jenis_invoice) {
        selectTipe = a;
      }
    });

    this.entryForm.controls['jenis_invoice'].patchValue(selectTipe);

    let selectSupplier;
    this.gbmSupplierService.getAll().subscribe(x => {
      this.dataSelectSupplier = [];
      x['data'].forEach(d => {
        this.dataSelectSupplier.push({ "id": d.id, "text": d.nama_supplier + " - " + d.kode_supplier });
        if (this.accPermohonanBayar.supplier_id == d.id) {
          selectSupplier = { "id": d.id, "text": d.nama_supplier }
        }
      });
      this.entryForm.get('supplier_id').patchValue(selectSupplier);

      // Kalau supplier sudah terpilih, langsung load semua data terkait
      if (selectSupplier && selectSupplier.id) {
        const supplier_id = selectSupplier.id;

        // PO
        this.prcPoService.getAllPoReleaseRecieveBySupplier(supplier_id).subscribe(r => {
          this.dataSelectPO = [];
          r['data'].forEach(d => {
            this.dataSelectPO.push({ "id": d.id, "text": d.no_po + ' (' + d.no_penerimaan + ')' + ' (' + d.tanggal + ')', no_invoice: d.no_invoice });
          });
          if (selectTipe.id == 'PO') {
            let selected = this.dataSelectPO.find(po => po.id == this.accPermohonanBayar.noTipe_id);
            if (selected) {
              this.entryForm.get('noTipe_id').patchValue(selected);
            }
          }
        });

        // Biaya Angkut
        this.prcKontrakAngkutService.getAllBiayaAngkut(supplier_id).subscribe(r => {
          this.dataSelectBiayaAngkut = [];
          r['data'].forEach(d => {
            this.dataSelectBiayaAngkut.push({ "id": d.id, "text": d.no_spk + ' (' + d.no_invoice + ') ' + ' (' + d.tanggal + ')' });
          });
          if (selectTipe.id == 'BIAYA ANGKUT') {
            let selected = this.dataSelectBiayaAngkut.find(b => b.id == this.accPermohonanBayar.noTipe_id);
            if (selected) {
              this.entryForm.get('noTipe_id').patchValue(selected);
            }
          }
        });

        // permintaan dana
        this.accPermintaanDanaService.getPermintaanDana().subscribe(x => {
          this.dataSelectPermintaanDana = [];
          let i = x['data'];
          i.forEach(d => {
            this.dataSelectPermintaanDana.push({ "id": d.id, "text": d.no_transaksi + ' (' + d.tanggal + ')' });
          });

          if (selectTipe.id == 'PERMINTAAN DANA') {
            let selected = this.dataSelectPermintaanDana.find(u => u.id == this.accPermohonanBayar.noTipe_id);
            if (selected) {
              this.entryForm.get('noTipe_id').patchValue(selected);
            }
          }
        })

        // Uang Muka
        this.accUangMukaService.getUangMuka().subscribe(r => {
          this.dataSelectUangMuka = [];
          if (Array.isArray(r['data'])) {
            r['data'].forEach(d => {
              this.dataSelectUangMuka.push({ id: d.id, text: d.no_transaksi + ' (' + d.tanggal + ')' });
            });
          }
          if (selectTipe.id == 'UANG MUKA') {
            let selected = this.dataSelectUangMuka.find(u => u.id == this.accPermohonanBayar.noTipe_id);
            if (selected) {
              this.entryForm.get('noTipe_id').patchValue(selected);
            }
          }
        });

        // Pembelian TBS
        this.accTbsInvoiceService.getTbsbySupplierId(supplier_id).subscribe(r => {
          this.dataSelectPembelianTbs = [];
          if (Array.isArray(r['data'])) {
            r['data'].forEach(d => {
              this.dataSelectPembelianTbs.push({ id: d.id, text: d.no_invoice + ' (' + d.tanggal + ')' });
            });
          }
          if (selectTipe.id == 'PEMBELIAN TBS') {
            let selected = this.dataSelectPembelianTbs.find(t => t.id == this.accPermohonanBayar.noTipe_id);
            if (selected) {
              this.entryForm.get('noTipe_id').patchValue(selected);
            }
          }
        });

        // Hutang
        this.accApInvoiceService.getHutangByIdSupplier(supplier_id).subscribe(r => {
          this.dataSelectHutang = [];
          r['data'].forEach(d => {
            this.dataSelectHutang.push({ id: d.id, text: d.no_invoice + ' (' + d.tanggal + ')' });
          });
          if (selectTipe.id == 'HUTANG LAINNYA' || selectTipe.id == 'HUTANG RETENSI') {
            let selected = this.dataSelectHutang.find(h => h.id == this.accPermohonanBayar.noTipe_id);
            if (selected) {
              this.entryForm.get('noTipe_id').patchValue(selected);
            }
          }
        });
      }

      this.entryForm.controls['supplier_id'].valueChanges.subscribe(x => {
        this.tampildataSupp();
      });
    });

    // Detail
    let dtl: any = [];
    dtl = this.accPermohonanBayar.detail;
    for (let index = 0; index < dtl.length; index++) {
      const d = dtl[index];
      this.addBlok(d.keterangan, d.qty, d.harga, d.jumlah, d.diskon_detail);
    }
  }

  onSubmit() {


    this.isFormSubmitted = true;

    if (this.entryForm.invalid) {
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

    this.accPermohonanBayarService.update(this.accPermohonanBayar.id, frmData).subscribe(data => {
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
    let harga = 0;

    let toDate: Date = new Date();
    this.details.push(this.builder.group({
      keterangan: new FormControl('',),
      x_qty: new FormControl(0,),
      qty: new FormControl(0,),
      harga: new FormControl(harga,),
      x_harga: new FormControl(harga,),
      diskon: new FormControl(0,),
      x_diskon: new FormControl(0,),
      jumlah: new FormControl(0,),
    }));
  }


  addBlok(keterangan, qty, harga, jumlah, diskon) {




    this.details.push(this.builder.group({
      keterangan: new FormControl(keterangan),

      qty: new FormControl(qty),
      x_qty: new FormControl(formatNumber(qty, 'en_US', '1.2-2')),

      harga: new FormControl(harga),
      x_harga: new FormControl(formatNumber(harga, 'en_US', '1.2-2')),

      diskon: new FormControl(diskon),
      x_diskon: new FormControl(formatNumber(diskon, 'en_US', '1.2-2')),

      jumlah: new FormControl(formatNumber(jumlah, 'en_US', '1.2-2')),
      // jumlah: new FormControl(jumlah),

    }));
    this.totalSub()
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

    this.totalHarga(item);
  }



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

  totalGrandOld() {
    let subTotal = this.entryForm.get('subtotal').value;
    subTotal = isNumber(subTotal) ? subTotal : parseFloat(subTotal.replace(/[^\d\.\-]/g, ""));

    let diskon = this.entryForm.get('diskon').value;
    diskon = isNumber(diskon) ? diskon : parseFloat(diskon.replace(/[^\d\.\-]/g, ""));

    let biaya_lain = this.entryForm.get('biaya_lain').value;
    biaya_lain = isNumber(biaya_lain) ? biaya_lain : parseFloat(biaya_lain.replace(/[^\d\.\-]/g, ""));

    let dpp = this.entryForm.get('dpp').value;
    dpp = isNumber(dpp) ? dpp : parseFloat(dpp.replace(/[^\d\.\-]/g, ""));

    let grandTotal = 0;
    let ppn = parseFloat(this.entryForm.get('ppn').value);
    let ppnTotal = 0;

    let ppnbm = parseFloat(this.entryForm.get('ppnbm').value);
    let ppnbmTotal = 0;


    let pph = parseFloat(this.entryForm.get('pph').value);
    let pphTotal = 0;
    if (!isNumber(pph)) {
      pph = 0;
      pphTotal = 0;
    } else {
      pphTotal = (pph / 100) * parseFloat(subTotal);

    }
    if (!isNumber(ppn)) {
      ppn = 0;
      ppnTotal = 0;
    } else {
      ppnTotal = (ppn / 100) * parseFloat(subTotal);

    }
    if (!isNumber(ppnbm)) {
      ppnbm = 0;
      ppnbmTotal = 0;
    } else {
      ppnbmTotal = (ppnbm / 100) * parseFloat(subTotal);

    }
    subTotal = subTotal - diskon;


    grandTotal = parseFloat(subTotal) + (ppnTotal + ppnbmTotal + biaya_lain - pphTotal);
    console.log('subtotal:' + subTotal)
    console.log('ppnTotal:' + ppnTotal)
    console.log('ppnbmTotal:' + ppnbmTotal)
    console.log('biaya_lain:' + biaya_lain)
    console.log('pphTotal:' + pphTotal)
    console.log('grandTotal:' + grandTotal)
    this.entryForm.get('diskon').patchValue(formatNumber(diskon, 'en_US', '1.2-2'));
    this.entryForm.get('biaya_lain').patchValue(formatNumber(biaya_lain, 'en_US', '1.2-2'));
    this.entryForm.get('dpp').patchValue(formatNumber(subTotal, 'en_US', '1.2-2'));

    this.entryForm.get('pph').patchValue(formatNumber(pph, 'en_US', '1.2-2'));
    this.entryForm.get('ppn').patchValue(formatNumber(ppn, 'en_US', '1.2-2'));
    this.entryForm.get('ppnbm').patchValue(formatNumber(ppnbm, 'en_US', '1.2-2'));
    this.entryForm.get('pph_nilai').patchValue(formatNumber(pphTotal, 'en_US', '1.2-2'));
    this.entryForm.get('ppn_nilai').patchValue(formatNumber(ppnTotal, 'en_US', '1.2-2'));
    this.entryForm.get('ppnbm_nilai').patchValue(formatNumber(ppnbmTotal, 'en_US', '1.2-2'));

    this.entryForm.get('total').patchValue(formatNumber(grandTotal, 'en_US', '1.2-2'));
  }


  calc_pph() {
    let subTotal = this.entryForm.get('subtotal').value;
    subTotal = isNumber(subTotal) ? subTotal : parseFloat(subTotal.replace(/[^\d\.\-]/g, ""));
    let pph_show = this.entryForm.get('pph_nilai').value;
    pph_show = isNumber(pph_show) ? pph_show : parseFloat(pph_show.replace(/[^\d\.\-]/g, ""));

    let pphPercent = 0;

    if (isNumber(pph_show)) {
      pphPercent = (pph_show / parseFloat(subTotal)) * 100;
    } else {
      pphPercent = 0;
    }

    //pphPercent.toFixed(4);
    this.entryForm.get('pph').patchValue(formatNumber(pphPercent, 'en_US', '1.2-2'));

    this.totalSub();
  }

  tampildataSupp() {

    let supplier_id = this.entryForm.get('supplier_id').value['id']
    this.gbmSupplierService.getById(supplier_id).subscribe(res => {
      this.entryForm.controls['supplier'].patchValue(res['data']['nama_supplier']);
      this.entryForm.controls['nama_bank'].patchValue(res['data']['nama_bank']);
      this.entryForm.controls['no_rek'].patchValue(res['data']['no_rekening']);
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
    // console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

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

  totalGrand() {

  const parseNum = (val: any): number => {
    if (val === null || val === undefined || val === '') {
      return 0;
    }

    if (typeof val === 'string') {
      val = val.replace(/[^\d.-]/g, '');
    }

    const num = parseFloat(val);
    return isNaN(num) || !isFinite(num) ? 0 : num;
  };

  // ===========================
  // Nilai dasar
  // ===========================

  let subTotal = parseNum(this.entryForm.get('subtotal').value);
  let diskon = parseNum(this.entryForm.get('diskon').value);
  let biayaLain = parseNum(this.entryForm.get('biaya_lain').value);

  let dpp = subTotal - diskon;

  if (dpp < 0) {
    dpp = 0;
  }

  // ===========================
  // Persentase pajak
  // ===========================

  let ppn = parseNum(this.entryForm.get('ppn').value);
  let ppnbm = parseNum(this.entryForm.get('ppnbm').value);
  let pph = parseNum(this.entryForm.get('pph').value);

  let ppnTotal = 0;
  let ppnbmTotal = 0;
  let pphTotal = 0;

  // ===========================
  // AUTO / MANUAL
  // ===========================

  if (this.autoTax) {

    ppnTotal = dpp * ppn / 100;
    ppnbmTotal = dpp * ppnbm / 100;
    pphTotal = dpp * pph / 100;

    this.entryForm.patchValue({

      ppn_nilai: formatNumber(ppnTotal, 'en_US', '1.2-2'),
      ppnbm_nilai: formatNumber(ppnbmTotal, 'en_US', '1.2-2'),
      pph_nilai: formatNumber(pphTotal, 'en_US', '1.2-2')

    }, { emitEvent: false });

  } else {

    ppnTotal = parseNum(this.entryForm.get('ppn_nilai').value);
    ppnbmTotal = parseNum(this.entryForm.get('ppnbm_nilai').value);
    pphTotal = parseNum(this.entryForm.get('pph_nilai').value);

  }

  // ===========================
  // Grand Total
  // ===========================

  let grandTotal =
      dpp
      + ppnTotal
      + ppnbmTotal
      + biayaLain
      - pphTotal;

  if (!isFinite(grandTotal)) {
    grandTotal = 0;
  }

  // ===========================
  // Format kembali
  // ===========================

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

}
