import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { EstPotonganKaryawanService } from 'src/app/shared/services/est_potongan_karyawan.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
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
  public dataSelectKaryawan: any[] = [];
  public dataSelectKegiatan: any[] = [];


  public options: any;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private estPotonganKaryawanService:EstPotonganKaryawanService,
    private GbmOrganisasiService:GbmOrganisasiService,
    private KaryawanService:KaryawanService,
    private AccKegiatanService:AccKegiatanService,


    ) {
      let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      
      lokasi_id: new FormControl([], Validators.required),
      karyawan_id: new FormControl([], Validators.required),
      kegiatan_id: new FormControl([], Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      nilai_potongan: new FormControl(0, Validators.required),


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


    let id_lokasi;
    this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x=>{
      id_lokasi = x.id;
      this.KaryawanService.getAll().subscribe(x=>{
        // console.log(x);
        this.dataSelectKaryawan=[];
        x['data'].forEach(d => {
          if (id_lokasi == d.lokasi_tugas_id) {
            this.dataSelectKaryawan.push({"id":d.id,"text":"("+d.sub_bagian_nama+") "+d.nip+" - "+d.nama});
          }
        });
      });
    });


    this.AccKegiatanService.getAll().subscribe(x=>{
      // console.log(x);
      this.dataSelectKegiatan=[];
      x['data'].forEach(d => {
        this.dataSelectKegiatan.push({"id":d.id,"text":"("+d.kode+") "+d.nama});
      });
    });


  }
  onSubmit(){
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let dataSubmit = this.entryForm.value;



    this.estPotonganKaryawanService.create(dataSubmit).subscribe(data=>{
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
