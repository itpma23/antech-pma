import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { Pengajar } from 'src/app/shared/models/pengajar.model';
import { formatDate } from '@angular/common';
import * as QuillNamespace from 'quill';
let Quill: any = QuillNamespace;
import ImageResize from 'quill-image-resize-module';
import { TranslateService } from '@ngx-translate/core';
import { Akun } from 'src/app/shared/models/akun.model';

import { PksTimbanganCustomer } from 'src/app/shared/models/pks_timbangan_customer.model';
import { PksTimbanganCustomerService } from 'src/app/shared/services/pks_timbangan_customer.service';

import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmCustomerService } from 'src/app/shared/services/gbm_customer.service';


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

  dataSelectTipe;
  dataSelectMill;
  dataSelectEstate;
  dataSelectItem;
  dataSelectCustomer;

  jenis_kelamin = '';
  tipes: Tipe[] = [
    { value: '0', viewValue: 'KAS' },
    { value: '1', viewValue: 'Bank' },
    { value: '2', viewValue: 'Piutang' }
  ];
  constructor(
    private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private PksTimbanganCustomerService: PksTimbanganCustomerService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private invItemService:InvItemService,
    private GbmCustomerService:GbmCustomerService,

    private translate: TranslateService
  ) {
    let toDate: Date = new Date();
    let time: Date = new Date();

    this.entryForm = this.builder.group({
      
      mill_id: new FormControl([], Validators.required),
      item_id: new FormControl([], Validators.required),
      estate_id: new FormControl([], Validators.required),
      customer_id: new FormControl([], Validators.required),
      
      tipe: new FormControl([], Validators.required),
      tanggal: new FormControl(toDate, Validators.required),

      no_tiket: new FormControl(null, Validators.required),
      no_referensi: new FormControl(null, Validators.required),
      no_kendaraan: new FormControl(null, Validators.required),
      nama_supir: new FormControl(null, Validators.required),
      
      jam_masuk: new FormControl(time, Validators.required),
      jam_keluar: new FormControl(time, Validators.required),
      
      jumlah_item: new FormControl(0, Validators.required),
      jumlah_berondolan: new FormControl(0, Validators.required),
      
      tara_kirim: new FormControl(0, Validators.required),
      bruto_kirim: new FormControl(0, Validators.required),
      netto_kirim: new FormControl(0, Validators.required),
      
      keterangan: new FormControl(null, Validators.required),
      
    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    this.loadSelect2();
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

    this.dataSelectTipe = [
      { id: 'INT', text: 'INTERNAL' },
      { id: 'EXT', text: 'EXTERNAL' },
      { id: 'AFL', text: 'AFILIASI' },
    ];

    this.GbmOrganisasiService.getAllByType('MILL').subscribe(x=>{
      this.dataSelectMill=[];
      x.forEach(d => {
        this.dataSelectMill.push({"id":d.id,"text":d.nama});
      });
    });

    this.GbmOrganisasiService.getAllByType('ESTATE').subscribe(x=>{
      this.dataSelectEstate=[];
      x.forEach(d => {
        this.dataSelectEstate.push({"id":d.id,"text":d.nama});
      });
    });

    this.invItemService.getAll().subscribe(x=>{
      this.dataSelectItem=[];
      x['data'].forEach(d => {
        this.dataSelectItem.push({"id":d.id,"text":d.nama});
      });
    });

    this.GbmCustomerService.getAll().subscribe(x=>{
      console.log(x);
      this.dataSelectCustomer=[];
      x['data'].forEach(d => {
        this.dataSelectCustomer.push({"id":d.id,"text":d.nama_customer});
      });
    });

  }
  onSubmit() {
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    
    let frmData = this.entryForm.value;
    frmData['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');
    frmData['jam_masuk']=formatDate(this.entryForm.get('jam_masuk').value, "HH:mm", "en_US");
    frmData['jam_keluar']=formatDate(this.entryForm.get('jam_keluar').value, "HH:mm", "en_US");

    // console.log(frmData);
    this.PksTimbanganCustomerService.create(frmData).subscribe(data => {
      if (data['status'] == 'OK') {
        this.event.emit('OK');
        this.bsModalRef.hide();
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
}
