import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { UserService } from 'src/app/shared/services/user.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { User } from 'src/app/shared/models/user.model';
import { formatDate } from '@angular/common';
import { MustMatch } from 'src/app/shared/helpers/must-match.validator';

declare var $: any;
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'ganti-password-cmp',
  templateUrl: 'ganti-password.component.html',
  styleUrls: ['ganti-password.component.css'],
})

export class GantiPasswordComponent implements OnInit, AfterViewInit {
  isFormSubmitted = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();
  public dataSelect: any[] = [];
  public dataSelectKaryawan: any[] = [];
  public options: any;
  user: any;

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private userService: UserService,
    private karyawanService: KaryawanService,


  ) {
    this.entryForm = this.builder.group({
      // user_name: new FormControl('',Validators.required),
      user_password: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      // password_baru: new FormControl('', Validators.required),
      re_password: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),

    }, {
      validator: MustMatch('user_password', 're_password')
    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }


  private loadSelect2(): void {


    // this.karyawanService.getAll().subscribe(x=>{
    //   this.dataSelectKaryawan=[];

    //   x['data'].forEach(d => {
    //     this.dataSelectKaryawan.push({"id":d.id,"text":d.nama});

    //   });

    // });
  }
  onSubmit() {
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    let dataSubmit: User = {
      // 'user_name': this.entryForm.get('user_name').value,
      'user_password': this.entryForm.get('user_password').value,



    };


    this.userService.updatePassword(this.user.id, dataSubmit).subscribe(data => {
      // console.log(data);
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

  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.entryForm.patchValue({
      img: file
    });
    this.entryForm.get('img').updateValueAndValidity()
    console.log(file);
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
}
