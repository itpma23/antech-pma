import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { EstSpkKendaraanService } from '../../../shared/services/est_spk_kendaraan.service';
import { GbmOrganisasiService } from '../../../shared/services/gbm_organisasi.service';
import { TrkKendaraanService } from '../../../shared/services/trk_kendaraan.service';
import { GbmSupplierService } from '../../../shared/services/gbm_supplier.service';
import { GbmUomService } from '../../../shared/services/gbm_uom.service';
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
  public dataSelectUom: any[] = [];
  public dataSelectTraksi: any[] = [];
  public dataSelectKendaraan: any[] = [];
  public dataSelectSupplier : any[]=[];

  public options: any;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private estSpkKendaraanService:EstSpkKendaraanService,
    private GbmOrganisasiService:GbmOrganisasiService,
    private GbmSupplierService:GbmSupplierService,
    private GbmUomService:GbmUomService,
    private trkKendaraanService:TrkKendaraanService


    ) {
      let toDate: Date = new Date();

    this.entryForm = this.builder.group({
      lokasi_id: new FormControl([], Validators.required),
      traksi_id: new FormControl([], Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      no_spk: new FormControl('', ),
      kontraktor_id: new FormControl([], Validators.required),
      kendaraan_id: new FormControl([], Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      harga_sewa: new FormControl(0, ),
      harga_mob: new FormControl(0,),
      uom_id: new FormControl([], Validators.required),
      deskripsi: new FormControl('', ),


    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }


  private loadSelect2(): void {


    this.GbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });

      this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {

        let org_id = x.id;
        console.log(x)

        this.GbmOrganisasiService.getAllByType('TRAKSI').subscribe(x => {
          this.dataSelectTraksi = [];
          x.forEach(d => {
            if (d.parent_id == org_id) {
              this.dataSelectTraksi.push({ "id": d.id, "text": d.nama });
            }
          });
          this.entryForm.controls['traksi_id'].valueChanges.subscribe(x => {
            let traksi_id = x.id;
            this.trkKendaraanService.getAll().subscribe(x => {
              this.dataSelectKendaraan = [];
              x['data'].forEach(d => {
                if (d.traksi_id == traksi_id) {
                  this.dataSelectKendaraan.push({ "id": d.id, "text": d.kode + " - " + d.nama });
                }
              });
            })
          });
        });
      });

    });

    this.GbmSupplierService.getKontraktor().subscribe(x => {
      this.dataSelectSupplier = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectSupplier.push({ "id": d.id, "text": d.nama_supplier });
      });
    });
    
    this.GbmUomService.getAll().subscribe(x => {
      this.dataSelectUom = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectUom.push({ "id": d.id, "text": d.nama });
      });
    });

    // this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x=>{
    //   // console.log(x);
    //   this.dataSelectLokasi=[];
    //   x.forEach(d => {
    //     this.dataSelectLokasi.push({"id":d.id,"text":d.nama});
    //   });

    // });

    // this.GbmOrganisasiService.getAllByType('AFDELING').subscribe(x=>{
    //   // console.log(x);
    //   this.dataSelectTraksi=[];
    //   x.forEach(d => {
    //     this.dataSelectTraksi.push({"id":d.id,"text":d.nama});
    //   });

    // });


  }
  onSubmit(){
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let dataSubmit = this.entryForm.value;



    this.estSpkKendaraanService.create(dataSubmit).subscribe(data=>{
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
    const file = (event.target as HTMLInputElement).files![0];
    this.entryForm.patchValue({
      img: file
    });
    this.entryForm.get('img')!.updateValueAndValidity()
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
