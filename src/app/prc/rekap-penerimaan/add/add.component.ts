import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { PrcRekapService } from 'src/app/shared/services/prc_rekap.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { PrcKontrakService } from 'src/app/shared/services/prc_kontrak.service';
import { PksTimbanganService } from 'src/app/shared/services/pks_timbangan.service';
import { isNull, isNumber } from 'util';

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
  rekapTimbangan: any = [];
  totalTagihan: number;
  totalBerat: number;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private bsModalRef1: BsModalRef,
    private bsModalService: BsModalService,
    private translate: TranslateService,
    private invItemService: InvItemService,
    private PrcRekapService: PrcRekapService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private PrcKontrakService: PrcKontrakService,
    private gbmSupplier: GbmSupplierService,
    private pksTimbanganService: PksTimbanganService,

  ) {
    let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      lokasi_id: new FormControl([], Validators.required),
      supplier_id: new FormControl([], Validators.required),
      spk_id: new FormControl([], Validators.required),

      no_rekap: new FormControl('(Auto Generate)'),
      tanggal: new FormControl(toDate, Validators.required),
      periode_kt_dari: new FormControl(toDate, Validators.required),
      periode_kt_sd: new FormControl(toDate, Validators.required),
      item_id: new FormControl('', Validators.required),
      total_berat_terima: new FormControl(0, Validators.required),
      jumlah: new FormControl(0,),
      sub_total: new FormControl(0, Validators.required),
      total_berat_tagihan: new FormControl(0,),
      harga_satuan: new FormControl(0,),
      total_tagihan: new FormControl(0,),
      potongan_persen: new FormControl(0),
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
            this.entryForm.get('item_id').patchValue(x.nama_item);
            this.entryForm.get('harga_satuan').patchValue(x.harga_satuan);
            this.entryForm.get('jumlah').patchValue(x.jumlah);
            this.entryForm.get('sub_total').patchValue(x.sub_total);
          }
        });
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

    frmData['detail'] = this.rekapTimbangan.map(a => {
      let data = { id: a['id'], harga: a['harga'], berat_terima: a['berat_terima'], berat_potongan: a['berat_potongan'], berat_potongan_persen: a['berat_potongan_persen'] };
      return data;
    });

    console.log(frmData);

    this.PrcRekapService.create(frmData).subscribe(data => {
      // // console.log(data);
      if (data['status'] == 'OK') {
        // console.log('ok');
        swal({
          title: 'Info!',
          text: 'Data berhasil disimpan dengan Nomor:' + data['data'],
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
    let totalNilai = 0;
    // if (this.rekapTimbangan) {
    console.log(this.rekapTimbangan)
    this.rekapTimbangan.forEach(x => {
      totalBeratTerima += parseInt(x.berat_terima);
      totalNilai += (x.berat_terima * x.harga)
    });
    console.log(totalBeratTerima)
    this.entryForm.get("total_berat_terima").patchValue(totalBeratTerima);
    // let harga_satuan = this.entryForm.get("harga_satuan").value;
    // let sub_total = parseInt(harga_satuan) * totalBeratTerima;
    this.entryForm.get("sub_total").patchValue(totalNilai);
    // } {
    //   this.entryForm.get("total_berat_terima").patchValue(0);
    //   this.entryForm.get("sub_total").patchValue(0);

    // }
  }


  showTimbanganPKS() {
    let supp_id = this.entryForm.get('supplier_id').value.id;
    let tgl_mulai = formatDate(this.entryForm.get('periode_kt_dari').value, "yyyy-MM-dd", 'en_US');
    let tgl_sd = formatDate(this.entryForm.get('periode_kt_sd').value, "yyyy-MM-dd", 'en_US');
    let data = { supp_id: supp_id, tgl_mulai: tgl_mulai, tgl_sd: tgl_sd }
    this.pksTimbanganService.getTimbanganTBSExternalBelumRekap(data).subscribe(t => {
      this.rekapTimbangan = t['data']
      //  console.log (this.rekapTimbangan)
      this.totalBeratTerima();
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
        tara_cust: new FormControl(item['tara_Supplier'], Validators.required),
        bruto_cust: new FormControl(item['bruto_Supplier'], Validators.required),
        netto_cust: new FormControl(item['netto_Supplier'], Validators.required),

        // subTotaal: new FormControl([{value: 0, disabled: true}], [Validators.required])

      }
      ));

  }

  removeBlok(i) {
    let x = this.rekapTimbangan.splice(i, 1);

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
  updatePotongan() {
    let pot_persen = this.entryForm.get('potongan_persen').value;
    console.log(pot_persen)
    if (isNull(pot_persen)) {
      return;
    }
    if (!isNumber(pot_persen)) {
      return;
    }

    this.rekapTimbangan.forEach(el => {
      let pot = el['berat_bersih'] * (pot_persen / 100);
      el['berat_potongan'] = pot.toFixed(0);
      el['berat_potongan_persen'] = (pot_persen / 100);
      el['berat_terima'] = (el['berat_bersih'] - pot).toFixed(0);


    });
    this.totalBeratTerima()
  }

  onHargaInput(p: any, event: any) {
    const hargaBaru = +event.target.value || 0;
    const berat = +p.berat_terima || 0;

    // update harga dan total di array langsung
    p.harga = hargaBaru;
    p.total = berat * hargaBaru;

    // kalau mau hitung total keseluruhan juga
    this.hitungTotalRekap();
  }

  hitungTotalRekap() {
    let totalSemua = 0;
    let totalBerat = 0;

    for (const item of this.rekapTimbangan) {
      totalSemua += +item.total || (+item.harga * +item.berat_terima) || 0;
      totalBerat += +item.berat_terima || 0;
    }

    this.totalTagihan = totalSemua;
    this.totalBerat = totalBerat;

    console.log("nilai total", totalSemua);


    this.entryForm.patchValue({
      sub_total: totalSemua
    }, { emitEvent: false }); // supaya nggak trigger valueChanges loop
  }

}
