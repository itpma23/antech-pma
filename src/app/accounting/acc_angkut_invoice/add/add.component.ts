import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { PrcRekapAngkutService } from 'src/app/shared/services/prc_rekap_angkut.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { AccAngkutInvoiceService } from 'src/app/shared/services/acc_angkut_invoice.service';
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
  dataSelectRekap;
  dataSelectItem;
  rekapTimbangan: any = [];
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private bsModalRef1: BsModalRef,
    private bsModalService: BsModalService,
    private translate: TranslateService,
    private invItemService: InvItemService,
    private prcRekapService: PrcRekapAngkutService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private gbmSupplier: GbmSupplierService,
    private accAngkutInvoiceService: AccAngkutInvoiceService

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
      sumber_timbangan: new FormControl(''),
      total_berat_terima: new FormControl(0, Validators.required),
      jumlah: new FormControl(0,),
      sub_total: new FormControl(0, Validators.required),
      total_berat_tagihan: new FormControl(0,),
      harga_satuan: new FormControl(0,),
      harga_susut_per_kg: new FormControl(0,),
      toleransi: new FormControl(0,),
      total_tagihan: new FormControl(0,),
      potongan: new FormControl(0,),
      ppn: new FormControl(0, Validators.required),
      pph: new FormControl(0, Validators.required),
      keterangan: new FormControl('Angkut CPO/Kernel', Validators.required),
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
      this.prcRekapService.getById(IdSpk).subscribe(x => {
        console.log(x);
        let d = x['data']

        // this.entryForm.get('item_id').patchValue(d.nama_item);
        this.entryForm.get('harga_satuan').patchValue(d.harga_satuan);
        this.entryForm.get('jumlah').patchValue(d.jumlah);
        this.entryForm.get('sub_total').patchValue(d.sub_total);
        this.entryForm.get('total_tagihan').patchValue(d.sub_total);
        this.entryForm.get('sumber_timbangan').patchValue(d.sumber_timbangan);

      });
    });

  }
  private loadSelect2(): void {

    this.GbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
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
    let sumber_timbangan=this.entryForm.get("sumber_timbangan").value
    frmData['detail'] = this.rekapTimbangan.map(a => {
     let tgl;
     let berat=0;
      if (sumber_timbangan=='ext'){
        tgl=a.tanggal_terima;
        berat=a['berat_terima'];
      }else{
        tgl=a.tanggal_timbang;
        berat=a['netto_kirim'];
      }
      let data = {
         sjpp_id: a['sjpp_id'],
         qty:berat,
         harga: a['harga'], uom: 'Kg',
         pekerjaan: 'Angkut CPO/Kernel Periode: ' + tgl
         };
      return data;
    });

    console.log(frmData);

    this.accAngkutInvoiceService.create(frmData).subscribe(data => {
      // // console.log(data);
      if (data['status'] == 'OK') {
        // console.log('ok');
        swal({
          title: 'Info!',
          text: 'Simpan berhasil disimpan dengan Nomor:' + data['data'],
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
    let sumber_timbangan=this.entryForm.get("sumber_timbangan").value
    let totalBeratTerima = 0;
    let totalNilai = 0;
    let sub_total = 0;
    console.log(this.rekapTimbangan)
    let harga_susut=  parseFloat(this.entryForm.get("harga_susut_per_kg").value)
    let toleransi=  parseFloat(this.entryForm.get("toleransi").value)
   let total_susut=0;
   if (sumber_timbangan=='ext'){
    this.rekapTimbangan.forEach(x => {
      let susut=(x.netto_customer-x.netto_kirim)
      if (susut<0){
          let persen_susut = ((susut * -1) / x.netto_kirim) * 100
          // console.log(parseFloat(persen_susut.toFixed(2)));
          // console.log(parseFloat(toleransi.toFixed(2)));
          if (parseFloat(persen_susut.toFixed(2)) > parseFloat(toleransi.toFixed(2))) {
            let pot_susut = ((persen_susut - toleransi) / 100) * x.netto_kirim
            total_susut = total_susut + pot_susut
          }

      }
      totalBeratTerima += parseInt(x.berat_terima);
      sub_total += (x.berat_terima * x.harga)
    });
  }else{
    this.rekapTimbangan.forEach(x => {
      let susut=0
      totalBeratTerima += parseInt(x.netto_kirim);
      sub_total += (x.netto_kirim * x.harga)
    });
    total_susut=0;
  }
    let potongan=total_susut*harga_susut;
    //let potongan=  parseFloat(this.entryForm.get("potongan").value)
    this.entryForm.get("potongan").patchValue(potongan);
    this.entryForm.get("total_berat_terima").patchValue(totalBeratTerima);
    totalNilai =sub_total-potongan
    let ppn_nilai = parseFloat(this.entryForm.get("ppn").value) / 100 * totalNilai;
    let pph_nilai = parseFloat(this.entryForm.get("pph").value) / 100 * totalNilai;
    let total_tagihan = totalNilai + ppn_nilai - pph_nilai;
    // let harga_satuan = this.entryForm.get("harga_satuan").value;
    // let sub_total = parseInt(harga_satuan) * totalBeratTerima;

    this.entryForm.get("sub_total").patchValue(sub_total);
    this.entryForm.get("total_tagihan").patchValue(total_tagihan);
  }


  showTimbanganPKS() {
    let rekap_id = this.entryForm.get('rekap_id').value.id;
    // let tgl_mulai=formatDate( this.entryForm.get('periode_kt_dari').value,"yyyy-MM-dd",'en_US');
    // let tgl_sd=formatDate( this.entryForm.get('periode_kt_sd').value,"yyyy-MM-dd",'en_US');
    // let data={supp_id:supp_id,tgl_mulai:tgl_mulai,tgl_sd:tgl_sd}
    this.prcRekapService.getRekapPerTanggalBelumInvoice(rekap_id).subscribe(t => {
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
    if (!this.entryForm.dirty) {
      // form belum diapa-apakan → langsung close
      this.bsModalRef.hide();
      return;
    }

    // form sudah ada isi / perubahan → munculkan swal
    let that = this;
    swal({
      title: 'Yakin akan Menutup?',
      text: "Data yang sudah diinput akan hilang!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      buttonsStyling: false
    }).then(function () {
      that.bsModalRef.hide();
    });
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
