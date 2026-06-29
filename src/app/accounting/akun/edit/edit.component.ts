import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
import { Akun } from 'src/app/shared/models/akun.model';
import { formatDate } from '@angular/common';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { isNullOrUndefined } from 'util';

@Component({
  moduleId: module.id,
  selector: 'edit-cmp',
  styleUrls: ['edit.component.css'],
  templateUrl: 'edit.component.html'
})

export class EditComponent implements OnInit, AfterViewInit {
  isFormSubmitted = false;
  isChangePhoto = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  public dataselectOrganisasi: any[] = [];
  entryForm: FormGroup;
  categories: any[] = [];
  event: EventEmitter<any> = new EventEmitter();
  akun: Akun;
  dbName;
  pathName;
  PATH_URL;
  dataSelectJenisBiaya: { id: string; text: string; }[];
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private akunService: AccAkunService,
    private authenticationService: AuthenticationService,
    private organisasiService: GbmOrganisasiService,
  ) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;
    this.entryForm = this.builder.group({
      kode: new FormControl(null, Validators.required),
      nama: new FormControl(null, Validators.required),
      tipe: new FormControl(null, Validators.required),
      is_transaksi_akun: new FormControl(1, Validators.required),
      is_kasbank_akun: new FormControl(1, Validators.required),
      aktif: new FormControl(1, Validators.required),
      lokasi_id: new FormControl([], []),
      jenis_biaya_id: new FormControl([]),

    });




  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {

    this.entryForm.controls['kode'].patchValue(this.akun.kode);
    this.entryForm.controls['nama'].patchValue(this.akun.nama);
    this.entryForm.controls['tipe'].patchValue(this.akun.tipe);
    this.entryForm.controls['is_transaksi_akun'].patchValue(this.akun.is_transaksi_akun == true ? 1 : 0);
    this.entryForm.controls['is_kasbank_akun'].patchValue(this.akun.is_kasbank_akun == true ? 1 : 0);
    this.entryForm.controls['aktif'].patchValue(this.akun.aktif == true ? 1 : 0);
    this.loadSelect2();


  }
  private loadSelect2(): void {
    let selectedKelompokBiaya={};
    this.dataSelectJenisBiaya = [
      { id: 'PNN', text: 'PANEN' },
      { id: 'PML', text: 'PEMELIHARAAN' },
      { id: 'PMK', text: 'PEMUPUKAN' },
      { id: 'UMM', text: 'UMUM' },
      { id: 'TRK', text: 'TRAKSI' },
      { id: 'WRK', text: 'WORKSHOP' },
      { id: 'MIL', text: 'MILL' },
      { id: 'LAIN', text: 'LAINNYA' },

    ];
    this.dataSelectJenisBiaya.forEach(d => {
      if (d.id == this.akun.kelompok_biaya) {
        selectedKelompokBiaya = { "id": d.id, "text": d.text };
      }
    });
    this.entryForm.controls['jenis_biaya_id'].patchValue(selectedKelompokBiaya);
    this.organisasiService.getAllAdmUnit().subscribe(x => {
      this.dataselectOrganisasi = [];

      let selectOrganisasi = this.akun['detail'].map(x => {

        return ({ "id": x.lokasi_id, "text": x.nama });
      });
      x.forEach(d => {
        this.dataselectOrganisasi.push({ "id": d.id, "text": d.nama });

      });

      this.entryForm.controls['lokasi_id'].patchValue(selectOrganisasi);

    });

    // let selectOrganisasi:any;
    // this.organisasiService.getAllAdmUnit().subscribe(x=>{
    //   console.log(x);
    //   this.dataselectOrganisasi=[];
    //   x.forEach(d => {
    //     this.dataselectOrganisasi.push({"id":d.id,"text":d.nama});
    //     if (d.id==this.userAcces.lokasi_id){
    //       selectOrganisasi={"id":d.id,"text":d.nama};
    //     }

    //   });

    //   this.entryForm.controls['lokasi_id'].patchValue(selectOrganisasi);

    // });



  }

  onSubmit() {
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }
    let arr_lokasi = [];
    arr_lokasi = this.entryForm.get('lokasi_id').value;
    let lokasi_id = arr_lokasi.map(a => { return a.id });
    let jenis_biaya_id;
    if (isNullOrUndefined(this.entryForm.get('jenis_biaya_id').value) != true) {
      if (isNullOrUndefined(this.entryForm.get('jenis_biaya_id').value!.id)) {
        jenis_biaya_id = null
      } else {
        jenis_biaya_id = this.entryForm.get('jenis_biaya_id').value.id;
      }

    } else {
      jenis_biaya_id = null
    }
    let dataSubmit: Akun = {
      'kode': this.entryForm.get('kode').value,
      'nama': this.entryForm.get('nama').value,
      'tipe': this.entryForm.get('tipe').value,
      'kelompok_biaya':jenis_biaya_id,
      'is_transaksi_akun': this.entryForm.get('is_transaksi_akun').value,
      'is_kasbank_akun': this.entryForm.get('is_kasbank_akun').value,
      'aktif': this.entryForm.get('aktif').value,
      'ket': '',
      'lokasi_id': lokasi_id


    };
    console.log(dataSubmit);

    this.akunService.update(this.akun.id, dataSubmit).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        console.log('ok');
        this.event.emit('OK');
        this.bsModalRef.hide();
      }
    });
  }


  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {

    // console.log(this.akun);
    // this.entryForm = this.builder.group({
    //   nip: new FormControl(this.akun.nip,[Validators.required]),
    //   nama: new FormControl(this.akun.nama, [Validators.required]),
    //   jenis_kelamin: new FormControl(this.akun.jenis_kelamin, [Validators.required]),
    //   tgl_lahir:   new FormControl(new Date(Date.parse(this.akun.tgl_lahir)), Validators.required),
    //   tempat_lahir: new FormControl(this.akun.tempat_lahir, []),
    //   alamat: new FormControl(this.akun.alamat, []),
    //   username: new FormControl(this.akun.username, []),
    //   password: new FormControl(this.akun.password, []),
    // });


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
