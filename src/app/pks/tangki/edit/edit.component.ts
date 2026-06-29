import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { PksTankiService } from 'src/app/shared/services/pks_tanki.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { PksTanki } from 'src/app/shared/models/pks_tanki.model';
import { InvItemService } from 'src/app/shared/services/inv_item.service';

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

pengolahan:PksTanki;
dataSelectDivisi;
dataSelectBlok;
dataSelectMill;
dataSelectMesin;
dataSelectItem;

constructor(private builder: FormBuilder,
  private bsModalRef: BsModalRef,
  private pksPengolahanService: PksTankiService,
  private gbmOrganisasiService:GbmOrganisasiService,
  private InvItemService: InvItemService,

  private translate: TranslateService,
) {
  let toDate: Date = new Date();
  let time: Date = new Date();

  this.entryForm = this.builder.group({
    // divisi_id: new FormControl([], Validators.required),
      kode_tanki: new FormControl(''),
      nama_tanki: new FormControl(''),
      mill_id: new FormControl([], Validators.required),
      produk_id: new FormControl([], Validators.required),
      meja_ukur: new FormControl(0, ),
      // tinggi_meja_ukur: new FormControl(0, ),
      kapasitas: new FormControl(0, Validators.required ),
    
    details: this.builder.array([]),


  });
}
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    let date: Date = new Date();
    let strDate = formatDate(date, "yyyy-MM-dd", "en_US");

    this.entryForm.get('nama_tanki').patchValue(this.pengolahan.nama_tanki);
    this.entryForm.get('kode_tanki').patchValue(this.pengolahan.kode_tanki);
    this.entryForm.get('kapasitas').patchValue(this.pengolahan.kapasitas);
    this.entryForm.get('meja_ukur').patchValue(this.pengolahan.meja_ukur);
    // this.entryForm.get('tinggi_meja_ukur').patchValue(this.pengolahan.tinggi_meja_ukur);
  }
  public options: any;

  private loadSelect2(): void {
    

    let selectMill;
    this.gbmOrganisasiService.getAllByType('MILL').subscribe(x=>{
      this.dataSelectMill=[];
      x.forEach(d => {
        this.dataSelectMill.push({"id":d.id,"text":d.nama});
        if (this.pengolahan.mill_id == d.id) {
          selectMill = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('mill_id').patchValue(selectMill);

      
      console.log(x);


      let dtl = [];
      dtl = this.pengolahan.detail;
      for (let index = 0; index < dtl.length; index++) {
        const d = dtl[index];
        this.addBlok(  d['volume'], d['tinggi_dari'], d['tinggi_sd']);
      }
    });

    let selectProduk;
    this.InvItemService.getAll().subscribe(x=>{
      this.dataSelectItem=[];
      x['data'].forEach(d => {
        this.dataSelectItem.push({"id":d.id,"text":d.nama});
        if (this.pengolahan.produk_id == d.id) {
          selectProduk = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('produk_id').patchValue(selectProduk);
    });


  }
  onSubmit() {
   
    
    this.isFormSubmitted = true;

    if (this.entryForm.invalid) {
      return;
    }

    let frmData = this.entryForm.value;
    

    // // console.log(frmData);
    this.pksPengolahanService.update(this.pengolahan.id,frmData).subscribe(data => {
      // console.log(data);
      if( data['status']=='OK'){
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

  addBlokNew() {
    this.details.push(this.builder.group({
      volume: new FormControl('', Validators.required),
      tinggi_dari: new FormControl('', Validators.required),
      tinggi_sd: new FormControl('', Validators.required),
    }));
  }

 
  addBlok(volume ,tinggi_dari,tinggi_sd ) {
   
    let fb = this.builder.group({

      // cal: new FormControl(cal),
      // suhu: new FormControl(suhu),
      volume: new FormControl(volume),
      tinggi_dari: new FormControl(tinggi_dari),
      tinggi_sd: new FormControl(tinggi_sd),
      
    });

    this.details.push(fb);
  }

  


  removeBlok(item) {
    let i = this.details.controls.indexOf(item);
    if(i != -1) {
    // let x=	this.details.controls.splice(i, 1);
      let items = this.entryForm.get('details') as FormArray;
      items.removeAt(i);
    	let data = {details: items.value};
    	this.updateForm(data);
    }
  }
 



  updateForm(data) {
    // const items = data.details;
    // // console.log(items);
    // let sub = 0;
    // for(let i of items){
    //   sub=sub+ parseFloat( i.qty);

    // }
    // // console.log(sub);
  }
  recalculate(){
    // let items = this.entryForm.get('details') as FormArray;
    // let data = { details: items.value };
    // this.updateForm(data);
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
