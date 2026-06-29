import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import * as $ from "jquery";

import { PrcPo } from 'src/app/shared/models/prc_po.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { PrcPoService } from 'src/app/shared/services/prc_po.service';
import { formatDate, formatNumber } from '@angular/common';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { PrcSyaratBayarService } from 'src/app/shared/services/prc_syarat_bayar.service';
import { PrcFrancoService } from 'src/app/shared/services/prc_franco.service';
import { PrcPoTTDService } from 'src/app/shared/services/prc_po_ttd.service';
import { AccMatauangService } from 'src/app/shared/services/acc_mata_uang.service';
import { isNullOrUndefined, isNumber, isString } from 'util';
import { PrcQuotationService } from 'src/app/shared/services/prc_quotation.service';
import { PrcPpService } from 'src/app/shared/services/prc_pp.service';
import { LookupPpComponent } from '../lookup-pp/lookup-pp.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';

declare var swal: any;

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
  categories: any[] = [];
  event: EventEmitter<any> = new EventEmitter();
  PrcPo: PrcPo;
  dbName;
  pathName;
  PATH_URL;

  dataSelectSimbol;
  dataSelectLokasi;
  dataSelectLokasiPP;
  dataSelectKode;
  dataSelectKaryawan;
  dataSelectItem;
  dataSelectSupplier;
  dataSelectSyaratBayar;
  dataSelectFranco;

  dataItem;
  dataSelectMataUang: any[];
  dataMatauang: any;
  dataSelectPeminta: any[];
  dataPeminta: any;
  dataSelectPenyetuju: any[];
  dataPenyetuju: any;
  dataSelectQuotation: any[];
  selectedLokasiPP: any[];
  dataSelectStatusStok: { id: string; text: string; }[];


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private PrcPoService: PrcPoService,
    private authenticationService: AuthenticationService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private ngxLoader: NgxUiLoaderService,
    private bsModalRef1: BsModalRef,
    private bsModalService: BsModalService,
    private PrcPpService: PrcPpService,
    private InvItemService: InvItemService,
    private GbmSupplierService: GbmSupplierService,
    private PrcSyaratBayarService: PrcSyaratBayarService,
    private PrcFrancoService: PrcFrancoService,
    private prcPoTTDService: PrcPoTTDService,
    private accMatauangService: AccMatauangService,
    private PrcQuotationService: PrcQuotationService,
  ) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;

    let toDate: Date = new Date();

    this.entryForm = this.builder.group({
      revisi_ke: new FormControl(0),
      lokasi_id: new FormControl([], Validators.required),
      supplier_id: new FormControl([], Validators.required),
      syarat_bayar_id: new FormControl([], Validators.required),
      franco_id: new FormControl([], Validators.required),
      mata_uang_id: new FormControl([], Validators.required),
      quotation_id: new FormControl([]),
      lokasi_pp_id: new FormControl([], Validators.required),
      status_stok: new FormControl([], Validators.required),
      ket_indent: new FormControl(''),
      // ttd_peminta: new FormControl([], Validators.required),
      // ttd_penyetuju: new FormControl([], Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      no_po: new FormControl('', Validators.required),
      catatan: new FormControl('', Validators.required),
      catatan_revisi: new FormControl('',),
      tempo_bayar: new FormControl(0,),
      sub_total: new FormControl(0, Validators.required),
      disc: new FormControl(0),
      diskon: new FormControl(0),
      biaya_kirim: new FormControl(0),
      biaya_lain: new FormControl(0),
      ppbkb: new FormControl(0, Validators.required),
      ppbkb_show: new FormControl(0, Validators.required),
      ppn: new FormControl(0, Validators.required),
      ppn_show: new FormControl(''),
      pph: new FormControl(0, Validators.required),
      pph_show: new FormControl(''),
      grand_total: new FormControl(0, Validators.required),

      details: this.builder.array([]),

    });




  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {

    // this.entryForm.controls['awal'].patchValue(this.PrcPo.awal);
    // this.entryForm.controls['akhir'].patchValue(this.PrcPo.akhir);
    this.entryForm.controls['no_po'].patchValue(this.PrcPo.status_stok);
    this.entryForm.controls['no_po'].patchValue(this.PrcPo.no_po);
    this.entryForm.controls['catatan'].patchValue(this.PrcPo.catatan);
    this.entryForm.controls['ket_indent'].patchValue(this.PrcPo.ket_indent);
    this.entryForm.controls['catatan_revisi'].patchValue(this.PrcPo.catatan_revisi);
    this.entryForm.controls['tempo_bayar'].patchValue(this.PrcPo.tempo_bayar);
    this.entryForm.controls['sub_total'].patchValue(this.PrcPo.sub_total);
    this.entryForm.controls['diskon'].patchValue(this.PrcPo.diskon);
    this.entryForm.controls['disc'].patchValue(this.PrcPo.disc);
    this.entryForm.controls['ppn'].patchValue(this.PrcPo.ppn);
    this.entryForm.controls['pph'].patchValue(this.PrcPo.pph);
    this.entryForm.controls['pph_show'].patchValue(this.PrcPo.pph_nilai);
    this.entryForm.controls['ppbkb'].patchValue(this.PrcPo.ppbkb);
    this.entryForm.controls['biaya_kirim'].patchValue(this.PrcPo.biaya_kirim);
    this.entryForm.controls['biaya_lain'].patchValue(this.PrcPo.biaya_lain);
    this.entryForm.controls['grand_total'].patchValue(this.PrcPo.grand_total);

    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.PrcPo.tanggal)));
    let rev_ke:number=0;
    rev_ke=(parseInt(this.PrcPo.revisi_ke));
    rev_ke= rev_ke+1;
    // console.log(typeof this.PrcPo.revisi_ke);
    this.entryForm.controls['revisi_ke'].patchValue(rev_ke);
    this.totalGrand();
  }
  public options: any;


  private loadSelect2(): void {
    let selectedStatusStok;
    this.dataSelectStatusStok = [
      { id: 'Ready Stok', text: 'Ready Stok' },
      { id: 'Indent', text: 'Indent' },
    ];
    this.dataSelectStatusStok.forEach(x => {
      if (this.PrcPo.status_stok == x.id) {
        selectedStatusStok = x;
      }

    })
    this.entryForm.get('status_stok').patchValue(selectedStatusStok);
    let selectedLokasi;
    this.GbmOrganisasiService.getAllByType("UNIT").subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
        if (this.PrcPo.lokasi_id == d.id) {
          selectedLokasi = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectedLokasi);
    });
    let selectedLokasiPP;
    this.GbmOrganisasiService.getAllByType("UNIT").subscribe(x => {
      this.dataSelectLokasiPP = [];
      x.forEach(d => {
        this.dataSelectLokasiPP.push({ "id": d.id, "text": d.nama });
        if (this.PrcPo.lokasi_pp_id == d.id) {
          selectedLokasiPP = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_pp_id').patchValue(selectedLokasiPP);
    });
    let selectedQuotation: any = null;
    this.PrcQuotationService.getAll().subscribe(x => {
      this.dataSelectQuotation = [];
      x['data'].forEach(d => {
        if (this.PrcPo.quotation_id == d.id) {
          selectedQuotation = { "id": d.id, "text": d.no_quotation + '-' + d.no_referensi }
        }
        this.dataSelectQuotation.push({ "id": d.id, "text": d.no_quotation + '-' + d.no_referensi });
      });
      if (selectedQuotation) {
        this.entryForm.get('quotation_id').patchValue(selectedQuotation);
      } else {
        this.entryForm.get('quotation_id').patchValue([]);
      }

    });

    let selectedItem;
    this.InvItemService.getAll().subscribe(x => {
      this.dataSelectItem = [];
      this.dataItem = x['data'];
      x['data'].forEach(d => {
        this.dataSelectItem.push({ "id": d.id, "text": "" + d.kode + " - " + d.nama });
      });
      let dtl = [];
      dtl = this.PrcPo.detail;
      // console.log(dtl);
      for (let index = 0; index < dtl.length; index++) {
        const d = dtl[index];
        this.addBlok(d['pp_dt_id'], d['item_id'], d['qty'], d['diskon'], d['harga'], d['total'], d['ket'], d['no_pp']);
      }
    });

    let selectedSupplier;
    this.GbmSupplierService.getAll().subscribe(x => {
      this.dataSelectSupplier = [];
      x['data'].forEach(d => {
        this.dataSelectSupplier.push({ "id": d.id, "text": d.nama_supplier });
        if (this.PrcPo.supplier_id == d.id) {
          selectedSupplier = { "id": d.id, "text": d.nama_supplier }
        }
      });
      this.entryForm.get('supplier_id').patchValue(selectedSupplier);
    });

    let selectedSyaratBayar;
    this.PrcSyaratBayarService.getAll().subscribe(x => {
      this.dataSelectSyaratBayar = [];
      x['data'].forEach(d => {
        this.dataSelectSyaratBayar.push({ "id": d.id, "text": "(" + d.jenis + ") " + d.kode + " - " + d.ket });
        if (this.PrcPo.syarat_bayar_id == d.id) {
          selectedSyaratBayar = { "id": d.id, "text": "(" + d.jenis + ") " + d.kode + " - " + d.ket }
        }
      });
      this.entryForm.get('syarat_bayar_id').patchValue(selectedSyaratBayar);
    });

    let selectedFranco;
    this.PrcFrancoService.getAll().subscribe(x => {
      this.dataSelectFranco = [];
      x['data'].forEach(d => {
        this.dataSelectFranco.push({ "id": d.id, "text": "(" + d.nama + ") " + d.alamat });
        if (this.PrcPo.franco_id == d.id) {
          selectedFranco = { "id": d.id, "text": "(" + d.nama + ") " + d.alamat }
        }
      });
      this.entryForm.get('franco_id').patchValue(selectedFranco);
    });
    let selectedMataUang;
    this.accMatauangService.getAll().subscribe(x => {
      this.dataSelectMataUang = [];
      this.dataMatauang = x['data'];

      x['data'].forEach(d => {
        if (this.PrcPo.mata_uang_id == d.id) {
          selectedMataUang = { "id": d.id, "text": "(" + d.nama + ") " + d.alamat }
        }
        this.dataSelectMataUang.push({ "id": d.id, "text": "(" + d.kode + ") " + d.nama });
      });
      this.entryForm.get('mata_uang_id').patchValue(selectedMataUang);
    });
    // let selectedPeminta;
    // this.prcPoTTDService.getAllbyType('peminta').subscribe(x=>{
    //   this.dataSelectPeminta=[];
    //   this.dataPeminta = x['data'];
    //   console.log(x)
    //   x['data'].forEach(d => {
    //     if (this.PrcPo.ttd_peminta == d.nama) {
    //       selectedPeminta = {"id":d.nama,"text":d.nama}
    //     }
    //     this.dataSelectPeminta.push({"id":d.nama,"text":d.nama});
    //   });
    //   this.entryForm.get('ttd_peminta').patchValue(selectedPeminta);
    // });

    // let selectedPenyetuju;
    // this.prcPoTTDService.getAllbyType('penyetuju').subscribe(x=>{
    //   this.dataSelectPenyetuju=[];
    //   this.dataPenyetuju = x['data'];
    //   console.log(x)
    //   x['data'].forEach(d => {
    //     if (this.PrcPo.ttd_penyetuju == d.nama) {
    //       selectedPenyetuju = {"id":d.nama,"text":d.nama}
    //     }
    //     this.dataSelectPenyetuju.push({"id":d.nama,"text":d.nama});
    //   });
    //   this.entryForm.get('ttd_penyetuju').patchValue(selectedPenyetuju);
    // });


    // let selectedKaryawan;
    // this.KaryawanService.getAll().subscribe(x=>{
    //   this.dataSelectKaryawan=[];
    //   x['data'].forEach(d => {
    //     this.dataSelectKaryawan.push({"id":d.id,"text":d.nama});
    //     if (this.PrcPo.karyawan_id == d.id) {
    //       selectedKaryawan = { "id": d.id, "text": d.nama }
    //     }
    //   });
    //   this.entryForm.get('karyawan_id').patchValue(selectedKaryawan);
    // });

    this.dataSelectKode = [
      { id: 'PO1', text: 'PO1' },
      { id: 'PO2', text: 'PO2' },
      { id: 'PO3', text: 'PO3' },
      { id: 'PO4', text: 'PO4' },
      { id: 'PO5', text: 'PO5' },
      { id: 'PO6', text: 'PO6' },
    ];

    // let selectedKode;
    // this.dataSelectKode.forEach(d => {
    //   if (this.PrcPo.kode == d.id) {
    //     selectedKode = { "id": d.id, "text": d.text }
    //   }
    // });
    // this.entryForm.get('kode_id').patchValue(selectedKode);

    // let selectedSimbol;
    // this.dataSelectSimbol.forEach(d => {
    //   if (this.PrcPo.simbol == d.id) {
    //     selectedSimbol = d;
    //   }
    // });
    // this.entryForm.get("simbol").patchValue(selectedSimbol);

  }

  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };
  addBlok1(pp_dt_id, item_id, qty, no_pp, ket = '') {
    // this.details.push(this.builder.group(new InvoiceBlok()));

    let selectedItem;
    this.dataItem.forEach(a => {
      if (item_id == a.id) {
        selectedItem = a;
      }
    });

    this.details.push(this.builder.group({
      pp_dt_id: new FormControl(pp_dt_id),
      item: new FormControl(selectedItem, Validators.required),
      uom: new FormControl(selectedItem.uom),
      qty: new FormControl(qty, Validators.required),
      xqty: new FormControl(formatNumber(qty, 'en_US', '1.2-2')),
      diskon: new FormControl(0),
      xdiskon: new FormControl(0),
      harga: new FormControl(0, Validators.required),
      xharga: new FormControl(0),
      total: new FormControl(0, Validators.required),
      no_pp: new FormControl(no_pp),
      ket: new FormControl(ket),
    }));

    this.totalSub();
  }
  addBlok(pp_dt_id, item_id, qty, diskon, harga, total, ket, no_pp) {
    // this.details.push(this.builder.group(new InvoiceBlok()));
    let selectedItem;
    this.dataItem.forEach(a => {
      if (item_id == a.id) {
        selectedItem = a;
      }
      // console.log(a);
    });

    let uom;
    this.dataItem.forEach(x => {
      if (item_id = x.id) {
        uom = x.satuan;
      }
    });

    this.details.push(this.builder.group({
      pp_dt_id: new FormControl(pp_dt_id),
      item: new FormControl(selectedItem, Validators.required),
      uom: new FormControl(selectedItem.uom),
      qty: new FormControl(qty, Validators.required),
      xqty: new FormControl(formatNumber(qty, 'en_US', '1.2-2')),
      diskon: new FormControl(diskon, Validators.required),
      xdiskon: new FormControl(formatNumber(diskon, 'en_US', '1.2-2')),
      harga: new FormControl(harga, Validators.required),
      xharga: new FormControl(formatNumber(harga, 'en_US', '1.2-2')),
      total: new FormControl(formatNumber(total, 'en_US', '1.2-2'), Validators.required),
      ket: new FormControl(ket),
      no_pp: new FormControl(no_pp),
    }));
    this.totalSub()
  }
  removeBlok(Blok) {
    let i = this.details.controls.indexOf(Blok);

    if (i != -1) {
      //  let x=	this.details.controls.splice(i, 1);
      let bloks = this.entryForm.get('details') as FormArray;
      bloks.removeAt(i);
      let data = { details: bloks.value };
      this.updateForm(data);
    }
  }
  updateForm(data) {
    const bloks = data.details;
    let sub = 0;
    for (let i of bloks) {
      sub = sub + parseFloat(i.qty);
    }
    console.log(sub);
    //this.entryForm.get('total').patchValue( sub);
  }

  onSubmit() {
    // console.log(this.entryForm);

    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }

    this.entryForm.get('details').value.forEach(x => {
      if (!isNumber(x.total)) {
        x.total = parseFloat(x.total.replace(/[^\d\.\-]/g, ""));
      }
    });
    let frmData = this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    frmData['sub_total'] = parseFloat(this.entryForm.get('sub_total').value.replace(/[^\d\.\-]/g, ""));
    frmData['diskon'] = parseFloat(this.entryForm.get('diskon').value.replace(/[^\d\.\-]/g, ""));
    frmData['biaya_kirim'] = parseFloat(this.entryForm.get('biaya_kirim').value.replace(/[^\d\.\-]/g, ""));
    frmData['biaya_lain'] = parseFloat(this.entryForm.get('biaya_lain').value.replace(/[^\d\.\-]/g, ""));
    frmData['grand_total'] = parseFloat(this.entryForm.get('grand_total').value.replace(/[^\d\.\-]/g, ""));
    frmData['pph_nilai']=parseFloat(this.entryForm.get('pph_show').value.replace(/[^\d\.\-]/g, ""));
    let quotation_id;
    if (!isNullOrUndefined(this.entryForm.controls['quotation_id'].value)) {
      if (isNullOrUndefined(this.entryForm.controls['quotation_id'].value['id'])) {
        quotation_id = null
      } else {
        quotation_id = this.entryForm.controls['quotation_id'].value['id']
      }
    } else {
      quotation_id = null
    }
    frmData['quotation_id'] = quotation_id;
    // console.log( isNullOrUndefined(this.entryForm.controls['quotation_id'].value['id']))
    console.log(frmData);
    //  return;
    this.PrcPoService.revisi(this.PrcPo.id, frmData).subscribe(data => {
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
          text: 'Proses Edit Gagal',
          type: 'warning',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
      }
    });
  }

  showPp() {
    let lokasi_pp_id;
    lokasi_pp_id = this.entryForm.get('lokasi_pp_id').value['id'],
      this.PrcPpService.getAllDetailLokasiByStatus(lokasi_pp_id).subscribe(t => {
        let modalConfig = {
          animated: true,
          keyboard: true,
          backdrop: true,
          ignoreBackdropClick: true,
          //size: 'lg',
          class: "modal-lg ",
          initialState: {
            PrcPp: t['data'],
            // intruksi_id: this.entryForm.get("intruksi_id").value['id'],
          }
        };
        this.bsModalRef1 = this.bsModalService.show(LookupPpComponent, modalConfig);

        this.bsModalRef1.content.event.subscribe(data => {
          console.log(data);
          if (data == null) {
          } else {
            // this.showNotification('top', 'right', "No PP " + data['qty'] + " ", 2);
            data.forEach(d => {
              this.ngxLoader.start();
              this.addBlok1(d['id'], d['item_id'], d['qty_belum_po'], d['no_pp'], d['ket']);

            })
          }
          this.ngxLoader.stop();
        });
      });
  }

  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();
  }
  valueChange($event) {
    console.log($event);

  }
  valueLokasiPPChange($event) {

    let bloks = this.entryForm.get('details') as FormArray;
    bloks.clear()
  }
  getUOM(form) {
    this.dataItem.forEach(x => {
      if (x.id == form.get('item').value.id) {
        form.get('uom').patchValue(x.satuan);
      }
    });
  }

  totalHarga(form) {
    let qty = form.get('xqty').value;
    if (isString(qty)) {
      qty = parseFloat(qty.replace(/[^\d\.\-]/g, ""));
    }
    form.get('xqty').patchValue(formatNumber(qty, 'en_US', '1.2-2'));
    form.get('qty').patchValue(qty);

    let diskon = form.get('xdiskon').value;
    if (isString(diskon)) {
      diskon = parseFloat(diskon.replace(/[^\d\.\-]/g, ""));
    }
    form.get('xdiskon').patchValue(formatNumber(diskon, 'en_US', '1.2-2'));
    form.get('diskon').patchValue(diskon);

    let harga = form.get('xharga').value;
    if (isString(harga)) {
      harga = parseFloat(harga.replace(/[^\d\.\-]/g, ""));
    }
    form.get('xharga').patchValue(formatNumber(harga, 'en_US', '1.2-2'));
    form.get('harga').patchValue(harga);

    let total = (qty * harga) - diskon;
    form.get('total').patchValue(formatNumber(total, 'en_US', '1.2-2'));

    this.totalSub();
  }

  totalSub() {
    let subTotal = 0;

    this.entryForm.get('details').value.forEach(x => {
      if (isNumber(x.total)) {
        subTotal += x.total;
      } else {
        subTotal += parseFloat(x.total.replace(/[^\d\.\-]/g, ""));
      }
    });
    this.entryForm.get('sub_total').patchValue(formatNumber(subTotal, 'en_US', '1.2-2'));
    this.totalGrand();
  }

  totalGrand() {
    let subTotal = this.entryForm.get('sub_total').value;
    subTotal = isNumber(subTotal) ? subTotal : parseFloat(subTotal.replace(/[^\d\.\-]/g, ""));
    let diskon = this.entryForm.get('diskon').value;
    diskon =isNumber(diskon)?diskon: parseFloat(diskon.replace(/[^\d\.\-]/g, ""));
    let biayaKirim = this.entryForm.get('biaya_kirim').value;
    biayaKirim = isNumber(biayaKirim) ? biayaKirim : parseFloat(biayaKirim.replace(/[^\d\.\-]/g, ""));
    let biayaLain = this.entryForm.get('biaya_lain').value;
    biayaLain =isNumber(biayaLain)?biayaLain: parseFloat(biayaLain.replace(/[^\d\.\-]/g, ""));

    let grandTotal = 0;

    let ppn = parseFloat(this.entryForm.get('ppn').value);
    let ppnTotal = 0;
    let pph = parseFloat(this.entryForm.get('pph').value);
    let pphTotal = 0;
    let ppbkb = parseFloat(this.entryForm.get('ppbkb').value);
    let ppbkbTotal = 0;

    subTotal = subTotal - diskon;
    ppnTotal = (ppn / 100) * parseFloat(subTotal);
    pphTotal = (pph / 100) * parseFloat(subTotal);
    ppbkbTotal = (ppbkb / 100) * parseFloat(subTotal);
    grandTotal = parseFloat(subTotal) + (ppnTotal - pphTotal + ppbkbTotal) + parseFloat(biayaKirim);
    grandTotal = grandTotal + biayaLain;

    this.entryForm.get('biaya_kirim').patchValue(formatNumber(biayaKirim, 'en_US', '1.2-2'));
    this.entryForm.get('biaya_lain').patchValue(formatNumber(biayaLain, 'en_US', '1.2-2'));
    this.entryForm.get('diskon').patchValue(formatNumber(diskon, 'en_US', '1.2-2'));
    this.entryForm.get('ppn_show').patchValue(formatNumber(ppnTotal, 'en_US', '1.2-2'));
    this.entryForm.get('pph_show').patchValue(formatNumber(pphTotal, 'en_US', '1.2-2'));
    this.entryForm.get('ppbkb_show').patchValue(formatNumber(ppbkbTotal, 'en_US', '1.2-2'));
    this.entryForm.get('grand_total').patchValue(formatNumber(grandTotal, 'en_US', '1.2-2'));
  }

  calc_pph() {
    let subTotal = this.entryForm.get('sub_total').value;
    subTotal =isNumber(subTotal)?subTotal: parseFloat(subTotal.replace(/[^\d\.\-]/g, ""));
    let pph_show = this.entryForm.get('pph_show').value;
    pph_show =isNumber(pph_show)?pph_show: parseFloat(pph_show.replace(/[^\d\.\-]/g, ""));

    let pphPercent = 0;

    pphPercent = (pph_show / parseFloat(subTotal)) * 100;
    // pphPercent = Math.round(pphPercent * 100) / 100;
    this.entryForm.get('pph').patchValue(pphPercent);

    this.totalGrand();
  }
}
