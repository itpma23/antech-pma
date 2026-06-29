import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { PksMaintenanceMesin } from 'src/app/shared/models/pks_maintenance_mesin';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { PksMaintenanceMesinService } from 'src/app/shared/services/pks_maintenance_mesin.service';
import { PksJenisMaintenanceService } from 'src/app/shared/services/pks_jenis_maintenance.service';
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
  public dataSelectMesin: any[] = [];
  public dataSelectJenis: any[] = [];
  public dataSelectTimbangan: any[] = [];

  pksMaintenanceMesin: PksMaintenanceMesin;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private pksMaintenanceMesinService: PksMaintenanceMesinService,
    private pksJenisMaintenanceService: PksJenisMaintenanceService,
    private GbmOrganisasiService: GbmOrganisasiService


  ) {

    let toDate: Date = new Date();
    this.entryForm = this.builder.group({

      mesin_id: new FormControl([], Validators.required),
      jenis_mesin_id: new FormControl([], Validators.required),
      hm_km: new FormControl(0, Validators.required),
      hm_km_maintenance: new FormControl(0, Validators.required),
      ket: new FormControl('', Validators.required),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    console.log(this.pksMaintenanceMesin);

    // this.entryForm.get('tanggal_efektif').patchValue(new Date(Date.parse(this.pksMaintenanceMesin.tanggal_efektif)));
    this.entryForm.controls['hm_km'].patchValue(this.pksMaintenanceMesin.hm_km);
    this.entryForm.controls['hm_km_maintenance'].patchValue(this.pksMaintenanceMesin.hm_km_maintenance);
    this.entryForm.controls['ket'].patchValue(this.pksMaintenanceMesin.ket);

  }
  private loadSelect2(): void {



    let selectMesin;
    this.GbmOrganisasiService.getAllByType('MESIN').subscribe(x => {

      this.dataSelectMesin = [];
      x.forEach(d => {
        this.dataSelectMesin.push({ "id": d.id, "text":d.kode+" - "+d.nama });
      });

      this.dataSelectMesin.forEach(a => {
        if (a.id == this.pksMaintenanceMesin.mesin_id) {
          selectMesin = a;
        }

      });
      this.entryForm.controls['mesin_id'].patchValue(selectMesin);

    });

    let selectJenis;
    this.pksJenisMaintenanceService.getAll().subscribe(x => {

      this.dataSelectJenis = [];
      x['data'].forEach(d => {
        this.dataSelectJenis.push({ "id": d.id, "text": d.kode+" - "+d.keterangan });
      });

      this.dataSelectJenis.forEach(a => {
        if (a.id == this.pksMaintenanceMesin.jenis_mesin_id) {
          selectJenis = a;
        }
        this.entryForm.controls['jenis_mesin_id'].patchValue(selectJenis);
      });

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
    // dataSubmit['tanggal']=formatDate( this.entryForm.get('tanggal_efektif').value,"yyyy-MM-dd",'en_US');
    console.log(dataSubmit);
    this.pksMaintenanceMesinService.update(this.pksMaintenanceMesin.id, dataSubmit).subscribe(data => {

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
