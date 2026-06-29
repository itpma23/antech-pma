import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { PksTimbanganService } from 'src/app/shared/services/pks_timbangan.service';
import { EstSpatService } from 'src/app/shared/services/est_spat.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { EstSpat } from 'src/app/shared/models/est_spat.model';
import { LookupTimbanganComponent } from '../lookup-timbangan/lookup-timbangan.component';
import { isNullOrUndefined } from 'util';

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

  spat: EstSpat;
  dataSelectRayon;
  dataSelectBlok;
  pksTimbangan;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private estSpatService: EstSpatService,
    private translate: TranslateService,
    private bsModalRef1: BsModalRef,
    private bsModalService: BsModalService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private pksTimbanganService: PksTimbanganService
  ) {
    let toDate: Date = new Date();
    this.entryForm = this.builder.group({
      rayon_id: new FormControl([], Validators.required),
      keterangan: new FormControl('',),
      tanggal: new FormControl(toDate, Validators.required),
      //tipe: new FormControl('0', Validators.required),
      no_spat: new FormControl('', Validators.required),
      berat_bersih: new FormControl(0, Validators.required),
      no_tiket: new FormControl('', Validators.required),
      pks_timbangan_id: new FormControl('', Validators.required),

      details: this.builder.array([]),
      // subTotal:[{value: 0, disabled: true}],


    });
  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    console.log(this.spat);
    this.entryForm.get('keterangan').patchValue(this.spat.keterangan);
    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.spat.tanggal)));
    this.entryForm.get('no_spat').patchValue(this.spat.no_spat);
    this.entryForm.get('pks_timbangan_id').patchValue(isNullOrUndefined (this.spat.pks_timbangan_id)?0:this.spat.pks_timbangan_id);
    this.entryForm.get('berat_bersih').patchValue(isNullOrUndefined (this.spat.berat_bersih)?0:this.spat.berat_bersih);
    this.entryForm.get('no_tiket').patchValue(isNullOrUndefined (this.spat.no_tiket)?0:this.spat.no_tiket);


    // this.addItem();
  }
  public options: any;

  private loadSelect2(): void {
    let selectedRayon;

    this.gbmOrganisasiService.getAllByType('AFDELING').subscribe(x => {
      this.dataSelectRayon = [];
      x.forEach(d => {
        this.dataSelectRayon.push({ "id": d.id, "text": d.nama });
        if (this.spat.rayon_id == d.id) {
          selectedRayon = { "id": d.id, "text": d.nama }
        }

      });
      this.entryForm.get('rayon_id').patchValue(selectedRayon);


    });
    this.gbmOrganisasiService.getAllByType('BLOK').subscribe(x => {
      this.dataSelectBlok = [];
      x.forEach(d => {
        this.dataSelectBlok.push({ "id": d.id, "text": d.nama });

      });
      let dtl = [];
      dtl = this.spat.detail;
      for (let index = 0; index < dtl.length; index++) {
        const d = dtl[index];
        this.addBlok(d['blok_id'], d['jum_janjang'], d['jum_brondolan'],d['bjr_pabrik'],d['kg_pabrik'],d['id']);


      }

    });

  }
  showTimbangan() {
    this.pksTimbanganService.getTimbanganTBSInternalBelumSPB().subscribe(t => {

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        class: "modal-lg ",
        initialState: {
          pksTimbangan: t['data']
        }
      };
      this.bsModalRef1 = this.bsModalService.show(LookupTimbanganComponent, modalConfig);
      this.bsModalRef1.content.event.subscribe(item => {
        if (item == null) {

        } else {
         // this.showNotification('top', 'right', "No Timbangan " + item['no_tiket'] + " ", 2);
          this.entryForm.get('no_tiket').patchValue(item['no_tiket']);
          this.entryForm.get('berat_bersih').patchValue(item['berat_bersih']);
          this.entryForm.get('pks_timbangan_id').patchValue( item['id']);
          let berat_bersih=parseFloat(item['berat_bersih']);
          let items = this.entryForm.get('details') as FormArray;
          let totJanjang=0;

          for (let c of items.controls) {
            totJanjang=totJanjang+parseFloat(c.get('jumlah_janjang').value);

          }

          for (let c of items.controls) {
            let kg=(c.get('jumlah_janjang').value)/totJanjang * berat_bersih
            let bjr=kg/(c.get('jumlah_janjang').value)
            c.get('kg_pabrik').patchValue(kg.toFixed(2));
            c.get('bjr_pabrik').patchValue(bjr.toFixed(2));

          }

        }
      });

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

    console.log(frmData);
    this.estSpatService.validasiTimbangan(this.spat.id, frmData).subscribe(data => {

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
      }else{
        swal({
          title: 'Proses Simpan Gagal!',
          text: data['data'],
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
      jumlah_janjang: new FormControl(0, Validators.required),
      jumlah_brondolan: new FormControl(0),
      bjr_pabrik: new FormControl(0, Validators.required),
      kg_pabrik: new FormControl(0, Validators.required),
    }));

  }

  addBlok(blok_id, jumlah_janjang = 0, jumlah_brondolan = 0,bjr_pabrik=0,kg_pabrik=0,id) {

    let selectedBlok;
    this.dataSelectBlok.forEach(a => {
      if (blok_id == a.id) {
        selectedBlok = a;
      }

    });

    let fb = this.builder.group({
      blok: new FormControl(selectedBlok, Validators.required),
      jumlah_janjang: new FormControl(jumlah_janjang, Validators.required),
      jumlah_brondolan: new FormControl(jumlah_brondolan, Validators.required),
      bjr_pabrik: new FormControl(bjr_pabrik, Validators.required),
      kg_pabrik: new FormControl(kg_pabrik, Validators.required),
      id_detail: new FormControl(id, Validators.required),
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
    // console.log(data.details);
    const items = data.details;
    console.log(items);
    let sub = 0;
    for (let i of items) {
      sub = sub + parseFloat(i.qty);

    }
    console.log(sub);
    //this.entryForm.get('total').patchValue( sub);

  }
  recalculate() {
    let items = this.entryForm.get('details') as FormArray;
    let data = { details: items.value };
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
  showNotification(from, align, message, color = 4) {
    var type = ['', 'info', 'success', 'warning', 'danger', 'rose', 'primary'];
    console.log(type[color]);
    //var color = Math.floor((Math.random() * 6) + 1);

    $.notify({
      icon: "notifications",
      message: message

    }, {
      type: type[color],
      timer: 3000,
      placement: {
        from: from,
        align: align
      }
    });
  }
}
