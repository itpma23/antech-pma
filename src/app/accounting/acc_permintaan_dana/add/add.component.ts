import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { AccPermintaanDanaService } from 'src/app/shared/services/acc_permintaan_dana.service';
import { AccUangMuka } from 'src/app/shared/models/acc_uang_muka.model';

import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
// import { AccKasbankService } from 'src/app/shared/services/acc_kasbank.service';

import { formatDate, formatNumber } from '@angular/common';
import { isNumber } from 'util';

declare var swal: any;
@Component({
    moduleId: module.id,
    selector: 'add-cmp',
    templateUrl: 'add.component.html',
    styleUrls: ['add.component.css'],
})

export class AddComponent implements OnInit,AfterViewInit{
  isFormSubmitted=false;

	datepickerConfig = {
		dateInputFormat: 'DD-MM-YYYY',
		containerClass: 'theme-red',


}
  entryForm: FormGroup;
  event: EventEmitter<any>=new EventEmitter();

  public dataSelectLokasi: any[] = [];
  public dataSelectAkun: any[] = [];
  public dataSelectAkunKasbank: any[] = [];
  awalanHeading = "heading_";
  awalanCollapse = "collapse_";
  sumberDoc = '';

  dataSelectLokasiAfd;
  dataSelectGudang;
  dataSelectBlok;
  dataSelectMesin;
  dataSelectKegiatan;
  dataSelectKaryawan;
  dataSelectUom;
  dataSelecttipe_jurnal;
  dataSelectTraksi;
  dataSelectLokasiDetail: any[];

  public options: any;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private accPermintaanDanaService:AccPermintaanDanaService,
    private AccAkunService:AccAkunService,
    private GbmOrganisasiService:GbmOrganisasiService,

    ) {
      let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      tanggal: new FormControl(toDate, Validators.required),
      lokasi_id: new FormControl([], Validators.required),
      no_transaksi: new FormControl('<OTOMATIS>', Validators.required),
      nilai: new FormControl(0, Validators.required),
      keterangan: new FormControl('', Validators.required),
      // details: this.builder.array([])
    });

  }
  get userControl() { return this.entryForm.controls; }
  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };

  ngAfterViewInit(): void {

  }


  private loadSelect2(): void {

    this.GbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
    });


  }


  onSubmit(){
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    let dataSubmit :AccUangMuka = {
      'lokasi_id': this.entryForm.get('lokasi_id').value.id,
      'tanggal': formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US'),
      'no_transaksi': this.entryForm.get('no_transaksi').value,
      'nilai': this.entryForm.get('nilai').value,
      'keterangan': this.entryForm.get('keterangan').value,
    };

    this.accPermintaanDanaService.create(dataSubmit).subscribe(data=>{
      if( data['status']=='OK'){
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Data berhasil disimpan dengan Nomor:'+data['data'],
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })

        this.event.emit('OK');
        this.bsModalRef.hide();
      }else{
        swal({
          title: 'Perhatian!',
          text: 'Proses Simpan Gagal' ,
          type: 'warning',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
      }
    });
  }

  addBlokItem() {
    this.details.push(this.builder.group({
      lokasi_id: new FormControl([], Validators.required),
      acc_akun_id: new FormControl([], Validators.required),
      debet: new FormControl(0, Validators.required),
      kredit: new FormControl(0, Validators.required),
      traksi_id: new FormControl([],),
      blok_id: new FormControl([],),
      kegiatan_id: new FormControl([],),
      ket: new FormControl('', Validators.required),
    }));
  }
  addBlok(lokasi_id, acc_akun_id, traksi_id, blok_id, kegiatan_id, debet, kredit, ket) {

    this.dataSelectBlok;
    this.dataSelectKegiatan;
    this.dataSelectUom;
    this.dataSelectAkun;
    let selectedLokasiDetail;
    this.dataSelectLokasiDetail.forEach(a => {
      if (lokasi_id == a.id) {
        selectedLokasiDetail = a;
      }
    });
    let selectedAkun;
    this.dataSelectAkun.forEach(a => {
      if (acc_akun_id == a.id) {
        selectedAkun = a;
      }
    });

    let selectedTraksi = [];
    this.dataSelectTraksi.forEach(a => {
      if (traksi_id == a.id) {
        selectedTraksi = a;
      }
    });
    let selectedBlok = [];
    this.dataSelectBlok.forEach(a => {
      if (blok_id == a.id) {
        selectedBlok = a;
      }
    });
    let selectedKegiatan = [];
    this.dataSelectKegiatan.forEach(a => {
      if (kegiatan_id == a.id) {
        selectedKegiatan = a;
      }
    });
    let sdebet;
    let skredit;
    if (!isNumber(debet)) {
      sdebet = parseFloat(debet.replace(/[^\d\.\-]/g, ""));
    } else {
      sdebet = debet;
    }
    if (!isNumber(kredit)) {
      skredit = parseFloat(kredit.replace(/[^\d\.\-]/g, ""));
    } else {
      skredit = kredit
    }
    let fb = this.builder.group({

      lokasi_id: new FormControl(selectedLokasiDetail, Validators.required),
      acc_akun_id: new FormControl(selectedAkun, Validators.required),
      debet: new FormControl(formatNumber(sdebet, 'en_US', '1.2-2'), Validators.required),
      kredit: new FormControl(formatNumber(skredit, 'en_US', '1.2-2'), Validators.required),
      traksi_id: new FormControl(selectedTraksi,),
      blok_id: new FormControl(selectedBlok,),
      kegiatan_id: new FormControl(selectedKegiatan),
      ket: new FormControl(ket,),

    });

    this.details.push(fb);
    // this.hitungNilai();
  }
  onClose(){
    this.bsModalRef.hide();
  }

  ngOnInit() {

     this.loadSelect2();

   }
  valueChange($event){
    console.log($event);
  }
}
