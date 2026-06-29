import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { PrcRekapAngkutService } from 'src/app/shared/services/prc_rekap_angkut.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { PrcKontrakAngkutService } from 'src/app/shared/services/prc_kontrak_angkut.service';
import { PksSjppService } from 'src/app/shared/services/pks_sjpp.service';
import { LookupTimbanganCustomerComponent } from '../lookup-timbangan-customer/lookup-timbangan-customer.component';
import { SlsKontrakService } from 'src/app/shared/services/sls_kontrak.service';


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
  dataSelectSupplier;
  dataSelectSpk;
  dataSelectItem;
  rekapSj: any = [];
  dataSelectKontrak: any[];
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private bsModalRef1: BsModalRef,
    private bsModalService: BsModalService,
    private translate: TranslateService,
    private invItemService: InvItemService,
    private PrcRekapAngkutService: PrcRekapAngkutService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private PrcKontrakService: PrcKontrakAngkutService,
    private slsKontrakService: SlsKontrakService,
    private gbmSupplier: GbmSupplierService,
    private pksSjppService: PksSjppService,

  ) {
    let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      lokasi_id: new FormControl([], Validators.required),
      supplier_id: new FormControl([], Validators.required),
      spk_id: new FormControl([], Validators.required),
      sls_kontrak_id: new FormControl([], Validators.required),
      item_id: new FormControl('', Validators.required),
      sumber_timbangan: new FormControl('ext', Validators.required),
      no_rekap: new FormControl({ value: 'Auto', disabled: 'disabled' }),
      tanggal: new FormControl(toDate, Validators.required),
      periode_kt_dari: new FormControl(toDate, Validators.required),
      periode_kt_sd: new FormControl(toDate, Validators.required),
      total_berat_terima: new FormControl(0, Validators.required),
      adj_berat_terima: new FormControl(0, Validators.required),
      jumlah: new FormControl(0, Validators.required),
      sub_total: new FormControl(0, Validators.required),
      total_berat_tagihan: new FormControl(0, Validators.required),
      harga_satuan: new FormControl(0, Validators.required),
      total_tagihan: new FormControl(0, Validators.required),
      harga_susut_per_kg: new FormControl(0, Validators.required),
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
      this.PrcKontrakService.getAll().subscribe(x => {
        // console.log(x);
        x['data'].forEach(x => {
          if (IdSpk == x.id) {
            // this.invItemService.getById(x.item).subscribe(x=> {
            //   this.entryForm.get('item_id').patchValue(x['data'].nama);
            // });
            this.entryForm.get('item_id').patchValue(x.produk_id);
            this.entryForm.get('harga_satuan').patchValue(x.harga_satuan);
            this.entryForm.get('jumlah').patchValue(x.jumlah);
            this.entryForm.get('sub_total').patchValue(x.sub_total);
          }
        });
      });
    });

  }
  private loadSelect2(): void {
    this.slsKontrakService.getAllBelumBAAngkut().subscribe(x => {
      this.dataSelectKontrak = [];
      x['data'].forEach(d => {
        this.dataSelectKontrak.push({ "id": d.id, "text": d.no_spk });

      });

    });

    this.GbmOrganisasiService.getAllByType('MILL').subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
    });

    this.gbmSupplier.getAll().subscribe(x => {
      // console.log(x);
      this.dataSelectSupplier = [];
      x['data'].forEach(d => {
        this.dataSelectSupplier.push({ "id": d.id, "text": d.kode_supplier + " - " + d.nama_supplier });
      });
    });

    this.invItemService.getAll().subscribe(x => {
      // console.log(x);
      this.dataSelectItem = [];
      x['data'].forEach(d => {
        this.dataSelectItem.push({ "id": d.id, "text": d.nama });
      });
    });

    this.entryForm.controls['supplier_id'].valueChanges.subscribe(x => {
      let supplier_id = x.id;
      this.PrcKontrakService.getAll().subscribe(x => {
        this.dataSelectSpk = [];
        x['data'].forEach(d => {
          if (d.supplier_id == supplier_id) {
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
    frmData['suratjalan'] = this.rekapSj.map(a => {
      let data: any = { id: a['id'], harga: a['harga'] }
      return data;
    });

    console.log(frmData);

    this.PrcRekapAngkutService.create(frmData).subscribe(data => {
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
    let sumber_timbangan = this.entryForm.get('sumber_timbangan').value
    let totalBeratTerima = 0;
    // console.log( this.rekapSj);
    this.rekapSj.forEach(x => {
      if (sumber_timbangan == 'int') {
        totalBeratTerima += parseInt(x.netto_kirim);
      } else {
        totalBeratTerima += parseInt(x.netto_customer);
      }


    });
    this.entryForm.get("total_berat_terima").patchValue(totalBeratTerima);
    this.entryForm.get("total_berat_tagihan").patchValue(totalBeratTerima);
    let harga_satuan = this.entryForm.get("harga_satuan").value;
    let sub_total = parseInt(harga_satuan) * totalBeratTerima;

    this.entryForm.get("sub_total").patchValue(sub_total);
    this.entryForm.get("total_tagihan").patchValue(sub_total);
  }


  showSuratJalanTervalidasi() {
    let spk_id = this.entryForm.get('spk_id').value.id
    let periode_kt_dari = formatDate(this.entryForm.get('periode_kt_dari').value, "yyyy-MM-dd", 'en_US');
    let periode_kt_sd = formatDate(this.entryForm.get('periode_kt_sd').value, "yyyy-MM-dd", 'en_US');
    let sumber_timbangan = this.entryForm.get('sumber_timbangan').value
    let sls_kontrak_id = this.entryForm.get('sls_kontrak_id').value.id
   let d={spk_id:spk_id,periode_kt_dari:periode_kt_dari,periode_kt_sd:periode_kt_sd,sumber_timbangan:sumber_timbangan,sls_kontrak_id:sls_kontrak_id}
    console.log(d);
    if (sumber_timbangan == 'int') {
      this.pksSjppService.getRekapAngkutInternal(spk_id, periode_kt_dari, periode_kt_sd,sls_kontrak_id).subscribe(t => {
        this.rekapSj = t['data']
        console.log(t);
        this.totalBeratTerima();
      });
    } else {
      this.pksSjppService.getRekapAngkut(spk_id, periode_kt_dari, periode_kt_sd,sls_kontrak_id).subscribe(t => {
        this.rekapSj = t['data']
        console.log(t);
        this.totalBeratTerima();
      });
    }
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
        tara_cust: new FormControl(item['tara_supplier'], Validators.required),
        bruto_cust: new FormControl(item['bruto_supplier'], Validators.required),
        netto_cust: new FormControl(item['netto_supplier'], Validators.required),

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


  }
  valueChange($event) {
    // console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
}
