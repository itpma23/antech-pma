import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { SlsRekapService } from 'src/app/shared/services/sls_rekap.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmCustomerService } from 'src/app/shared/services/gbm_customer.service';
import { SlsKontrakService } from 'src/app/shared/services/sls_kontrak.service';
import { PksSjppService } from 'src/app/shared/services/pks_sjpp.service';
import { LookupTimbanganCustomerComponent } from '../lookup-timbangan-customer/lookup-timbangan-customer.component';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import Swal from 'sweetalert2';


declare var $: any;
declare var swal: any;

@Component({
  moduleId: module.id,
  selector: 'add-cmp',
  templateUrl: 'add.component.html',
  styleUrls: ['add.component.css'],
})

export class AddComponent implements OnInit, AfterViewInit {
  editor_modules: any;
  isFormSubmitted = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }

  entryForm: FormGroup;

  event: EventEmitter<any> = new EventEmitter();


  dataSelectLokasi;
  dataSelectBlok;
  dataSelectMesin;
  dataSelectCustomer;
  dataSelectSpk;
  dataSelectItem;
  rekapSj: any = [];
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private bsModalRef1: BsModalRef,
    private bsModalService: BsModalService,
    private translate: TranslateService,
    private invItemService: InvItemService,
    private SlsRekapService: SlsRekapService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private slsKontrakService: SlsKontrakService,
    private gbmCustomer: GbmCustomerService,
    private pksSjppService: PksSjppService,


  ) {
    let toDate: Date = new Date();
    this.PATH_URL = SERVER_PATH_URL;

    this.entryForm = this.builder.group({

      lokasi_id: new FormControl([], Validators.required),
      customer_id: new FormControl([], Validators.required),
      spk_id: new FormControl([], Validators.required),

      no_rekap: new FormControl({ value: 'Auto', disabled: 'disabled' }),
      tanggal: new FormControl(toDate, Validators.required),
      periode_kt_dari: new FormControl(toDate, Validators.required),
      periode_kt_sd: new FormControl(toDate, Validators.required),
      item_id: new FormControl('', Validators.required),
      total_berat_terima: new FormControl(0, Validators.required),
      jumlah: new FormControl(0, Validators.required),
      sub_total: new FormControl(0, Validators.required),
      total_berat_tagihan: new FormControl(0, Validators.required),
      harga_satuan: new FormControl(0, Validators.required),
      total_tagihan: new FormControl(0, Validators.required),

      // divisi_id: new FormControl([], Validators.required),
      // keterangan: new FormControl('', ),

      //tipe: new FormControl('0', Validators.required),
      // no_spat: new FormControl('', Validators.required),

      details: this.builder.array([]),



    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    this.formChange();

  }
  public options: any;

  private formChange(): void {

    let IdSpk;
    this.entryForm.controls['spk_id'].valueChanges.subscribe(x => {
      IdSpk = x.id;
      this.slsKontrakService.getById(IdSpk).subscribe(x => {
        console.log(x);
        let d = x['data']

        this.entryForm.get('item_id').patchValue(d.nama_item);
        this.entryForm.get('harga_satuan').patchValue(d.harga_satuan);
        this.entryForm.get('jumlah').patchValue(d.jumlah);
        this.entryForm.get('sub_total').patchValue(d.sub_total);


      });
    });

  }
  private loadSelect2(): void {

    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
    });

    this.gbmCustomer.getAll().subscribe(x => {
      // console.log(x);
      this.dataSelectCustomer = [];
      x['data'].forEach(d => {
        this.dataSelectCustomer.push({ "id": d.id, "text": d.kode_customer + " - " + d.nama_customer });
      });
    });

    this.invItemService.getAll().subscribe(x => {
      // console.log(x);
      this.dataSelectItem = [];
      x['data'].forEach(d => {
        this.dataSelectItem.push({ "id": d.id, "text": d.nama });
      });
    });

    this.entryForm.controls['customer_id'].valueChanges.subscribe(x => {
      let customer_id = x.id;
      this.slsKontrakService.getAllbyCustomer(customer_id).subscribe(x => {
        this.dataSelectSpk = [];
        x['data'].forEach(d => {
          if (d.customer_id == customer_id) {
            this.dataSelectSpk.push({ "id": d.id, "text": d.no_spk });
          }
        });
      });
    });



  }
  onSubmit() {
    // console.log('submit');
    this.isFormSubmitted = true;

    if (this.entryForm.invalid) {
      return;
    }
    let frmData = this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    frmData['periode_kt_dari'] = formatDate(this.entryForm.get('periode_kt_dari').value, "yyyy-MM-dd", 'en_US');
    frmData['periode_kt_sd'] = formatDate(this.entryForm.get('periode_kt_sd').value, "yyyy-MM-dd", 'en_US');
    frmData['suratjalan'] = this.rekapSj.map(a => a['id']);

    console.log(frmData);

    this.SlsRekapService.create(frmData).subscribe(data => {
      // // console.log(data);
      if (data['status'] == 'OK') {
        // console.log('ok');
        swal({
          title: 'Info!',
          text: 'Simpan berhasil dengan No:' + data['data'],
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

  totalBeratTerima() {
    let totalBeratTerima = 0;

    this.rekapSj.forEach(x => {
      const netto = (x.netto_customer != null && x.netto_customer !== undefined)
        ? x.netto_customer
        : 0;

      totalBeratTerima += parseInt(netto);
    });

    this.entryForm.get("total_berat_terima").patchValue(totalBeratTerima);

    const harga_satuan = this.entryForm.get("harga_satuan").value;
    const sub_total = parseInt(harga_satuan ? harga_satuan : 0) * totalBeratTerima;

    this.entryForm.get("sub_total").patchValue(sub_total);
  }





  tampilkanHasilTimbangPKS() {
    let spk_id = this.entryForm.get('spk_id').value.id
    let periode_kt_dari = formatDate(this.entryForm.get('periode_kt_dari').value, "yyyy-MM-dd", 'en_US');
    let periode_kt_sd = formatDate(this.entryForm.get('periode_kt_sd').value, "yyyy-MM-dd", 'en_US');

    // this.pksSjppService.getAllbyIdSpk( this.entryForm.get('').value)
    this.pksSjppService.getRekapKirim(spk_id, periode_kt_dari, periode_kt_sd).subscribe(t => {
      this.rekapSj = t['data']
      //  console.log (this.rekapSj)
      this.totalBeratTerima();
    });
  }
  showTimbanganform() {
    this.totalBeratTerima();
    this.pksSjppService.getAll().subscribe(t => {

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        class: "modal-lg ",
        initialState: {
          PksVsjt: t['data']
        }
      };
      this.bsModalRef1 = this.bsModalService.show(LookupTimbanganCustomerComponent, modalConfig);
      this.bsModalRef1.content.event.subscribe(item => {
        // this.addBlok();
        if (item == null) {
        } else {
          this.showNotification('top', 'right', "No Timbangan " + item['no_surat'] + " ", 2);



          this.addBlok(item);


        }
      });
    });
  }

  showNotification(from, align, message, color = 4) {
    var type = ['', 'info', 'success', 'warning', 'danger', 'rose', 'primary'];
    // console.log(type[color]);
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

  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };
  addBlok(item = '') {
    // this.details.push(this.builder.group(new InvoiceBlok()));
    let toDate: Date = new Date();
    let selectedMesin;
    this.dataSelectLokasi.forEach(a => {
      if (item['mill_id'] == a.id) {
        selectedMesin = a;
      }
    });
    this.details.push(
      this.builder.group({
        dt_lokasi_id: new FormControl(selectedMesin, Validators.required),
        no_kartu_timbang: new FormControl(item['no_surat'], Validators.required),
        dt_tanggal: new FormControl(toDate, Validators.required),
        tara_cust: new FormControl(item['tara_customer'], Validators.required),
        bruto_cust: new FormControl(item['bruto_customer'], Validators.required),
        netto_cust: new FormControl(item['netto_customer'], Validators.required),

        // subTotaal: new FormControl([{value: 0, disabled: true}], [Validators.required])

      }
      ));

  }

  removeBlok(i) {
    let x = this.rekapSj.splice(i, 1);

    this.totalBeratTerima();
    // let i = this.details.controls.indexOf(Blok);

    // if(i != -1) {
    // //  let x=	this.details.controls.splice(i, 1);
    //   let bloks = this.entryForm.get('details') as FormArray;
    //   bloks.removeAt(i);
    // 	let data = {details: bloks.value};
    // 	this.updateForm(data);
    // }
  }
  updateForm(data) {
    const bloks = data.details;
    let sub = 0;
    for (let i of bloks) {
      sub = sub + parseFloat(i.jumlah_janjang);

    }
    // console.log(sub);
    //this.entryForm.get('total').patchValue( sub);

  }
  recalculate() {
    let bloks = this.entryForm.get('details') as FormArray;
    let data = { details: bloks.value };
    this.updateForm(data);


  }
  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();
    this.editor_modules = {
      toolbar: {
        container: [
          [{ 'font': [] }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'header': 1 }, { 'header': 2 }],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'align': [] }],
          ['link', 'image']
        ]
      },

      imageResize: true
    };


  }
  valueChange($event) {
    // console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
showSuratJalanTervalidasi() {
  const link = window.location.origin + "/#/pks/vsjt";

  const that = this;

  swal({
    title: 'Perhatian!',
    html: `
      Pastikan sudah melakukan <b>Validasi Timbang Customer</b>.<br><br>
      <a href="${link}" target="_blank">
        ➜ Klik untuk buka halaman Validasi Timbang Customer
      </a>
    `,
    type: 'warning',
    showCancelButton: true,
    confirmButtonClass: 'btn btn-primary',
    cancelButtonClass: 'btn btn-secondary',
    confirmButtonText: 'Lanjutkan',
    cancelButtonText: 'Batal',
    buttonsStyling: false
  }).then(function(result) {
    if (result === true) {
      that.tampilkanHasilTimbangPKS();
    }
  });
}




}
