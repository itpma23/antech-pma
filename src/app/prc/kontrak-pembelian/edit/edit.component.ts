import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { PrcKontrakService } from 'src/app/shared/services/prc_kontrak.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { PrcKontrak } from 'src/app/shared/models/prc_kontrak.model';
import { formatDate } from '@angular/common';
declare var $: any;
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'edit-cmp',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.css'],
})

export class EditComponent implements OnInit, AfterViewInit {
  mass = 0;
  height = 0;
  get bmi() {
    return this.mass * this.height;
  }

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
  public dataSelectItem: any[] = [];
  public dataSelectSupplier: any[] = [];

  prcKontrak:PrcKontrak;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private prcKontrakService: PrcKontrakService,
    private invItemService: InvItemService,
    private GbmSupplierService: GbmSupplierService,
    private GbmOrganisasiService: GbmOrganisasiService


  ) {

    let toDate: Date = new Date();
    this.entryForm = this.builder.group({

      no_spk: new FormControl('',Validators.required),
      no_ref: new FormControl(''),
      tanggal: new FormControl(toDate, Validators.required),
      lokasi_id: new FormControl([], Validators.required),
      supplier_id: new FormControl([], Validators.required),
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

    console.log(this.prcKontrak);
    let tanggal = new Date(Date.parse(this.prcKontrak['tanggal']));
    let periode_kirim_awal = new Date(Date.parse(this.prcKontrak['periode_kirim_awal']));
    let periode_kirim_akhir = new Date(Date.parse(this.prcKontrak['periode_kirim_akhir']));


    this.entryForm.controls['no_spk'].patchValue(this.prcKontrak.no_spk);
    this.entryForm.controls['no_ref'].patchValue(this.prcKontrak.no_ref);
    this.entryForm.get('tanggal').patchValue(tanggal);
    this.entryForm.controls['alamat_pengiriman'].patchValue(this.prcKontrak.alamat_pengiriman);
    this.entryForm.controls['alamat_penagihan'].patchValue(this.prcKontrak.alamat_penagihan);
    this.entryForm.controls['jumlah'].patchValue(this.prcKontrak.jumlah);
    this.entryForm.controls['harga_satuan'].patchValue(this.prcKontrak.harga_satuan);
    this.entryForm.controls['sub_total'].patchValue(this.prcKontrak.sub_total);
    this.entryForm.controls['ppn'].patchValue(this.prcKontrak.ppn);
    this.entryForm.controls['pph'].patchValue(this.prcKontrak.pph);
    this.entryForm.controls['pic'].patchValue(this.prcKontrak.pic);
    this.entryForm.controls['total'].patchValue(this.prcKontrak.total);
    this.entryForm.get('periode_kirim_awal').patchValue(periode_kirim_awal);
    this.entryForm.get('periode_kirim_akhir').patchValue(periode_kirim_akhir);
    // this.entryForm.controls['ffa'].patchValue(this.prcKontrak.ffa);
    // this.entryForm.controls['mi'].patchValue(this.prcKontrak.mi);
    // this.entryForm.controls['impurities'].patchValue(this.prcKontrak.impurities);
    // this.entryForm.controls['dobi'].patchValue(this.prcKontrak.dobi);
    // this.entryForm.controls['moisture'].patchValue(this.prcKontrak.moisture);
    // this.entryForm.controls['grading'].patchValue(this.prcKontrak.grading);
    // this.entryForm.controls['toleransi'].patchValue(this.prcKontrak.toleransi);
    this.entryForm.controls['keterangan'].patchValue(this.prcKontrak.keterangan);

  }
  private loadSelect2(): void {



    let selectMill;
    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      console.log(x);
      this.dataSelectMill = [];
      x.forEach(d => {
        this.dataSelectMill.push({ "id": d.id, "text": d.nama });
      });

      this.dataSelectMill.forEach(a => {
        if (a.id == this.prcKontrak.lokasi_id) {
          selectMill = a;
        }

      });
      this.entryForm.controls['lokasi_id'].patchValue(selectMill);

    });

    let selectSupplier;
    this.GbmSupplierService.getAll().subscribe(x => {

      this.dataSelectSupplier = [];
      x['data'].forEach(d => {
        this.dataSelectSupplier.push({ "id": d.id, "text": d.nama_supplier });
      });

      this.dataSelectSupplier.forEach(a => {
        if (a.id == this.prcKontrak.supplier_id) {
          selectSupplier = a;
        }
        this.entryForm.controls['supplier_id'].patchValue(selectSupplier);
      });

    });

    let selectItem;
    this.invItemService.getAllProduk().subscribe(x => {
      console.log(x);
      this.dataSelectItem = [];
      x['data'].forEach(d => {
        this.dataSelectItem.push({ "id": d.id, "text": d.nama });
      });


      this.dataSelectItem.forEach(a => {
        if (a.id == this.prcKontrak.produk_id) {
          selectItem = a;
        }

      });
      this.entryForm.controls['produk_id'].patchValue(selectItem);

    });




  }

  onSubmit() {
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    // let frmData=new FormData();
    // if (this.entryForm.invalid) {
    //   return;
    // }



    let dataSubmit: PrcKontrak = {
      'no_spk': this.entryForm.get('no_spk').value,
      'no_ref': this.entryForm.get('no_ref').value,
      'tanggal': formatDate(this.entryForm.get('tanggal').value, "yyy-MM-dd", "en_US"),
      'lokasi_id': this.entryForm.get('lokasi_id').value.id,
      'supplier_id': this.entryForm.get('supplier_id').value.id,
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
      // 'ffa':this.entryForm.get('ffa').value,
      // 'mi':this.entryForm.get('mi').value,
      // 'impurities':this.entryForm.get('impurities').value,
      // 'dobi':this.entryForm.get('dobi').value,
      // 'moisture':this.entryForm.get('moisture').value,
      // 'grading':this.entryForm.get('grading').value,
      // 'toleransi':this.entryForm.get('toleransi').value,
      'keterangan':this.entryForm.get('keterangan').value


    };
    console.log(dataSubmit);
    this.prcKontrakService.update(this.prcKontrak.id, dataSubmit).subscribe(data => {

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

  jumlah1(e){
    var n1 = parseFloat(this.entryForm.get('jumlah').value);
    var n2 = parseFloat (this.entryForm.get('harga_satuan').value);
    this.entryForm.get('sub_total').patchValue( n1 * n2 );
    var sub = parseFloat(this.entryForm.get('sub_total').value);

    var n3 = parseFloat(this.entryForm.get('ppn').value);
    var n4 = parseFloat(this.entryForm.get('pph').value);
    this.entryForm.get('total').patchValue( ((n3/100) * sub) + ((n4/100) * sub) + sub);
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
    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
}
