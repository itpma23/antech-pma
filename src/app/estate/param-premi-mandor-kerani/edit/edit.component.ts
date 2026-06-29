import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { EstParamPremiMandorKerani } from 'src/app/shared/models/est_param_premi_mandor_kerani.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { HrmsJabatanService } from 'src/app/shared/services/hrms_jabatan.service';
import { EstParamPremiMandorKeraniService } from 'src/app/shared/services/est_param_premi_mandor_kerani.service';
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
  public dataSelectBlok: any[] = [];
  public dataSelectJabatan: any[] = [];

  estParamPremiMandorKerani: EstParamPremiMandorKerani;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private estParamPremiMandorKeraniService: EstParamPremiMandorKeraniService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private HrmsJabatanService:HrmsJabatanService,


  ) {

    let toDate: Date = new Date();
    this.entryForm = this.builder.group({

      lokasi_id: new FormControl([], Validators.required),
      jabatan_id: new FormControl([], Validators.required),

      // tanggal: new FormControl(toDate, Validators.required),

      persen_premi: new FormControl(0),
      jumlah_karyawan: new FormControl(0),



    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    console.log(this.estParamPremiMandorKerani);

    // this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.estParamPremiMandorKerani.tanggal)));
    this.entryForm.controls['persen_premi'].patchValue(this.estParamPremiMandorKerani.persen_premi);
    this.entryForm.controls['jumlah_karyawan'].patchValue(this.estParamPremiMandorKerani.jumlah_karyawan);

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
        if (a.id == this.estParamPremiMandorKerani.lokasi_id) {
          selectMill = a;
        }
      });
      this.entryForm.controls['lokasi_id'].patchValue(selectMill);
    });

    let selectJabatan;
    this.dataSelectJabatan = [
      { id: 'MANDOR', text: 'MANDOR' },
      { id: 'KERANI', text: 'KERANI' }
    ];
    // this.HrmsJabatanService.getAll().subscribe(x => {
      // console.log(x);
      // this.dataSelectJabatan = [];
      // x['data'].forEach(d => {
      //   this.dataSelectJabatan.push({ "id": d.id, "text": d.nama });
      // });
      this.dataSelectJabatan.forEach(a => {
        if (a.id == this.estParamPremiMandorKerani.jabatan_id) {
          selectJabatan = a;
        }
      });
      this.entryForm.controls['jabatan_id'].patchValue(selectJabatan);
    // });

    // let selectAfdeling;
    // this.GbmOrganisasiService.getAllByType('AFDELING').subscribe(x => {
    //   // console.log(x);
    //   this.dataSelectAfdeling = [];
    //   x.forEach(d => {
    //     this.dataSelectAfdeling.push({ "id": d.id, "text": d.nama });
    //   });
    //   this.dataSelectAfdeling.forEach(a => {
    //     if (a.id == this.estParamPremiMandorKerani.afdeling_id) {
    //       selectAfdeling = a;
    //     }
    //   });
    //   this.entryForm.controls['afdeling_id'].patchValue(selectAfdeling);
    // });

    // let selectBlok;
    // this.GbmOrganisasiService.getAllByType('BLOK').subscribe(x => {
    //   // console.log(x);
    //   this.dataSelectBlok = [];
    //   x.forEach(d => {
    //     this.dataSelectBlok.push({ "id": d.id, "text": d.nama });
    //   });
    //   this.dataSelectBlok.forEach(a => {
    //     if (a.id == this.estParamPremiMandorKerani.blok_id) {
    //       selectBlok = a;
    //     }
    //   });
    //   this.entryForm.controls['blok_id'].patchValue(selectBlok);
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
    // dataSubmit['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');
    // console.log(dataSubmit);
    this.estParamPremiMandorKeraniService.update(this.estParamPremiMandorKerani.id, dataSubmit).subscribe(data => {

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
