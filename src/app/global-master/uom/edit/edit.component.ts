import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { GbmUom } from 'src/app/shared/models/gbm_uom.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { GbmUomService } from 'src/app/shared/services/gbm_uom.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { PksTimbanganService } from 'src/app/shared/services/pks_timbangan.service';
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
  public dataSelectSupplier: any[] = [];
  public dataSelectTimbangan: any[] = [];

  gbmUom: GbmUom;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private gbmUomService: GbmUomService,
    private gbmSupplierService: GbmSupplierService,
    private GbmOrganisasiService: GbmOrganisasiService


  ) {

    let toDate: Date = new Date();
    this.entryForm = this.builder.group({

      kode: new FormControl('', Validators.required),
      nama: new FormControl('', Validators.required),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    console.log(this.gbmUom);

    // this.entryForm.get('tanggal_efektif').patchValue(new Date(Date.parse(this.gbmUom.tanggal_efektif)));
    this.entryForm.controls['kode'].patchValue(this.gbmUom.kode);
    this.entryForm.controls['nama'].patchValue(this.gbmUom.nama);

  }
  private loadSelect2(): void {



    // let selectMill;
    // this.GbmOrganisasiService.getAllByType('MILL').subscribe(x => {
    //   console.log(x);
    //   this.dataSelectLokasi = [];
    //   x.forEach(d => {
    //     this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
    //   });

    //   this.dataSelectLokasi.forEach(a => {
    //     if (a.id == this.gbmUom.lokasi_id) {
    //       selectMill = a;
    //     }

    //   });
    //   this.entryForm.controls['lokasi_id'].patchValue(selectMill);

    // });

    // let selectSupplier;
    // this.gbmSupplierService.getAll().subscribe(x => {

    //   this.dataSelectSupplier = [];
    //   x['data'].forEach(d => {
    //     this.dataSelectSupplier.push({ "id": d.id, "text": d.nama_supplier });
    //   });

    //   this.dataSelectSupplier.forEach(a => {
    //     if (a.id == this.gbmUom.supplier_id) {
    //       selectSupplier = a;
    //     }
    //     this.entryForm.controls['supplier_id'].patchValue(selectSupplier);
    //   });

    // });

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
    // dataSubmit['tanggal']=formatDate( this.entryForm.get('tanggal_efektif').value,"yyyy-MM-dd",'en_US');
    // console.log(dataSubmit);
    this.gbmUomService.update(this.gbmUom.id, dataSubmit).subscribe(data => {

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
