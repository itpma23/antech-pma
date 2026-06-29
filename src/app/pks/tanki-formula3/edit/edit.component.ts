import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { PksTankiFormula3 } from 'src/app/shared/models/pks_tanki_formula3.model';
import { PksTankiService } from 'src/app/shared/services/pks_tanki.service';
import { PksTankiFormula3Service } from 'src/app/shared/services/pks_tanki_formula3.service';

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

  pksTankiFormula3: PksTankiFormula3;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private pksTankiFormula3Service: PksTankiFormula3Service,
    private pksTankiService: PksTankiService,
   


  ) {

    let toDate: Date = new Date();
    this.entryForm = this.builder.group({

      tanki_id: new FormControl([], Validators.required),
      simbol: new FormControl([], Validators.required),
      qty: new FormControl('', Validators.required),
      hasil: new FormControl('', Validators.required),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    console.log(this.pksTankiFormula3);

    this.entryForm.controls['qty'].patchValue(this.pksTankiFormula3.qty);
    this.entryForm.controls['hasil'].patchValue(this.pksTankiFormula3.hasil);

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
    this.dataSelectSimbol.forEach(a => {
      if (a.id == this.pksTankiFormula3.simbol) {
        selectTipe = a;
      }
    });
    this.entryForm.controls['simbol'].patchValue(selectTipe);

    let selectTanki;
    this.pksTankiService.getAll().subscribe(x => {

      this.dataSelectTanki = [];
      x['data'].forEach(d => {
        this.dataSelectTanki.push({ "id": d.id, "text": d.nama_tanki });
      });

      this.dataSelectTanki.forEach(a => {
        if (a.id == this.pksTankiFormula3.tanki_id) {
          selectTanki = a;
        }
        this.entryForm.controls['tanki_id'].patchValue(selectTanki);
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
    this.pksTankiFormula3Service.update(this.pksTankiFormula3.id, dataSubmit).subscribe(data => {

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
