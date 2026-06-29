import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// import { BlogService } from 'src/app/services/blog.service';

import { formatDate } from '@angular/common';

import { SlsInvoice } from 'src/app/shared/models/sls_invoice.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { SlsInvoiceService } from 'src/app/shared/services/sls_invoice.service';

import { SlsRekapService } from 'src/app/shared/services/sls_rekap.service';

import { LookupRekapComponent } from '../lookup-rekap/lookup-rekap.component';
import { GbmCustomerService } from 'src/app/shared/services/gbm_customer.service';
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

  slsInvoice: SlsInvoice;
  dbName;
  pathName;
  PATH_URL;
  dataSelectCustomer: any[];
  dataSelectLokasi: any[];
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private bsModalRef1: BsModalRef,
    private bsModalService: BsModalService,

    private slsInvoiceService: SlsInvoiceService,
    private slsRekapService: SlsRekapService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private gbmCustomerService: GbmCustomerService,



  ) {

    let toDate: Date = new Date();
    this.entryForm = this.builder.group({
      lokasi_id: new FormControl([], Validators.required),
      sls_rekap_id: new FormControl([], Validators.required),
      customer_id: new FormControl([], Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      no_invoice: new FormControl('', Validators.required),
      // rekap
      no_rekap: new FormControl('', Validators.required),
      total_berat_terima: new FormControl(0, Validators.required),
      harga_satuan: new FormControl(0, Validators.required),
      jumlah: new FormControl(0, Validators.required),
      sub_total: new FormControl(0, Validators.required),

      disc: new FormControl(0, Validators.required),
      uang_muka: new FormControl(0, Validators.required),
      dpp: new FormControl(0, Validators.required),
      ppn: new FormControl(0, Validators.required),
      grand_total: new FormControl(0, Validators.required),
    });
   }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

    console.log(this.slsInvoice);
    // {value: null, disabled: true}

    this.entryForm.controls['no_invoice'].patchValue(this.slsInvoice.no_invoice);
    this.entryForm.controls['no_rekap'].patchValue(this.slsInvoice.no_rekap);
    this.entryForm.controls['sls_rekap_id'].patchValue(this.slsInvoice.sls_rekap_id);
    this.entryForm.controls['total_berat_terima'].patchValue(this.slsInvoice.total_berat_terima);
    this.entryForm.controls['harga_satuan'].patchValue(this.slsInvoice.harga_satuan);
    this.entryForm.controls['jumlah'].patchValue(this.slsInvoice.jumlah);

    this.entryForm.controls['sub_total'].patchValue(this.slsInvoice.sub_total);
    this.entryForm.controls['disc'].patchValue(this.slsInvoice.disc);
    this.entryForm.controls['uang_muka'].patchValue(this.slsInvoice.uang_muka);
    this.entryForm.controls['dpp'].patchValue(this.slsInvoice.dpp);
    this.entryForm.controls['ppn'].patchValue(this.slsInvoice.ppn);

    this.entryForm.controls['grand_total'].patchValue(this.slsInvoice.grand_total);

    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.slsInvoice.tanggal)));

  }
  private loadSelect2(): void {
    let selectedCustomer;


    this.gbmCustomerService.getAll().subscribe(x=>{

      this.dataSelectCustomer=[];
      x['data'].forEach(d => {
        this.dataSelectCustomer.push({"id":d.id,"text":d.kode_customer+" - "+d.nama_customer});
        if (d.id == this.slsInvoice.customer_id) {
          selectedCustomer = d;
        }
      });
      this.entryForm.controls['customer_id'].patchValue(selectedCustomer);
    });
    let selectedLokasi;
    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x=>{

      this.dataSelectLokasi=[];
      x.forEach(d => {
        this.dataSelectLokasi.push({"id":d.id,"text":d.nama});
        if (d.id == this.slsInvoice.lokasi_id) {
          selectedLokasi = d;
        }
      });
      this.entryForm.controls['lokasi_id'].patchValue(selectedLokasi);

    });

    let customer_id;
    this.entryForm.controls['customer_id'].valueChanges.subscribe(x => {
      customer_id = x.id;
      // this.slsKontrakService.getAll().subscribe(x=>{
      //   console.log(x);
      //   this.dataSelectKontrak=[];
      //   x['data'].forEach(d => {
      //     if (d.customer_id == customer_id) {
      //       this.dataKontrak.push(d);
      //       this.dataSelectKontrak.push({"id":d.id,"text":d.no_spk});
      //     }
      //   });
      // });
    });


  }

  showRekap() {
    // this.slsRekapService.getAll().subscribe(t => {

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        class: "modal-lg ",
        initialState: {
          customer_id: this.entryForm.get('customer_id').value.id
        }
      };
      this.bsModalRef1 = this.bsModalService.show(LookupRekapComponent, modalConfig);
      this.bsModalRef1.content.event.subscribe(item => {
        if (item == null) {
        } else {
          this.showNotification('top', 'right', "No Rekap " + item['no_rekap'] + " ", 2);

          this.entryForm.get('sls_rekap_id').patchValue(item['id']);
          this.entryForm.get('no_rekap').patchValue(item['no_rekap']);
          this.entryForm.get('total_berat_terima').patchValue(item['total_berat_terima']);
          this.entryForm.get('harga_satuan').patchValue(item['harga_satuan']);
          this.entryForm.get('jumlah').patchValue(item['total_berat_terima']);
          // this.entryForm.get('sub_total').patchValue(item['sub_total']);
          this.entryForm.get('ppn').patchValue(item['ppn']);
          this.entryForm.get('disc').patchValue(0);
          this.entryForm.get('uang_muka').patchValue(0);
          // this.entryForm.get('dpp').patchValue(item['sub_total']);
          this.hitungTotal();

        }
      });
    // });
  }

  showNotification(from, align, message, color = 4) {
    var type = ['', 'info', 'success', 'warning', 'danger', 'rose', 'primary'];
    console.log(type[color]);
    $.notify({
      icon: "notifications",
      message: message
    }, {
      type: type[color],
      timer: 3000,
      placement: {
        from: from,
        align: align
      }
    });
  }

  onSubmit() {
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }


    let dataSubmit = this.entryForm.value;
    dataSubmit['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');
    console.log(dataSubmit);
    this.slsInvoiceService.update(this.slsInvoice.id, dataSubmit).subscribe(data => {

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
  valueChange($event){

    this.hitungTotal();

  }
hitungTotal() {

  var total_berat_terima = this.entryForm.get('total_berat_terima').value;
  this.entryForm.get('jumlah').patchValue(total_berat_terima);

  var jumlah = parseFloat(this.entryForm.get('jumlah').value) || 0;
  var harga = parseFloat(this.entryForm.get('harga_satuan').value) || 0;

  let sub_total = jumlah * harga;
  this.entryForm.get('sub_total').patchValue(sub_total);

  var disc = parseFloat(this.entryForm.get('disc').value) || 0;
  var uang_muka = parseFloat(this.entryForm.get('uang_muka').value) || 0;

  var nilai_transaksi = sub_total - disc - uang_muka;

  var dpp = (11 / 12) * nilai_transaksi;

  var nilai_ppn =
    (parseFloat(this.entryForm.get('ppn').value) || 0) / 100 * dpp;

  var grand_total = nilai_transaksi + nilai_ppn;

  this.entryForm.get('dpp').patchValue(dpp);
  this.entryForm.get('nilai_ppn').patchValue(nilai_ppn);
  this.entryForm.get('grand_total').patchValue(grand_total);
}
}
