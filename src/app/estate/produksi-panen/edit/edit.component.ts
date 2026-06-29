import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate, formatNumber } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { EstProduksiPanenService } from 'src/app/shared/services/est_produksi_panen.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { EstProduksiPanen } from 'src/app/shared/models/est_produksi_panen.model';
import { EstBjrService } from 'src/app/shared/services/est_bjr.service';
import { isNullOrUndefined, isNumber, isString } from 'util';

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

  produksi_panen: EstProduksiPanen;
  dataSelectDivisi;
  dataSelectRayon;
  dataSelectBlok;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private EstProduksiPanenService: EstProduksiPanenService,
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
      // no_produksi_panen: new FormControl('', Validators.required),

      details: this.builder.array([]),
      total_ha: new FormControl(),
      total_hk: new FormControl(),
      total_jjg: new FormControl(),
      total_kg: new FormControl(),
      total_kirim: new FormControl(),
      total_kg_pks: new FormControl(),

      total_jjg_afkir: new FormControl(),
      total_kg_afkir: new FormControl(),
      total_jjg_restan: new FormControl(),
      total_kg_restan: new FormControl(),
      // total_jjg: new FormControl(0),
      // total_brondolan: new FormControl(0),
      // total_kg: new FormControl(0),
      // total_luas: new FormControl(0),
      // total_hk: new FormControl(0),
      // subTotal:[{value: 0, disabled: true}],

    });
  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    this.entryForm.get('keterangan').patchValue(this.produksi_panen.keterangan);
    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.produksi_panen.tanggal)));
    // this.entryForm.get('no_produksi_panen').patchValue(this.produksi_panen.no_produksi_panen);


    // this.addItem();
    this.totalSub();
  }
  public options: any;

  private loadSelect2(): void {
    // let selectedDivisi;
    // this.gbmOrganisasiService.getAllByType('AFDELING').subscribe(x=>{
    //   this.dataSelectDivisi=[];
    //   x.forEach(d => {
    //     this.dataSelectDivisi.push({"id":d.id,"text":d.nama});
    //     if (this.produksi_panen.divisi_id == d.id) {
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
        if (this.produksi_panen.divisi_id == d.id) {
          selectedDivisi = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('divisi_id').patchValue(selectedDivisi);
    });


    this.gbmOrganisasiService.getBlokByAfdeling(this.produksi_panen.divisi_id).subscribe(x => {
      this.dataSelectBlok = [];
      x.forEach(d => {
        this.dataSelectBlok.push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
      });
      let dtl = [];
      dtl = this.produksi_panen.detail;
      for (let index = 0; index < dtl.length; index++) {
        const d = dtl[index];
        this.addBlok(d['blok_id'], d['jum_ha'],d['jum_hk'],d['jum_jjg'],d['jum_kg'],d['jum_jjg_kirim'],d['jum_kg_pks'],d['jjg_afkir'],d['kg_afkir'],d['jjg_restan'],d['kg_restan'],);
      }
      // this.entryForm.get('total_jjg').patchValue(this.produksi_panen.total_jjg);
      // this.entryForm.get('total_brondolan').patchValue(this.produksi_panen.total_brondolan);
      // this.entryForm.get('total_kg').patchValue(this.produksi_panen.total_kg_kebun);

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


    this.EstProduksiPanenService.update(this.produksi_panen.id, frmData).subscribe(data => {
      console.log(data);
      // if (data['status'] == 'OK') {
      //   console.log('ok');
      //   this.event.emit('OK');
      //   this.bsModalRef.hide();
      // }
      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          // text: 'Data berhasil diSimpan dengan Nomor:'+data['data'],
          text: 'Data berhasil di simpan',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })

        this.event.emit('OK');
        this.bsModalRef.hide();
      } else {
        swal({
          title: 'Perhatian!',
          text: 'Proses Simpan Gagal',
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
      blok: new FormControl([], Validators.required),
      jum_ha: new FormControl(0,Validators.required),
      jum_hk: new FormControl(0,Validators.required),
      jum_jjg: new FormControl(0,Validators.required),
      jum_kg: new FormControl(0,Validators.required),
      jum_jjg_kirim: new FormControl(0,Validators.required),
      jum_kg_pks: new FormControl(0,Validators.required),
      jjg_afkir: new FormControl(0, Validators.required),
      jjg_restan: new FormControl(0, Validators.required),
      kg_afkir: new FormControl(0, Validators.required),
      kg_restan: new FormControl(0, Validators.required),
      

    }));
  }


  addBlok(blok_id, jum_ha ,jum_hk ,jum_jjg ,jum_kg ,jum_jjg_kirim ,jum_kg_pks,jjg_afkir ,kg_afkir,jjg_restan,kg_restan) {
    let selectedBlok;
    this.dataSelectBlok.forEach(a => {
      if (blok_id == a.id) {
        selectedBlok = a;
      }

    });

    let fb = this.builder.group({
      blok: new FormControl(selectedBlok, Validators.required),
      jum_ha: new FormControl(jum_ha, Validators.required),
      jum_hk: new FormControl(jum_hk, Validators.required),
      jum_jjg: new FormControl(jum_jjg, Validators.required),
      jum_kg: new FormControl(jum_kg, Validators.required),
      jum_jjg_kirim: new FormControl(jum_jjg_kirim, Validators.required),
      jum_kg_pks: new FormControl(jum_kg_pks, Validators.required),

      jjg_afkir: new FormControl(jjg_afkir, Validators.required),
      kg_afkir: new FormControl(kg_afkir, Validators.required),
      jjg_restan: new FormControl(jjg_restan, Validators.required),
      kg_restan: new FormControl(kg_restan, Validators.required),
      

    });
    
    this.details.push(fb);
    this.totalSub();
    
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
    this.totalSub();
  }
  updateForm(data) {
    const bloks = data.details;
    let sub_jjg = 0;
    let sub_brondolan = 0;
    let sub_kg = 0;
    for (let i of bloks) {

      sub_kg = sub_kg + parseFloat(i.jum_kg);

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
  totalSub() {
    let subTotal_ha =0;
    let subTotal_hk =0;
    let subTotal_jjg =0;
    let subTotal_kg =0;
    let subTotal_kirim =0;
    let subTotal_pks =0;
    let subTotal_jjg_afkir =0;
    let subTotal_kg_afkir =0;
    let subTotal_jjg_restan =0;
    let subTotal_kg_restan =0;
    this.entryForm.get('details').value.forEach(x => {
      // console.log(x);
      if (x.jum_ha) {
        subTotal_ha = subTotal_ha + parseFloat(x.jum_ha);
      }
      
      if (x.jum_hk) {
        subTotal_hk = subTotal_hk + parseFloat(x.jum_hk);
      }

      if (x.jum_jjg) {
        subTotal_jjg += parseFloat(x.jum_jjg);
      }
      if (x.jum_kg) {
        subTotal_kg += parseFloat(x.jum_kg);
      } 
      if (x.jum_jjg_kirim) {
        subTotal_kirim += parseFloat(x.jum_jjg_kirim);
      }     
      if (x.jum_kg_pks) {
        subTotal_pks += parseFloat(x.jum_kg_pks);
      } 
      if (x.jjg_afkir) {
        subTotal_jjg_afkir += parseFloat(x.jjg_afkir);
      }   
      if (x.kg_afkir) {
        subTotal_kg_afkir += parseFloat(x.kg_afkir);
      }  
      if (x.jjg_restan) {
        subTotal_jjg_restan += parseFloat(x.jjg_restan);
      }  
      if (x.kg_restan) {
        subTotal_kg_restan += parseFloat(x.kg_restan);
      }      

    });
      this.entryForm.get('total_ha').patchValue(formatNumber(subTotal_ha, 'en_US', '1.2-2'));
      this.entryForm.get('total_hk').patchValue(formatNumber(subTotal_hk, 'en_US', '1.2-2'));
      this.entryForm.get('total_jjg').patchValue(formatNumber(subTotal_jjg, 'en_US', '1.2-2'));
      this.entryForm.get('total_kg').patchValue(formatNumber(subTotal_kg, 'en_US', '1.2-2'));
      this.entryForm.get('total_kirim').patchValue(formatNumber(subTotal_kirim, 'en_US', '1.2-2'));
      this.entryForm.get('total_kg_pks').patchValue(formatNumber(subTotal_pks, 'en_US', '1.2-2'));

      this.entryForm.get('total_jjg_afkir').patchValue(formatNumber(subTotal_jjg_afkir, 'en_US', '1.2-2'));
      this.entryForm.get('total_kg_afkir').patchValue(formatNumber(subTotal_kg_afkir, 'en_US', '1.2-2'));
      this.entryForm.get('total_jjg_restan').patchValue(formatNumber(subTotal_jjg_restan, 'en_US', '1.2-2'));
      this.entryForm.get('total_kg_restan').patchValue(formatNumber(subTotal_kg_restan, 'en_US', '1.2-2'));

  }
  totalHarga(form) {
    
   
    this.totalSub();
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
    // this.estBjrService.getByBlokId(event.id).subscribe(b => {
    //   blok.get('bjr').patchValue(b['data']['bjr']);
    //   this.hitungKg(blok);
    //   this.recalculate(blok)
    // });


  }
  hitungKg(blok) {

    let bjr = parseFloat(blok.get('bjr').value);
    let jjg = parseFloat(blok.get('jumlah_janjang').value);
    let jumlah_kg = (bjr * jjg) ;
    blok.get('jumlah_kg').patchValue(jumlah_kg.toFixed(2));


  }
}
