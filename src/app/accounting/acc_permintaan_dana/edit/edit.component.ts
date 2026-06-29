import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { AccPermintaanDana } from 'src/app/shared/models/acc_permintan_dana.model';
import { AccPermintaanDanaService } from 'src/app/shared/services/acc_permintaan_dana.service';

import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';

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
  public dataSelectAkun: any[] = [];
  public dataSelectAkunKasbank: any[] = [];


  accPermintaanDana: AccPermintaanDana;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private accPermintaanDanaService: AccPermintaanDanaService,
    private AccAkunService:AccAkunService,
    private GbmOrganisasiService:GbmOrganisasiService,

  ) {

    let toDate: Date = new Date();
    this.entryForm = this.builder.group({
      tanggal: new FormControl(toDate, Validators.required),
      lokasi_id: new FormControl([], Validators.required),
      no_transaksi: new FormControl('', Validators.required),
      nilai: new FormControl(0, Validators.required),
      keterangan: new FormControl('', Validators.required),
    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    console.log(this.accPermintaanDana);

    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.accPermintaanDana.tanggal)));
    this.entryForm.controls['no_transaksi'].patchValue(this.accPermintaanDana.no_transaksi);
    this.entryForm.controls['nilai'].patchValue(this.accPermintaanDana.nilai);
    this.entryForm.controls['keterangan'].patchValue(this.accPermintaanDana.keterangan);

  }
  private loadSelect2(): void {

    let selectLokasi;
    this.GbmOrganisasiService.getAllAdmUnit().subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
        if (this.accPermintaanDana.lokasi_id == d.id) {
          selectLokasi={ "id": d.id, "text": d.nama };
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectLokasi);
    });

  }

  onSubmit() {
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    // let frmData=new FormData();
    // if (this.entryForm.invalid) {
    //   return;
    // }
    // let dataSubmit = this.entryForm.value;
    let dataSubmit :AccPermintaanDana = {
      'lokasi_id': this.entryForm.get('lokasi_id').value.id,
      'tanggal': formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US'),
      'no_transaksi': this.entryForm.get('no_transaksi').value,
      'nilai': this.entryForm.get('nilai').value,
      'keterangan': this.entryForm.get('keterangan').value,
    };
    // console.log(dataSubmit);
    this.accPermintaanDanaService.update(this.accPermintaanDana.id, dataSubmit).subscribe(data => {
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
