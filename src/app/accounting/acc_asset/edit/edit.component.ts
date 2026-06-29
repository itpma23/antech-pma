import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { AccAsset } from 'src/app/shared/models/acc_asset.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { AccAssetService } from 'src/app/shared/services/acc_asset.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { AccAssetTipeService } from 'src/app/shared/services/acc_asset_tipe.service';
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
import { PksTimbanganService } from 'src/app/shared/services/pks_timbangan.service';
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
  public dataSelectAssetTipe: any[] = [];
  public dataSelectPosisiAsset: any[] = [];
  public dataSelectAkunPenyusutan: any[] = [];
  public dataSelectMetodePenyusutan: any[] = [];
  public dataSelectStatus: any[] = [];

  gbmUom: AccAsset;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private gbmUomService: AccAssetService,
    private gbmSupplierService: GbmSupplierService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private AccAssetTipeService: AccAssetTipeService,
    private AccAkunService: AccAkunService,


  ) {

    let toDate: Date = new Date();
    this.entryForm = this.builder.group({

      lokasi_id: new FormControl([], Validators.required),
      kode: new FormControl('', Validators.required),
      nama: new FormControl('', Validators.required),
      asset_tipe_id: new FormControl([], Validators.required),
      tgl_beli: new FormControl(toDate, Validators.required),
      harga_beli: new FormControl(0, Validators.required),
      nilai_asset: new FormControl(0, Validators.required),
      nilai_residu: new FormControl(0, Validators.required),
      posisi_asset_id: new FormControl([], Validators.required),
      status: new FormControl([], Validators.required),
      lama_bulan_penyusutan: new FormControl(0, Validators.required),
      metode_penyusutan: new FormControl([], Validators.required),
      ket: new FormControl('', Validators.required),
      akun_penyusutan_id: new FormControl([], Validators.required),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    console.log(this.gbmUom);

    // this.entryForm.get('tanggal_efektif').patchValue(new Date(Date.parse(this.gbmUom.tanggal_efektif)));
    this.entryForm.controls['kode'].patchValue(this.gbmUom.kode);
    this.entryForm.controls['nama'].patchValue(this.gbmUom.nama);
    this.entryForm.controls['harga_beli'].patchValue(this.gbmUom.harga_beli);
    this.entryForm.controls['nilai_asset'].patchValue(this.gbmUom.nilai_asset);
    this.entryForm.controls['nilai_residu'].patchValue(this.gbmUom.nilai_residu);
    this.entryForm.controls['lama_bulan_penyusutan'].patchValue(this.gbmUom.lama_bulan_penyusutan);
    this.entryForm.controls['ket'].patchValue(this.gbmUom.ket);

  }
  private loadSelect2(): void {



    this.dataSelectStatus = [
      { id: 'AKTIF', text: 'AKTIF' },
      { id: 'TIDAK AKTIF', text: 'TIDAK AKTIF' },
      { id: 'TIDAK DAPAT DIGUNAKAN', text: 'TIDAK DAPAT DIGUNAKAN' },
      { id: 'HILANG', text: 'HILANG' },
      { id: 'NILAI BUKU HABIS', text: 'NILAI BUKU HABIS' },
    ];
    let selectStatus;
    this.dataSelectStatus.forEach(a => {
      if (a.id == this.gbmUom.status) {
        selectStatus = a;
      }
    });
    this.entryForm.controls['status'].patchValue(selectStatus);

    this.dataSelectMetodePenyusutan = [
      { id: 'STRAIGHT', text: 'STRAIGHT' },
      { id: 'DOUBLE', text: 'DOUBLE' },
    ];
    let selectMetodePenyusutan;
    this.dataSelectMetodePenyusutan.forEach(a => {
      if (a.id == this.gbmUom.metode_penyusutan) {
        selectMetodePenyusutan = a;
      }
    });
    this.entryForm.controls['metode_penyusutan'].patchValue(selectMetodePenyusutan);

    let selectLokasi=[];
    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x=>{
      this.dataSelectLokasi=[];
      x.forEach(d => {
        this.dataSelectLokasi.push({"id":d.id,"text":d.nama});
        if (d.id == this.gbmUom.lokasi_id) {
          selectLokasi = d;
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectLokasi);
    });

    let selectAssetTipe=[];
    this.AccAssetTipeService.getAll().subscribe(x=> {
      this.dataSelectAssetTipe=[];
      x['data'].forEach(d=> {
        this.dataSelectAssetTipe.push({"id":d.id, "text":d.nama});
        if (d.id == this.gbmUom.asset_tipe_id) {
          selectAssetTipe = d;
        }
      });
      this.entryForm.get('asset_tipe_id').patchValue(selectAssetTipe);
    });

    let selectPosisiAsset=[];
    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x=>{
      this.dataSelectPosisiAsset=[];
      x.forEach(d => {
        this.dataSelectPosisiAsset.push({"id":d.id,"text":d.nama});
        if (d.id == this.gbmUom.posisi_asset_id) {
          selectPosisiAsset = d;
        }
      });
      this.entryForm.get('posisi_asset_id').patchValue(selectPosisiAsset);
    });
    
    let selectAkunPenyusutan=[];
    this.AccAkunService.getAll().subscribe(x=> {
      this.dataSelectAkunPenyusutan=[];
      x['data'].forEach(d=> {
        this.dataSelectAkunPenyusutan.push({"id":d.id, "text": "("+d.kode+") "+d.nama});
        if (d.id == this.gbmUom.akun_penyusutan_id) {
          selectAkunPenyusutan = d;
        }
      });
      this.entryForm.get('akun_penyusutan_id').patchValue(selectAkunPenyusutan);
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
    this.gbmUomService.update(this.gbmUom.id, dataSubmit).subscribe(data => {

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
    if (!this.entryForm.dirty) {
      // form belum diapa-apakan → langsung close
      this.bsModalRef.hide();
      return;
    }

    // form sudah ada isi / perubahan → munculkan swal
    let that = this;
    swal({
      title: 'Yakin akan Menutup?',
      text: "Data yang sudah diubah akan hilang!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      buttonsStyling: false
    }).then(function () {
      that.bsModalRef.hide();
    });
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
