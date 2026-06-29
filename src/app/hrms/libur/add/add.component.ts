import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators,FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { HrmsLiburService } from 'src/app/shared/services/hrms_libur.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { formatDate } from '@angular/common';

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
		containerClass: 'theme-red',
  
	
}
  entryForm: FormGroup;
  event: EventEmitter<any>=new EventEmitter();

  public dataSelectLokasi: any[] = [];
  public dataSelectTipe: any[] = [];


  public options: any;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private hrmsTipeLiburService:HrmsLiburService,
    private GbmOrganisasiService:GbmOrganisasiService


    ) {
      let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      
      
      tipe_libur:  new FormControl([],Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      details: this.builder.array([])


    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }


  private loadSelect2(): void {

    this.dataSelectTipe = [
      { id: 'Minggu', text: 'MINGGU' },
      { id: 'Nasional', text: 'LIBUR NASIONAL' },
      { id: 'HariRaya', text: 'HARI RAYA' },
    ];

    this.GbmOrganisasiService.getAllAdmUnit().subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
    });

    // this.GbmOrganisasiService.getAllByType('MILL').subscribe(x=>{
    //   console.log(x);
    //   this.dataSelectLokasi=[];
    //   x.forEach(d => {
    //     this.dataSelectLokasi.push({"id":d.id,"text":d.nama});
    //   });

    // });


  

  }
  onSubmit(){
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let dataSubmit = this.entryForm.value;
    dataSubmit['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');


    this.hrmsTipeLiburService.create(dataSubmit).subscribe(data=>{
      console.log(data);
      if( data['status']=='OK'){
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
      }else{
        swal({
          title: 'Perhatian!',
          text: 'Proses Simpan Gagal' ,
          type: 'warning',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
      }
    });
  }

  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };

  addBlok() {
    this.details.push(this.builder.group({
    lokasi_id: new FormControl([],Validators.required),
    }));
}


  removeBlok(blok) {
  let i = this.details.controls.indexOf(blok);
    if (i != -1) {
      let detail = this.entryForm.get('details') as FormArray;
      detail.removeAt(i);
      let data = { details: detail.value };
      this.updateForm(data);
    }
  }

  updateForm(data) {

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
