import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate,formatNumber } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { AccPermohonanBayarService } from '../../../shared/services/acc_permohonan_bayar.service';
import { AccPermohonanBayar } from '../../../shared/models/acc_permohonan_bayar.model';
import { GbmSupplierService } from '../../../shared/services/gbm_supplier.service';
import { isNullOrUndefined, isNumber, isString } from 'util';

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

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private accPermohonanBayarService: AccPermohonanBayarService,
    private gbmSupplierService: GbmSupplierService,

    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();
    let time: Date = new Date();

    this.entryForm = this.builder.group({

      supplier: new FormControl('', ),
      txt_biaya_lain: new FormControl('Biaya Lain',),
      supplier_id: new FormControl([], ),
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
    
    this.totalGrand();
    this.totalSub();
  }
  public options: any;

  private loadSelect2(): void {
 

         

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
      this.entryForm.controls['supplier_id'].valueChanges.subscribe(x => {
        this.tampildataSupp();
      });
    });

                let dtl:any=[];
                dtl = this.accPermohonanBayar.detail;
                for (let index = 0; index < dtl.length; index++) {
                  const d = dtl[index];
                  this.addBlok( d.keterangan, d.qty, d.harga, d.jumlah,d.diskon_detail);
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
    let harga=0;
      
    let toDate: Date = new Date();
    this.details.push(this.builder.group({
        keterangan: new FormControl('', ),
        x_qty: new FormControl(0, ),
        qty: new FormControl(0, ),
        harga: new FormControl(harga, ),
        x_harga: new FormControl(harga, ),
        diskon: new FormControl(0, ),
        x_diskon: new FormControl(0, ),
        jumlah: new FormControl(0, ),
    }));
  }


  addBlok( keterangan,qty,harga,jumlah,diskon) {

  

  
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
  }
 
  totalHarga(form) {
    let qty = form.get('x_qty').value;
    if (isString(qty)) {
      qty = parseFloat(qty.replace(/[^\d\.\-]/g, ""));
    }
    form.get('x_qty').patchValue(formatNumber(qty, 'en_US', '1.2-2'));
    form.get('qty').patchValue(qty);

    let harga = form.get('x_harga').value;
    if (isString(harga)) {
      harga = parseFloat(harga.replace(/[^\d\.\-]/g, ""));
    }
    form.get('x_harga').patchValue(formatNumber(harga, 'en_US', '1.2-2'));
    form.get('harga').patchValue(harga);

    let diskon = form.get('x_diskon').value;
    if (isString(diskon)) {
      diskon = parseFloat(diskon.replace(/[^\d\.\-]/g, ""));
    }
    form.get('x_diskon').patchValue(formatNumber(diskon, 'en_US', '1.2-2'));
    form.get('diskon').patchValue(diskon);

    let total = (qty * harga)-diskon;

    form.get('jumlah').patchValue(formatNumber(total, 'en_US', '1.2-2'));

    this.totalSub();
    this.totalGrand();
    this.calc_pph();
  }

  totalSub() {
    let subTotal = 0;
    this.entryForm.get('details').value.forEach(x => {
      // console.log(x);
      if (isNumber(x.jumlah)) {
        subTotal += x.jumlah;
      } else {
        subTotal += parseFloat(x.jumlah.replace(/[^\d\.\-]/g, ""));
      }

    });
    this.entryForm.get('subtotal').patchValue(formatNumber(subTotal, 'en_US', '1.2-2'));
  }
  totalGrand() {
    let subTotal = this.entryForm.get('subtotal').value;
    subTotal = isNumber(subTotal) ? subTotal : parseFloat(subTotal.replace(/[^\d\.\-]/g, ""));

    let diskon = this.entryForm.get('diskon').value;
    diskon = isNumber(diskon) ? diskon : parseFloat(diskon.replace(/[^\d\.\-]/g, ""));

    let biaya_lain = this.entryForm.get('biaya_lain').value;
    biaya_lain = isNumber(biaya_lain) ? biaya_lain : parseFloat(biaya_lain.replace(/[^\d\.\-]/g, ""));

    // let dpp = this.entryForm.get('dpp').value;
    // dpp = isNumber(dpp) ? dpp : parseFloat(dpp.replace(/[^\d\.\-]/g, ""));
    let dpp= subTotal - diskon;

    let grandTotal = 0;
    let ppn = parseFloat(this.entryForm.get('ppn').value);
    let ppnTotal = 0;

    let ppnbm = parseFloat(this.entryForm.get('ppnbm').value);
    let ppnbmTotal = 0;


    let pph = parseFloat(this.entryForm.get('pph').value);
    let pphTotal = 0;
    if (!isNumber(pph)) {
      pph = 0;
      pphTotal=0;
    }else{
      pphTotal = (pph / 100) * (dpp);
     
    }
    if (!isNumber(ppn)) {
      ppn = 0;
      ppnTotal=0;
    }else{
      ppnTotal = (ppn / 100) * (dpp);
     
    }
    if (!isNumber(ppnbm)) {
      ppnbm = 0;
      ppnbmTotal=0;
    }else{
      ppnbmTotal = (ppnbm / 100) * (dpp);
     
    }
    // subTotal = subTotal - diskon;
   
 
    grandTotal = (dpp) + (ppnTotal+ppnbmTotal+biaya_lain - pphTotal);


    this.entryForm.get('diskon').patchValue(formatNumber(diskon, 'en_US', '1.2-2'));
    this.entryForm.get('biaya_lain').patchValue(formatNumber(biaya_lain, 'en_US', '1.2-2'));
    this.entryForm.get('dpp').patchValue(formatNumber(dpp, 'en_US', '1.2-2'));
   
    this.entryForm.get('pph').patchValue(formatNumber(pph, 'en_US', '1.2-2'));
    this.entryForm.get('ppn').patchValue(formatNumber(ppn, 'en_US', '1.2-2'));
    this.entryForm.get('ppnbm').patchValue(formatNumber(ppnbm, 'en_US', '1.2-2'));
    this.entryForm.get('pph_nilai').patchValue(formatNumber(pphTotal, 'en_US', '1.2-2'));
    this.entryForm.get('ppn_nilai').patchValue(formatNumber(ppnTotal, 'en_US', '1.2-2'));
    this.entryForm.get('ppnbm_nilai').patchValue(formatNumber(ppnbmTotal, 'en_US', '1.2-2'));

    this.entryForm.get('total').patchValue(formatNumber(grandTotal, 'en_US', '1.2-2'));
  }

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
      pphTotal=0;
    }else{
      pphTotal = (pph / 100) * parseFloat(subTotal);
     
    }
    if (!isNumber(ppn)) {
      ppn = 0;
      ppnTotal=0;
    }else{
      ppnTotal = (ppn / 100) * parseFloat(subTotal);
     
    }
    if (!isNumber(ppnbm)) {
      ppnbm = 0;
      ppnbmTotal=0;
    }else{
      ppnbmTotal = (ppnbm / 100) * parseFloat(subTotal);
     
    }
    subTotal = subTotal - diskon;
   
 
    grandTotal = parseFloat(subTotal) + (ppnTotal+ppnbmTotal+biaya_lain - pphTotal);
console.log('subtotal:'+subTotal)
console.log('ppnTotal:'+ppnTotal)
console.log('ppnbmTotal:'+ppnbmTotal)
console.log('biaya_lain:'+biaya_lain)
console.log('pphTotal:'+pphTotal)
console.log('grandTotal:'+grandTotal)
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

    if (isNumber(pph_show)){
      pphPercent = (pph_show / parseFloat(subTotal)) * 100;
    }else{
      pphPercent=0;
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
}
