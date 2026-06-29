import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { Pengajar } from 'src/app/shared/models/pengajar.model';
import { formatDate } from '@angular/common';
import * as QuillNamespace from 'quill';
let Quill: any = QuillNamespace;
import ImageResize from 'quill-image-resize-module';
import { TranslateService } from '@ngx-translate/core';
import { Akun } from 'src/app/shared/models/akun.model';
import { InvKategoriService } from 'src/app/shared/services/inv_kategori.service';
import { InvItem } from 'src/app/shared/models/inv_item.model';
import { HrmsKomponenGaji } from 'src/app/shared/models/hrms_komponen_gaji.model';
import { HrmsKomponenGajiService } from 'src/app/shared/services/hrms_komponen_gaji.service';
Quill.register('modules/imageResize', ImageResize);
declare var swal: any;
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
  dataSelectKategori;
  event: EventEmitter<any> = new EventEmitter();

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private hrmsKomponenGajiService: HrmsKomponenGajiService,
    private translate: TranslateService
  ) {

    this.entryForm = this.builder.group({
      nama: new FormControl(null, Validators.required),
      jenis: new FormControl('1', Validators.required),
      urut: new FormControl(null, Validators.required)


    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    this.loadSelect2();
  }
  public dataSelectJenis: any[] = [
    { "id": '0', "text":'Pendapatan' },
    { "id": '1', "text": 'Potongan' }
  ];
  public options: any;

  private loadSelect2(): void {


    // this.invKategoriService.getAll().subscribe(x => {
    //   this.dataSelectKategori = [];
    //  let data=x['data'];
    //   data.forEach(d => {
    //     this.dataSelectKategori.push({ "id": d.id, "text": d.nama });

    //   });

    // });

  }

  onSubmit() {
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let frmData = new FormData();

    let dataSubmit :HrmsKomponenGaji = {

      'nama': this.entryForm.get('nama').value,
      'jenis': this.entryForm.get('jenis').value,
      'urut': this.entryForm.get('urut').value


    };

    this.hrmsKomponenGajiService.create(dataSubmit).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Save!',
          text: 'Data has been Saved successfully.',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
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
