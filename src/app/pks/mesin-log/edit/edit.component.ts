import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { PksMesinLog } from 'src/app/shared/models/pks_mesin_log.model';
import { PksTankiService } from 'src/app/shared/services/pks_tanki.service';
import { PksMesinLogService } from 'src/app/shared/services/pks_mesin_log.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';

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
  public dataSelectTanki: any[] = [];
  public dataSelectSimbol: any[] = [];
  public dataSelectMesin: any[] = [];

  pksMesinLog: PksMesinLog;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private pksMesinLogService: PksMesinLogService,
    private pksTankiService: PksTankiService,
    private GbmOrganisasiService:GbmOrganisasiService,


  ) {

    let toDate: Date = new Date();
    this.entryForm = this.builder.group({

      mesin_id: new FormControl([], Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      km_hm_awal: new FormControl(0, Validators.required),
      km_hm_akhir: new FormControl(0, Validators.required),
      ket: new FormControl('', Validators.required),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    console.log(this.pksMesinLog);

    this.entryForm.controls['km_hm_awal'].patchValue(this.pksMesinLog.km_hm_awal);
    this.entryForm.controls['km_hm_akhir'].patchValue(this.pksMesinLog.km_hm_akhir);
    this.entryForm.controls['ket'].patchValue(this.pksMesinLog.ket);

  }
  private loadSelect2(): void {

    this.dataSelectSimbol = [
      { id: 'A', text: 'A' },
      { id: 'B', text: 'B' },
      { id: 'C', text: 'C' },
      { id: 'D', text: 'D' },
      { id: 'E', text: 'E' },
      { id: 'F', text: 'F' },
      { id: 'G', text: 'G' },
      { id: 'H', text: 'H' },
      { id: 'I', text: 'I' },
      { id: 'J', text: 'J' },
      { id: 'K', text: 'K' },
      { id: 'L', text: 'L' },
    ];
    let selectTipe;
    // this.dataSelectSimbol.forEach(a => {
    //   if (a.id == this.pksMesinLog.simbol) {
    //     selectTipe = a;
    //   }
    // });
    // this.entryForm.controls['simbol'].patchValue(selectTipe);

    // let selectTanki;
    // this.pksTankiService.getAll().subscribe(x => {
    //   // this.dataSelectTanki = [];
    //   // x['data'].forEach(d => {
    //   //   this.dataSelectTanki.push({ "id": d.id, "text": d.nama_tanki });
    //   // });
    //   // this.dataSelectTanki.forEach(a => {
    //   //   if (a.id == this.pksMesinLog.tanki_id) {
    //   //     selectTanki = a;
    //   //   }
    //   //   this.entryForm.controls['tanki_id'].patchValue(selectTanki);
    //   // });
    // });


    console.log(this.pksMesinLog.mesin_id);
    let selectMesin;
    this.GbmOrganisasiService.getAllByType("MESIN").subscribe(x => {
      this.dataSelectMesin = [];
      x.forEach(d => {
        this.dataSelectMesin.push({ "id": d.id, "text": d.nama });
      });
      this.dataSelectMesin.forEach(a => {
        if (a.id == this.pksMesinLog.mesin_id) {
          selectMesin = a;
        }
        this.entryForm.controls['mesin_id'].patchValue(selectMesin);
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
    console.log(this.entryForm.value);
    console.log(dataSubmit);
    this.pksMesinLogService.update(this.pksMesinLog.id, dataSubmit).subscribe(data => {

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
