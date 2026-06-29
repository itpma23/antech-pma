import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";
import { formatDate } from '@angular/common';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { GbmOrganisasi } from 'src/app/shared/models/gbm_organisasi.model';
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'edit-cmp',
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
  event: EventEmitter<any> = new EventEmitter();
  GbmOrganisasi: GbmOrganisasi;
  public dataSelect: any[] = [];
  public dataSelectTipe: any[] = [];
  public dataSelectOrganisasi: any[] = [];
  dataSelectAfdeling: any[];

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private GbmOrganisasiService: GbmOrganisasiService
  ) {
    this.entryForm = this.builder.group({

      kode: new FormControl('', Validators.required),
      nama: new FormControl('', Validators.required),
      tipe: new FormControl([], Validators.required),
      afdeling_id: new FormControl([]),
      is_child: new FormControl('0', Validators.required),
      sort_order: new FormControl(1, []),
      parent_id: new FormControl([]),

    });


  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    // console.log(this.GbmOrganisasi);
    this.entryForm.controls['kode'].patchValue(this.GbmOrganisasi.kode);
    this.entryForm.controls['nama'].patchValue(this.GbmOrganisasi.nama);
    //  this.entryForm.controls['url'].patchValue(this.GbmOrganisasi.tipe);
    // this.entryForm.controls['is_child'].patchValue(this.GbmOrganisasi.is_child);
    //  this.entryForm.controls['icon'].patchValue(this.GbmOrganisasi.icon);
    //  this.entryForm.controls['sort_order'].patchValue(this.GbmOrganisasi.sort_order);


  }

  private loadSelect2(): void {
    this.dataSelectTipe = [
      { id: 'PT', text: 'PT' },
      { id: 'HOLDING', text: 'HOLDING' },
      { id: 'HO', text: 'HEAD OFFICE' },
      { id: 'RO', text: 'REGIONAL OFFICE' },
      { id: 'ESTATE', text: 'ESTATE' },
      { id: 'MILL', text: 'MILL' },
      { id: 'AFDELING', text: 'AFDELING' },
      { id: 'UMUM', text: 'KANTOR/UMUM' },
      { id: 'DIVISI', text: 'DIVISI' },
      { id: 'TRAKSI', text: 'TRAKSI' },
      { id: 'WORKSHOP', text: 'WORKSHOP' },
      { id: 'GUDANG', text: 'GUDANG' },
      { id: 'GUDANG_VIRTUAL', text: 'GUDANG_VIRTUAL' },
      { id: 'BLOK', text: 'BLOK' },
      { id: 'MESIN', text: 'MESIN' },
      { id: 'STASIUN', text: 'STASIUN' },
      { id: 'RAYON', text: 'RAYON' }
    ].sort((a, b) => a.id.localeCompare(b.id));

    let selectTipe;
    this.dataSelectTipe.forEach(a => {
      if (a.id == this.GbmOrganisasi.tipe) {
        selectTipe = a;
      }

    });
    this.entryForm.controls['tipe'].patchValue(selectTipe);
    let menuParent;
    this.GbmOrganisasiService.getAllParent().subscribe(x => {
      this.dataSelectOrganisasi = [];
      x.forEach(d => {
        this.dataSelectOrganisasi.push({ "id": d.id, "text": d.nama });
        if (d.id == this.GbmOrganisasi.parent_id && this.GbmOrganisasi.parent_id != 0) {
          menuParent = { "id": d.id, "text": d.nama }

        }
      });
      // console.log(this.GbmOrganisasi.parent_id);
      // console.log(menuParent);
      if (menuParent != null) this.entryForm.controls['parent_id'].patchValue(menuParent);

    });
    let selectedAfdeling;
    this.GbmOrganisasiService.getAllByType('AFDELING').subscribe(x => {
      this.dataSelectAfdeling = [];
      x.forEach(d => {
        this.dataSelectAfdeling.push({ "id": d.id, "text": d.nama });
        if (d.id == this.GbmOrganisasi.afdeling_id) {
          selectedAfdeling = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.controls['afdeling_id'].patchValue(selectedAfdeling);

    });

  }
  onSubmit() {
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }
    let parent_id = this.entryForm.get('parent_id').value == null ? 0 : this.entryForm.get('parent_id').value['id'];
    let afdeling_id = this.entryForm.get('afdeling_id').value == null ? null : this.entryForm.get('afdeling_id').value['id'];
    if (this.entryForm.get('tipe').value.id != 'GUDANG_VIRTUAL') {
      afdeling_id = null;
    }
    let dataSubmit: GbmOrganisasi = {
      'kode': this.entryForm.get('kode').value,
      'parent_id': parent_id,
      'nama': this.entryForm.get('nama').value,
      'tipe': this.entryForm.get('tipe').value.id,
      'afdeling_id': afdeling_id,
      'icon': '',//this.entryForm.get('icon').value,
      'is_child': false,
      'sort_order': 1

    };
    console.log(dataSubmit);

    this.GbmOrganisasiService.update(this.GbmOrganisasi.id, dataSubmit).subscribe(data => {
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


  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {

    this.loadSelect2();

  }
  valueChange($event) {
    console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.entryForm.patchValue({
      img: file
    });
    this.entryForm.get('img').updateValueAndValidity();
    this.isChangePhoto = true;
    console.log(this.isChangePhoto);
  }
}
