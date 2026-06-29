import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { SlsInvoiceService } from 'src/app/shared/services/sls_invoice.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmCustomerService } from 'src/app/shared/services/gbm_customer.service';
import { SlsKontrak } from 'src/app/shared/models/sls_kontrak.model';
import { formatDate } from '@angular/common';

import { SlsRekapService } from 'src/app/shared/services/sls_rekap.service';
import { LookupRekapComponent } from '../lookup-rekap/lookup-rekap.component';
import 'bootstrap-notify';

declare var $: any;
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'add-cmp',
  templateUrl: 'add.component.html',
  styleUrls: ['add.component.css'],
})

export class AddComponent implements OnInit, AfterViewInit {
  isFormSubmitted = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();

  public dataSelectMill: any[] = [];
  public dataSelectItem: any[] = [];
  public dataSelectCustomer: any[] = [];


  public options: any;
  dataSelectLokasi: any;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private bsModalRef1: BsModalRef,
    private bsModalService: BsModalService,
    private slsInvoice: SlsInvoiceService,
    private slsRekapService: SlsRekapService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private GbmCustomerService: GbmCustomerService,


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

  }


  private loadSelect2(): void {

    this.GbmCustomerService.getAll().subscribe(x => {
      console.log(x);
      this.dataSelectCustomer = [];
      x['data'].forEach(d => {
        this.dataSelectCustomer.push({ "id": d.id, "text": d.kode_customer + " - " + d.nama_customer });
      });
    });
    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {

      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });

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
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    let dataSubmit = this.entryForm.value;

    console.log(dataSubmit);

    this.slsInvoice.create(dataSubmit).subscribe(data => {
      // console.log(data);
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

    this.hitungTotal();

  }
  hitungTotal() {

    var total_berat_terima = parseFloat(this.entryForm.get('total_berat_terima').value) || 0;
    this.entryForm.get('jumlah').patchValue(total_berat_terima);

    var jumlah = parseFloat(this.entryForm.get('jumlah').value) || 0;
    var harga = parseFloat(this.entryForm.get('harga_satuan').value) || 0;

    let sub_total = jumlah * harga;
    this.entryForm.get('sub_total').patchValue(sub_total);

    var disc = parseFloat(this.entryForm.get('disc').value) || 0;
    var uang_muka = parseFloat(this.entryForm.get('uang_muka').value) || 0;

    // Nilai transaksi sebelum PPN
    var nilai_transaksi = sub_total - disc - uang_muka;

    // DPP Nilai Lain = 11/12 x Nilai Transaksi
    var dpp = (11 / 12) * nilai_transaksi;

    // PPN (biasanya 12%)
    var nilai_ppn = (parseFloat(this.entryForm.get('ppn').value) || 0) / 100 * dpp;

    // Grand Total
    var total = nilai_transaksi + nilai_ppn;

    this.entryForm.get('grand_total').patchValue(total);

    // kalau ada field dpp & nilai_ppn
    if (this.entryForm.get('dpp')) {
      this.entryForm.get('dpp').patchValue(dpp);
    }

    if (this.entryForm.get('nilai_ppn')) {
      this.entryForm.get('nilai_ppn').patchValue(nilai_ppn);
    }
  }
}
