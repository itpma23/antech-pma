import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { EstTaksasiService } from 'src/app/shared/services/est_taksasi.service';
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
  public dataSelectAfdeling: any[] = [];
  public dataSelectBlok: any[] = [];


  public options: any;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private estTaksasiService:EstTaksasiService,
    private GbmOrganisasiService:GbmOrganisasiService


    ) {
      let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      
      lokasi_id: new FormControl([], Validators.required),
      afdeling_id: new FormControl([], Validators.required),
      blok_id: new FormControl([], Validators.required),
      tanggal: new FormControl(toDate, Validators.required),

      ha_sisa: new FormControl(0, ),
      ha_besok: new FormControl(0,),
      jumlah_pokok: new FormControl(0, ),
      persen_buah_matang: new FormControl(0, ),
      jjg_output: new FormControl(0, ),
      hk: new FormControl(0, ),
      bjr: new FormControl(0, ),
      berat_kg: new FormControl(0, ),
      seksi_panen: new FormControl(0, ),


    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }


  private loadSelect2(): void {

    // this.GbmOrganisasiService.getAllByType('Estate').subscribe(x => {
    //   this.dataSelectLokasi = [];
    //   x.forEach(d => {
    //     this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
    //   });
    //   this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {
        
    //     let org_id = x.id;
    //     this.GbmOrganisasiService.getAfdelingByEstate(org_id).subscribe(x => {
    //       this.dataSelectAfdeling = [];
    //       x.forEach(d => {
    //         this.dataSelectAfdeling.push({ "id": d.id, "text": d.nama });
    //       });
    //       this.entryForm.controls['afdeling_id'].valueChanges.subscribe(x => {
            
    //       });
    //     });

    //   });

    // });

    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x=>{
      // console.log(x);
      this.dataSelectLokasi=[];
      x.forEach(d => {
        this.dataSelectLokasi.push({"id":d.id,"text":d.nama});
      });

    });

    this.GbmOrganisasiService.getAllByType('AFDELING').subscribe(x=>{
      // console.log(x);
      this.dataSelectAfdeling=[];
      x.forEach(d => {
        this.dataSelectAfdeling.push({"id":d.id,"text":d.nama});
      });

    });

    this.GbmOrganisasiService.getAllByType('BLOK').subscribe(x=>{
      // console.log(x);
      this.dataSelectBlok=[];
      x.forEach(d => {
        this.dataSelectBlok.push({"id":d.id,"text":d.nama});
      });

    });


  }
  onSubmit(){
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let dataSubmit = this.entryForm.value;



    this.estTaksasiService.create(dataSubmit).subscribe(data=>{
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
