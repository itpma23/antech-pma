import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";

import { HrmsPengajuanCuti } from 'src/app/shared/models/hrms_pengajuan_cuti.model';
import { PksTankiService } from 'src/app/shared/services/pks_tanki.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { HrmsPengajuanCutiService } from 'src/app/shared/services/hrms_pengajuan_cuti.service';
import { formatDate, formatNumber } from '@angular/common';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { PrcSyaratBayarService } from 'src/app/shared/services/prc_syarat_bayar.service';
import { PrcFrancoService } from 'src/app/shared/services/prc_franco.service';
import { AccMatauangService } from 'src/app/shared/services/acc_mata_uang.service';
import { isNullOrUndefined, isNumber, isString } from 'util';
import { PrcQuotationService } from 'src/app/shared/services/prc_quotation.service';
import { HrmsJenisAbsensiService } from 'src/app/shared/services/hrms_jenis_absensi.service';

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
  HrmsPengajuanCuti: HrmsPengajuanCuti;
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

  dataSelectJenisAbsensi;

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
    private HrmsPengajuanCutiService: HrmsPengajuanCutiService,
    private authenticationService: AuthenticationService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private KaryawanService: KaryawanService,
    private HrmsJenisAbsensiService: HrmsJenisAbsensiService,
  ) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;

    let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      tanggal: new FormControl(toDate),
      dari_tanggal: new FormControl(toDate, Validators.required),
      sampai_tanggal: new FormControl(toDate, Validators.required),
      lokasi_id: new FormControl([]),
      karyawan_id: new FormControl([], Validators.required),
      cuti: new FormControl('', Validators.required),
      jenis_absensi_id: new FormControl([], Validators.required),

    });




  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {

    this.entryForm.controls['cuti'].patchValue(this.HrmsPengajuanCuti.cuti);
    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.HrmsPengajuanCuti.tanggal)));
    this.entryForm.get('dari_tanggal').patchValue(new Date(Date.parse(this.HrmsPengajuanCuti.dari_tanggal)));
    this.entryForm.get('sampai_tanggal').patchValue(new Date(Date.parse(this.HrmsPengajuanCuti.sampai_tanggal)));

    // this.totalGrand();
  }
  public options: any;


  private loadSelect2(): void {

    let selectedLokasi;
    this.GbmOrganisasiService.getAllByType("UNIT").subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
        if (this.HrmsPengajuanCuti.lokasi_id == d.id) {
          selectedLokasi = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectedLokasi);

    });

    let selectedKaryawan;
    this.dataSelectKaryawan = [];
    this.KaryawanService.getById(this.HrmsPengajuanCuti.karyawan_id).subscribe(x => {
      this.dataSelectKaryawan = [];
      let d = x['data'];
      this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama + " - " + d.nip });
      this.entryForm.get('karyawan_id').patchValue({ "id": d.id, "text": d.nama + " - " + d.nip });
    });

    this.KaryawanService.getAllAktif().subscribe(x=>{
      this.dataSelectKaryawan=[];
      x['data'].forEach(d => {
        this.dataSelectKaryawan.push({"id":d.id,"text":d.nama});
        if (this.HrmsPengajuanCuti.karyawan_id == d.id) {
          selectedKaryawan = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('karyawan_id').patchValue(selectedKaryawan);
    });

    let selectedJenisAbsensi;
    this.HrmsJenisAbsensiService.getAll().subscribe(x=>{
      this.dataSelectJenisAbsensi=[];
      x['data'].forEach(d => {
        this.dataSelectJenisAbsensi.push({"id":d.id,"text":"("+d.kode+") "+d.keterangan});
        if (this.HrmsPengajuanCuti.jenis_absensi_id == d.id) {
          selectedJenisAbsensi = {"id":d.id,"text":"("+d.kode+") "+d.keterangan};
        }
      });
      this.entryForm.get('jenis_absensi_id').patchValue(selectedJenisAbsensi);
    });

    // this.dataSelectKode = [
    //   { id: 'PO1', text: 'PO1' },
    //   { id: 'PO2', text: 'PO2' },
    //   { id: 'PO3', text: 'PO3' },
    //   { id: 'PO4', text: 'PO4' },
    //   { id: 'PO5', text: 'PO5' },
    //   { id: 'PO6', text: 'PO6' },
    // ];
    // let selectedKode;
    // this.dataSelectKode.forEach(d => {
    //   if (this.HrmsPengajuanCuti.kode == d.id) {
    //     selectedKode = { "id": d.id, "text": d.text }
    //   }
    // });
    // this.entryForm.get('kode_id').patchValue(selectedKode);

    // let selectedSimbol;
    // this.dataSelectSimbol.forEach(d => {
    //   if (this.HrmsPengajuanCuti.simbol == d.id) {
    //     selectedSimbol = d;
    //   }
    // });
    // this.entryForm.get("simbol").patchValue(selectedSimbol);

  }

  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };
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
     console.log(this.entryForm.value);

    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }

    // this.entryForm.get('details').value.forEach(x => {
    //   if (!isNumber(x.total)) {
    //     x.total = parseFloat(x.total.replace(/[^\d\.\-]/g, ""));
    //   }
    // });
    let frmData = this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    frmData['dari_tanggal'] = formatDate(this.entryForm.get('dari_tanggal').value, "yyyy-MM-dd", 'en_US');
    frmData['sampai_tanggal'] = formatDate(this.entryForm.get('sampai_tanggal').value, "yyyy-MM-dd", 'en_US');
    // frmData['sub_total'] = parseFloat(this.entryForm.get('sub_total').value.replace(/[^\d\.\-]/g, ""));
    // frmData['diskon'] = parseFloat(this.entryForm.get('diskon').value.replace(/[^\d\.\-]/g, ""));
    // frmData['biaya_kirim'] = parseFloat(this.entryForm.get('biaya_kirim').value.replace(/[^\d\.\-]/g, ""));
    // frmData['biaya_lain'] = parseFloat(this.entryForm.get('biaya_lain').value.replace(/[^\d\.\-]/g, ""));
    // frmData['grand_total'] = parseFloat(this.entryForm.get('grand_total').value.replace(/[^\d\.\-]/g, ""));
    // frmData['pph_nilai']=parseFloat(this.entryForm.get('pph_show').value.replace(/[^\d\.\-]/g, ""));
    // let quotation_id;
    // if (!isNullOrUndefined(this.entryForm.controls['quotation_id'].value)) {
    //   if (isNullOrUndefined(this.entryForm.controls['quotation_id'].value['id'])) {
    //     quotation_id = null
    //   } else {
    //     quotation_id = this.entryForm.controls['quotation_id'].value['id']
    //   }
    // } else {
    //   quotation_id = null
    // }
    // frmData['quotation_id'] = quotation_id;
    this.HrmsPengajuanCutiService.update(this.HrmsPengajuanCuti.id, frmData).subscribe(data => {
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
    pphPercent = Math.round(pphPercent * 100) / 100;
    this.entryForm.get('pph').patchValue(pphPercent);

    this.totalGrand();
  }

    upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.entryForm.patchValue({
      file: file
    });
    this.entryForm.get('file').updateValueAndValidity();
    this.isChangePhoto = true;
    console.log(this.entryForm);
  }
}
