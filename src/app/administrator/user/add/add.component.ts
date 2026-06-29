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
    selector: 'add-cmp',
    templateUrl: 'add.component.html',
    styleUrls: ['add.component.css'],
})

export class AddComponent implements OnInit,AfterViewInit{
  isFormSubmitted=false;
	datepickerConfig = {
		dateInputFormat: 'DD-MM-YYYY',
		containerClass: 'theme-red'
	}
  entryForm: FormGroup;
  categories: any[] = [];
  event: EventEmitter<any>=new EventEmitter();
  jenis_kelamin='';
  public dataSelect: any[] = [];
  public dataSelectAgama: any[] = [];
  public dataSelectKaryawan: any[] = [];
  public options: any;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private userService:UserService,
    private karyawanService:KaryawanService,


    ) {
    this.entryForm = this.builder.group({
      user_full_name: new FormControl(null, Validators.required),
      user_email: new FormControl('', []),
      user_name: new FormControl('',Validators.required),
      user_password: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      re_password: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      employee_id: new FormControl([], Validators.required),
      status: new FormControl('1', Validators.required),
      img: new FormControl(null, []),
    }, {
      validator: MustMatch('user_password', 're_password')
    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }


  private loadSelect2(): void {


    this.karyawanService.getAll().subscribe(x=>{
      this.dataSelectKaryawan=[];

      x['data'].forEach(d => {
        this.dataSelectKaryawan.push({"id":d.id,"text":d.nama});

      });

    });
  }
  onSubmit(){
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let employeeId;
    employeeId=(this.entryForm.get('employee_id').value['id']==null) ?null:this.entryForm.get('employee_id').value['id']

    let dataSubmit :User = {
      'user_full_name': this.entryForm.get('user_full_name').value,
      'user_name': this.entryForm.get('user_name').value,
      'user_password':this.entryForm.get('user_password').value,
      'user_email': this.entryForm.get('user_email').value,
      'status': this.entryForm.get('status').value,
      'employee_id':employeeId,


    };


    this.userService.create(dataSubmit).subscribe(data=>{
      // console.log(data);
      if( data['status']=='OK'){
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
  onClose(){
    this.bsModalRef.hide();
  }

  ngOnInit() {

     this.loadSelect2();

   }
  valueChange($event){
    console.log($event);

  //  let selectedOptions = $event.target['options'];
  //  let selectedIndex = selectedOptions.selectedIndex;
  // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
}
