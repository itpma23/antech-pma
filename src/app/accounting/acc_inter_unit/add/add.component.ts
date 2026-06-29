import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { AccInterUnit } from 'src/app/shared/models/acc_inter_unit.model';
import { AccInterUnitService } from 'src/app/shared/services/acc_inter_unit.service';

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
  public dataSelectLokasi: any[] = [];
  public dataSelectLokasi2: any[] = [];
  public dataSelectTipe: any[] = [];

  tipes: Tipe[] = [
    { value: '0', viewValue: 'KAS' },
    { value: '1', viewValue: 'Bank' },
    { value: '2', viewValue: 'Piutang' }
  ];
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private AccInterUnitService: AccInterUnitService,
    private translate: TranslateService,
    private AccAkunService:AccAkunService,
    private GbmOrganisasiService:GbmOrganisasiService,
  ) {

    this.entryForm = this.builder.group({
      lokasi_id: new FormControl([], Validators.required),
      lokasi_id_2: new FormControl([], Validators.required),
      acc_akun_id: new FormControl([], Validators.required),
      tipe: new FormControl('', Validators.required),
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

    // this.dataSelectTipe = [
    //   { id: 'Laki-laki', text: 'Laki-laki' },
    //   { id: 'Perempuan', text: 'Perempuan' },
    // ];
    // this.dataSelect.unshift({ id: -1, text: 'Pilih' });

    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
    });

    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi2 = [];
      x.forEach(d => {
        this.dataSelectLokasi2.push({ "id": d.id, "text": d.nama });
      });
    });

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

    let dataSubmit :AccInterUnit = {
      'acc_akun_id': this.entryForm.get('acc_akun_id').value.id,
      'lokasi_id': this.entryForm.get('lokasi_id').value.id,
      'lokasi_id_2': this.entryForm.get('lokasi_id_2').value.id,
      'tipe': this.entryForm.get('tipe').value,
    };
    // console.log(dataSubmit);

    this.AccInterUnitService.create(dataSubmit).subscribe(data => {
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
