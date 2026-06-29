import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { AccAssetService } from 'src/app/shared/services/acc_asset.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { PksPengolahanService } from 'src/app/shared/services/pks_pengolahan.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { AccAssetTipeService } from 'src/app/shared/services/acc_asset_tipe.service';
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
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

  public dataSelectLokasi: any[] = [];
  public dataSelectAssetTipe: any[] = [];
  public dataSelectPosisiAsset: any[] = [];
  public dataSelectAkunPenyusutan: any[] = [];
  public dataSelectMetodePenyusutan: any[] = [];
  public dataSelectStatus: any[] = [];


  public options: any;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private AccAssetService:AccAssetService,
    private gbmSupplierService:GbmSupplierService,
    private GbmOrganisasiService:GbmOrganisasiService,
    private AccAssetTipeService: AccAssetTipeService,
    private AccAkunService: AccAkunService,


    ) {
      let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      // tanggal_efektif: new FormControl(toDate, Validators.required),
      lokasi_id: new FormControl([], Validators.required),
      kode: new FormControl('', Validators.required),
      nama: new FormControl('', Validators.required),
      asset_tipe_id: new FormControl([], Validators.required),
      tgl_beli: new FormControl(toDate, Validators.required),
      tgl_mulai_pakai: new FormControl(toDate, Validators.required),
      harga_beli: new FormControl(0, Validators.required),
      nilai_asset: new FormControl(0, Validators.required),
      nilai_residu: new FormControl(0, Validators.required),
      posisi_asset_id: new FormControl([], Validators.required),
      status: new FormControl([], Validators.required),
      lama_bulan_penyusutan: new FormControl(0, Validators.required),
      metode_penyusutan: new FormControl([], Validators.required),
      ket: new FormControl('', Validators.required),
      akun_penyusutan_id: new FormControl([], Validators.required),
      

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }


  private loadSelect2(): void {


    this.dataSelectStatus = [
      { id: 'AKTIF', text: 'AKTIF' },
      { id: 'TIDAK AKTIF', text: 'TIDAK AKTIF' },
      { id: 'TIDAK DAPAT DIGUNAKAN', text: 'TIDAK DAPAT DIGUNAKAN' },
      { id: 'HILANG', text: 'HILANG' },
      { id: 'NILAI BUKU HABIS', text: 'NILAI BUKU HABIS' },
    ];

    this.dataSelectMetodePenyusutan = [
      { id: 'STRAIGHT', text: 'STRAIGHT' },
      { id: 'DOUBLE', text: 'DOUBLE' },
    ];

    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x=>{
      this.dataSelectLokasi=[];
      x.forEach(d => {
        this.dataSelectLokasi.push({"id":d.id,"text":d.nama});
      });
    });

    this.AccAssetTipeService.getAll().subscribe(x=> {
      this.dataSelectAssetTipe=[];
      x['data'].forEach(d=> {
        this.dataSelectAssetTipe.push({"id":d.id, "text":d.nama});
      });
    });

    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x=>{
      this.dataSelectPosisiAsset=[];
      x.forEach(d => {
        this.dataSelectPosisiAsset.push({"id":d.id,"text":d.nama});
      });
    });

    this.AccAkunService.getAll().subscribe(x=> {
      this.dataSelectAkunPenyusutan=[];
      x['data'].forEach(d=> {
        this.dataSelectAkunPenyusutan.push({"id":d.id, "text": "("+d.kode+") "+d.nama});
      });
    });    



  }
  onSubmit(){
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let dataSubmit = this.entryForm.value;



    this.AccAssetService.create(dataSubmit).subscribe(data=>{
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
onClose() {
    if (!this.entryForm.dirty) {
      // form belum diapa-apakan → langsung close
      this.bsModalRef.hide();
      return;
    }

    // form sudah ada isi / perubahan → munculkan swal
    let that = this;
    swal({
      title: 'Yakin akan Menutup?',
      text: "Data yang sudah diubah akan hilang!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      buttonsStyling: false
    }).then(function () {
      that.bsModalRef.hide();
    });
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
