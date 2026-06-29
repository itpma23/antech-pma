import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { AccJurnalEntryService } from 'src/app/shared/services/acc_jurnal_entry.service';
import { formatDate } from '@angular/common';

// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';
// import SimpleuploadPlugin from 'ckeditor5-simple-upload/src/simpleupload';
declare var $: any;
@Component({
    moduleId: module.id,
    selector: 'import-cmp',
    templateUrl: 'import.component.html',
    styleUrls: ['import.component.css'],
})

export class ImportComponent implements OnInit,AfterViewInit{
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
  public dataSelectKelas: any[] = [];
  public options: any;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private accJurnalEntryService:AccJurnalEntryService,

    ) {
      this.entryForm = this.builder.group({
        file: new FormControl(null, Validators.required),

      });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }

  private loadSelect2(): void {

  }
  import(){
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let frmData=new FormData();

    frmData.append("userfile", this.entryForm.get('file').value);
    // console.log(this.entryForm.get('img').value);
   let res;
    this.accJurnalEntryService.import(frmData).subscribe(data=>{
      console.log(data);
      if( data['status']=='OK'){
        res={data:data['data'],status:'OK'}
        this.event.emit(res);
        this.bsModalRef.hide();
      }
    });
  }

  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.entryForm.patchValue({
      file: file
    });
    this.entryForm.get('file').updateValueAndValidity()
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
