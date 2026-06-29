import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Akun } from 'src/app/shared/models/akun.model';
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
  public dataselectOrganisasi: any[] = [];
  entryForm: FormGroup;
  categories: any[] = [];
  event: EventEmitter<any> = new EventEmitter();
  jenis_kelamin = '';
  tipes: Tipe[] = [
    { value: '0', viewValue: 'KAS' },
    { value: '1', viewValue: 'Bank' },
    { value: '2', viewValue: 'Piutang' }
  ];
  dataSelectJenisBiaya: { id: string; text: string; }[];
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private akunService: AccAkunService,
    private translate: TranslateService,
    private organisasiService: GbmOrganisasiService,
  ) {

    this.entryForm = this.builder.group({
      kode: new FormControl(null, Validators.required),
      nama: new FormControl(null, Validators.required),
      tipe: new FormControl(null, Validators.required),
      is_transaksi_akun: new FormControl(1, Validators.required),
      is_kasbank_akun: new FormControl(0, Validators.required),
      aktif: new FormControl(1, Validators.required),
      lokasi_id: new FormControl([], []),
      jenis_biaya_id: new FormControl([]),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    this.loadSelect2();
  }
  public dataSelect: any[] = [];
  public options: any;

  private loadSelect2(): void {
    this.dataSelectJenisBiaya = [
      { id: 'PNN', text: 'PANEN' },
      { id: 'PML', text: 'PEMELIHARAAN' },
      { id: 'PMK', text: 'PEMUPUKAN' },
      { id: 'UMM', text: 'UMUM' },
      { id: 'TRK', text: 'TRAKSI' },
      { id: 'WRK', text: 'WORKSHOP' },
      { id: 'MIL', text: 'MILL' },
      { id: 'LAIN', text: 'LAINNYA' },

    ];
    this.organisasiService.getAllAdmUnit().subscribe(x => {
      this.dataselectOrganisasi = [];
      x.forEach(d => {
        this.dataselectOrganisasi.push({ "id": d.id, "text": d.nama });
      });

    });


  }
  onSubmit() {
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let frmData = new FormData();
    let arr_lokasi = [];
    arr_lokasi = this.entryForm.get('lokasi_id').value;
    let lokasi_id = arr_lokasi.map(a => { return a.id });
    let jenis_biaya_id;
    if (isNullOrUndefined(this.entryForm.get('jenis_biaya_id').value) != true) {
      if (isNullOrUndefined(this.entryForm.get('jenis_biaya_id').value!.id)) {
        jenis_biaya_id = null
      } else {
        jenis_biaya_id = this.entryForm.get('jenis_biaya_id').value.id;
      }

    } else {
      jenis_biaya_id = null
    }
    let dataSubmit :Akun = {
      'kode': this.entryForm.get('kode').value,
      'nama': this.entryForm.get('nama').value,
      'tipe': this.entryForm.get('tipe').value,
      'kelompok_biaya': jenis_biaya_id,
      'is_transaksi_akun': this.entryForm.get('is_transaksi_akun').value,
      'is_kasbank_akun': this.entryForm.get('is_kasbank_akun').value,
      'aktif': this.entryForm.get('aktif').value,
      'ket':'',
      'lokasi_id':lokasi_id


    };

    this.akunService.create(dataSubmit).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        console.log('ok');
        this.event.emit('OK');
        this.bsModalRef.hide();
      }
    });
  }


  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {



  }
  valueChange($event) {
    console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
}
