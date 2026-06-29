import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators,FormArray } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { HrmsLibur } from 'src/app/shared/models/hrms_libur.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { HrmsLiburService } from 'src/app/shared/services/hrms_libur.service';

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
  public dataSelectTipe: any[] = [];

  hrmsTipeLibur: HrmsLibur;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private hrmsTipeLiburService: HrmsLiburService,
    private GbmOrganisasiService: GbmOrganisasiService


  ) {

    let toDate: Date = new Date();
    this.entryForm = this.builder.group({

      tipe_libur:  new FormControl([],Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      details: this.builder.array([])

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    console.log(this.hrmsTipeLibur);

    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.hrmsTipeLibur.tanggal)));

    

  }
  private loadSelect2(): void {


   

    this.dataSelectTipe = [
      { id: 'Minggu', text: 'MINGGU' },
      { id: 'Nasional', text: 'LIBUR NASIONAL' },
      { id: 'HariRaya', text: 'HARI RAYA' },
    ];
      let selectTipe;
    this.dataSelectTipe.forEach(a => {
      if (a.id == this.hrmsTipeLibur.tipe_libur) {
        selectTipe = a;
      }
    });
    this.entryForm.controls['tipe_libur'].patchValue(selectTipe);


    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
            let dtl = [];
            dtl = this.hrmsTipeLibur.detail;
            for (let index = 0; index < dtl.length; index++) {
              const d = dtl[index];
              this.addBlok(d['lokasi_id']);
            }
       
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
    dataSubmit['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');
    console.log(this.entryForm.value);
    
    console.log(dataSubmit);
    this.hrmsTipeLiburService.update(this.hrmsTipeLibur.id, dataSubmit).subscribe(data => {

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

  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };

  addBlok(lokasi_id) {

    this.dataSelectLokasi;

    let selectedLokasi = [];
    this.dataSelectLokasi.forEach(a => {
      if (lokasi_id == a.id) {
        selectedLokasi = a;
      }
    });
 
    this.details.push(this.builder.group({
      lokasi_id: new FormControl(selectedLokasi, Validators.required),
    }));

  }
  addBlokNew() {
    this.details.push(this.builder.group({
      lokasi_id: new FormControl([],Validators.required),
    }));
  }

  removeBlokItem(item) {
    let i = this.details.controls.indexOf(item);
    if (i != -1) {
      // let x=	this.details.controls.splice(i, 1);
      let items = this.entryForm.get('details') as FormArray;
      items.removeAt(i);
      let data = { details: items.value };
      this.updateForm(data);
    }
  }

  updateForm(data) {

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
