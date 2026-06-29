import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { TrkJenisTraksiService } from 'src/app/shared/services/trk_jenis_traksi.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
import { TrkKendaraanService } from 'src/app/shared/services/trk_kendaraan.service';
import { SlsKontrak } from 'src/app/shared/models/sls_kontrak.model';
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

  public dataSelectTraksi: any[] = [];
  public dataSelectJenisTraksi: any[] = [];
  public dataSelectAkun: any[] = [];
  public dataSelectPemilik: any[] = [];


  public options: any;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private trkJenisTraksiService:TrkJenisTraksiService,
    private trkKendaraanService:TrkKendaraanService,
    private GbmOrganisasiService:GbmOrganisasiService


    ) {
      let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      // tanggal_efektif: new FormControl(toDate, Validators.required),
      traksi_id: new FormControl([], Validators.required),
      jenis_id: new FormControl([], Validators.required),
      kode: new FormControl('', Validators.required),
      nama: new FormControl('', Validators.required),
      no_kendaraan: new FormControl('', ),
      no_mesin: new FormControl('', ),
      no_rangka: new FormControl('', ),
      tahun_perolehan: new FormControl(0, ),
      berat_kosong: new FormControl(0, ),
      kepemilikan: new FormControl([], Validators.required),
      nama_pemilik: new FormControl('', ),
      is_nonaktif: new FormControl(0),


    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }


  private loadSelect2(): void {
    
    this.dataSelectPemilik = [
      { id: 'SEWA', text: 'SEWA' },
      { id: 'ASET', text: 'ASET' },
    ];

    this.GbmOrganisasiService.getAllByType('TRAKSI').subscribe(x=>{
      console.log(x);
      this.dataSelectTraksi=[];
      x.forEach(d => {
        this.dataSelectTraksi.push({"id":d.id,"text":d.nama});
      });

    });

    // this.pksPengolahanService.getAll().subscribe(x=>{
    //   console.log(x);
    //   this.dataSelectPengolahan=[];
    //   x['data'].forEach(d => {
    //     this.dataSelectPengolahan.push({"id":d.id,"text":d.no_transaksi});
    //   });

    // });

    this.trkJenisTraksiService.getAll().subscribe(x=>{
      console.log(x);
      this.dataSelectJenisTraksi=[];
      x['data'].forEach(d => {
        this.dataSelectJenisTraksi.push({"id":d.id,"text":d.nama});
      });

    });

    

  }
  onSubmit(){
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let dataSubmit = this.entryForm.value;



    this.trkKendaraanService.create(dataSubmit).subscribe(data=>{
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
