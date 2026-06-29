import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";
import { formatDate } from '@angular/common';
import { MenuService } from 'src/app/shared/services/menu.service';
import { Menu } from 'src/app/shared/models/menu.model';
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'edit-cmp',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.css'],
})

export class EditComponent implements OnInit,AfterViewInit{
  isFormSubmitted=false;
  isChangePhoto=false;
	datepickerConfig = {
		dateInputFormat: 'DD-MM-YYYY',
		containerClass: 'theme-red'
	}
  entryForm: FormGroup;
  event: EventEmitter<any>=new EventEmitter();
  menu:Menu;
  public dataSelect: any[] = [];
  public dataSelectAgama: any[] = [];
  public dataSelectMenu: any[] = [];

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private menuService:MenuService
    ) {
      this.entryForm = this.builder.group({

      name: new FormControl('', Validators.required),
      text: new FormControl('', Validators.required),
      url: new FormControl('', []),
      icon: new FormControl('',[]),
      is_child: new FormControl('0', Validators.required),
      sort_order: new FormControl(1, []),
        parent_id: new FormControl([]),

      });


  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
     this.entryForm.controls['name'].patchValue(this.menu.name);
     this.entryForm.controls['text'].patchValue(this.menu.text);
     this.entryForm.controls['url'].patchValue(this.menu.url);
     this.entryForm.controls['is_child'].patchValue(this.menu.is_child);
     this.entryForm.controls['icon'].patchValue(this.menu.icon);
     this.entryForm.controls['sort_order'].patchValue(this.menu.sort_order);


  }

  // getMenu(id:any){
  //   let menu=[];
  //   for (let index = 0; index <  this.dataSelectMenu.length; index++) {
  //     const el =  this.dataSelectMenu[index];
  //     if (el.id==id){
  //       return el;

  //     }
  //   }
  //   return menu;
  // }
  private loadSelect2(): void {
    let menuParent;
    this.menuService.getAllParent().subscribe(x=>{
      this.dataSelectMenu=[];
      x.forEach(d => {
        this.dataSelectMenu.push({"id":d.id,"text":d.name});
        if (d.id==this.menu.parent_id && this.menu.parent_id!=0){
         menuParent={"id":d.id,"text":d.name}

        }
      });
      console.log(this.menu.parent_id);
      console.log(menuParent);
      if (menuParent !=null ) this.entryForm.controls['parent_id'].patchValue(menuParent);

    });

  }
  onSubmit(){
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }
    let parent_id=this.entryForm.get('parent_id').value==null?0: this.entryForm.get('parent_id').value['id'];

    let dataSubmit :Menu = {
      'name': this.entryForm.get('name').value,
     'parent_id':parent_id,
     'text':this.entryForm.get('text').value,
     'url':this.entryForm.get('url').value,
     'icon':this.entryForm.get('icon').value,
     'is_child':this.entryForm.get('is_child').value,
     'sort_order':this.entryForm.get('sort_order').value

   };
     console.log(dataSubmit);

    this.menuService.update(this.menu.id,dataSubmit).subscribe(data=>{
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
  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.entryForm.patchValue({
      img: file
    });
    this.entryForm.get('img').updateValueAndValidity();
    this.isChangePhoto=true;
    console.log(this.isChangePhoto);
 }
}
