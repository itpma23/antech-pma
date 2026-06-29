import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";

import { formatDate } from '@angular/common';

import { SERVER_PATH_URL } from 'src/app/app.constants';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { UserAccessService } from 'src/app/shared/services/userAccess.service';
import { User } from 'src/app/shared/models/user.model';
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'posting-cmp',
  templateUrl: 'posting.component.html',
  styleUrls: ['posting.component.css'],
})

export class PostingComponent implements OnInit, AfterViewInit {
  isFormSubmitted = false;
  isChangePhoto = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();
  user: User;
  userAccesPosting: any;

  public dataselectPosting: any[] = [];
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private userAccesService: UserAccessService,
    private authenticationService: AuthenticationService,
  ) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;
    this.entryForm = this.builder.group({

      posting_id: new FormControl([], []),
    });






  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

    this.userAccesService.getPostingAccess(this.user.id).subscribe(u => {
      this.userAccesPosting = u;
      this.loadSelect2();

    })


  }

  private loadSelect2(): void {
    this.userAccesService.getPostingAll().subscribe((x:any) => {
      this.dataselectPosting = [];

      let selectPosting = this.userAccesPosting['data'].map(x => {

        return ({ "id": x.posting_id, "text": x.nama });
      });
      x['data'].forEach(d => {
        this.dataselectPosting.push({ "id": d.id, "text": d.posting_name });

      });

      this.entryForm.controls['posting_id'].patchValue(selectPosting);

    });


  }
  onSubmit() {
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }
    let arr_kelas = [];
    arr_kelas = this.entryForm.get('posting_id').value;
    let posting_id = arr_kelas.map(a => { return a.id });
    // frmData.append('tugas_kelas', JSON.stringify(kelas_id));
    let dataSubmit: any = {

      'posting_id': posting_id,


    };
    console.log(dataSubmit);

    this.userAccesService.updatePosting(this.user.id, dataSubmit).subscribe(data => {
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
