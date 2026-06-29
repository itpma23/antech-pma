import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { SlsKontrakService } from 'src/app/shared/services/sls_kontrak.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmCustomerService } from 'src/app/shared/services/gbm_customer.service';
import { SlsKontrak } from 'src/app/shared/models/sls_kontrak.model';
import { formatDate } from '@angular/common';

declare var swal: any;
@Component({
    moduleId: module.id,
    selector: 'add-cmp',
    templateUrl: 'add.component.html',
    styleUrls: ['add.component.css'],
})

export class AddComponent implements OnInit,AfterViewInit{
  isFormSubmitted=false;
  // mass = 0;
  // height = 0;
  // get bmi() {
  //   return this.mass * this.height;
  // }

	datepickerConfig = {
		dateInputFormat: 'DD-MM-YYYY',
		containerClass: 'theme-red',


}
  entryForm: FormGroup;
  event: EventEmitter<any>=new EventEmitter();

  public dataSelectMill: any[] = [];
  public dataSelectItem: any[] = [];
  public dataSelectCustomer: any[] = [];


  public options: any;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private pksTimbanganService:SlsKontrakService,
    private invItemService:InvItemService,
    private gbmCustomerService:GbmCustomerService,
    private GbmOrganisasiService:GbmOrganisasiService


    ) {
      let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      no_spk: new FormControl('',Validators.required),
      no_ref: new FormControl(''),
      tanggal: new FormControl(toDate, Validators.required),
      lokasi_id: new FormControl([], Validators.required),
      customer_id: new FormControl([], Validators.required),
      alamat_pengiriman: new FormControl('',Validators.required),
      alamat_penagihan: new FormControl('',Validators.required),
      pic: new FormControl('',Validators.required),
      produk_id: new FormControl([], Validators.required),
      jumlah: new FormControl(0, ),
      harga_satuan: new FormControl(0, ),
      sub_total: new FormControl(0,),
      pph: new FormControl(0,),
      ppn: new FormControl(0, ),
      total: new FormControl(0, ),
      periode_kirim_awal: new FormControl(toDate, Validators.required),
      periode_kirim_akhir: new FormControl(toDate, Validators.required),
      ffa: new FormControl(0,),
      mi: new FormControl(0,),
      impurities: new FormControl(0,),
      dobi: new FormControl(0, ),
      moisture: new FormControl(0, ),
      grading: new FormControl(0,),
      toleransi: new FormControl(0,),
      keterangan: new FormControl('',),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }


  private loadSelect2(): void {

    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x=>{
      console.log(x);
      this.dataSelectMill=[];
      x.forEach(d => {
        this.dataSelectMill.push({"id":d.id,"text":d.nama});
      });

    });

    this.invItemService.getAllProduk().subscribe(x=>{
      console.log(x);
      this.dataSelectItem=[];
      x['data'].forEach(d => {
        this.dataSelectItem.push({"id":d.id,"text":d.nama});
      });

    });

    this.gbmCustomerService.getAll().subscribe(x=>{
      console.log(x);
      this.dataSelectCustomer=[];
      x['data'].forEach(d => {
        this.dataSelectCustomer.push({"id":d.id,"text":d.nama_customer});
      });

    });

  }
  onSubmit(){
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    let dataSubmit :SlsKontrak = {
      'no_spk': this.entryForm.get('no_spk').value,
      'no_ref': this.entryForm.get('no_ref').value,
      'tanggal': formatDate(this.entryForm.get('tanggal').value, "yyy-MM-dd", "en_US"),
      'lokasi_id': this.entryForm.get('lokasi_id').value.id,
      'customer_id': this.entryForm.get('customer_id').value.id,
      'alamat_pengiriman': this.entryForm.get('alamat_pengiriman').value,
      'alamat_penagihan': this.entryForm.get('alamat_penagihan').value,
      'pic': this.entryForm.get('pic').value,
      'produk_id': this.entryForm.get('produk_id').value.id,
      'jumlah':this.entryForm.get('jumlah').value,
      'harga_satuan': this.entryForm.get('harga_satuan').value,
      'sub_total': this.entryForm.get('sub_total').value,
      'ppn':this.entryForm.get('ppn').value,
      'pph':this.entryForm.get('pph').value,
      'total':this.entryForm.get('total').value,
      'periode_kirim_awal': formatDate(this.entryForm.get('periode_kirim_awal').value, "yyy-MM-dd", "en_US"),
      'periode_kirim_akhir': formatDate(this.entryForm.get('periode_kirim_akhir').value, "yyy-MM-dd", "en_US"),
      'ffa':this.entryForm.get('ffa').value,
      'mi':this.entryForm.get('mi').value,
      'impurities':this.entryForm.get('impurities').value,
      'dobi':this.entryForm.get('dobi').value,
      'moisture':this.entryForm.get('moisture').value,
      'grading':this.entryForm.get('grading').value,
      'toleransi':this.entryForm.get('toleransi').value,
      'keterangan':this.entryForm.get('keterangan').value


    };


    console.log(dataSubmit);
    this.pksTimbanganService.create(dataSubmit).subscribe(data=>{
      // console.log(data);
      if( data['status']=='OK'){
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

//   upload(event) {
//     const file = (event.target as HTMLInputElement).files[0];
//     this.entryForm.patchValue({
//       img: file
//     });
//     this.entryForm.get('img').updateValueAndValidity()
//     console.log(file);
//  }

jumlah1(e){
  // let jml1 = this.entryForm.get('cpo_los_fruit').value + this.entryForm.get('cpo_los_press').value
  // this.entryForm.get('jml').patchValue(jml1)
  var n1 = parseFloat(this.entryForm.get('jumlah').value);
  var n2 = parseFloat (this.entryForm.get('harga_satuan').value);
  this.entryForm.get('sub_total').patchValue( n1 * n2 );
  var sub = parseFloat(this.entryForm.get('sub_total').value);

  var n3 = parseFloat(this.entryForm.get('ppn').value);
  var n4 = parseFloat(this.entryForm.get('pph').value);
  this.entryForm.get('total').patchValue( ((n3/100) * sub) + ((n4/100) * sub) + sub);
}

  onClose(){
    this.bsModalRef.hide();
  }

  ngOnInit() {

     this.loadSelect2();

   }
  valueChange($event){
    console.log($event);

    this.jumlah1($event);

  //  let selectedOptions = $event.target['options'];
  //  let selectedIndex = selectedOptions.selectedIndex;
  // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
}
