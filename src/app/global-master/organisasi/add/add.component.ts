import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { formatDate } from '@angular/common';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { GbmOrganisasi } from 'src/app/shared/models/gbm_organisasi.model';

declare var $: any;
declare var swal: any;
@Component({
    moduleId: module.id,
    selector: 'add-cmp',
    templateUrl: 'add.component.html',
    styleUrls: ['add.component.css'],
})

export class AddComponent implements OnInit,AfterViewInit{
  isFormSubmitted=false;
	datepickerConfig = {
		dateInputFormat: 'DD-MM-YYYY',
		containerClass: 'theme-red'
	}
  entryForm: FormGroup;
  dataSelectTipe: any[] = [];
  event: EventEmitter<any>=new EventEmitter();

  public options: any;
  parent=null;
  dataSelectAfdeling: any[];


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private GbmOrganisasiService:GbmOrganisasiService,

    ) {
    this.entryForm = this.builder.group({

      kode: new FormControl('', Validators.required),
      nama: new FormControl('', Validators.required),
      afdeling_id: new FormControl([]),
      is_child: new FormControl('0', Validators.required),
      sort_order: new FormControl(1, []),
      tipe: new FormControl([], Validators.required),



    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

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
    ].sort( (a,b) => a.id.localeCompare(b.id) );

    this.GbmOrganisasiService.getAllByType('AFDELING').subscribe(x => {
      this.dataSelectAfdeling = [];
      x.forEach(d => {
        this.dataSelectAfdeling.push({ "id": d.id, "text": d.nama });

      });

    });
  }
  onSubmit(){
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let afdeling_id = this.entryForm.get('afdeling_id').value == null ? null : this.entryForm.get('afdeling_id').value['id'];
    if ( this.entryForm.get('tipe').value.id !='GUDANG_VIRTUAL'){
      afdeling_id=null;
    }
    let dataSubmit :GbmOrganisasi = {
      'kode': this.entryForm.get('kode').value,
      'parent_id':this.parent,
      'nama':this.entryForm.get('nama').value,
      'tipe':this.entryForm.get('tipe').value.id,
      'afdeling_id':  afdeling_id,
      'icon':'',
      'is_child':false,
      'sort_order': 1//this.entryForm.get('sort_order').value

    };
    this.GbmOrganisasiService.create(dataSubmit).subscribe(data=>{
      console.log(data);
      if( data['status']=='OK'){
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
  onClose(){
    this.bsModalRef.hide();
  }

  ngOnInit() {

    this.loadSelect2();

   }
  valueChange($event){
    console.log($event);
  }
}
