import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { PksMesinLogService } from 'src/app/shared/services/pks_mesin_log.service';
import { PksTankiService } from 'src/app/shared/services/pks_tanki.service';
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

  public dataSelectTanki: any[] = [];
  public dataSelectSimbol: any[] = [];
  public dataSelectMesin: any[] = [];


  public options: any;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private pksHargaTbsService:PksMesinLogService,
    private pksTankiService:PksTankiService,
    private GbmOrganisasiService:GbmOrganisasiService,
    private PksMesinLogService:PksMesinLogService,


    ) {
      let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      mesin_id: new FormControl([], Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      km_hm_awal: new FormControl(0, Validators.required),
      km_hm_akhir: new FormControl(0, Validators.required),
      ket: new FormControl('', Validators.required),


    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }


  private loadSelect2(): void {

    this.dataSelectSimbol = [
      { id: 'A', text: 'A' },
      { id: 'B', text: 'B' },
      { id: 'C', text: 'C' },
      { id: 'D', text: 'D' },
      { id: 'E', text: 'E' },
      { id: 'F', text: 'F' },
      { id: 'G', text: 'G' },
      { id: 'H', text: 'H' },
      { id: 'I', text: 'I' },
      { id: 'J', text: 'J' },
      { id: 'K', text: 'K' },
      { id: 'L', text: 'L' },
    ];

    this.pksTankiService.getAll().subscribe(x=>{
      console.log(x);
      this.dataSelectTanki=[];
      x['data'].forEach(d => {
        this.dataSelectTanki.push({"id":d.id,"text":d.nama_tanki});
      });
    });

    this.GbmOrganisasiService.getAllByType("MESIN").subscribe(x=>{
      this.dataSelectMesin=[];
      x.forEach(d => {
        this.dataSelectMesin.push({"id":d.id,"text":d.nama});
      });
    });


    this.entryForm.controls['mesin_id'].valueChanges.subscribe(x=> {
      let mesin_id = x.id;
      this.PksMesinLogService.getKm(mesin_id).subscribe(x=>{
        let mesin = x['data'];
        this.entryForm.get("km_hm_awal").patchValue(mesin.km_hm_akhir);
      });
    });

  }
  onSubmit(){
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let dataSubmit = this.entryForm.value;



    this.pksHargaTbsService.create(dataSubmit).subscribe(data=>{
      // console.log(data);
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
