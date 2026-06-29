import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { AccKegiatan } from 'src/app/shared/models/acc_kegiatan.model';
import { AccKegiatanService } from 'src/app/shared/services/acc_kegiatan.service';
import { AccKegiatanKelompokService } from 'src/app/shared/services/acc_kegiatan_kelompok.service';
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
import { GbmUomService } from 'src/app/shared/services/gbm_uom.service';
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
  public dataSelectKegiatan: any[] = [];
  public dataSelectAkun: any[] = [];
  public dataSelectTipeKegiatan: any[] = [];

  accKegiatan: AccKegiatan;
  dbName;
  pathName;
  PATH_URL;
  dataSelectSatuan: any[];
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private accKegiatanKelompokService: AccKegiatanKelompokService,
    private accAkunService: AccAkunService,
    private accKegiatanService: AccKegiatanService,
    private gbmUomService: GbmUomService,


  ) {

    let toDate: Date = new Date();
    this.entryForm = this.builder.group({
      acc_akun_id: new FormControl([], Validators.required),
      kegiatan_kelompok_id: new FormControl([], Validators.required),
      tipe_kegiatan_id: new FormControl([], Validators.required),
      kode: new FormControl('', Validators.required),
      nama: new FormControl('', Validators.required),
      uom_id: new FormControl([], Validators.required),
      is_pemeliharaan: new FormControl(0, Validators.required),
      is_bahan: new FormControl(0, Validators.required),
      is_traksi: new FormControl(0, Validators.required),
      is_umum: new FormControl(0, Validators.required),
      is_premi_otomatis: new FormControl(0, Validators.required),
      is_traksi_mill: new FormControl(0, Validators.required),
      basis: new FormControl(0, Validators.required),
      premi_basis: new FormControl(0, Validators.required),
      premi_lebih_basis: new FormControl(0, Validators.required),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    console.log(this.accKegiatan);

    // this.entryForm.get('tanggal_efektif').patchValue(new Date(Date.parse(this.accKegiatan.tanggal_efektif)));
    this.entryForm.controls['kode'].patchValue(this.accKegiatan.kode);
    this.entryForm.controls['nama'].patchValue(this.accKegiatan.nama);
    this.entryForm.controls['is_pemeliharaan'].patchValue(this.accKegiatan.is_pemeliharaan==true?1:0);
    this.entryForm.controls['is_bahan'].patchValue(this.accKegiatan.is_bahan==true?1:0);
    this.entryForm.controls['is_traksi'].patchValue(this.accKegiatan.is_traksi==true?1:0);
    this.entryForm.controls['is_umum'].patchValue(this.accKegiatan.is_umum==true?1:0);
    this.entryForm.controls['is_premi_otomatis'].patchValue(this.accKegiatan.is_premi_otomatis==true?1:0);
    this.entryForm.controls['is_traksi_mill'].patchValue(this.accKegiatan.is_traksi_mill==true?1:0);
    this.entryForm.controls['basis'].patchValue(this.accKegiatan.basis);
    this.entryForm.controls['premi_basis'].patchValue(this.accKegiatan.premi_basis);
    this.entryForm.controls['premi_lebih_basis'].patchValue(this.accKegiatan.premi_lebih_basis);
  }
  private loadSelect2(): void {
    let selectedTipekegiatan;
    this.dataSelectTipeKegiatan = [
      { id: 'PNN', text: 'PANEN' },
      { id: 'PML', text: 'PEMELIHARAAN' },
      { id: 'PMK', text: 'PEMUPUKAN' },
      { id: 'UMM', text: 'UMUM' },
      { id: 'TRK', text: 'TRAKSI' },
      { id: 'WRK', text: 'WORKSHOP' },
      { id: 'MIL', text: 'MILL' },
      { id: 'LAIN', text: 'LAINNYA' },

    ];
    this.dataSelectTipeKegiatan.forEach(d => {
      if (d.id == this.accKegiatan.tipe_kegiatan) {
        selectedTipekegiatan = { "id": d.id, "text": d.text };
      }
    });
    this.entryForm.controls['tipe_kegiatan_id'].patchValue(selectedTipekegiatan);
    let selectedSatuan;
    this.gbmUomService.getAll().subscribe(x => {
      this.dataSelectSatuan = [];
      let data = x['data'];

      data.forEach(d => {
        this.dataSelectSatuan.push({ "id": d.id, "text": d.nama });
        if (d.id == this.accKegiatan.uom_id) {
          selectedSatuan = { "id": d.id, "text": d.nama };
        }
      });
      this.entryForm.controls['uom_id'].patchValue(selectedSatuan);

    });
    let selectAkun;
    this.accAkunService.getAllDetail().subscribe(x => {

      this.dataSelectAkun = [];
      x['data'].forEach(d => {
        this.dataSelectAkun.push({ "id": d.id, "text": d.kode + " - " + d.nama });
      });

      this.dataSelectAkun.forEach(a => {
        if (a.id == this.accKegiatan.acc_akun_id) {
          selectAkun = a;
        }
        this.entryForm.controls['acc_akun_id'].patchValue(selectAkun);
      });

    });

    let selectKegiatan;
    this.accKegiatanKelompokService.getAll().subscribe(x => {

      this.dataSelectKegiatan = [];
      x['data'].forEach(d => {
        this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama });
      });

      this.dataSelectKegiatan.forEach(a => {
        if (a.id == this.accKegiatan.kegiatan_kelompok_id) {
          selectKegiatan = a;
        }
        this.entryForm.controls['kegiatan_kelompok_id'].patchValue(selectKegiatan);
      });

    });

  }

  onSubmit() {
    // console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }
    let dataSubmit = this.entryForm.value;
    // console.log(this.entryForm.value);
    // dataSubmit['tanggal']=formatDate( this.entryForm.get('tanggal_efektif').value,"yyyy-MM-dd",'en_US');
     console.log(dataSubmit);
    this.accKegiatanService.update(this.accKegiatan.id, dataSubmit).subscribe(data => {

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
