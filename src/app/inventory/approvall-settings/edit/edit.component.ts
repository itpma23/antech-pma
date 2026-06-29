import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";

import { PrcApprovallSetting } from 'src/app/shared/models/prc_approvall_setting.model';
import { PksTankiService } from 'src/app/shared/services/pks_tanki.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { formatDate } from '@angular/common';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { InvApprovalSettingPbService } from 'src/app/shared/services/inv_approvall_setting_pb.service';
import { InvApprovalSettingPb } from 'src/app/shared/models/inv_approval_setting.model';

declare var swal: any;

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
  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();
  PrcApprovallSetting: PrcApprovallSetting;
  InvApprovalSetting: InvApprovalSettingPb;
  dbName;
  pathName;
  PATH_URL;

  dataSelectLokasi;
  dataSelectKode;
  dataSelectKaryawan;
  isChecked = false; // Default value (false = OFF)

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private InvApprovalSettingPbService: InvApprovalSettingPbService,
    private authenticationService: AuthenticationService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private KaryawanService: KaryawanService,
  ) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;

    let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      // tanggal: new FormControl(toDate, Validators.required),

      lokasi_id: new FormControl([], Validators.required),
      kode_id: new FormControl([], Validators.required),
      karyawan_id: new FormControl([], Validators.required),
      is_finish: new FormControl(0, Validators.required),
      is_active: new FormControl(0) // Set default to 0

    });




  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {

    // this.entryForm.controls['awal'].patchValue(this.InvApprovalSetting.awal);
    // this.entryForm.controls['akhir'].patchValue(this.InvApprovalSetting.akhir);

    // this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.InvApprovalSetting.tanggal)));


  }
  public options: any;


  private loadSelect2(): void {

    if (this.InvApprovalSetting.is_active == '0') {
      this.isChecked = false
    }else{
      this.isChecked = true
    }
        

    let selectedLokasi;
    this.GbmOrganisasiService.getAllByType("UNIT").subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
        if (this.InvApprovalSetting.lokasi_id == d.id) {
          selectedLokasi = { "id": d.id, "text": d.nama }
        }


      });
      this.entryForm.get('lokasi_id').patchValue(selectedLokasi);
    });

    let selectedKaryawan;
    this.KaryawanService.getAll().subscribe(x => {
      this.dataSelectKaryawan = [];
      x['data'].forEach(d => {
        this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama });
        if (this.InvApprovalSetting.karyawan_id == d.id) {
          selectedKaryawan = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('karyawan_id').patchValue(selectedKaryawan);
    });

    this.dataSelectKode = [
      { id: 'PB1', text: 'PB1' },
      { id: 'PB2', text: 'PB2' },
      { id: 'PB3', text: 'PB3' },
      { id: 'PB4', text: 'PB4' }
    ];
    let selectedKode;
    this.dataSelectKode.forEach(d => {
      if (this.InvApprovalSetting.kode == d.id) {
        selectedKode = { "id": d.id, "text": d.text }
      }
    });
    this.entryForm.get('kode_id').patchValue(selectedKode);
    this.entryForm.get('is_finish').patchValue(this.InvApprovalSetting.is_finish == true ? 1 : 0);

    

    console.log('DATA EDIt =>', this.InvApprovalSetting)


  }


  onSubmit() {
    console.log(this.entryForm.value);

    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }


    let frmData = this.entryForm.value;
    // frmData['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');


    this.InvApprovalSettingPbService.update(this.InvApprovalSetting.id, frmData).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        console.log('ok');
        this.event.emit('OK');
        this.bsModalRef.hide();  // Menyembunyikan modal

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


  // Method untuk menangani perubahan toggle
onToggleChange(event) {
  this.isChecked = event.checked; // Mengubah nilai isChecked berdasarkan status toggle
  console.log('Status toggle berubah:', this.isChecked);
  
  // Mengambil FormControl is_active dan set nilai berdasarkan isChecked
  const isActiveControl = this.entryForm.get('is_active');
  
  // Pastikan is_active ada dan kemudian set nilai
  if (isActiveControl) {
    isActiveControl.setValue(this.isChecked ? 1 : 0);
  }
}

}
