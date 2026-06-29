import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate, formatNumber } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { EstRekapPanenService } from 'src/app/shared/services/est_rekap_panen.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { EstBjrService } from 'src/app/shared/services/est_bjr.service';

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
  dataSelectRayon;
  dataSelectBlok;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private estRekapPanenService: EstRekapPanenService,
    private translate: TranslateService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private estBjrService: EstBjrService,
  ) {
    let toDate: Date = new Date();
    this.entryForm = this.builder.group({
      // divisi_id: new FormControl([], Validators.required),
      divisi_id: new FormControl([], Validators.required),
      keterangan: new FormControl('',),
      tanggal: new FormControl(toDate, Validators.required),
      //tipe: new FormControl('0', Validators.required),
      // no_rekap_panen: new FormControl('', Validators.required),

      details: this.builder.array([]),
      total_jjg: new FormControl(0),
      total_brondolan: new FormControl(0),
      total_kg: new FormControl(0),
      total_luas: new FormControl(0),
      total_hk: new FormControl(0),
      // subTotal:[{value: 0, disabled: true}],


    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

    this.addBlok();
  }
  public options: any;

  private loadSelect2(): void {

    this.GbmOrganisasiService.getAllByType('AFDELING').subscribe(x => {
      this.dataSelectDivisi = [];
      x.forEach(d => {
        this.dataSelectDivisi.push({ "id": d.id, "text": d.nama });
      });
    });
    this.GbmOrganisasiService.getAllByType('RAYON').subscribe(x => {
      this.dataSelectRayon = [];
      x.forEach(d => {
        this.dataSelectRayon.push({ "id": d.id, "text": d.nama });
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
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US')

    this.estRekapPanenService.create(frmData).subscribe(data => {
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
      bjr: new FormControl('0'),
      jumlah_janjang: new FormControl('0', Validators.required),
      jumlah_hk: new FormControl('0', Validators.required),
      luas_panen: new FormControl('0', Validators.required),
      jumlah_kg: new FormControl('0'),
      jum_brondolan: new FormControl('0'),
    }));

  }

  removeBlok(Blok) {

    let i = this.details.controls.indexOf(Blok);

    if (i != -1) {
      //  let x=	this.details.controls.splice(i, 1);
      let bloks = this.entryForm.get('details') as FormArray;
      bloks.removeAt(i);
      let data = { details: bloks.value };
      this.updateForm(data);
    }

  }
  updateForm(data) {
    const bloks = data.details;
    let sub_jjg = 0;
    let sub_brondolan = 0;
    let sub_kg = 0;
    for (let i of bloks) {
      sub_jjg = sub_jjg + parseFloat(i.jumlah_janjang);
      sub_brondolan = sub_brondolan + parseFloat(i.jumlah_brondolan);
      sub_kg = sub_kg + parseFloat(i.jumlah_kg);

    }
    // this.entryForm.get('total_hk').patchValue( sub_jjg);
    // this.entryForm.get('total_jjg').patchValue( sub_jjg);
    // this.entryForm.get('total_luas').patchValue( sub_brondolan);
    // this.entryForm.get('total_kg').patchValue( sub_kg);

  }
  recalculate(blok) {
    this.hitungKg(blok);
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

    let id = $event['id'];
    this.GbmOrganisasiService.getBlokByAfdeling(id).subscribe(x => {

      this.dataSelectBlok = [];
      x.forEach(d => {
        this.dataSelectBlok.push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
      });
    });

  }
  blokChange(event, blok) {
    // console.log(event);
    // console.log(blok);
    this.estBjrService.getByBlokId(event.id).subscribe(b => {
      blok.get('bjr').patchValue(b['data']['bjr']);
      this.hitungKg(blok);
      this.recalculate(blok)
    });


  }
  hitungKg(blok) {

    let bjr = parseFloat(blok.get('bjr').value);
    let jjg = parseFloat(blok.get('jumlah_janjang').value);
    let jumlah_kg = (bjr * jjg) ;
    blok.get('jumlah_kg').patchValue(jumlah_kg.toFixed(2));


  }
}
