import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { BgtProduksiService } from 'src/app/shared/services/bgt_produksi.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { AccKegiatanService } from 'src/app/shared/services/acc_kegiatan.service';
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
  public dataSelectKegiatan: any[] = [];

  public options: any;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private bgtProduksiService:BgtProduksiService,
    private GbmOrganisasiService:GbmOrganisasiService,
    private accKegiatanService:AccKegiatanService




    ) {
      let toDate: Date = new Date();

    this.entryForm = this.builder.group({

     
      // kegiatan_id: new FormControl([], Validators.required),
      lokasi_id: new FormControl([], Validators.required),
      afdeling_id: new FormControl([], Validators.required),
      tahun: new FormControl(0,),
      b01: new FormControl(0, ),
      b02: new FormControl(0,),
      b03: new FormControl(0, ),
      b04: new FormControl(0, ),
      b05: new FormControl(0,),
      b06: new FormControl(0, ),
      b07: new FormControl(0, ),
      b08: new FormControl(0, ),
      b09: new FormControl(0,),
      b10: new FormControl(0, ),
      b11: new FormControl(0, ),
      b12: new FormControl(0, ),


    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }


  private loadSelect2(): void {

    this.accKegiatanService.getAll().subscribe(x => {
      this.dataSelectKegiatan = [];
      x['data'].forEach(d => {
        this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama +' - '+ d.kode });
      });
    });

    this.GbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
      
      this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {
        
        let org_id = x.id;
        console.log(x)
        this.GbmOrganisasiService.getAfdelingByEstateAndUser(org_id).subscribe(x => {
          console.log(x)
          this.dataSelectAfdeling = [];
          x.forEach(d => {
            this.dataSelectAfdeling.push({ "id": d.id, "text": d.nama });
          });
          this.entryForm.controls['afdeling_id'].valueChanges.subscribe(x => {
            
          });
        });

      });

    });


  }
  onSubmit(){
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let dataSubmit = this.entryForm.value;



    this.bgtProduksiService.create(dataSubmit).subscribe(data=>{
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
