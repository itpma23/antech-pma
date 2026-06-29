import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { EstPremiBasisPanen } from 'src/app/shared/models/est_premi_basis_panen.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { EstPremiBasisPanenService } from 'src/app/shared/services/est_premi_basis_panen.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
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
  public dataSelectBlok: any[] = [];
  public dataSelectTimbangan: any[] = [];

  estPremiBasisPanen: EstPremiBasisPanen;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private estPremiBasisPanenService: EstPremiBasisPanenService,
    // private gbmSupplierService: GbmSupplierService,
    private GbmOrganisasiService: GbmOrganisasiService


  ) {

    let toDate: Date = new Date();
    this.entryForm = this.builder.group({

      tanggal_efektif: new FormControl(toDate, Validators.required),
      blok_id: new FormControl([], Validators.required),

      bjr_dari: new FormControl(0),
      bjr_sd: new FormControl(0),
      basis_jjg: new FormControl(0, Validators.required),
      basis_jjg_jumat: new FormControl(0, Validators.required),
      premi_basis: new FormControl(0, Validators.required),
      lebih_basis1: new FormControl(0, Validators.required),
      premi_lebih_basis1: new FormControl(0, Validators.required),
      lebih_basis2: new FormControl(0,Validators.required),
      premi_lebih_basis2: new FormControl(0,Validators.required),
      lebih_basis3: new FormControl(0,Validators.required),
      premi_lebih_basis3: new FormControl(0,Validators.required),

      premi_brondolan: new FormControl(0,Validators.required),
      hk_luas_panen: new FormControl(0,Validators.required),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    console.log(this.estPremiBasisPanen);


    this.entryForm.get('tanggal_efektif').patchValue(new Date(Date.parse(this.estPremiBasisPanen.tanggal_efektif)));

    this.entryForm.controls['bjr_dari'].patchValue(this.estPremiBasisPanen.bjr_dari);
    this.entryForm.controls['bjr_sd'].patchValue(this.estPremiBasisPanen.bjr_sd);
    this.entryForm.controls['premi_basis'].patchValue(this.estPremiBasisPanen.premi_basis);
    this.entryForm.controls['basis_jjg'].patchValue(this.estPremiBasisPanen.basis_jjg);
    this.entryForm.controls['basis_jjg_jumat'].patchValue(this.estPremiBasisPanen.basis_jjg_jumat);

    this.entryForm.controls['lebih_basis1'].patchValue(this.estPremiBasisPanen.lebih_basis1);
    this.entryForm.controls['premi_lebih_basis1'].patchValue(this.estPremiBasisPanen.premi_lebih_basis1);

    this.entryForm.controls['lebih_basis2'].patchValue(this.estPremiBasisPanen.lebih_basis2);
    this.entryForm.controls['premi_lebih_basis2'].patchValue(this.estPremiBasisPanen.premi_lebih_basis2);

    this.entryForm.controls['lebih_basis3'].patchValue(this.estPremiBasisPanen.lebih_basis3);
    this.entryForm.controls['premi_lebih_basis3'].patchValue(this.estPremiBasisPanen.premi_lebih_basis3);

    this.entryForm.controls['premi_brondolan'].patchValue(this.estPremiBasisPanen.premi_brondolan);
    this.entryForm.controls['hk_luas_panen'].patchValue(this.estPremiBasisPanen.hk_luas_panen);


  }
  private loadSelect2(): void {



    // let selectMill;
    // this.GbmOrganisasiService.getAllByType('MILL').subscribe(x => {
    //   console.log(x);
    //   this.dataSelectLokasi = [];
    //   x.forEach(d => {
    //     this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
    //   });

    //   this.dataSelectLokasi.forEach(a => {
    //     if (a.id == this.estPremiBasisPanen.lokasi_id) {
    //       selectMill = a;
    //     }

    //   });
    //   this.entryForm.controls['lokasi_id'].patchValue(selectMill);

    // });

   let selectMill;
    this.GbmOrganisasiService.getAllByType('BLOK').subscribe(x => {
      // console.log(x);
      this.dataSelectBlok = [];
      x.forEach(d => {
        this.dataSelectBlok.push({"id":d.id,"text":d.kode+"("+d.nama+")"});
      });

      this.dataSelectBlok.forEach(a => {
        if (a.id == this.estPremiBasisPanen.blok_id) {
          selectMill = a;
        }

      });
      this.entryForm.controls['blok_id'].patchValue(selectMill);

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
    dataSubmit['tanggal_efektif']=formatDate( this.entryForm.get('tanggal_efektif').value,"yyyy-MM-dd",'en_US');
    console.log(dataSubmit);
    this.estPremiBasisPanenService.update(this.estPremiBasisPanen.id, dataSubmit).subscribe(data => {

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
