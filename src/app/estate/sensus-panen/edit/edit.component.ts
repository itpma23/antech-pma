import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate, formatNumber } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { EstSensusPanenService } from 'src/app/shared/services/est_sensus_panen.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { EstSensusPanen } from 'src/app/shared/models/est_sensus_panen.model';
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

  sensus_panen: EstSensusPanen;
  dataSelectDivisi;
  dataSelectAfdeling;
  dataSelectLokasi;
  dataSelectBlok;
  dataSelectBulan;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private EstSensusPanenService: EstSensusPanenService,
    private translate: TranslateService,
    private estBjrService: EstBjrService,
    private gbmOrganisasiService: GbmOrganisasiService
  ) {
    let toDate: Date = new Date();
    this.entryForm = this.builder.group({
      lokasi_id: new FormControl([], Validators.required),
      afdeling_id: new FormControl([], Validators.required),
      tahun: new FormControl('',),
      bulan: new FormControl([], Validators.required),
      ket: new FormControl('',),
      // tanggal: new FormControl(toDate, Validators.required),

      details: this.builder.array([]),

    });
  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    this.entryForm.get('ket').patchValue(this.sensus_panen.ket);
    this.entryForm.get('tahun').patchValue(this.sensus_panen.tahun);
    // this.entryForm.get('bulan').patchValue(this.sensus_panen.bulan);
    // this.entryForm.get('tahun').patchValue(new Date(Date.parse(this.sensus_panen.tahun)));
    // this.entryForm.get('bulan').patchValue(new Date(Date.parse(this.sensus_panen.bulan)));
    // this.entryForm.get('no_sensus_panen').patchValue(this.sensus_panen.no_sensus_panen);


    // this.addItem();
    // this.totalSub();
  }
  public options: any;

  private loadSelect2(): void {

    this.dataSelectBulan = [
      { "id": "01", "text": "Januari" },
      { "id": "02", "text": "Februari" },
      { "id": "03", "text": "Maret" },
      { "id": "04", "text": "April" },
      { "id": "05", "text": "Mei" },
      { "id": "06", "text": "Juni" },
      { "id": "07", "text": "Juli" },
      { "id": "08", "text": "Agustus" },
      { "id": "09", "text": "September" },
      { "id": "10", "text": "Oktober" },
      { "id": "11", "text": "November" },
      { "id": "12", "text": "Desember" },
    ];
    let selectTipe;
    this.dataSelectBulan.forEach(a => {
      if (a.id == this.sensus_panen.bulan) {
        selectTipe = a;
      }
    });
    console.log(selectTipe);
    this.entryForm.controls['bulan'].patchValue(selectTipe);

    let selectedLokasi;
    this.gbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
        if (this.sensus_panen.lokasi_id == d.id) {
          selectedLokasi = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectedLokasi);

        console.log(x);
        let selectedAfdeling;
         this.gbmOrganisasiService.getAfdelingByEstate(this.sensus_panen.lokasi_id).subscribe(x => {
          this.dataSelectAfdeling = [];
          x.forEach(d => {
            this.dataSelectAfdeling.push({ "id": d.id, "text": d.nama });
            if (this.sensus_panen.afdeling_id == d.id) {
              selectedAfdeling = { "id": d.id, "text": d.nama }
            }
          });
          this.entryForm.get('afdeling_id').patchValue(selectedAfdeling);
        });

            this.gbmOrganisasiService.getBlokByAfdeling(this.sensus_panen.afdeling_id).subscribe(x => {
              this.dataSelectBlok = [];
              x.forEach(d => {
                this.dataSelectBlok.push({ "id": d.id, "text": d.nama + "(" + d.kode + ")" });
              });
  
                  let dtl:any[];
                  dtl = this.sensus_panen.detail;
                  console.log(dtl);
                  for (let index = 0; index < dtl.length; index++) {
                    const d = dtl[index];
                    this.addDetail(d.blok_id, d.jjg, d.kg, d.bjr);
                  }
            });

    });

    // let selectedDivisi;
    // this.gbmOrganisasiService.getAllByType('AFDELING').subscribe(x => {
    //   this.dataSelectDivisi = [];
    //   x.forEach(d => {
    //     this.dataSelectDivisi.push({ "id": d.id, "text": d.nama });
    //     if (this.sensus_panen.divisi_id == d.id) {
    //       selectedDivisi = { "id": d.id, "text": d.nama }
    //     }
    //   });
    //   this.entryForm.get('divisi_id').patchValue(selectedDivisi);
    // });


    // this.gbmOrganisasiService.getBlokByAfdeling(this.sensus_panen.afdeling_id).subscribe(x => {
    //   this.dataSelectBlok = [];
    //   x.forEach(d => {
    //     this.dataSelectBlok.push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
    //   });
    //   let dtl = [];
    //   dtl = this.sensus_panen.detail;
    //   for (let index = 0; index < dtl.length; index++) {
    //     const d = dtl[index];
    //     this.addBlok(d.blok_id, d.jjg, d.kg, d.bjr);
    //   }

    // });

  }
  onSubmit() {
    console.log(this.entryForm.value);

    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let frmData = this.entryForm.value;
    // frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US')


    this.EstSensusPanenService.update(this.sensus_panen.id, frmData).subscribe(data => {
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
      blok_id: new FormControl([], Validators.required),
      jjg: new FormControl(0, Validators.required),
      kg: new FormControl(0, Validators.required),
      bjr: new FormControl(0, Validators.required),
      

    }));
  }


  addDetail(blok_id, jjg ,kg ,bjr ) {
    let selectedBlok;
    this.dataSelectBlok.forEach(a => {
      if (blok_id == a.id) {
        selectedBlok = a;
      }

    });

    let fb = this.builder.group({
      blok_id: new FormControl(selectedBlok, Validators.required),
      jjg: new FormControl(jjg, Validators.required),
      kg: new FormControl(kg, Validators.required),
      bjr: new FormControl((formatNumber(bjr, 'en_US', '1.2-2'))),
      
    });
    
    this.details.push(fb);
    // this.totalSub();
    
  }


  removeBlok(item) {
    let i = this.details.controls.indexOf(item);
    if (i != -1) {
      // let x=	this.details.controls.splice(i, 1);
      let items = this.entryForm.get('details') as FormArray;
      items.removeAt(i);
      let data = { details: items.value };
      // this.updateForm(data);
    }
    // this.totalSub();
  }

  
  jmlh(form) {

    let jjg = form.get('jjg').value;
    let kg = form.get('kg').value;
  
    let bjr = kg/jjg;

    form.get('bjr').patchValue(formatNumber(bjr, 'en_US', '1.2-2'));

   
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
