import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { EstRekapPanenService } from 'src/app/shared/services/est_rekap_panen.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { EstRekapPanen } from 'src/app/shared/models/est_rekap_panen.model';
import { EstBjrService } from 'src/app/shared/services/est_bjr.service';

declare var $: any;

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

  rekap_panen: EstRekapPanen;
  dataSelectDivisi;
  dataSelectRayon;
  dataSelectBlok;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private estRekapPanenService: EstRekapPanenService,
    private translate: TranslateService,
    private estBjrService: EstBjrService,
    private gbmOrganisasiService: GbmOrganisasiService
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
    this.entryForm.get('keterangan').patchValue(this.rekap_panen.keterangan);
    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.rekap_panen.tanggal)));
    // this.entryForm.get('no_rekap_panen').patchValue(this.rekap_panen.no_rekap_panen);


    // this.addItem();
  }
  public options: any;

  private loadSelect2(): void {
    // let selectedDivisi;
    // this.gbmOrganisasiService.getAllByType('AFDELING').subscribe(x=>{
    //   this.dataSelectDivisi=[];
    //   x.forEach(d => {
    //     this.dataSelectDivisi.push({"id":d.id,"text":d.nama});
    //     if (this.rekap_panen.divisi_id == d.id) {
    //       selectedDivisi = { "id": d.id, "text": d.nama }
    //     }
    //   });
    //   this.entryForm.get('divisi_id').patchValue(selectedDivisi);
    // });

    let selectedDivisi;
    this.gbmOrganisasiService.getAllByType('AFDELING').subscribe(x => {
      this.dataSelectDivisi = [];
      x.forEach(d => {
        this.dataSelectDivisi.push({ "id": d.id, "text": d.nama });
        if (this.rekap_panen.divisi_id == d.id) {
          selectedDivisi = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('divisi_id').patchValue(selectedDivisi);
    });


    this.gbmOrganisasiService.getBlokByAfdeling(this.rekap_panen.divisi_id).subscribe(x => {
      this.dataSelectBlok = [];
      x.forEach(d => {
        this.dataSelectBlok.push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
      });
      let dtl = [];
      dtl = this.rekap_panen.detail;
      for (let index = 0; index < dtl.length; index++) {
        const d = dtl[index];
        this.addBlok(d['blok_id'], d['bjr_kebun'], d['jum_janjang'], d['jum_hk'], d['luas_panen'] ,d['kg_kebun'],d['jum_brondolan']);
      }
      // this.entryForm.get('total_jjg').patchValue(this.rekap_panen.total_jjg);
      // this.entryForm.get('total_brondolan').patchValue(this.rekap_panen.total_brondolan);
      // this.entryForm.get('total_kg').patchValue(this.rekap_panen.total_kg_kebun);

    });

  }
  onSubmit() {
    console.log(this.entryForm.value);

    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let frmData = this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US')


    this.estRekapPanenService.update(this.rekap_panen.id, frmData).subscribe(data => {
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
  addBlokNew() {
    this.details.push(this.builder.group({
      blok: new FormControl([], Validators.required),
      bjr: new FormControl('0'),
      jumlah_janjang: new FormControl('0', Validators.required),
      jumlah_hk: new FormControl('0', Validators.required),
      luas_panen: new FormControl('0', Validators.required),
      jumlah_kg: new FormControl('0'),
    }));
  }


  addBlok(blok_id, bjr = 0, jumlah_janjang = 0, jumlah_hk = 0,luas_panen=0, jumlah_kg = 0,jum_brondolan=0) {
    let selectedBlok;
    this.dataSelectBlok.forEach(a => {
      if (blok_id == a.id) {
        selectedBlok = a;
      }

    });

    let fb = this.builder.group({
      blok: new FormControl(selectedBlok, Validators.required),
      bjr: new FormControl(bjr, Validators.required),
      jumlah_janjang: new FormControl(jumlah_janjang, Validators.required),
      jumlah_hk: new FormControl(jumlah_hk, Validators.required),
      luas_panen: new FormControl(luas_panen, Validators.required),
      jumlah_kg: new FormControl(jumlah_kg),
      jum_brondolan: new FormControl(jum_brondolan),
    });

    this.details.push(fb);
  }


  removeBlok(item) {

    let i = this.details.controls.indexOf(item);

    if (i != -1) {
      // let x=	this.details.controls.splice(i, 1);
      let items = this.entryForm.get('details') as FormArray;
      items.removeAt(i);
      let data = { details: items.value };
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

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

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
