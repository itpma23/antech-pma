import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';


import { isNullOrUndefined, isNumber, isString } from 'util';
import { formatDate, formatNumber } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { AccKegiatanService } from 'src/app/shared/services/acc_kegiatan.service';
// import { TrkKendaraanService } from 'src/app/shared/services/trk_kendaraan.service';
import { EstSpkService } from 'src/app/shared/services/est_spk.service';
import { EstSpkBAService } from 'src/app/shared/services/est_spk_ba.service';

import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { EstSpk, EstSpkDetail, EstSpkLog } from 'src/app/shared/models/est_spk.model';
import { EstSpkBA } from 'src/app/shared/models/est_spk_ba.model';

declare var $: any;
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'edit-cmp',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.css'],
})

export class EditComponent implements OnInit, AfterViewInit {
  editor_modules: any;
  isFormSubmitted = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  awalanHeading = "heading_";
  awalanCollapse = "collapse_";

  entryForm: FormGroup;

  event: EventEmitter<any> = new EventEmitter();

  EstSpkBA: EstSpkBA;

  dataSelectSupplier;
  dataSelectRayon;
  dataSelectBlok;
  dataSelectKegiatan;
  dataSelectLokasi: any[];
  dataKegiatan: any;
  dataSelectSPK: any[];
  dataSelectAkunPph: any[];

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    // private trkKendaraanService: TrkKendaraanService,
    private GbmSupplierService: GbmSupplierService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private EstSpkBAService: EstSpkBAService,
    private accKegiatanService: AccKegiatanService,
    private EstSpkService: EstSpkService,
    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();
    let time: Date = new Date();

    this.entryForm = this.builder.group({
      lokasi_id: new FormControl([], Validators.required),
     spk_id: new FormControl([], Validators.required),
      supplier_id: new FormControl([], Validators.required),

      no_transaksi: new FormControl(''),
      total: new FormControl(0),

      tanggal: new FormControl(toDate, Validators.required),
      tanggal_tempo: new FormControl(toDate, Validators.required),
      pph_persen: new FormControl(0),
      pph_nilai: new FormControl(0),
      subtotal: new FormControl(0),
      // tgl_mulai: new FormControl(toDate, Validators.required),
      // tgl_akhir: new FormControl(toDate, Validators.required),
      acc_akun_id_pph:new FormControl([], Validators.required),
      details: this.builder.array([]),
      // details_kegiatan: this.builder.array([]),
    });
  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    let date: Date = new Date();
    let strDate = formatDate(date, "yyyy-MM-dd", "en_US");

    this.entryForm.get('no_transaksi').patchValue(this.EstSpkBA.no_transaksi);
    this.entryForm.get('pph_persen').patchValue(this.EstSpkBA.pph_persen);
    this.entryForm.get('subtotal').patchValue(this.EstSpkBA.subtotal);
    this.entryForm.get('total').patchValue(this.EstSpkBA.total);
    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.EstSpkBA.tanggal)));
    this.entryForm.get('tanggal_tempo')!.patchValue(new Date(Date.parse(this.EstSpkBA.tanggal_tempo)));
    // this.entryForm.get('tgl_mulai').patchValue(new Date(Date.parse(this.EstSpkBA.tgl_mulai)));
    // this.entryForm.get('tgl_akhir').patchValue(new Date(Date.parse(this.EstSpkBA.tgl_akhir)));
    this.totalGrand();
  }
  public options: any;

  private loadSelect2(): void {
   let  selectedSpk;
    this.EstSpkService.getAllPosted().subscribe(x => {
      this.dataSelectSPK = [];
      console.log(x)
      x['data'].forEach(d => {
        this.dataSelectSPK.push({ "id": d.id, "text": d.no_spk + "(" + d.tanggal + ")" });
        if (this.EstSpkBA.spk_id == d.id) {
          selectedSpk = { "id": d.id, "text": d.no_spk + "(" + d.tanggal + ")" };
        }
      });
      this.entryForm.get('spk_id').patchValue(selectedSpk);
    });

      let selectedLokasi;
      this.gbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
        this.dataSelectLokasi = [];
        x.forEach(d => {
          this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
          if (this.EstSpkBA.lokasi_id == d.id) {
            selectedLokasi = { "id": d.id, "text": d.nama };
          }
        });
        this.entryForm.get('lokasi_id').patchValue(selectedLokasi);


        this.gbmOrganisasiService.getMesinBlokByMillEstate(this.EstSpkBA.lokasi_id).subscribe(x => {
          this.dataSelectBlok = [];
          x.forEach(d => {
            this.dataSelectBlok.push({ "id": d.id, "text": d.nama +'('+ d.kode+')' + ' - ' + d.nama_parent});
          });


          this.accKegiatanService.getAllbyTipe('PEMELIHARAAN').subscribe(x => {
            this.dataKegiatan = x['data'];
            this.dataSelectKegiatan = [];
            x['data'].forEach(d => {
              this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama + ' - '+d.kode });
            });

            let dtl: any[];
            dtl = this.EstSpkBA.detail;
            console.log(dtl);
            for (let index = 0; index < dtl.length; index++) {
              const d = dtl[index];
              this.addDetail(d.blok_id, d.kegiatan_id, d.hk, d.volume, d.total, d.harga,d.satuan_volume,d.keterangan);
            }
          });

        });

      });
      let selectedAkunpph;
      this.EstSpkBAService.getAllAkunPph().subscribe(x => {
        console.log(x);
        this.dataSelectAkunPph = [];
        let i = x['data'];
        console.log(i);
        i.forEach(d => {
          this.dataSelectAkunPph.push({ "id": d.acc_akun_id, "text": d.kode_akun + ' - ' + d.nama_akun });
          if (this.EstSpkBA.pph_akun_id == d.acc_akun_id) {
            selectedAkunpph = { "id": d.acc_akun_id, "text": d.kode_akun + ' - ' + d.nama_akun }
          }
        });
  
        this.entryForm.get('acc_akun_id_pph')!.patchValue(selectedAkunpph);
      });
  

    let selectedSupplier;
    this.GbmSupplierService.getAll().subscribe(x => {
      this.dataSelectSupplier = [];
      x['data'].forEach(d => {
        this.dataSelectSupplier.push({ "id": d.id, "text": d.nama_supplier });
        if (this.EstSpkBA.supplier_id == d.id) {
          selectedSupplier = { "id": d.id, "text": d.nama_supplier };
        }
      });
      this.entryForm.get('supplier_id').patchValue(selectedSupplier);
    });
  }
  onSubmit() {
    // // console.log(this.entryForm.value);

    this.isFormSubmitted = true;

    if (this.entryForm.invalid) {
      swal({
        title: 'Perhatian!',
        text: 'Data belum lengkap!',
        type: 'warning',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      })
      return;
    }

    this.entryForm.get('details').value.forEach(x => {
      if (!isNumber(x.harga)) {
        x.harga = parseFloat(x.harga.replace(/[^\d\.\-]/g, ""));

      }
      if (!isNumber(x.total)) {
        x.total = parseFloat(x.total.replace(/[^\d\.\-]/g, ""));

      }
      if (!isNumber(x.volume)) {
        x.volume = parseFloat(x.volume.replace(/[^\d\.\-]/g, ""));

      }
      if (!isNumber(x.hk)) {
        x.hk = parseFloat(x.hk.replace(/[^\d\.\-]/g, ""));

      }

    });
    let total = this.entryForm.get('total').value;
    if (!isNumber(total)) {
      total = parseFloat(total.replace(/[^\d\.\-]/g, ""));

    }
    let frmData = this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    frmData['tanggal_tempo']=formatDate( this.entryForm.get('tanggal_tempo')!.value,"yyyy-MM-dd",'en_US');

    // frmData['tgl_mulai'] = formatDate(this.entryForm.get('tgl_mulai').value, "yyyy-MM-dd", 'en_US');
    // frmData['tgl_akhir'] = formatDate(this.entryForm.get('tgl_akhir').value, "yyyy-MM-dd", 'en_US');
    frmData['subtotal'] = parseFloat(this.entryForm.get('subtotal').value.replace(/[^\d\.\-]/g, ""));
    frmData['total'] = parseFloat(this.entryForm.get('total').value.replace(/[^\d\.\-]/g, ""));
    //  frmData['total'] = total;
    console.log(frmData);
    this.EstSpkBAService.update(this.EstSpkBA.id, frmData).subscribe(data => {
      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          // text: 'Data berhasil diSimpan dengan Nomor:'+data['data'],
          text: 'Data berhasil di simpan',
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

  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };

  get details_kegiatan(): FormArray {
    return this.entryForm.get('details_kegiatan') as FormArray;
  };

  getSatuan(form)
  {
    let uom;
    let kegiatan_id = form.get('kegiatan_id').value.id;

    this.dataKegiatan.forEach( x=>{
      if (x.id == kegiatan_id) {
        uom = x.uom;
      }
    });

    form.get('satuan').patchValue(uom);
  }
  addDetail(blok_id, kegiatan_id, hk, volume, total, harga,satuan,keterangan) {

    let selectedBlok = [];
    this.dataSelectBlok.forEach(a => {
      if (blok_id == a.id) {
        selectedBlok = a;
      }
    });

    let selectedKegiatan = [];
    // console.log(this.dataSelectKegiatan);
    this.dataSelectKegiatan.forEach(a => {
      if (kegiatan_id == a.id) {
        selectedKegiatan = a;
      }
    });

    let fb = this.builder.group({
      blok_id: new FormControl(selectedBlok, Validators.required),
      kegiatan_id: new FormControl(selectedKegiatan, Validators.required),
      satuan: new FormControl(satuan),
      hk: new FormControl(hk, Validators.required),
      volume: new FormControl(volume, Validators.required),
      total: new FormControl(total, Validators.required),
      harga: new FormControl(harga, Validators.required),
      keterangan: new FormControl(keterangan),

    });

    this.details.push(fb);
    // this.getSatuan(fb);
   this.numberFormatDetail(fb)
  }

  // addKegiatan(blok_id, Kegiatan_id, km_hm_mulai, km_hm_akhir, km_hm_jumlah, volume) {
  //   let selectedKegiatan = [];
  //   this.dataSelectKegiatan.forEach(a => {
  //     if (Kegiatan_id == a.id) {
  //       selectedKegiatan = a;
  //     }
  //   });
  //   let selectedBlok = [];
  //   this.dataSelectBlok.forEach(a => {
  //     if (blok_id == a.id) {
  //       selectedBlok = a;
  //     }
  //   });
  //   let fb = this.builder.group({
  //     blok_id: new FormControl(selectedBlok, Validators.required),
  //     kegiatan_id: new FormControl(selectedKegiatan, Validators.required),
  //     km_hm_mulai: new FormControl(km_hm_mulai, Validators.required),
  //     km_hm_akhir: new FormControl(km_hm_akhir, Validators.required),
  //     km_hm_jumlah: new FormControl(km_hm_jumlah, Validators.required),
  //     volume: new FormControl(volume, Validators.required),
  //   });
  //   this.details_kegiatan.push(fb);
  //   // this.valueChange();
  // }

  removeDetail(dtl) {
    let i = this.details.controls.indexOf(dtl);
    if (i != -1) {
      //  let x=	this.details.controls.splice(i, 1);
      let dtls = this.entryForm.get('details') as FormArray;
      dtls.removeAt(i);
      let data = { details: dtls.value };
      this.updateForm(data);
    }

    this.hitungTotal()
  }




  updateForm(data) {
    // const Kegiatans = data.details;
    // // console.log(Kegiatans);
    // let sub = 0;
    // for(let i of Kegiatans){
    //   sub=sub+ parseFloat( i.qty);

    // }
    // // console.log(sub);
  }
  recalculate() {
    // let Kegiatans = this.entryForm.get('details') as FormArray;
    // let data = { details: Kegiatans.value };
    // this.updateForm(data);
  }
  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();
    // this.valueChange();
  }
  valueChange(event, blok) {
    // console.log(event);
    // console.log(blok);
    // this.hitungPremi(blok);
  }

  hitungTotal() {
    let total = 0;
      this.entryForm.get('details').value.forEach(x => {
      // console.log(x);
      if (isNumber(x.total)) {
        total += x.total;
      } else {
        total += parseFloat(x.total.replace(/[^\d\.\-]/g, ""));
      }
    });
    this.entryForm.get('subtotal').patchValue(formatNumber(total, 'en_US', '1.2-2'));
  }


  numberFormat() {
    let total = this.entryForm.get('total').value;
    if (isString(total)) {
      total = parseFloat(total.replace(/[^\d\.\-]/g, ""));
    }
    this.entryForm.get('subtotal').patchValue(formatNumber(total, 'en_US', '1.2-2'));
  }
  numberFormatDetail(form) {
    let hk = form.get('hk').value;
    if (isString(hk)) {
      hk = parseFloat(hk.replace(/[^\d\.\-]/g, ""));
    }
    form.get('hk').patchValue(formatNumber(hk, 'en_US', '1.2-2'));

    let volume = form.get('volume').value;
    if (isString(volume)) {
      volume = parseFloat(volume.replace(/[^\d\.\-]/g, ""));
    }
    form.get('volume').patchValue(formatNumber(volume, 'en_US', '1.2-2'));

    let total = form.get('total').value;
    if (isString(total)) {
      total = parseFloat(total.replace(/[^\d\.\-]/g, ""));
    }
    form.get('total').patchValue(formatNumber(total, 'en_US', '1.2-2'));

    let harga = total / volume;
    form.get('harga').patchValue(formatNumber(harga, 'en_US', '1.2-2'));
    this.hitungTotal()
    this.totalGrand()
  }
  totalGrand() {
    let subTotal = this.entryForm.get('subtotal').value;
    subTotal = isNumber(subTotal) ? subTotal : parseFloat(subTotal.replace(/[^\d\.\-]/g, ""));

    let grandTotal = 0;
    let pph = parseFloat(this.entryForm.get('pph_persen').value);
    let pphTotal = 0;

    pphTotal = (pph / 100) * parseFloat(subTotal);
    grandTotal = parseFloat(subTotal) -  pphTotal  ;

    this.entryForm.get('pph_nilai').patchValue(formatNumber(pphTotal, 'en_US', '1.2-2'));
    this.entryForm.get('total').patchValue(formatNumber(grandTotal, 'en_US', '1.2-2'));
  }
  calc_pph() {
    let subTotal = this.entryForm.get('subtotal').value;
    subTotal = isNumber(subTotal) ? subTotal : parseFloat(subTotal.replace(/[^\d\.\-]/g, ""));
    let pph_show = this.entryForm.get('pph_nilai').value;
    pph_show = isNumber(pph_show) ? pph_show : parseFloat(pph_show.replace(/[^\d\.\-]/g, ""));

    let pphPercent = 0;

    pphPercent = (pph_show / parseFloat(subTotal)) * 100;
    pphPercent.toFixed(4);
    this.entryForm.get('pph_persen').patchValue(pphPercent);

    this.totalGrand();
  }
  getPrice(form) {
    let spk_id = this.entryForm.get('spk_id').value['id'];
    let blok_id = form.get('blok_id').value['id'];
    let kegiatan_id = form.get('kegiatan_id').value['id'];
    let vol = form.get('volume').value;
    this.EstSpkService.getPrice(spk_id, blok_id, kegiatan_id).subscribe(b => {
      console.log(b);
      let harga = b['data']['harga'];
      let total = vol * harga;
      form.get('harga').patchValue(formatNumber(harga, 'en_US', '1.2-2'));
      form.get('total').patchValue(formatNumber(total, 'en_US', '1.2-2'));
      this.numberFormatDetail(form)
      this.hitungTotal()
      // this.getSatuan(form)
    });
  }

}
