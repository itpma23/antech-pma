import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
import { AccAutoJurnal } from 'src/app/shared/models/acc_auto_jurnal.model';
import { AccAutoJurnalService } from 'src/app/shared/services/acc_auto_jurnal.service';
import { isNullOrUndefined } from 'util';

declare var $: any;
interface Tipe {
  value: string;
  viewValue: string;
}
@Component({
  moduleId: module.id,
  selector: 'add-cmp',
  templateUrl: 'add.component.html',
  styleUrls: ['add.component.css'],
})

export class AddComponent implements OnInit, AfterViewInit {
  editor_modules: any;
  isFormSubmitted = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }

  entryForm: FormGroup;
  categories: any[] = [];
  event: EventEmitter<any> = new EventEmitter();
  jenis_kelamin = '';

  public dataSelectAkun: any[] = [];

  tipes: Tipe[] = [
    { value: '0', viewValue: 'KAS' },
    { value: '1', viewValue: 'Bank' },
    { value: '2', viewValue: 'Piutang' }
  ];
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private AccAutoJurnalService: AccAutoJurnalService,
    private translate: TranslateService,
    private AccAkunService:AccAkunService,
  ) {

    this.entryForm = this.builder.group({
      acc_akun_id: new FormControl([]),
      acc_akun_id_debet: new FormControl([]),
      acc_akun_id_kredit: new FormControl([]),
      kode: new FormControl(null, Validators.required),
      ket: new FormControl(null, Validators.required),
    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    this.loadSelect2();
  }
  public dataSelect: any[] = [];
  public options: any;

  private loadSelect2(): void {
    // let m = this.translate.instant('holidays.messages.update');

    // this.dataSelect = [
    //   { id: 'Laki-laki', text: 'Laki-laki' },
    //   { id: 'Perempuan', text: 'Perempuan' },
    // ];
    // this.dataSelect.unshift({ id: -1, text: 'Pilih' });

    this.AccAkunService.getAllDetail().subscribe(x=>{
      console.log(x);
      this.dataSelectAkun=[];
      x['data'].forEach(d => {
        this.dataSelectAkun.push({"id":d.id,"text":d.kode+ ' - '+ d.nama});
      });
    });
  }
  onSubmit() {
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let frmData = new FormData();

    let akun_id;
    if (isNullOrUndefined(this.entryForm.get('acc_akun_id').value) != true) {
      if (isNullOrUndefined(this.entryForm.get('acc_akun_id').value!.id)) {
        akun_id = null
      } else {
        akun_id = this.entryForm.get('acc_akun_id').value.id;
      }

    } else {
      akun_id = null
    }

    let akun_id_debet;
    if (isNullOrUndefined(this.entryForm.get('acc_akun_id_debet').value) != true) {
      if (isNullOrUndefined(this.entryForm.get('acc_akun_id_debet').value!.id)) {
        akun_id_debet = null
      } else {
        akun_id_debet = this.entryForm.get('acc_akun_id_debet').value.id;
      }

    } else {
      akun_id_debet = null
    }
    let akun_id_kredit;
    if (isNullOrUndefined(this.entryForm.get('acc_akun_id_kredit').value) != true) {
      if (isNullOrUndefined(this.entryForm.get('acc_akun_id_kredit').value!.id)) {
        akun_id_kredit = null
      } else {
        akun_id_kredit = this.entryForm.get('acc_akun_id_kredit').value.id;
      }

    } else {
      akun_id_kredit = null
    }
    let dataSubmit :AccAutoJurnal = {
      'acc_akun_id': akun_id,
      'acc_akun_id_debet': akun_id_debet,
      'acc_akun_id_kredit': akun_id_kredit,
      'kode': this.entryForm.get('kode').value,
      'ket': this.entryForm.get('ket').value,
    };

    this.AccAutoJurnalService.create(dataSubmit).subscribe(data => {
      if (data['status'] == 'OK') {
        console.log('ok');
        this.event.emit('OK');
        this.bsModalRef.hide();
      }
    });
  }

  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.entryForm.patchValue({
      img: file
    });
    this.entryForm.get('img').updateValueAndValidity()
    console.log(file);
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
}
