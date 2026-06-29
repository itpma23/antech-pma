import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { EstDendaPanenService } from 'src/app/shared/services/est_denda_panen.service';

import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { EstKodeDendaPanenService } from 'src/app/shared/services/est_kode_denda_panen.service';
import { EstDendaPanen } from 'src/app/shared/models/est_denda_panen.model';
import { GbmOrganisasi } from 'src/app/shared/models/gbm_organisasi.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';


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
  dataSelectSatuan;
  event: EventEmitter<any> = new EventEmitter();
  dataSelectKodeDendaPanen: any[];
  dataSelectEstate: any[];

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private estDendaPanenService: EstDendaPanenService,
    private estKodeDendaPanenService: EstKodeDendaPanenService,
    private gbmOrganisasiService:GbmOrganisasiService,
    private translate: TranslateService
  ) {
    let toDate: Date = new Date();
    this.entryForm = this.builder.group({
     lokasi_id: new FormControl([], Validators.required),
      tanggal_efektif: new FormControl(toDate, Validators.required),
      nilai: new FormControl(0, Validators.required),
      kode_denda_panen_id: new FormControl([], Validators.required),
      tipe: new FormControl([], Validators.required),


    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    this.loadSelect2();
  }
  public dataSelect: any[] = [];
  public options: any;

  private loadSelect2(): void {

    this.estKodeDendaPanenService.getAll().subscribe(x => {
      this.dataSelectKodeDendaPanen = [];
     let data=x['data'];
      data.forEach(d => {
        this.dataSelectKodeDendaPanen.push({ "id": d.id, "text": d.nama });

      });

    });
    this.gbmOrganisasiService.getAllByType('Estate').subscribe(x=>{

      this.dataSelectEstate=[];
      x.forEach(d => {
        this.dataSelectEstate.push({"id":d.id,"text":d.nama});
      });

    });



  }

  onSubmit() {
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let frmData = new FormData();

    let dataSubmit :EstDendaPanen = {
      'tipe': this.entryForm.get('tipe').value,
      'kode_denda_panen_id': this.entryForm.get('kode_denda_panen_id').value['id'],
      'lokasi_id': this.entryForm.get('lokasi_id').value['id'],
      'nilai': this.entryForm.get('nilai').value,
      'tanggal_efektif':formatDate(this.entryForm.get('tanggal_efektif').value, "yyyy-MM-dd", 'en_US')



    };
    console.log(dataSubmit);
    this.estDendaPanenService.create(dataSubmit).subscribe(data => {

      if (data['status'] == 'OK') {
        console.log('ok');
        this.event.emit('OK');
        this.bsModalRef.hide();
      }
    });
  }


  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {



  }
  valueChange($event) {
    console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
}
