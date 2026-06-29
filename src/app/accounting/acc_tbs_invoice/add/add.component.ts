import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { PrcRekapService } from 'src/app/shared/services/prc_rekap.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { AccTbsInvoiceService } from 'src/app/shared/services/acc_tbs_invoice.service';
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
  showRekapWarning: boolean = false;

  dataSelectLokasi;
  dataSelectBlok;
  dataSelectMesin;
  dataSelectSupplier;
  dataSelectRekap;
  dataSelectItem;
  rekapTimbangan: any = [];
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private bsModalRef1: BsModalRef,
    private bsModalService: BsModalService,
    private translate: TranslateService,
    private invItemService: InvItemService,
    private prcRekapService: PrcRekapService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private gbmSupplier: GbmSupplierService,
    private accTbsInvoiceService: AccTbsInvoiceService

  ) {
    let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      lokasi_id: new FormControl([], Validators.required),
      supplier_id: new FormControl([], Validators.required),
      rekap_id: new FormControl([], Validators.required),

      no_invoice: new FormControl('AutoNumber'),
      tanggal: new FormControl(toDate, Validators.required),
      tanggal_tempo: new FormControl(toDate, Validators.required),
      // periode_kt_dari: new FormControl(toDate, Validators.required),
      // periode_kt_sd: new FormControl(toDate, Validators.required),
      // item_id: new FormControl('', Validators.required),
      total_berat_terima: new FormControl(0, Validators.required),
      jumlah: new FormControl(0,),
      sub_total: new FormControl(0, Validators.required),
      total_berat_tagihan: new FormControl(0,),
      harga_satuan: new FormControl(0,),
      total_tagihan: new FormControl(0,),
      ppn: new FormControl(0, Validators.required),
      pph: new FormControl(0, Validators.required),
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
    this.entryForm.controls['rekap_id'].valueChanges.subscribe(x => {
      IdSpk = x.id;
      this.prcRekapService.getAll().subscribe(x => {
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
            this.entryForm.get('total_tagihan').patchValue(x.sub_total);
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

    // this.invItemService.getAll().subscribe(x=>{
    //   // console.log(x);
    //   this.dataSelectItem=[];
    //   x['data'].forEach(d => {
    //     this.dataSelectItem.push({"id":d.id,"text":d.nama});
    //   });
    // });

    this.entryForm.controls['supplier_id'].valueChanges.subscribe(x => {
      let supplier_id = x.id;
      this.prcRekapService.getAllbySupplierId(supplier_id).subscribe(x => {
        this.dataSelectRekap = [];
        x['data'].forEach(d => {
          if (d.supplier_id == supplier_id) {
            this.dataSelectRekap.push({ "id": d.id, "text": d.no_rekap + ' - spk:' + d.no_spk });
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
    frmData['tanggal_tempo'] = formatDate(this.entryForm.get('tanggal_tempo').value, "yyyy-MM-dd", 'en_US');
    frmData['detail'] = this.rekapTimbangan.map(a => {
      let data = { id: a['id'], qty: a['qty'], harga: a['harga'], uom: 'Kg', pekerjaan: 'Pembelian TBS Periode: ' + a.tanggal };
      return data;
    });

    console.log(frmData);

    this.accTbsInvoiceService.create(frmData).subscribe(data => {
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

  // totalBeratTerima() {
  //   let totalBeratTerima = 0;
  //   let totalNilai = 0;
  //   this.rekapTimbangan.forEach(x => {
  //     totalBeratTerima += parseInt(x.berat_terima);
  //     totalNilai += (x.berat_terima * x.harga)
  //   });
  //   this.entryForm.get("total_berat_terima").patchValue(totalBeratTerima);
  //   let ppn_nilai = Math.floor((parseFloat(this.entryForm.get("ppn").value) / 100 * totalNilai));
  //   let pph_nilai = Math.floor((parseFloat(this.entryForm.get("pph").value) / 100 * totalNilai));
  //   let total_tagihan = (totalNilai + ppn_nilai - pph_nilai);
  //   // let harga_satuan = this.entryForm.get("harga_satuan").value;
  //   // let sub_total = parseInt(harga_satuan) * totalBeratTerima;

  //   this.entryForm.get("sub_total").patchValue(totalNilai.toFixed());
  //   this.entryForm.get("total_tagihan").patchValue(total_tagihan.toFixed());
  // }

  totalBeratTerima() {
    let totalBerat = 0;
    let totalNilai = 0;

    for (let i = 0; i < this.rekapTimbangan.length; i++) {
      const r = this.rekapTimbangan[i];
      totalBerat += r.qty;
      totalNilai += (r.qty * r.harga);
    }

    this.entryForm.get("total_berat_terima").patchValue(totalBerat);

    let ppn = Math.floor((this.entryForm.get("ppn").value / 100) * totalNilai);
    let pph = Math.floor((this.entryForm.get("pph").value / 100) * totalNilai);

    this.entryForm.get("sub_total").patchValue(totalNilai);
    this.entryForm.get("total_tagihan").patchValue(totalNilai + ppn - pph);
  }


  // showTimbanganPKS() {
  //   let rekap_ids = this.entryForm.get('rekap_id').value;
  //   // let tgl_mulai=formatDate( this.entryForm.get('periode_kt_dari').value,"yyyy-MM-dd",'en_US');
  //   // let tgl_sd=formatDate( this.entryForm.get('periode_kt_sd').value,"yyyy-MM-dd",'en_US');
  //   // let data={supp_id:supp_id,tgl_mulai:tgl_mulai,tgl_sd:tgl_sd}
  //   // this.prcRekapService.getRekapPerTanggalBelumInvoice(rekap_id).subscribe(t => {
  //   //   this.rekapTimbangan = t ['data']
  //   //   //  console.log (this.rekapTimbangan)
  //   //   this.totalBeratTerima();
  //   // });

  //   this.prcRekapService.getRekapPerTanggalMulti(rekap_ids)
  //     .subscribe(t => {
  //       this.rekapTimbangan = t['data'];
  //       this.totalBeratTerima();
  //       this.showRekapWarning = false; // <-- reset warning
  //     });
  // }

  showTimbanganPKS() {
    let rekap_ids = this.entryForm.get('rekap_id').value;

    this.prcRekapService.getRekapPerTanggalMulti(rekap_ids)
      .subscribe(t => {
        const raw = t['data'];

        // proses per rekap
        this.rekapTimbangan = this.groupByRekap(raw);

        // update summary total
        this.totalBeratTerima();

        this.showRekapWarning = false;
      });
  }


  showNotification(from, align, message, color = 4) {
    const type = ['', 'info', 'success', 'warning', 'danger', 'rose', 'primary'];

    $.notify({
      icon: "notifications",
      message: message
    }, {
      type: type[color],
      timer: 3000,
      placement: {
        from: from,
        align: align
      },
      z_index: 20000,
      newest_on_top: true,
      allow_dismiss: true,
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
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

    this.entryForm.get('rekap_id').valueChanges.subscribe(val => {
      if (this.rekapTimbangan && this.rekapTimbangan.length > 0) {
        this.showRekapWarning = true;
      }
    });



  }
  valueChange($event) {
    // console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }

  groupByRekap(raw) {
    const grouped = {};

    for (let i = 0; i < raw.length; i++) {
      const r = raw[i];
      const key = r.rekap_id;

      if (!grouped[key]) {
        grouped[key] = {
          rekap_id: r.rekap_id,
          no_rekap: r.no_rekap,
          tanggal_mulai: r.tanggal,
          tanggal_akhir: r.tanggal,
          qty: 0,
          totalNilai: 0
        };
      }

      // update tanggal awal–akhir
      if (r.tanggal < grouped[key].tanggal_mulai) grouped[key].tanggal_mulai = r.tanggal;
      if (r.tanggal > grouped[key].tanggal_akhir) grouped[key].tanggal_akhir = r.tanggal;

      // akumulasi qty dan nilai
      grouped[key].qty += parseFloat(r.berat_terima);
      grouped[key].totalNilai += (parseFloat(r.berat_terima) * parseFloat(r.harga));
    }

    // convert ke array + hitung harga rata-rata
    const final = [];
    for (const key in grouped) {
      const g = grouped[key];
      const hargaRata = g.totalNilai / g.qty;
      const hargaRataLabel = Math.floor(g.totalNilai / g.qty);

      final.push({
        rekap_id: g.rekap_id,
        no_rekap: g.no_rekap,
        tanggal: g.tanggal_mulai + " - " + g.tanggal_akhir,
        qty: g.qty,
        harga: hargaRata,
        jumlah: g.qty * hargaRata
      });
    }

    return final;
  }



}
