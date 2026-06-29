import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { PksProduksiHarianService } from 'src/app/shared/services/pks_produksi_harian.service';
declare var $: any;
declare var swal: any;
@Component({
    moduleId: module.id,
    selector: 'proses-cmp',
    templateUrl: 'proses.component.html',
    styleUrls: ['proses.component.css'],
})

export class ProsesComponent implements OnInit,AfterViewInit{
  isFormSubmitted=false;
	datepickerConfig = {
		dateInputFormat: 'DD-MM-YYYY',
		containerClass: 'theme-red'
	}
  entryForm: FormGroup;

  event: EventEmitter<any>=new EventEmitter();
  public options: any;
  dataSelectOrganisasi: any[];
  isFormProduksiSubmitted: boolean;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private gbmOrganisasiService: GbmOrganisasiService,
    private pksProduksiHarianService:PksProduksiHarianService,

    ) {
      let toDate: Date = new Date();
      this.entryForm = this.builder.group({
        lokasi: new FormControl([], Validators.required),

        tanggal_mulai: new FormControl(toDate, Validators.required),
        tanggal_akhir: new FormControl(toDate, Validators.required),

      });



  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }

  private loadSelect2(): void {
    this.gbmOrganisasiService.getAllByType("MILL").subscribe(x=>{
      this.dataSelectOrganisasi=[];
      x.forEach(d => {
        this.dataSelectOrganisasi.push({"id":d.id,"text":d.nama});
      });
    });


  }

  proses(){
    this.isFormProduksiSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    let lokasi_id = (this.entryForm.controls['lokasi'].value!=null)?this.entryForm.controls['lokasi'].value['id']:null ;
    let data={
     mill_id: lokasi_id,
      tgl_mulai: formatDate(this.entryForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      tgl_akhir: formatDate(this.entryForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };
    this.pksProduksiHarianService.proses(data).subscribe(data=>{
      // console.log(data);
      if( data['status']=='OK'){
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Proses berhasil',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })

        this.event.emit('OK');
        this.bsModalRef.hide();
      }else{
        swal({
          title: 'Perhatian!',
          text: 'Proses Gagal' ,
          type: 'warning',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
      }
    });

  }
  // import(){
  //   this.isFormSubmitted = true;
  //   if (this.entryForm.invalid) {
  //     return;
  //   }
  //   let frmData=new FormData();

  //   frmData.append("userfile", this.entryForm.get('file').value);
  //   // console.log(this.entryForm.get('img').value);

  //   this.hrmsAbsensiService.import(frmData).subscribe(data=>{
  //     // console.log(data);
  //     if( data['status']=='OK'){
  //       console.log('ok');
  //       this.event.emit('OK');
  //       this.bsModalRef.hide();
  //     }
  //   });
  // }

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
