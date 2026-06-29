import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { EstKodeDendaPanen } from 'src/app/shared/models/est_kode_denda_panen.model';

import { EstKodeDendaPanenService } from 'src/app/shared/services/est_kode_denda_panen.service';
import { EstKodePenaltyPanenService } from 'src/app/shared/services/est_kode_penalty_panen.service';
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
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
  public dataSelectAkun: any[] = [];

  kodeDendaPanen: EstKodeDendaPanen;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private estKodeDendaPanenService:EstKodePenaltyPanenService,
    private accAkunService:AccAkunService,


  ) {

    let toDate: Date = new Date();
    this.entryForm = this.builder.group({

      kode: new FormControl('', Validators.required),
      nama: new FormControl('', Validators.required),
      acc_akun_id: new FormControl('', Validators.required),
      keterangan: new FormControl(''),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    console.log(this.kodeDendaPanen);

    // this.entryForm.get('tanggal_efektif').patchValue(new Date(Date.parse(this.gbmUom.tanggal_efektif)));
    this.entryForm.controls['kode'].patchValue(this.kodeDendaPanen.kode);
    this.entryForm.controls['nama'].patchValue(this.kodeDendaPanen.nama);
    this.entryForm.controls['keterangan'].patchValue(this.kodeDendaPanen.keterangan);

  }

  private loadSelect2(): void {



    let selectAkun;
    this.accAkunService.getAllDetail().subscribe(x => {

      this.dataSelectAkun = [];
      x['data'].forEach(d => {
        this.dataSelectAkun.push({ "id": d.id, "text":d.kode+" - "+d.nama });
      });

      this.dataSelectAkun.forEach(a => {
        if (a.id == this.kodeDendaPanen.akun_id) {
          selectAkun = a;
        }
        this.entryForm.controls['acc_akun_id'].patchValue(selectAkun);
      });

    });
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
    this.estKodeDendaPanenService.update(this.kodeDendaPanen.id, dataSubmit).subscribe(data => {

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
