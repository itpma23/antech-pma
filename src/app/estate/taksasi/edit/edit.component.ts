import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { EstTaksasi } from 'src/app/shared/models/est_taksasi.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { EstTaksasiService } from 'src/app/shared/services/est_taksasi.service';
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

  estTaksasi: EstTaksasi;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private estTaksasiService: EstTaksasiService,
    private GbmOrganisasiService: GbmOrganisasiService


  ) {

    let toDate: Date = new Date();
    this.entryForm = this.builder.group({

      lokasi_id: new FormControl([], Validators.required),
      afdeling_id: new FormControl([], Validators.required),
      blok_id: new FormControl([], Validators.required),
      tanggal: new FormControl(toDate, Validators.required),

      ha_sisa: new FormControl(0, ),
      ha_besok: new FormControl(0,),
      jumlah_pokok: new FormControl(0, ),
      persen_buah_matang: new FormControl(0, ),
      jjg_output: new FormControl(0, ),
      hk: new FormControl(0, ),
      bjr: new FormControl(0, ),
      berat_kg: new FormControl(0, ),
      seksi_panen: new FormControl(0, ),



    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    console.log(this.estTaksasi);

    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.estTaksasi.tanggal)));
    this.entryForm.controls['ha_sisa'].patchValue(this.estTaksasi.ha_sisa);
    this.entryForm.controls['ha_besok'].patchValue(this.estTaksasi.ha_besok);
    this.entryForm.controls['jumlah_pokok'].patchValue(this.estTaksasi.jumlah_pokok);

    this.entryForm.controls['persen_buah_matang'].patchValue(this.estTaksasi.persen_buah_matang);
    this.entryForm.controls['jjg_output'].patchValue(this.estTaksasi.jjg_output);
    this.entryForm.controls['hk'].patchValue(this.estTaksasi.hk);
    this.entryForm.controls['bjr'].patchValue(this.estTaksasi.bjr);
    this.entryForm.controls['berat_kg'].patchValue(this.estTaksasi.berat_kg);
    this.entryForm.controls['seksi_panen'].patchValue(this.estTaksasi.seksi_panen);

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
        if (a.id == this.estTaksasi.lokasi_id) {
          selectMill = a;
        }

      });
      this.entryForm.controls['lokasi_id'].patchValue(selectMill);

    });

    let selectAfdeling;
    this.GbmOrganisasiService.getAllByType('AFDELING').subscribe(x => {
      // console.log(x);
      this.dataSelectAfdeling = [];
      x.forEach(d => {
        this.dataSelectAfdeling.push({ "id": d.id, "text": d.nama });
      });

      this.dataSelectAfdeling.forEach(a => {
        if (a.id == this.estTaksasi.afdeling_id) {
          selectAfdeling = a;
        }

      });
      this.entryForm.controls['afdeling_id'].patchValue(selectAfdeling);

    });

    let selectBlok;
    this.GbmOrganisasiService.getAllByType('BLOK').subscribe(x => {
      // console.log(x);
      this.dataSelectBlok = [];
      x.forEach(d => {
        this.dataSelectBlok.push({ "id": d.id, "text": d.nama });
      });

      this.dataSelectBlok.forEach(a => {
        if (a.id == this.estTaksasi.blok_id) {
          selectBlok = a;
        }

      });
      this.entryForm.controls['blok_id'].patchValue(selectBlok);

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
    this.estTaksasiService.update(this.estTaksasi.id, dataSubmit).subscribe(data => {

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
