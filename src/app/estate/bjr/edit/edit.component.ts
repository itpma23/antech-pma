import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { EstBjr } from 'src/app/shared/models/est_bjr.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { EstBjrService } from 'src/app/shared/services/est_bjr.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { PksTimbanganService } from 'src/app/shared/services/pks_timbangan.service';
declare var $: any;
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'edit-cmp',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.css'],
})

export class EditComponent implements OnInit, AfterViewInit {
  isFormSubmitted = false;
  isChangePhoto = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();
  public dataSelectLokasi: any[] = [];
  public dataSelectSupplier: any[] = [];
  public dataSelectTimbangan: any[] = [];

  estBjr: EstBjr;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private estBjrService: EstBjrService,
    private gbmSupplierService: GbmSupplierService,
    private GbmOrganisasiService: GbmOrganisasiService


  ) {

    let toDate: Date = new Date();
    this.entryForm = this.builder.group({
      blok_id: new FormControl([], Validators.required),
      bjr: new FormControl(0, Validators.required),


    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    console.log(this.estBjr);

    // this.entryForm.get('tanggal_efektif').patchValue(new Date(Date.parse(this.estBjr.tanggal_efektif)));
    this.entryForm.controls['bjr'].patchValue(this.estBjr.bjr);

    // this.entryForm.controls['nama'].patchValue(this.estBjr.nama);

  }
  private loadSelect2(): void {



    let selectMill;
    this.GbmOrganisasiService.getAllByType('BLOK').subscribe(x => {
      // console.log(x);
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({"id":d.id,"text":d.kode +"("+d.nama+")"});
      });

      this.dataSelectLokasi.forEach(a => {
        if (a.id == this.estBjr.blok_id) {
          selectMill = a;
        }

      });
      this.entryForm.controls['blok_id'].patchValue(selectMill);

    });

    // let selectSupplier;
    // this.gbmSupplierService.getAll().subscribe(x => {

    //   this.dataSelectSupplier = [];
    //   x['data'].forEach(d => {
    //     this.dataSelectSupplier.push({ "id": d.id, "text": d.nama_supplier });
    //   });

    //   this.dataSelectSupplier.forEach(a => {
    //     if (a.id == this.estBjr.supplier_id) {
    //       selectSupplier = a;
    //     }
    //     this.entryForm.controls['supplier_id'].patchValue(selectSupplier);
    //   });

    // });

  }

  onSubmit() {
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    // let frmData=new FormData();
    // if (this.entryForm.invalid) {
    //   return;
    // }
    let dataSubmit = this.entryForm.value;
    console.log(this.entryForm.value);
    // dataSubmit['tanggal']=formatDate( this.entryForm.get('tanggal_efektif').value,"yyyy-MM-dd",'en_US');
    // console.log(dataSubmit);
    this.estBjrService.update(this.estBjr.id, dataSubmit).subscribe(data => {

      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Simpan berhasil',
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
  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.entryForm.patchValue({
      img: file
    });
    this.entryForm.get('img').updateValueAndValidity();
    this.isChangePhoto = true;
    console.log(this.isChangePhoto);
  }
}
