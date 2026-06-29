import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { AccKegiatanKelompokService } from 'src/app/shared/services/acc_kegiatan_kelompok.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
import { AccKegiatanService } from 'src/app/shared/services/acc_kegiatan.service';
import { formatDate } from '@angular/common';
import { GbmUomService } from 'src/app/shared/services/gbm_uom.service';

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
  public dataSelectKegiatan: any[] = [];
  public dataSelectAkun: any[] = [];
  public dataSelectTipeKegiatan: any[] = [];

  public options: any;
  dataSelectSatuan: any[];


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private accKegiatanKelompokService:AccKegiatanKelompokService,
    private accKegiatanService:AccKegiatanService,
    private accAkunService:AccAkunService,
    private gbmUomService: GbmUomService,


    ) {
      let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      // tanggal_efektif: new FormControl(toDate, Validators.required),
      acc_akun_id: new FormControl([], Validators.required),
      kegiatan_kelompok_id: new FormControl([], Validators.required),
      tipe_kegiatan_id: new FormControl([], Validators.required),
      kode: new FormControl('', Validators.required),
      nama: new FormControl('', Validators.required),
      is_pemeliharaan: new FormControl(0, Validators.required),
      is_bahan: new FormControl(0, Validators.required),
      is_traksi: new FormControl(0, Validators.required),
      is_umum: new FormControl(0, Validators.required),
      is_premi_otomatis: new FormControl(0, Validators.required),
      is_traksi_mill: new FormControl(0, Validators.required),
      basis: new FormControl(0, Validators.required),
      premi_basis: new FormControl(0, Validators.required),
      premi_lebih_basis: new FormControl(0, Validators.required),
      uom_id: new FormControl([], Validators.required),


    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }


  private loadSelect2(): void {
    this.dataSelectTipeKegiatan = [
      { id: 'PNN', text: 'PANEN' },
      { id: 'PML', text: 'PEMELIHARAAN' },
      { id: 'PMK', text: 'PEMUPUKAN' },
      { id: 'UMM', text: 'UMUM' },
      { id: 'TRK', text: 'TRAKSI' },
      { id: 'WRK', text: 'WORKSHOP' },
      { id: 'MIL', text: 'MILL' },
      { id: 'LAIN', text: 'LAINNYA' },

    ];

    this.accKegiatanKelompokService.getAll().subscribe(x=>{
      console.log(x);
      this.dataSelectKegiatan=[];
      x['data'].forEach(d => {
        this.dataSelectKegiatan.push({"id":d.id,"text":d.nama});
      });

    });

    this.accAkunService.getAllDetail().subscribe(x=>{
      console.log(x);
      this.dataSelectAkun=[];
      x['data'].forEach(d => {
        this.dataSelectAkun.push({"id":d.id,"text":d.kode+" - "+d.nama});
      });

    });
    this.gbmUomService.getAll().subscribe(x => {
      this.dataSelectSatuan = [];
     let data=x['data'];
      data.forEach(d => {
        this.dataSelectSatuan.push({ "id": d.id, "text": d.nama });

      });

    });

  }
  onSubmit(){
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let dataSubmit = this.entryForm.value;



    this.accKegiatanService.create(dataSubmit).subscribe(data=>{
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
