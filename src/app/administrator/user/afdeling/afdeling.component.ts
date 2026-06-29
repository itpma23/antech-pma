import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";

import { formatDate } from '@angular/common';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { UserAccessService } from 'src/app/shared/services/userAccess.service';
import { User } from 'src/app/shared/models/user.model';
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'afdeling-cmp',
  templateUrl: 'afdeling.component.html',
  styleUrls: ['afdeling.component.css'],
})

export class AfdelingComponent implements OnInit, AfterViewInit {
  isFormSubmitted = false;
  isChangePhoto = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();
  user: User;
  userAccesLocation: any;

  public dataselectOrganisasi: any[] = [];
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private userAccesService: UserAccessService,
    private organisasiService: GbmOrganisasiService,
    private authenticationService: AuthenticationService,
  ) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;
    this.entryForm = this.builder.group({

      lokasi_id: new FormControl([], []),
    });






  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

    this.userAccesService.getAfdelingAccess(this.user.id).subscribe(u => {
      this.userAccesLocation = u;
      this.loadSelect2();

    })


  }

  private loadSelect2(): void {
    this.organisasiService.getAllByType('SUBBAGIAN').subscribe(x => {
      this.dataselectOrganisasi = [];

      let selectOrganisasi = this.userAccesLocation['data'].map(x => {

        return ({ "id": x.afdeling_id, "text": x.nama });
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
    let arr_kelas = [];
    arr_kelas = this.entryForm.get('lokasi_id').value;
    let lokasi_id = arr_kelas.map(a => { return a.id });
    // frmData.append('tugas_kelas', JSON.stringify(kelas_id));
    let dataSubmit: any = {

      'lokasi_id': lokasi_id,


    };
    console.log(dataSubmit);

    this.userAccesService.updateAfdeling(this.user.id, dataSubmit).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Data berhasil diSimpan.',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        this.event.emit('OK');
        this.bsModalRef.hide();
      }
    });
  }

  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {




  }
  valueChange($event) {
    console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }

}
