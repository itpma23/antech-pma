import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { InvItemService } from 'src/app/shared/services/inv_item.service';

import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { InvKategoriService } from 'src/app/shared/services/inv_kategori.service';
import { GbmUomService } from 'src/app/shared/services/gbm_uom.service';
import { InvItem } from 'src/app/shared/models/inv_item.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';


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
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  entryForm: FormGroup;
  dataSelectKategori;
  dataSelectSatuan;
  event: EventEmitter<any> = new EventEmitter();
  dataSelectJenisItem: { id: string; text: string; }[];
  keyword = 'nama';
  dataItem = [
    // {
    //   id: 1,
    //   name: 'Georgia'
    // },
    //  {
    //    id: 2,
    //    name: 'Usa'
    //  },
    //  {
    //    id: 3,
    //    name: 'England'
    //  }
  ];

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private invItemService: InvItemService,
    private invKategoriService: InvKategoriService,
    private gbmUomService: GbmUomService,
    private translate: TranslateService
  ) {

    this.entryForm = this.builder.group({
      kode: new FormControl(null, Validators.required),
      nama: new FormControl('', Validators.required),
      kategori_id: new FormControl([], Validators.required),
      uom_id: new FormControl([], Validators.required),
      min_stok: new FormControl(0, Validators.required),
      jenis_item: new FormControl([], Validators.required),
      aktif: new FormControl(1, Validators.required),


    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    this.loadSelect2();
  }
  public dataSelect: any[] = [];
  // public options: any;

  private loadSelect2(): void {
    this.dataSelectJenisItem = [
      { id: 'BARANG STOK', text: 'BARANG STOK' },
      { id: 'ASSET', text: 'ASSET' },
      { id: 'JASA', text: 'JASA' }
    ];
    this.gbmUomService.getAll().subscribe(x => {
      this.dataSelectSatuan = [];
      let data = x['data'];
      data.forEach(d => {
        this.dataSelectSatuan.push({ "id": d.id, "text": d.nama });

      });

    });


    this.invKategoriService.getAll().subscribe(x => {
      this.dataSelectKategori = [];
      let data = x['data'];
      data.forEach(d => {
        this.dataSelectKategori.push({ "id": d.id, "text": d.nama });

      });

    });

    this.invItemService.getAll().subscribe(x => {
      this.dataItem = [];
      let data = x['data'];
      data.forEach(d => {
        this.dataItem.push({ "id": d.id, "nama": d.nama });

      });

    });

  }

  onSubmit() {
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    // let frmData = new FormData();
    console.log(this.entryForm.value);

    let namaItemfrm = this.entryForm.get('nama').value;
    let namaItem;
    if (isNullOrUndefined(namaItemfrm) || namaItemfrm == "") {
      return
    }
    // if (Array.isArray(namaItemfrm)) {
    if (!isNullOrUndefined(namaItemfrm['nama'])) {
      namaItem = namaItemfrm['nama'];
    } else {
      namaItem = namaItemfrm;

    }

    let dataSubmit: InvItem = {
      'kode': this.entryForm.get('kode').value,
      'nama': namaItem,
      'uom_id': this.entryForm.get('uom_id').value['id'],
      'min_stok': this.entryForm.get('min_stok').value,
      'inv_kategori_id': this.entryForm.get('kategori_id').value['id'],
      'jenis_item': this.entryForm.get('jenis_item').value['id'],
      'aktif': this.entryForm.get('aktif').value
    };
    console.log(dataSubmit);
    this.invItemService.create(dataSubmit).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Simpan berhasil',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })

        this.event.emit('OK');
        this.bsModalRef.hide();
      } else {
        swal({
          title: 'Perhatian!',
          text: 'Proses Simpan Gagal: ' + data['data'],
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
    this.filteredOptions = this.entryForm.get('nama').valueChanges.pipe(
      startWith(''), map(value => this._filter(value || '')),
    );

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
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log(filterValue);
    let result = this.options.filter(option => option.toLowerCase().includes(filterValue));
    console.log(result);
    return result;
  }


  selectEvent(item) {
    // do something with selected item
    console.log('selectEvent');
    console.log(item);
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    console.log('onChangeSearch');
    console.log(val);
  }

  onFocused(e) {
    // do something when input is focused
  }
}
