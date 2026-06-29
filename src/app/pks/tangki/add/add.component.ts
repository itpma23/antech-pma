import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { PksTankiService } from 'src/app/shared/services/pks_tanki.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { PksShiftService } from 'src/app/shared/services/pks_shift.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';

declare var $: any;
declare var swal: any;

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

  event: EventEmitter<any> = new EventEmitter();


  dataSelectDivisi;
  dataSelectBlok;
  dataSelectMesin;
  dataSelectShift;
  dataSelectMandor;
  dataSelectAsisten;
  dataSelectItem;

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private PksPengolahanService: PksTankiService,
    private GbmOrganisasiService:GbmOrganisasiService,

    private InvItemService: InvItemService,

    private translate: TranslateService,
  ) {

    this.entryForm = this.builder.group({

      kode_tanki: new FormControl(''),
      nama_tanki: new FormControl(''),
      mill_id: new FormControl([], Validators.required),
      produk_id: new FormControl([], Validators.required),
      meja_ukur: new FormControl(0, Validators.required ),
      // tinggi_meja_ukur: new FormControl(0, Validators.required ),
      kapasitas: new FormControl(0, Validators.required ),


      details: this.builder.array([])

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
  
  }
  public options: any;

  private loadSelect2(): void {

    this.GbmOrganisasiService.getAllByType('MILL').subscribe(x=>{
      this.dataSelectDivisi=[];
      x.forEach(d => {
        this.dataSelectDivisi.push({"id":d.id,"text":d.nama});
      });
    });

    this.InvItemService.getAll().subscribe(x=>{
      this.dataSelectItem=[];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectItem.push({"id":d.id,"text":d.nama});
      });
    });

  }
  onSubmit() {
    this.isFormSubmitted = true;
    
    if (this.entryForm.invalid) {
      return;
    }


    let frmData = this.entryForm.value;
   
    
    // // console.log(frmData);
    this.PksPengolahanService.create(frmData).subscribe(data => {
      // console.log(data);
      if( data['status']=='OK'){
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

  
  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };


  addBlokItem() {
    this.details.push(this.builder.group({
      volume: new FormControl('', Validators.required),
      tinggi_dari: new FormControl('', Validators.required),
      tinggi_sd: new FormControl('', Validators.required),
    }));
  }

  
  removeBlokItem( blok ) {
    let i = this.details.controls.indexOf(blok);
    if(i != -1) {
      let detail = this.entryForm.get('details') as FormArray;
      detail.removeAt(i);
      let data = {details: detail.value};
      this.updateForm(data);
    }
  }


  updateForm(data) {

  }
  recalculate(){


  }
  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();


  }
  valueChange($event) {

  }
}
