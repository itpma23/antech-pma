import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { HrmsBasisLembur } from 'src/app/shared/models/hrms_basis_lembur.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { HrmsBasisLemburService } from 'src/app/shared/services/hrms_basis_lembur.service';
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
  public dataSelectTipe: any[] = [];
  public dataSelectSupplier: any[] = [];
  public dataSelectTimbangan: any[] = [];

  hrmsBasisLembur: HrmsBasisLembur;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private hrmsBasisLemburService: HrmsBasisLemburService,
    // private gbmSupplierService: GbmSupplierService,
    private GbmOrganisasiService: GbmOrganisasiService


  ) {

    let toDate: Date = new Date();
    this.entryForm = this.builder.group({

      lokasi_id: new FormControl([], Validators.required),
      tipe_lembur:  new FormControl([],Validators.required),
      basis_jam_lembur: new FormControl(0, Validators.required),
      jumlah_jam_lembur: new FormControl(0, Validators.required),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    console.log(this.hrmsBasisLembur);

    this.entryForm.controls['basis_jam_lembur'].patchValue(this.hrmsBasisLembur.basis_jam_lembur);
    this.entryForm.controls['jumlah_jam_lembur'].patchValue(this.hrmsBasisLembur.jumlah_jam_lembur);

  }
  private loadSelect2(): void {




      this.dataSelectTipe = [
        { id: 'HariKerja', text: 'Hari Kerja' },
        { id: 'HariMinggu', text: 'Hari Minggu' },
        { id: 'HariLibur', text: 'Hari Libur' },
        { id: 'HariRaya', text: 'Hari Raya' },
        { id: 'HariLiburPendek', text: 'Hari Libur HK terpendek' },
        { id: 'HariLiburKhusus', text: 'Hari Libur Khusus' },
      ];
      let selectTipe;
    this.dataSelectTipe.forEach(a => {
      if (a.id == this.hrmsBasisLembur.tipe_lembur) {
        selectTipe = a;
      }
    });
    this.entryForm.controls['tipe_lembur'].patchValue(selectTipe);

    let selectMill;
    this.GbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      console.log(x);
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });

      this.dataSelectLokasi.forEach(a => {
        if (a.id == this.hrmsBasisLembur.lokasi_id) {
          selectMill = a;
        }

      });
      this.entryForm.controls['lokasi_id'].patchValue(selectMill);

    });

    // let selectSupplier;
    // this.gbmSupplierService.getAll().subscribe(x => {

    //   this.dataSelectSupplier = [];
    //   x['data'].forEach(d => {
    //     this.dataSelectSupplier.push({ "id": d.id, "text": d.nama_supplier });
    //   });

    //   this.dataSelectSupplier.forEach(a => {
    //     if (a.id == this.hrmsBasisLembur.supplier_id) {
    //       selectSupplier = a;
    //     }
    //     this.entryForm.controls['supplier_id'].patchValue(selectSupplier);
    //   });

    // });

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
    this.hrmsBasisLemburService.update(this.hrmsBasisLembur.id, dataSubmit).subscribe(data => {

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
