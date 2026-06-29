import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate, formatNumber } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { EstSensusPanenService } from 'src/app/shared/services/est_sensus_panen.service';
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


  dataSelectAfdeling;
  dataSelectLokasi;
  dataSelectBlok;
  dataSelectBulan;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private EstSensusPanenService: EstSensusPanenService,
    private translate: TranslateService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private estBjrService: EstBjrService,
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

    this.GbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
      this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {
        console.log(x);
        let org_id = x.id;
        // this.GbmOrganisasiService.getAfdStByUnit(org_id).subscribe(x => {
         this.GbmOrganisasiService.getAfdelingByEstate(org_id).subscribe(x => {
          this.dataSelectAfdeling = [];
          x.forEach(d => {
            this.dataSelectAfdeling.push({ "id": d.id, "text": d.nama });
          });
         
        });
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
    // frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US')

    this.EstSensusPanenService.create(frmData).subscribe(data => {
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
      blok_id: new FormControl('', Validators.required),
      jjg: new FormControl(0, Validators.required),
      kg: new FormControl(0, Validators.required),
      bjr: new FormControl(0, Validators.required),

    }));

  }


  removeBlok(Blok) {

    let i = this.details.controls.indexOf(Blok);
    if (i != -1) {
      //  let x=	this.details.controls.splice(i, 1);
      let bloks = this.entryForm.get('details') as FormArray;
      bloks.removeAt(i);
      let data = { details: bloks.value };
      // this.updateForm(data);
    }
    // this.totalSub();

  }

  tampilBlokAfd(){
    this.dataSelectBlok = [];
    this.GbmOrganisasiService.getBlokByAfdeling(this.entryForm.get('afdeling_id').value['id']).subscribe(x => {
      // console.log(x);
      // x.forEach(d => {
      //   this.dataSelectBlok.push({ "id": d.id, "text": d.nama + "(" + d.kode + ")" });
      // });
      let dtl = [];
      dtl = x;
      console.log(dtl);
      for (let index = 0; index < dtl.length; index++) {
        const d = dtl[index];
        console.log(d);
        this.addBlokAfd(d['id'],d['kode'],d['nama']);
      }
      
    });
  }
  addBlokAfd(id='',kode='',nama='' ) {
    this.dataSelectBlok=[];
    // let selectBlokAfd;
    // this.dataSelectBlok.forEach(a => {
    //   if (blok_id == a.id) {
    //     selectBlokAfd = a;
    //   }
    // });
    let fb = this.builder.group({
      blok_id: new FormControl(id),
      nama_blok: new FormControl(nama + " (" +kode+ ")"),
      jjg: new FormControl(0),
      kg: new FormControl(0),
      bjr: new FormControl(0),
    });
    this.details.push(fb);
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

    let id = $event['id'];
    this.GbmOrganisasiService.getBlokByAfdeling(id).subscribe(x => {

      this.dataSelectBlok = [];
      x.forEach(d => {
        this.dataSelectBlok.push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
      });
    });

  }
}
