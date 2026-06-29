import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { EstSpatService } from 'src/app/shared/services/est_spat.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { EstSpat } from 'src/app/shared/models/est_spat.model';
import { EstBjrService } from 'src/app/shared/services/est_bjr.service';

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
  dataSelectDivisi;
  dataSelectRayon;
  dataSelectBlok;
  dataSelectAfdeling;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private estSpatService: EstSpatService,
    private translate: TranslateService,
    private estBjrService: EstBjrService,
    private gbmOrganisasiService: GbmOrganisasiService
  ) {
    let toDate: Date = new Date();
    this.entryForm = this.builder.group({
      divisi_id: new FormControl([], Validators.required),
      rayon_id: new FormControl([], Validators.required),
      keterangan: new FormControl('',),
      tanggal: new FormControl(toDate, Validators.required),
      //tipe: new FormControl('0', Validators.required),
      no_spat: new FormControl('', Validators.required),
      is_double_handling: new FormControl(0),
      details: this.builder.array([]),
      total_jjg: new FormControl(0, Validators.required),
      total_brondolan: new FormControl(0, Validators.required),
      total_kg: new FormControl(0, Validators.required),
      // subTotal:[{value: 0, disabled: true}],

    });
  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    this.entryForm.get('keterangan').patchValue(this.spat.keterangan);
    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.spat.tanggal)));
    this.entryForm.get('no_spat').patchValue(this.spat.no_spat);
    this.entryForm.get('is_double_handling').patchValue(this.spat.is_double_handling == true ? 1 : 0);


    // this.addItem();
  }
  public options: any;

  private loadSelect2(): void {
    // let selectedDivisi;
    // this.gbmOrganisasiService.getAllByType('AFDELING').subscribe(x=>{
    //   this.dataSelectDivisi=[];
    //   x.forEach(d => {
    //     this.dataSelectDivisi.push({"id":d.id,"text":d.nama});
    //     if (this.spat.divisi_id == d.id) {
    //       selectedDivisi = { "id": d.id, "text": d.nama }
    //     }
    //   });
    //   this.entryForm.get('divisi_id').patchValue(selectedDivisi);
    // });

    // let selectedRayon;
    // this.gbmOrganisasiService.getAllByType('RAYON').subscribe(x => {
    //   this.dataSelectRayon = [];
    //   x.forEach(d => {
    //     this.dataSelectRayon.push({ "id": d.id, "text": d.nama });
    //     if (this.spat.rayon_id == d.id) {
    //       selectedRayon = { "id": d.id, "text": d.nama }
    //     }
    //   });
    //   this.entryForm.get('rayon_id').patchValue(selectedRayon);
    // });

    let selectedDivisi;
    this.gbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectDivisi = [];
      x.forEach(d => {
        this.dataSelectDivisi.push({ "id": d.id, "text": d.nama });
        if (this.spat.divisi_id == d.id) {
          selectedDivisi = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('divisi_id').patchValue(selectedDivisi);

      let selectedAfdeling;

         this.gbmOrganisasiService.getAfdelingByEstate(this.spat.divisi_id ).subscribe(x => {
          this.dataSelectAfdeling = [];
          x.forEach(d => {
            this.dataSelectAfdeling.push({ "id": d.id, "text": d.nama });
            if (this.spat.rayon_id == d.id) {
              selectedAfdeling = { "id": d.id, "text": d.nama }
            }
          });
          this.entryForm.get('rayon_id').patchValue(selectedAfdeling);
         
        });

    });


    this.gbmOrganisasiService.getBlokByAfdeling(this.spat.rayon_id).subscribe(x => {
      this.dataSelectBlok = [];
      x.forEach(d => {
        this.dataSelectBlok.push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
      });
      let dtl = [];
      dtl = this.spat.detail;
      for (let index = 0; index < dtl.length; index++) {
        const d = dtl[index];
        this.addBlok(d['blok_id'], d['bjr_kebun'], d['jum_janjang'], d['jum_brondolan'], d['kg_kebun']);
      }
      this.entryForm.get('total_jjg').patchValue(this.spat.total_jjg);
      this.entryForm.get('total_brondolan').patchValue(this.spat.total_brondolan);
      this.entryForm.get('total_kg').patchValue(this.spat.total_kg_kebun);

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


    this.estSpatService.update(this.spat.id, frmData).subscribe(data => {
      console.log(data);
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
      bjr: new FormControl('0'),
      jumlah_janjang: new FormControl('0', Validators.required),
      jumlah_brondolan: new FormControl('0', Validators.required),
      jumlah_kg: new FormControl('0'),
    }));

  }

  // addBlok() {

  //   this.details.push(this.builder.group({
  //     blok: new FormControl([], Validators.required),
  //     jumlah_janjang: new FormControl('0', Validators.required),
  //     brondolan: new FormControl('0', Validators.required),
  //   }));

  // }
  addBlok(blok_id, bjr = 0, jumlah_janjang = 0, jumlah_brondolan = 0, jumlah_kg = 0) {
    // this.details.push(this.builder.group(new InvoiceItem()));
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
      jumlah_brondolan: new FormControl(jumlah_brondolan, Validators.required),
      jumlah_kg: new FormControl(jumlah_kg),
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

    this.entryForm.get('total_jjg').patchValue(sub_jjg);
    this.entryForm.get('total_brondolan').patchValue(sub_brondolan);
    this.entryForm.get('total_kg').patchValue(sub_kg);

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
    let berondolan = parseFloat(blok.get('jumlah_brondolan').value);
    let jumlah_kg = (bjr * jjg) + berondolan;
    blok.get('jumlah_kg').patchValue(jumlah_kg.toFixed(2));

  }

  D_handlingChange(event) {
    console.log(event);
    let org_id = this.entryForm.get('divisi_id').value['id'];

      this.gbmOrganisasiService.getById(org_id).subscribe(lok => {
        console.log(lok)
        // this.lokasi_tipe = lok['data']['tipe'];
        if (event.target.checked) {

          this.gbmOrganisasiService.getAllByType('BLOK').subscribe(x => {
            this.dataSelectBlok = [];
            x.forEach(d => {
              this.dataSelectBlok.push({ "id": d.id, "text": d.nama + "("+ d.kode +")"});
            });
          })
        } 
        else {
          let id = this.entryForm.get('rayon_id').value['id'];
          this.gbmOrganisasiService.getBlokByAfdeling(id).subscribe(x => {
            console.log(x);
            this.dataSelectBlok = [];
            x.forEach(d => {
              this.dataSelectBlok.push({ "id": d.id, "text": d.nama + "("+ d.kode +")"});
            });
          })
       
        }
      })

  }
}
