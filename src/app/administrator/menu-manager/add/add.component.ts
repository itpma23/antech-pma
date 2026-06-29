import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { formatDate } from '@angular/common';
import { MenuService } from 'src/app/shared/services/menu.service';
import { Menu } from 'src/app/shared/models/menu.model';

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

  public options: any;
  parent=null;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private menuService:MenuService,

    ) {
    this.entryForm = this.builder.group({

      name: new FormControl('', Validators.required),
      text: new FormControl('', Validators.required),
      url: new FormControl('', []),
      icon: new FormControl('',[]),
      is_child: new FormControl('0', Validators.required),
      sort_order: new FormControl(1, []),


    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }


  private loadSelect2(): void {



    // this.menuService.getAllChild().subscribe(x=>{
    //   this.dataSelectKelas=[];
    //   x.forEach(d => {
    //     this.dataSelectKelas.push({"id":d.id,"text":d.nama});

    //   });

    // });
  }
  onSubmit(){
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let dataSubmit :Menu = {
       'name': this.entryForm.get('name').value,
      'parent_id':this.parent,
      'text':this.entryForm.get('text').value,
      'url':this.entryForm.get('url').value,
      'icon':this.entryForm.get('icon').value,
      'is_child':this.entryForm.get('is_child').value,
      'sort_order':this.entryForm.get('sort_order').value

    };
    this.menuService.create(dataSubmit).subscribe(data=>{
      console.log(data);
      if( data['status']=='OK'){
        console.log('ok');
        swal({
          title: 'Save!',
          text: 'Data has been Saved successfully.',
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

    // this.loadSelect2();

   }
  valueChange($event){
    console.log($event);
  }
}
