import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from '../../../app.constants';
import { EstSpkKendaraan } from '../../../shared/models/est_spk_kendaraan.model';
import { GbmOrganisasiService } from '../../../shared/services/gbm_organisasi.service';
import { TrkKendaraanService } from '../../../shared/services/trk_kendaraan.service';
import { EstSpkKendaraanService } from '../../../shared/services/est_spk_kendaraan.service';
import { GbmSupplierService } from '../../../shared/services/gbm_supplier.service';
import { GbmUomService } from '../../../shared/services/gbm_uom.service';
declare var $: any;
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'edit-cmp',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.css'],
})

export class EditComponent implements OnInit, AfterViewInit {
  isFormSubmitted = false;
  isChangePhoto = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();
  public dataSelectLokasi: any[] = [];
  public dataSelectTraksi: any[] = [];
  public dataSelectKendaraan: any[] = [];
  public dataSelectSupplier: any[] = [];
  public dataSelectUom: any[] = [];


  estSpkKendaraan: EstSpkKendaraan;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private estSpkKendaraanService: EstSpkKendaraanService,
    private trkKendaraanService: TrkKendaraanService,
    private gbmSupplierService: GbmSupplierService,
    private GbmUomService: GbmUomService,
    private GbmOrganisasiService: GbmOrganisasiService


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
    console.log(this.estSpkKendaraan);
    this.entryForm.controls['no_spk'].patchValue(this.estSpkKendaraan.no_spk);
    this.entryForm.get('tanggal')!.patchValue(new Date(Date.parse(this.estSpkKendaraan.tanggal)));
    this.entryForm.get('tanggal_mulai')!.patchValue(new Date(Date.parse(this.estSpkKendaraan.tanggal_mulai)));
    this.entryForm.get('tanggal_akhir')!.patchValue(new Date(Date.parse(this.estSpkKendaraan.tanggal_akhir)));
    this.entryForm.controls['harga_sewa']!.patchValue(this.estSpkKendaraan.harga_sewa);
    this.entryForm.controls['harga_mob']!.patchValue(this.estSpkKendaraan.harga_mob);
    this.entryForm.controls['deskripsi']!.patchValue(this.estSpkKendaraan.deskripsi);

  }
  private loadSelect2(): void {



    let selectMill;
    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      // console.log(x);
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
      this.dataSelectLokasi.forEach(a => {
        if (a.id == this.estSpkKendaraan.lokasi_id) {
          selectMill = a;
        }
      });
      this.entryForm.controls['lokasi_id'].patchValue(selectMill);
    });



    this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {
      let org_id = x.id;
      let selectedTraksi;
      this.GbmOrganisasiService.getAllByType('TRAKSI').subscribe(x => {
        this.dataSelectTraksi = [];
        x.forEach(d => {
          if (d.parent_id == org_id) {
            this.dataSelectTraksi.push({ "id": d.id, "text": d.nama });
            if (this.estSpkKendaraan.traksi_id == d.id) {
              selectedTraksi = { "id": d.id, "text": d.nama }
            }
          }
        });
        this.entryForm.get('traksi_id').patchValue(selectedTraksi);
      });

    });

    this.entryForm.controls['traksi_id'].valueChanges.subscribe(x => {
      let traksi_id = x.id;
      let selectedKendaraan;
      this.trkKendaraanService.getAll().subscribe(x => {
        this.dataSelectKendaraan = [];
        x['data'].forEach(d => {
          if (d.traksi_id == traksi_id) {
            this.dataSelectKendaraan.push({ "id": d.id, "text": d.kode + " - " + d.nama });
            if (this.estSpkKendaraan.kendaraan_id == d.id) {
              selectedKendaraan = { "id": d.id, "text": d.kode + " - " + d.nama }
            }
          }
        });
        this.entryForm.get('kendaraan_id').patchValue(selectedKendaraan);
      });
    });

    let selectedSupplier;
    this.gbmSupplierService.getAll().subscribe(x => {
      this.dataSelectSupplier = [];
      x['data'].forEach(d => {
        this.dataSelectSupplier.push({ "id": d.id, "text": d.nama_supplier });
        if (this.estSpkKendaraan.kontraktor_id == d.id) {
          selectedSupplier = { "id": d.id, "text": d.nama_supplier };
        }
      });
      this.entryForm.get('kontraktor_id').patchValue(selectedSupplier);
    });

    let selectedUom;
    this.GbmUomService.getAll().subscribe(x => {
      this.dataSelectUom = [];
      x['data'].forEach(d => {
        this.dataSelectUom.push({ "id": d.id, "text": d.nama });
        if (this.estSpkKendaraan.uom_id == d.id) {
          selectedUom = { "id": d.id, "text": d.nama };
        }
      });
      this.entryForm.get('uom_id').patchValue(selectedUom);
    });



  }

  onSubmit() {
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    // let frmData=new FormData();
    // if (this.entryForm.invalid) {
    //   return;
    // }
    let dataSubmit = this.entryForm.value;
    console.log(this.entryForm.value);
    dataSubmit['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');
    dataSubmit['tanggal_mulai']=formatDate( this.entryForm.get('tanggal_mulai').value,"yyyy-MM-dd",'en_US');
    dataSubmit['tanggal_akhir']=formatDate( this.entryForm.get('tanggal_akhir').value,"yyyy-MM-dd",'en_US');
    // console.log(dataSubmit);
    this.estSpkKendaraanService.update(this.estSpkKendaraan.id, dataSubmit).subscribe(data => {

      if (data['status'] == 'OK') {
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
      } else {
        swal({
          title: 'Perhatian!',
          text: 'Proses Simpan Gagal',
          type: 'warning',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
      }
    });
  }



  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {

    this.loadSelect2();

  }
  valueChange($event) {
    console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.entryForm.patchValue({
      img: file
    });
    this.entryForm.get('img').updateValueAndValidity();
    this.isChangePhoto = true;
    console.log(this.isChangePhoto);
  }
}
