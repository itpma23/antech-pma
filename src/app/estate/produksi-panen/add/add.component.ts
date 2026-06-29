import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate, formatNumber } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { EstProduksiPanenService } from 'src/app/shared/services/est_produksi_panen.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { EstBjrService } from 'src/app/shared/services/est_bjr.service';

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
  dataSelectRayon;
  dataSelectBlok;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private EstProduksiPanenService: EstProduksiPanenService,
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
      total_ha: new FormControl(0),
      total_hk: new FormControl(0),
      total_jjg: new FormControl(0),
      total_kg: new FormControl(0),
      total_kirim: new FormControl(0),
      total_kg_pks: new FormControl(0),

      total_jjg_afkir: new FormControl(0),
      total_kg_afkir: new FormControl(0),
      total_jjg_restan: new FormControl(0),
      total_kg_restan: new FormControl(0),


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
    // this.GbmOrganisasiService.getAllByType('RAYON').subscribe(x => {
    //   this.dataSelectRayon = [];
    //   x.forEach(d => {
    //     this.dataSelectRayon.push({ "id": d.id, "text": d.nama });
    //   });
    // });

  }
  onSubmit() {

    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    console.log(this.entryForm.value);

    let frmData = this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US')

    this.EstProduksiPanenService.create(frmData).subscribe(data => {
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
  addBlok() {
    // this.details.push(this.builder.group(new InvoiceBlok()));

    this.details.push(this.builder.group({
      blok: new FormControl([], Validators.required),
      jum_ha: new FormControl(0, Validators.required),
      jum_hk: new FormControl(0, Validators.required),
      jum_jjg: new FormControl(0, Validators.required),
      jum_kg: new FormControl(0, Validators.required),
      jum_jjg_kirim: new FormControl(0, Validators.required),
      jum_kg_pks: new FormControl(0, Validators.required),

      jjg_afkir: new FormControl(0, Validators.required),
      kg_afkir: new FormControl(0, Validators.required),
      jjg_restan: new FormControl(0, Validators.required),
      kg_restan: new FormControl(0, Validators.required),

      

    }));

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
          subTotal_ha += x.jum_ha;
        }
        if (x.jum_hk) {
          subTotal_hk += x.jum_hk;
        }
        if (x.jum_jjg) {
          subTotal_jjg += x.jum_jjg;
        }
        if (x.jum_kg) {
          subTotal_kg += x.jum_kg;
        } 
        if (x.jum_jjg_kirim) {
          subTotal_kirim += x.jum_jjg_kirim;
        }     
        if (x.jum_kg_pks) {
          subTotal_pks += x.jum_kg_pks;
        } 
        if (x.jjg_afkir) {
          subTotal_jjg_afkir += x.jjg_afkir;
        }   
        if (x.kg_afkir) {
          subTotal_kg_afkir += x.kg_afkir;
        }  
        if (x.jjg_restan) {
          subTotal_jjg_restan += x.jjg_restan;
        }  
        if (x.kg_restan) {
          subTotal_kg_restan += x.kg_restan;
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

  removeBlok(Blok) {

    let i = this.details.controls.indexOf(Blok);

    if (i != -1) {
      //  let x=	this.details.controls.splice(i, 1);
      let bloks = this.entryForm.get('details') as FormArray;
      bloks.removeAt(i);
      let data = { details: bloks.value };
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
      // sub_jjg = sub_jjg + parseFloat(i.jumlah_janjang);
      // sub_brondolan = sub_brondolan + parseFloat(i.jumlah_brondolan);
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
