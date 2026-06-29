import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { EstSpatService } from 'src/app/shared/services/est_spat.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';

declare var $: any;

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
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private EstSpatService: EstSpatService,
    private translate: TranslateService,
    private GbmOrganisasiService:GbmOrganisasiService
  ) {
    let toDate: Date = new Date();
    this.entryForm = this.builder.group({
      divisi_id: new FormControl([], Validators.required),
      keterangan: new FormControl('', ),
      tanggal: new FormControl(toDate, Validators.required),
      //tipe: new FormControl('0', Validators.required),
      no_spat: new FormControl('', Validators.required),

      details: this.builder.array([]),
     // subTotal:[{value: 0, disabled: true}],


    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

    this.addBlok();
  }
  public options: any;

  private loadSelect2(): void {

    this.GbmOrganisasiService.getAllByType('RAYON').subscribe(x=>{
      this.dataSelectDivisi=[];
      x.forEach(d => {
        this.dataSelectDivisi.push({"id":d.id,"text":d.nama});

      });

    });
    this.GbmOrganisasiService.getAllByType('BLOK').subscribe(x=>{
      this.dataSelectBlok=[];
      x.forEach(d => {
        this.dataSelectBlok.push({"id":d.id,"text":d.nama});

      });

    });
  }
  onSubmit() {

    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    console.log(this.entryForm.value);

    let frmData = this.entryForm.value;
    frmData['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US')

    this.EstSpatService.create(frmData).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        console.log('ok');
        this.event.emit('OK');
        this.bsModalRef.hide();
      }
    });
  }

  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };
  addBlok() {
    // this.details.push(this.builder.group(new InvoiceBlok()));

    this.details.push(this.builder.group({
      blok: new FormControl([], Validators.required),
      jumlah_janjang: new FormControl('0', Validators.required),
      jumlah_brondolan: new FormControl('0', Validators.required),
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
  recalculate(){
    let bloks = this.entryForm.get('details') as FormArray;
    let data = { details: bloks.value };
    this.updateForm(data);


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
}
