import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { TrkKendaraan } from 'src/app/shared/models/trk_kendaraan.model';
import { TrkKendaraanService } from 'src/app/shared/services/trk_kendaraan.service';
import { TrkJenisTraksiService } from 'src/app/shared/services/trk_jenis_traksi.service';
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
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

  public dataSelectTraksi: any[] = [];
  public dataSelectJenisTraksi: any[] = [];
  public dataSelectAkun: any[] = [];
  public dataSelectPemilik: any[] = [];


  trkKendaraan: TrkKendaraan;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private trkKendaraanKelompokService: TrkJenisTraksiService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private trkKendaraanService: TrkKendaraanService


  ) {

    let toDate: Date = new Date();
    this.entryForm = this.builder.group({
      traksi_id: new FormControl([], Validators.required),
      jenis_id: new FormControl([], Validators.required),
      kode: new FormControl('', Validators.required),
      nama: new FormControl('', Validators.required),
      no_kendaraan: new FormControl('', ),
      no_mesin: new FormControl('', ),
      no_rangka: new FormControl('', ),
      tahun_perolehan: new FormControl(0, ),
      berat_kosong: new FormControl(0, ),
      kepemilikan: new FormControl([], Validators.required),
      nama_pemilik: new FormControl('', ),
      is_nonaktif: new FormControl(0),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    console.log(this.trkKendaraan);

    // this.entryForm.get('tanggal_efektif').patchValue(new Date(Date.parse(this.trkKendaraan.tanggal_efektif)));
    this.entryForm.controls['kode'].patchValue(this.trkKendaraan.kode);
    this.entryForm.controls['nama'].patchValue(this.trkKendaraan.nama);
    this.entryForm.controls['no_kendaraan'].patchValue(this.trkKendaraan.no_kendaraan);
    this.entryForm.controls['no_mesin'].patchValue(this.trkKendaraan.no_mesin);
    this.entryForm.controls['no_rangka'].patchValue(this.trkKendaraan.no_rangka);
    this.entryForm.controls['tahun_perolehan'].patchValue(this.trkKendaraan.tahun_perolehan);
    this.entryForm.controls['berat_kosong'].patchValue(this.trkKendaraan.berat_kosong);
    this.entryForm.controls['nama_pemilik'].patchValue(this.trkKendaraan.nama_pemilik);
    this.entryForm.get('is_nonaktif').patchValue((this.trkKendaraan.is_nonaktif==1)?true:false);

  }
  private loadSelect2(): void {

    this.dataSelectPemilik = [
      { id: 'SEWA', text: 'SEWA' },
      { id: 'ASET', text: 'ASET' },
    ];
  
    let selectPemilik;
    this.dataSelectPemilik.forEach(a => {
      if (a.id == this.trkKendaraan.kepemilikan) {
        selectPemilik = a;
      }
    });this.entryForm.controls['kepemilikan'].patchValue(selectPemilik);

    let selectMill;
    this.GbmOrganisasiService.getAllByType('TRAKSI').subscribe(x => {
      console.log(x);
      this.dataSelectTraksi = [];
      x.forEach(d => {
        this.dataSelectTraksi.push({ "id": d.id, "text": d.nama });
      });

      this.dataSelectTraksi.forEach(a => {
        if (a.id == this.trkKendaraan.traksi_id) {
          selectMill = a;
        }

      });
      this.entryForm.controls['traksi_id'].patchValue(selectMill);

    });


    let selectJenisTraksi;
    this.trkKendaraanKelompokService.getAll().subscribe(x => {

      this.dataSelectJenisTraksi = [];
      x['data'].forEach(d => {
        this.dataSelectJenisTraksi.push({ "id": d.id, "text": d.nama });
      });

      this.dataSelectJenisTraksi.forEach(a => {
        if (a.id == this.trkKendaraan.jenis_id) {
          selectJenisTraksi = a;
        }
        this.entryForm.controls['jenis_id'].patchValue(selectJenisTraksi);
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
    // dataSubmit['tanggal']=formatDate( this.entryForm.get('tanggal_efektif').value,"yyyy-MM-dd",'en_US');
    // console.log(dataSubmit);
    this.trkKendaraanService.update(this.trkKendaraan.id, dataSubmit).subscribe(data => {

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
