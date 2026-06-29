import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { PksLabPengolahan } from 'src/app/shared/models/pks_lab_pengolahan';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { PksLabPengolahanService } from 'src/app/shared/services/pks_lab_pengolahan.service';
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
  public dataSelectMill: any[] = [];
  public dataSelectTimbangan: any[] = [];

  pksLabPengolahan: PksLabPengolahan;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private pksLabPengolahanService: PksLabPengolahanService,
    private gbmSupplierService: GbmSupplierService,
    private GbmOrganisasiService: GbmOrganisasiService


  ) {

    let toDate: Date = new Date();
    this.entryForm = this.builder.group({

      no_transaksi: new FormControl('',Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      mill_id: new FormControl([], Validators.required),
      
      cpo_moisture: new FormControl(0, Validators.required),
      cpo_dobi: new FormControl(0, Validators.required),
      cpo_ffa: new FormControl(0, Validators.required),
      cpo_dirt: new FormControl(0, Validators.required),
      
      kernel_moisture: new FormControl(0, Validators.required),
      kernel_dobi: new FormControl(0,Validators.required),
      kernel_ffa: new FormControl(0,Validators.required),
      kernel_dirt: new FormControl(0,Validators.required),
      
      cpo_los_fruit: new FormControl(0,Validators.required),
      cpo_los_press: new FormControl(0,Validators.required),
      cpo_los_nut: new FormControl(0,Validators.required),
      cpo_los_e_bunch: new FormControl(0,Validators.required),
      cpo_los_effluent: new FormControl(0,Validators.required),
      
      kernel_los_fruit: new FormControl(0,Validators.required),
      kernel_los_fiber_cyclone: new FormControl(0,Validators.required),
      kernel_los_ltds1: new FormControl(0,Validators.required),
      kernel_los_ltds2: new FormControl(0,Validators.required),
      kernel_los_claybath: new FormControl(0,Validators.required),
   

      jml: new FormControl(0),
      jml1: new FormControl(0),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    console.log(this.pksLabPengolahan);


    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.pksLabPengolahan.tanggal)));
    this.entryForm.controls['no_transaksi'].patchValue(this.pksLabPengolahan.no_transaksi);
 
    this.entryForm.controls['cpo_moisture'].patchValue(this.pksLabPengolahan.cpo_moisture);
    this.entryForm.controls['cpo_dobi'].patchValue(this.pksLabPengolahan.cpo_dobi);
    this.entryForm.controls['cpo_ffa'].patchValue(this.pksLabPengolahan.cpo_ffa);
    this.entryForm.controls['cpo_dirt'].patchValue(this.pksLabPengolahan.cpo_dirt);

    this.entryForm.controls['kernel_moisture'].patchValue(this.pksLabPengolahan.kernel_moisture);
    this.entryForm.controls['kernel_dobi'].patchValue(this.pksLabPengolahan.kernel_dobi);
    this.entryForm.controls['kernel_ffa'].patchValue(this.pksLabPengolahan.kernel_ffa);
    this.entryForm.controls['kernel_dirt'].patchValue(this.pksLabPengolahan.kernel_dirt);

    this.entryForm.controls['cpo_los_fruit'].patchValue(this.pksLabPengolahan.cpo_los_fruit);
    this.entryForm.controls['cpo_los_press'].patchValue(this.pksLabPengolahan.cpo_los_press);
    this.entryForm.controls['cpo_los_nut'].patchValue(this.pksLabPengolahan.cpo_los_nut);
    this.entryForm.controls['cpo_los_e_bunch'].patchValue(this.pksLabPengolahan.cpo_los_e_bunch);
    this.entryForm.controls['cpo_los_effluent'].patchValue(this.pksLabPengolahan.cpo_los_effluent);

    this.entryForm.controls['kernel_los_fruit'].patchValue(this.pksLabPengolahan.kernel_los_fruit);
    this.entryForm.controls['kernel_los_fiber_cyclone'].patchValue(this.pksLabPengolahan.kernel_los_fiber_cyclone);
    this.entryForm.controls['kernel_los_ltds1'].patchValue(this.pksLabPengolahan.kernel_los_ltds1);
    this.entryForm.controls['kernel_los_ltds2'].patchValue(this.pksLabPengolahan.kernel_los_ltds2);
    this.entryForm.controls['kernel_los_claybath'].patchValue(this.pksLabPengolahan.kernel_los_claybath);
    

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
    //     if (a.id == this.pksLabPengolahan.lokasi_id) {
    //       selectMill = a;
    //     }

    //   });
    //   this.entryForm.controls['lokasi_id'].patchValue(selectMill);

    // });

   let selectMill;
    this.GbmOrganisasiService.getAllByType('MILL').subscribe(x => {
      console.log(x);
      this.dataSelectMill = [];
      x.forEach(d => {
        this.dataSelectMill.push({ "id": d.id, "text": d.nama });
      });

      this.dataSelectMill.forEach(a => {
        if (a.id == this.pksLabPengolahan.mill_id) {
          selectMill = a;
        }

      });
      this.entryForm.controls['mill_id'].patchValue(selectMill);

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
    dataSubmit['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');
    console.log(dataSubmit);
    this.pksLabPengolahanService.update(this.pksLabPengolahan.id, dataSubmit).subscribe(data => {

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
          text: 'Proses Edit Gagal',
          type: 'warning',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
      }
    });
  }
  jumlah1(e){
    // let jml1 = this.entryForm.get('cpo_los_fruit').value + this.entryForm.get('cpo_los_press').value
    // this.entryForm.get('jml').patchValue(jml1)
    var n1 = parseFloat(this.entryForm.get('cpo_los_fruit').value);
    var n2 = parseFloat (this.entryForm.get('cpo_los_press').value);
    var n3 = parseFloat (this.entryForm.get('cpo_los_nut').value);
    var n4 = parseFloat (this.entryForm.get('cpo_los_e_bunch').value);
    var n5 = parseFloat (this.entryForm.get('cpo_los_effluent').value);
    this.entryForm.get('jml').patchValue( n1 + n2 + n3 + n4 + n5  );
  }

  jumlah2(e){
    // let jml1 = this.entryForm.get('cpo_los_fruit').value + this.entryForm.get('cpo_los_press').value
    // this.entryForm.get('jml').patchValue(jml1)
    var n1 = parseFloat(this.entryForm.get('kernel_los_fruit').value);
    var n2 = parseFloat(this.entryForm.get('kernel_los_fiber_cyclone').value);
    var n3 = parseFloat(this.entryForm.get('kernel_los_ltds1').value);
    var n4 = parseFloat(this.entryForm.get('kernel_los_ltds2').value);
    var n5 = parseFloat(this.entryForm.get('kernel_los_claybath').value);
    this.entryForm.get('jml1').patchValue( (n1 + n2) + (n3 + n4) + n5 );
  }



  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {

    this.loadSelect2();

  }
  valueChange($event) {
    console.log($event);
    this.jumlah1($event);
    this.jumlah2($event);

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
