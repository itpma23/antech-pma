import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { EstCurahHujan } from 'src/app/shared/models/est_curah_hujan.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { EstCurahHujanService } from 'src/app/shared/services/est_curah_hujan.service';
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
  public dataSelectAfdeling: any[] = [];

  estCurahHujan: EstCurahHujan;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private estCurahHujanService: EstCurahHujanService,
    private GbmOrganisasiService: GbmOrganisasiService


  ) {

    let toDate: Date = new Date();
    this.entryForm = this.builder.group({

      tanggal: new FormControl(toDate, Validators.required),
      lokasi_id: new FormControl([], Validators.required),
      afdeling_id: new FormControl([], Validators.required),
      pagi: new FormControl(0, ),
      sore: new FormControl(0,),
      malam: new FormControl(0, ),



    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    console.log(this.estCurahHujan);

    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.estCurahHujan.tanggal)));
    this.entryForm.controls['pagi'].patchValue(this.estCurahHujan.pagi);
    this.entryForm.controls['sore'].patchValue(this.estCurahHujan.sore);
    this.entryForm.controls['malam'].patchValue(this.estCurahHujan.malam);

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
        if (a.id == this.estCurahHujan.lokasi_id) {
          selectMill = a;
        }

      });
      this.entryForm.controls['lokasi_id'].patchValue(selectMill);

    });
    let org_id = selectMill;
    let selectAfdeling;
    this.GbmOrganisasiService.getAfdStByUnit(org_id).subscribe(x => {
      // console.log(x);
      this.dataSelectAfdeling = [];
      x.forEach(d => {
        this.dataSelectAfdeling.push({ "id": d.id, "text": d.nama });
      });

      this.dataSelectAfdeling.forEach(a => {
        if (a.id == this.estCurahHujan.afdeling_id) {
          selectAfdeling = a;
        }

      });
      this.entryForm.controls['afdeling_id'].patchValue(selectAfdeling);

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
    // console.log(dataSubmit);
    this.estCurahHujanService.update(this.estCurahHujan.id, dataSubmit).subscribe(data => {

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
