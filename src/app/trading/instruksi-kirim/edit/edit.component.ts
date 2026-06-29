import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';


import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';;
import { SlsIntruksi } from 'src/app/shared/models/sls_intruksi.model';
import { SlsKontrakService } from 'src/app/shared/services/sls_kontrak.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { SlsIntruksiService } from 'src/app/shared/services/sls_intruksi.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmCustomerService } from 'src/app/shared/services/gbm_customer.service';
import { TradingIntruksiService } from 'src/app/shared/services/trading_intruksi.service';
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
  public dataSelectMill: any[] = [];
  public dataSelectKontrak: any[] = [];
  public dataSelectItem: any[] = [];
  public dataSelectCustomer: any[] = [];
  public dataSelectSupplier: any[] = [];

  slsIntruksi: SlsIntruksi;
  dbName;
  pathName;
  PATH_URL;
  dataSelectLokasi: any[];
  dataKontrak: any;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private slsKontrakService:SlsKontrakService,
    private slsIntruksiService: TradingIntruksiService,
    private invItemService: InvItemService,
    private gbmSupplierService: GbmCustomerService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private GbmCustomerService: GbmCustomerService,


  ) {
    let toDate: Date = new Date();
    let time: Date = new Date();

    this.entryForm = this.builder.group({
      sales_lokasi_id: new FormControl([], Validators.required),
      kepada_lokasi_id: new FormControl([], Validators.required),
      customer_id: new FormControl('', ),
      spk_id: new FormControl([], Validators.required),
      no_transaksi: new FormControl('', Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      alamat_pengiriman: new FormControl('', Validators.required),
      keterangan: new FormControl('', Validators.required),
      pic: new FormControl('', Validators.required),
      periode_kirim_awal:  new FormControl(toDate, Validators.required),
      periode_kirim_akhir:  new FormControl(toDate, Validators.required),
      // produk_id: new FormControl([], Validators.required),
      jumlah: new FormControl(0, Validators.required),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

    console.log(this.slsIntruksi);
    let tanggal = new Date(Date.parse(this.slsIntruksi['tanggal']));
    let periode_kirim_awal = new Date(Date.parse(this.slsIntruksi['periode_kirim_awal']));
    let periode_kirim_akhir = new Date(Date.parse(this.slsIntruksi['periode_kirim_akhir']));


    this.entryForm.controls['spk_id'].patchValue(this.slsIntruksi.spk_id);
    // this.entryForm.controls['customer_id'].patchValue(this.slsIntruksi.spk_id);
    this.entryForm.controls['no_transaksi'].patchValue(this.slsIntruksi.no_transaksi);
    this.entryForm.get('tanggal').patchValue(tanggal);
    this.entryForm.controls['alamat_pengiriman'].patchValue(this.slsIntruksi.alamat_pengiriman);
    this.entryForm.controls['keterangan'].patchValue(this.slsIntruksi.keterangan);
    this.entryForm.controls['pic'].patchValue(this.slsIntruksi.pic);
    this.entryForm.get('periode_kirim_awal').patchValue(periode_kirim_awal);
    this.entryForm.get('periode_kirim_akhir').patchValue(periode_kirim_akhir);
    this.entryForm.controls['jumlah'].patchValue(this.slsIntruksi.jumlah);




  }
  private loadSelect2(): void {

  let selectKepadaLokasi;

    this.GbmOrganisasiService.getAllByType('HO').subscribe(x => {
      console.log(x);
      this.dataSelectMill = [];
      x.forEach(d => {
        this.dataSelectMill.push({ "id": d.id, "text": d.nama });
      });


      this.dataSelectMill.forEach(a => {
        if (a.id == this.slsIntruksi.kepada_lokasi_id) {
          selectKepadaLokasi = a;
        }

      });

      this.entryForm.controls['kepada_lokasi_id'].patchValue(selectKepadaLokasi);

    });

    let selectSalesLokasi;
    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x=>{
      console.log(x);
      this.dataSelectLokasi=[];
      x.forEach(d => {
        this.dataSelectLokasi.push({"id":d.id,"text":d.nama});
      });
      this.dataSelectLokasi.forEach(a => {
        if (a.id == this.slsIntruksi.sales_lokasi_id) {
          selectSalesLokasi = a;
        }

      });

      this.entryForm.controls['sales_lokasi_id'].patchValue(selectSalesLokasi);

    });

    let selectedKontrak;
    this.slsKontrakService.getAll().subscribe(x=>{
      console.log(x);
      this.dataSelectKontrak=[];
      x['data'].forEach(d => {
        this.dataSelectKontrak.push({"id":d.id,"text":d.no_spk});
      });
      this.dataSelectKontrak.forEach(a => {
        if (a.id == this.slsIntruksi.spk_id) {
          selectedKontrak = a;
        }
      });
      this.entryForm.controls['spk_id'].patchValue(selectedKontrak);
    });


    let selectedCustomer;
    this.GbmCustomerService.getAll().subscribe(x=>{
      console.log(x);
      this.dataSelectCustomer=[];
      x['data'].forEach(d => {
        this.dataSelectCustomer.push({"id":d.id,"text":d.nama_customer});
      });
      this.dataSelectCustomer.forEach(a => {
        if (a.id == this.slsIntruksi.customer_id) {
          selectedCustomer = a;
        }
      });
      this.entryForm.controls['customer_id'].patchValue(selectedCustomer);
    });
    let customer_id;
    this.entryForm.controls['customer_id'].valueChanges.subscribe(x => {
      customer_id = x.id;
      this.slsKontrakService.getAll().subscribe(x=>{
        console.log(x);
        this.dataSelectKontrak=[];
        this.dataKontrak=[];
        x['data'].forEach(d => {
          if (d.customer_id == customer_id) {
             this.dataKontrak.push(d);
            this.dataSelectKontrak.push({"id":d.id,"text":d.no_spk});
          }
        });
      });
    });
    this.entryForm.controls['spk_id'].valueChanges.subscribe(x=> {
      let spk_id = x.id;
      this.dataKontrak.forEach(x=>{
        if (x.id == spk_id) {
          this.entryForm.get("alamat_pengiriman").patchValue(x.alamat_pengiriman);
          this.entryForm.get("keterangan").patchValue(x.keterangan);
          this.entryForm.get("pic").patchValue(x.pic);
          this.entryForm.get("jumlah").patchValue(x.jumlah);
          // this.entryForm.get("priode_kirim_awal").patchValue(formatDate(x.priode_kirim_awal, "yyy-MM-dd", "en_US"));
          // this.entryForm.get("priode_kirim_akhir").patchValue(formatDate(x.priode_kirim_akhir, "yyy-MM-dd", "en_US"));
        }
      });
    });
  //   let selectedItem;
  //   this.invItemService.getAll().subscribe(x=>{
  //     console.log(x);
  //     this.dataSelectItem=[];
  //     x['data'].forEach(d => {
  //       this.dataSelectItem.push({"id":d.id,"text":d.nama});
  //     });
  //     this.dataSelectItem.forEach(a => {
  //       // if (a.id == this.slsIntruksi.produk_id) {
  //       //   selectedItem = a;
  //       // }

  //   });
  //   // this.entryForm.controls['produk_id'].patchValue(selectedItem);
  // });




  }

  onSubmit() {
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;


    let dataSubmit: SlsIntruksi = {
      'sales_lokasi_id': this.entryForm.get('sales_lokasi_id').value.id,
      'kepada_lokasi_id': this.entryForm.get('kepada_lokasi_id').value.id,
      'spk_id': this.entryForm.get('spk_id').value.id,
      'customer_id': this.entryForm.get('customer_id').value,
      'no_transaksi':this.entryForm.get('no_transaksi').value,
      'tanggal': formatDate(this.entryForm.get('tanggal').value, "yyy-MM-dd", "en_US"),
      'alamat_pengiriman': this.entryForm.get('alamat_pengiriman').value,
      'keterangan':this.entryForm.get('keterangan').value,
      'pic':this.entryForm.get('pic').value,
      'periode_kirim_awal': formatDate(this.entryForm.get('periode_kirim_awal').value, "yyy-MM-dd", "en_US"),
      'periode_kirim_akhir': formatDate(this.entryForm.get('periode_kirim_akhir').value, "yyy-MM-dd", "en_US"),
      // 'produk_id': this.entryForm.get('produk_id').value.id,
      'jumlah':this.entryForm.get('jumlah').value,


    };
    console.log(dataSubmit);
    this.slsIntruksiService.update(this.slsIntruksi.id, dataSubmit).subscribe(data => {

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
