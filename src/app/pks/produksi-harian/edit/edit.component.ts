import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate, formatNumber } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { PksProduksiHarian } from 'src/app/shared/models/pks_produksi_harian.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { PksProduksiHarianService } from 'src/app/shared/services/pks_produksi_harian.service';
import { isNullOrUndefined, isNumber, isString } from 'util';

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
  public dataSelectTipe: any[] = [];
  public dataSelectMill: any[] = [];

  pksProduksiHarian: any;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private pksProduksiHarianService: PksProduksiHarianService,
    private GbmOrganisasiService: GbmOrganisasiService


  ) {

    let toDate: Date = new Date();
    this.entryForm = this.builder.group({

      no_transaksi: new FormControl('', Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      mill_id: new FormControl([], Validators.required),

      tbs_olah: new FormControl(0, Validators.required),
      tbs_kemarin: new FormControl(0, Validators.required),
      tbs_masuk: new FormControl(0, Validators.required),
      tbs_sisa: new FormControl(0, Validators.required),
      cpo_kg: new FormControl(0, Validators.required),
      kirim_cpo_kg: new FormControl(0, Validators.required),
      produksi_cpo_kg: new FormControl(0, Validators.required),
      kernel_kg: new FormControl(0, Validators.required),
      kirim_kernel_kg: new FormControl(0, Validators.required),
      produksi_kernel_kg: new FormControl(0, Validators.required)
    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

    console.log(this.pksProduksiHarian);
    let tanggal = new Date(Date.parse(this.pksProduksiHarian['tanggal']));
    this.entryForm.get('tanggal').patchValue(tanggal);
    this.entryForm.controls['no_transaksi'].patchValue(this.pksProduksiHarian.no_transaksi);

    this.entryForm.controls['tbs_olah'].patchValue(formatNumber(this.pksProduksiHarian.tbs_olah, 'en_US', '1.2-2'));
    this.entryForm.controls['tbs_kemarin'].patchValue(formatNumber(this.pksProduksiHarian.tbs_kemarin, 'en_US', '1.2-2'));
    this.entryForm.controls['tbs_masuk'].patchValue(formatNumber(this.pksProduksiHarian.tbs_masuk, 'en_US', '1.2-2'));
    this.entryForm.controls['tbs_sisa'].patchValue(formatNumber(this.pksProduksiHarian.tbs_sisa, 'en_US', '1.2-2'));

    this.entryForm.controls['cpo_kg'].patchValue(formatNumber(this.pksProduksiHarian.cpo_stok, 'en_US', '1.2-2'));
    this.entryForm.controls['kirim_cpo_kg'].patchValue(formatNumber(this.pksProduksiHarian.cpo_kirim, 'en_US', '1.2-2'));
    this.entryForm.controls['produksi_cpo_kg'].patchValue(formatNumber(this.pksProduksiHarian.cpo_produksi, 'en_US', '1.2-2'));
    this.entryForm.controls['kernel_kg'].patchValue(formatNumber(this.pksProduksiHarian.kernel_stok, 'en_US', '1.2-2'));
    this.entryForm.controls['kirim_kernel_kg'].patchValue(formatNumber(this.pksProduksiHarian.kernel_kirim, 'en_US', '1.2-2'));
    this.entryForm.controls['produksi_kernel_kg'].patchValue(formatNumber(this.pksProduksiHarian.kernel_produksi, 'en_US', '1.2-2'));


  }
  private loadSelect2(): void {



    let selectMill;
    this.GbmOrganisasiService.getAllByType('MILL').subscribe(x => {
      console.log(x);
      this.dataSelectMill = [];
      x.forEach(d => {
        this.dataSelectMill.push({ "id": d.id, "text": d.nama });
      });

      this.dataSelectMill.forEach(a => {
        if (a.id == this.pksProduksiHarian.mill_id) {
          selectMill = a;
        }

      });
      this.entryForm.controls['mill_id'].patchValue(selectMill);

    });





  }

  onSubmit() {
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;

    let dataSubmit = this.entryForm.value;
    dataSubmit['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');

    const cleanNumber = (val: any): number => {
      
      if (val === null || val === undefined || val === '') return 0;
      
      const num = parseFloat(String(val).replace(/[^\d\.\-]/g, ""));
      return isNaN(num) ? 0 : num;
    };

    dataSubmit['tbs_olah'] = cleanNumber(this.entryForm.get('tbs_olah').value);
    dataSubmit['tbs_kemarin'] = cleanNumber(this.entryForm.get('tbs_kemarin').value);
    dataSubmit['tbs_masuk'] = cleanNumber(this.entryForm.get('tbs_masuk').value);
    dataSubmit['tbs_sisa'] = cleanNumber(this.entryForm.get('tbs_sisa').value);
    dataSubmit['cpo_kg'] = cleanNumber(this.entryForm.get('cpo_kg').value);
    dataSubmit['kirim_cpo_kg'] = cleanNumber(this.entryForm.get('kirim_cpo_kg').value);
    dataSubmit['produksi_cpo_kg'] = cleanNumber(this.entryForm.get('produksi_cpo_kg').value);
    dataSubmit['kernel_kg'] = cleanNumber(this.entryForm.get('kernel_kg').value);
    dataSubmit['kirim_kernel_kg'] = cleanNumber(this.entryForm.get('kirim_kernel_kg').value);
    dataSubmit['produksi_kernel_kg'] = cleanNumber(this.entryForm.get('produksi_kernel_kg').value);
    
    this.pksProduksiHarianService.update(this.pksProduksiHarian.id, dataSubmit).subscribe(data => {

      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Edit berhasil',
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
  processSounding() {

    let tgl = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US'); ''
    let data = { tanggal: tgl, mill_id: this.entryForm.get('mill_id').value['id'] }
    this.pksProduksiHarianService.getProduksiHarian(data).subscribe(d => {
      let res = d['data'];
      this.entryForm.controls['tbs_olah'].patchValue(res['tbs_olah_hari_ini']);
      this.entryForm.controls['tbs_kemarin'].patchValue(res['tbs_sisa_kemarin']);
      this.entryForm.controls['tbs_masuk'].patchValue(res['tbs_masuk']);
      this.entryForm.controls['tbs_sisa'].patchValue(res['tbs_sisa']);
      this.entryForm.controls['cpo_kg'].patchValue(res['cpo_kg_akhir']);
      this.entryForm.controls['kernel_kg'].patchValue(res['kernel_kg_akhir']);
      this.entryForm.controls['kirim_cpo_kg'].patchValue(res['cpo_kg_kirim']);
      this.entryForm.controls['kirim_kernel_kg'].patchValue(res['kernel_kg_kirim']);
      this.entryForm.controls['produksi_cpo_kg'].patchValue(res['cpo_kg_olah']);
      this.entryForm.controls['produksi_kernel_kg'].patchValue(res['kernel_kg_olah']);


    });
  }
  formatNumber( event ){
    // console.log(event.srcElement.getAttribute('formControlName'));
    let form = this.entryForm.get(event.srcElement.getAttribute('formControlName'));
    let value = this.entryForm.get(event.srcElement.getAttribute('formControlName')).value;
    if (isString(value)) {
      value = parseFloat(value.replace(/[^\d\.\-]/g, ""));
    }
    form.patchValue(formatNumber(value, 'en_US', '1.2-2'));
  }
}
