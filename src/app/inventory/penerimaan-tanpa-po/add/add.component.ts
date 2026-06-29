import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { PksTankiService } from 'src/app/shared/services/pks_tanki.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { InvPenerimaanTanpaPoService } from 'src/app/shared/services/inv_penerimaan_tanpa_po.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { Pengajar } from 'src/app/shared/models/pengajar.model';
import { formatDate, formatNumber } from '@angular/common';
import * as QuillNamespace from 'quill';
let Quill: any = QuillNamespace;
import ImageResize from 'quill-image-resize-module';
import { TranslateService } from '@ngx-translate/core';
import { Akun } from 'src/app/shared/models/akun.model';
import { InvPenerimaanTanpaPo } from 'src/app/shared/models/inv_penerimaan_tanpa_po.model';

import { isNullOrUndefined, isNumber, isString } from 'util';

declare var swal: any;

Quill.register('modules/imageResize', ImageResize);

declare var $: any;
interface Tipe {
  value: string;
  viewValue: string;
}
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
  categories: any[] = [];
  event: EventEmitter<any> = new EventEmitter();

  dataSelectTanki;
  dataSelectSimbol;
  dataSelectLokasi;
  dataSelectGudang;
  dataSelectSupplier;
  dataSelectKode;
  dataSelectKaryawan;
  dataSelectItem;

  dataItem;
  uom;

  jenis_kelamin = '';
  tipes: Tipe[] = [
    { value: '0', viewValue: 'KAS' },
    { value: '1', viewValue: 'Bank' },
    { value: '2', viewValue: 'Piutang' }
  ];
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private InvPenerimaanTanpaPoService: InvPenerimaanTanpaPoService,
    private translate: TranslateService,
    private PksTankiService: PksTankiService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private GbmSupplierService: GbmSupplierService,
    private KaryawanService: KaryawanService,
    private InvItemService: InvItemService,
  ) {
    let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      no_transaksi: new FormControl('(AutoNumber)'),
      
      lokasi_id: new FormControl([], Validators.required),
      gudang_id: new FormControl([], Validators.required),
      supplier_id: new FormControl([], Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      no_ref: new FormControl('', Validators.required),
      catatan: new FormControl('', Validators.required),

      details: this.builder.array([]),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    this.loadSelect2();
    this.addBlok();

  }
  public dataSelect: any[] = [];
  public options: any;

  private loadSelect2(): void {
    let m = this.translate.instant('holidays.messages.update');

    this.dataSelect = [
      { id: 'Laki-laki', text: 'Laki-laki' },
      { id: 'Perempuan', text: 'Perempuan' },
    ];
    this.dataSelect.unshift({ id: -1, text: 'Pilih' });

    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
      
      this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {
        
        let gd_id = x.id;
        console.log(x)
        this.GbmOrganisasiService.getGudangByUnit(gd_id).subscribe(x => {
          console.log(x)
          this.dataSelectGudang = [];
          x.forEach(d => {
            this.dataSelectGudang.push({ "id": d.id, "text": d.nama });
          });
          this.entryForm.controls['gudang_id'].valueChanges.subscribe(x => {
            
          });
        });

      });
    });

    this.GbmSupplierService.getAll().subscribe(x=>{
      this.dataSelectSupplier=[];
      x['data'].forEach(d => {
        this.dataSelectSupplier.push({"id":d.id,"text":d.nama_supplier});
      });
    });

    // this.KaryawanService.getAll().subscribe(x=>{
    //   this.dataSelectKaryawan=[];
    //   x['data'].forEach(d => {
    //     this.dataSelectKaryawan.push({"id":d.id,"text":d.nama});
    //   });
    // });

    this.InvItemService.getAll().subscribe(x=>{
      this.dataSelectItem=[];
      console.log(x['data']);
      this.dataItem = x['data'];
      x['data'].forEach(d => {
        this.dataSelectItem.push({"id":d.id,"text":d.kode+' - '+d.nama+"("+ d.uom +")" });
      });
    });

    this.dataSelectKode = [
      { id: 'PP1', text: 'PP1' },
      { id: 'PP2', text: 'PP2' },
      { id: 'PP3', text: 'PP3' },
      { id: 'PP4', text: 'PP4' },
      { id: 'PP5', text: 'PP5' },
      { id: 'PP6', text: 'PP6' },
    ];


  }
  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };
  addBlok() {
    // this.details.push(this.builder.group(new InvoiceBlok()));

    this.details.push(this.builder.group({
      item: new FormControl([], Validators.required),
      uom: new FormControl(''),
      qty: new FormControl(0, Validators.required),
      harga: new FormControl(0, Validators.required),
      total: new FormControl(0, Validators.required),
      ket: new FormControl('', Validators.required),
    }));
  }
  removeBlok(Blok) {
    let i = this.details.controls.indexOf(Blok);

    if(i != -1) {
    //  let x=	this.details.controls.splice(i, 1);
      let bloks = this.entryForm.get('details') as FormArray;
      bloks.removeAt(i);
    	let data = {details: bloks.value};
    	this.updateForm(data);
    }
  }
  updateForm(data) {
    const bloks = data.details;
    let sub = 0;
    for(let i of bloks){
      sub=sub+ parseFloat( i.jumlah_janjang);
    }
    console.log(sub);
    //this.entryForm.get('total').patchValue( sub);
  }
  onSubmit() {
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    let frmData = this.entryForm.value;
    frmData['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');
    this.entryForm.get('details').value.forEach(x => {
      if (!isNumber(x.qty)){
        x.qty= parseFloat(x.qty.replace(/[^\d\.\-]/g, ""));
      }
      if (!isNumber(x.harga)){
        x.harga= parseFloat(x.harga.replace(/[^\d\.\-]/g, ""));
      }
      if (!isNumber(x.total)){
       x.total= parseFloat(x.total.replace(/[^\d\.\-]/g, ""));
      }
    });

    this.InvPenerimaanTanpaPoService.create(frmData).subscribe(data => {
      if( data['status']=='OK'){
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Data berhasil disimpan dengan Nomor:'+data['data'],
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })

        this.event.emit('OK');
        this.bsModalRef.hide();
      }else{
        swal({
          title: 'Perhatian!',
          text: 'Proses Simpan Gagal' ,
          type: 'warning',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
      }
    });
  }

  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.entryForm.patchValue({
      img: file
    });
    this.entryForm.get('img').updateValueAndValidity()
    console.log(file);
  }
  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {

    this.editor_modules = {
      toolbar: {
        container: [
          [{ 'font': [] }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'header': 1 }, { 'header': 2 }],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'align': [] }],
          ['link', 'image']
        ]
      },

      imageResize: true
    };

  }
  valueChange($event) {
    console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }

  cekHarga(form) {
    this.dataItem.forEach(x => {
      if (x.id == form.get('item').value.id) {
        form.get('uom').patchValue(x.uom);
      }
    });
  }

  totalHarga(form) {
    let qty = form.get('qty').value;
    if (isString(qty)) {
      qty = parseFloat(qty.replace(/[^\d\.\-]/g, ""));
    }
    form.get('qty').patchValue(formatNumber(qty, 'en_US', '1.2-2'));

    let harga = form.get('harga').value;
    if (isString(harga)) {
      harga = parseFloat(harga.replace(/[^\d\.\-]/g, ""));
    }
    form.get('harga').patchValue(formatNumber(harga, 'en_US', '1.2-2'));
    
    let total = qty * harga;
    // form.get('total').patchValue(total);
    form.get('total').patchValue(formatNumber(total, 'en_US', '1.2-2'));

  }
}
