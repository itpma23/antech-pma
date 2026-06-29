import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { PksSoundingKernel } from 'src/app/shared/models/pks_sounding_kernel.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { PksSoundingKernelService } from 'src/app/shared/services/pks_sounding_kernel.service';
import { PksTankiService } from 'src/app/shared/services/pks_tanki.service';
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
  public dataSelectMill: any[] = [];
  public dataSelectTanki: any[] = [];

  pksSoundingKernel: PksSoundingKernel;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private pksSoundingKernelService: PksSoundingKernelService,
    private pksTankiService: PksTankiService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private pksSoundingService: PksSoundingKernelService,


  ) {

    let toDate: Date = new Date();
    this.entryForm = this.builder.group({


      tanggal: new FormControl(toDate, Validators.required),
      tanki_id: new FormControl([], Validators.required),
      mill_id: new FormControl([], Validators.required),

      hasil_ukur_a: new FormControl(0, Validators.required),
      hasil_ukur_b: new FormControl(0, Validators.required),
      hasil_ukur_c: new FormControl(0, Validators.required),
      hasil_ukur_d: new FormControl(0, Validators.required),

      stok_a: new FormControl(0, Validators.required),
      stok_b: new FormControl(0,Validators.required),
      stok_c: new FormControl(0,Validators.required),
      stok_d: new FormControl(0,Validators.required),

      hasil_sounding: new FormControl(0,Validators.required),


      jml: new FormControl(0),
      jml1: new FormControl(0),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    console.log(this.pksSoundingKernel);


    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.pksSoundingKernel.tanggal)));

    this.entryForm.controls['hasil_ukur_a'].patchValue(this.pksSoundingKernel.hasil_ukur_a);
    this.entryForm.controls['hasil_ukur_b'].patchValue(this.pksSoundingKernel.hasil_ukur_b);
    this.entryForm.controls['hasil_ukur_c'].patchValue(this.pksSoundingKernel.hasil_ukur_c);
    this.entryForm.controls['hasil_ukur_d'].patchValue(this.pksSoundingKernel.hasil_ukur_d);

    this.entryForm.controls['stok_a'].patchValue(this.pksSoundingKernel.stok_a);
    this.entryForm.controls['stok_b'].patchValue(this.pksSoundingKernel.stok_b);
    this.entryForm.controls['stok_c'].patchValue(this.pksSoundingKernel.stok_c);
    this.entryForm.controls['stok_d'].patchValue(this.pksSoundingKernel.stok_d);

    this.entryForm.controls['hasil_sounding'].patchValue(this.pksSoundingKernel.hasil_sounding);


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
        if (a.id == this.pksSoundingKernel.mill_id) {
          selectMill = a;
        }
      });
      this.entryForm.controls['mill_id'].patchValue(selectMill);
    });

    let selectTanki;
    this.pksTankiService.getAll().subscribe(x => {
      this.dataSelectTanki = [];
      x['data'].forEach(d => {
        this.dataSelectTanki.push({ "id": d.id, "text": d.nama_tanki });
      });
      this.dataSelectTanki.forEach(a => {
        if (a.id == this.pksSoundingKernel.tanki_id) {
          selectTanki = a;
        }
        this.entryForm.controls['tanki_id'].patchValue(selectTanki);
      });
      console.log(selectTanki);
    });



  //  let selectMill;
  //   this.GbmOrganisasiService.getAllByType('MILL').subscribe(x => {
  //     console.log(x);
  //     this.dataSelectMill = [];
  //     x.forEach(d => {
  //       this.dataSelectMill.push({ "id": d.id, "text": d.nama });
  //     });

  //     this.dataSelectMill.forEach(a => {
  //       if (a.id == this.pksSoundingKernel.mill_id) {
  //         selectMill = a;
  //       }

  //     });
  //     this.entryForm.controls['mill_id'].patchValue(selectMill);

  //   });


  }

  onSubmit() {
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    // let frmData=new FormData();
    // if (this.entryForm.invalid) {
    //   return;
    // }
    let dataSubmit = this.entryForm.value;
    dataSubmit['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');
    // console.log(dataSubmit);
    this.pksSoundingKernelService.update(this.pksSoundingKernel.id, dataSubmit).subscribe(data => {

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
  processSounding(){
    let data = {
      hasil_ukur_A: this.entryForm.get("hasil_ukur_a").value,
      hasil_ukur_B: this.entryForm.get("hasil_ukur_b").value,
      hasil_ukur_C: this.entryForm.get("hasil_ukur_c").value,
      hasil_ukur_D: this.entryForm.get("hasil_ukur_d").value,
    };
    this.pksSoundingService.processSoundingKernel(data).subscribe(x=> {
      console.log(data);
      this.entryForm.get("stok_a").patchValue(x['data'].jumlah_stok_A);
      this.entryForm.get("stok_b").patchValue(x['data'].jumlah_stok_B);
      this.entryForm.get("stok_c").patchValue(x['data'].jumlah_stok_C);
      this.entryForm.get("stok_d").patchValue(x['data'].jumlah_stok_D);
      this.entryForm.get("hasil_sounding").patchValue(
        (x['data'].total_stok).toFixed(2)
      );
    });
  }
}
