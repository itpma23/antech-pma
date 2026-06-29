import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate, formatNumber } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { EstSpkBappKendaraanService } from '../../../shared/services/est_spk_bapp_kendaraan.service';
import { GbmOrganisasiService } from '../../../shared/services/gbm_organisasi.service';
import { GbmUomService } from '../../../shared/services/gbm_uom.service';
import { EstSpkBappKendaraan, EstSpkBappKendaraanDetail, EstSpkBappKendaraanOpt } from '../../../shared/models/est_spk_bapp_kendaraan.model';
import { EstSpkKendaraanService } from '../../../shared/services/est_spk_kendaraan.service';
import { AccKegiatanService } from '../../../shared/services/acc_kegiatan.service';
import { EstSpkKendaraan } from 'src/app/shared/models/est_spk_kendaraan.model';
import { isNullOrUndefined, isNumber, isString } from 'util';

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
  entryForm: FormGroup;

  event: EventEmitter<any> = new EventEmitter();
  estSpkKendaraan: EstSpkKendaraan;
  estBappSpkKendaraan: EstSpkBappKendaraan;
  dataSelectLokasi;
  dataSelectAfdeling;
  dataselectKegiatan1;
  dataselectKegiatan2;
  dataSelectBlok;
  dataSelectSpk;
  dataSelectUom;
  dataSelectAkunPph: any[];

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private estBappSpkKendaraanService: EstSpkBappKendaraanService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private GbmUomService: GbmUomService,
    private estSpkKendaraanService: EstSpkKendaraanService,
    private AccKegiatanService: AccKegiatanService,

    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();
    let time: Date = new Date();

    this.entryForm = this.builder.group({
      no_bapp: new FormControl('', Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      tanggal_tempo: new FormControl(toDate, Validators.required),
      periode_mulai: new FormControl(toDate, Validators.required),
      periode_sd: new FormControl(toDate, Validators.required),
      deskripsi: new FormControl(''),

      lokasi_id: new FormControl([], Validators.required),
      spk_kendaraan_id: new FormControl([], Validators.required),

      pph_persen: new FormControl(0),
      pph_nilai: new FormControl(0),

      ppn_persen: new FormControl(0),
      ppn_nilai: new FormControl(0),
      nilai_invoice: new FormControl(0),
      subtotal: new FormControl(0),
      jml_opt: new FormControl(0),
      acc_akun_id_pph: new FormControl([], Validators.required),
      is_asistensi_unit: new FormControl(0),
      details: this.builder.array([]),
      details_opt: this.builder.array([])


    });
  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

    this.entryForm.get('tanggal')!.patchValue(new Date(Date.parse(this.estBappSpkKendaraan.tanggal)));
    this.entryForm.get('tanggal_tempo')!.patchValue(new Date(Date.parse(this.estBappSpkKendaraan.tanggal_tempo)));
    this.entryForm.get('periode_mulai')!.patchValue(new Date(Date.parse(this.estBappSpkKendaraan.periode_mulai)));
    this.entryForm.get('periode_sd')!.patchValue(new Date(Date.parse(this.estBappSpkKendaraan.periode_sd)));
    this.entryForm.get('deskripsi')!.patchValue(this.estBappSpkKendaraan.deskripsi);
    this.entryForm.get('no_bapp')!.patchValue(this.estBappSpkKendaraan.no_bapp);
    this.entryForm.get('pph_persen')!.patchValue(this.estBappSpkKendaraan.pph_persen);
    this.entryForm.get('ppn_persen')!.patchValue(this.estBappSpkKendaraan.ppn_persen);
    this.entryForm.get('subtotal')!.patchValue(this.estBappSpkKendaraan.subtotal);
    this.entryForm.get('jml_opt')!.patchValue(this.estBappSpkKendaraan.jml_opt);
    this.entryForm.get('nilai_invoice')!.patchValue(this.estBappSpkKendaraan.nilai_invoice);
    this.entryForm.get('is_asistensi_unit').patchValue(this.estBappSpkKendaraan.is_asistensi == true ? 1 : 0);
    this.estSpkKendaraanService.getById(this.estBappSpkKendaraan.spk_kendaraan_id).subscribe((data) => {
      this.estSpkKendaraan = data['data'];
      console.log(this.estSpkKendaraan)
    })
    this.totalGrand();
  }
  public options: any;

  private loadSelect2(): void {
    let selectedEstate;
    this.gbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
        if (this.estBappSpkKendaraan.lokasi_id == d.id) {
          selectedEstate = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectedEstate);
      this.gbmOrganisasiService.getById(this.estBappSpkKendaraan.lokasi_id).subscribe(lok => {
        console.log(lok)
        if (this.estBappSpkKendaraan.is_asistensi == false) {
          this.gbmOrganisasiService.getMesinBlokByMillEstate(this.estBappSpkKendaraan.lokasi_id).subscribe(x => {
            this.dataSelectBlok = [];
            x.forEach(d => {
              this.dataSelectBlok.push({ "id": d.id, "text": d.nama + "(" + d.kode + ")" + " - " + d.nama_parent });
            });

            this.GbmUomService.getAll().subscribe(x => {
              this.dataSelectUom = [];
              x['data'].forEach(d => {
                this.dataSelectUom.push({ "id": d.id, "text": d.nama });
              });

              this.AccKegiatanService.getAll().subscribe(x => {
                this.dataselectKegiatan1 = [];
                x['data'].forEach(d => {
                  this.dataselectKegiatan1.push({ "id": d.id, "text": d.nama + " - " + d.kode });
                });

                let dtl: EstSpkBappKendaraanDetail[];
                dtl = this.estBappSpkKendaraan.detail;
                for (let index = 0; index < dtl.length; index++) {
                  const d = dtl[index];
                  this.addBlok(d.blok_id, d.kegiatan_id, d.tanggal_operasi, d.hm_km_awal, d.hm_km_akhir, d.jml_hm_km, d.uom_id, d.qty, d.harga_satuan, d.jumlah, d.keterangan);
                }

              });
            });
          });
        } else {
          this.gbmOrganisasiService.getAllByType('BLOK').subscribe(x => {
            this.dataSelectBlok = [];
            x.forEach(d => {
              this.dataSelectBlok.push({ "id": d.id, "text": d.nama + "(" + d.kode + ")" + " - " + d.nama_parent });
            });

            this.GbmUomService.getAll().subscribe(x => {
              this.dataSelectUom = [];
              x['data'].forEach(d => {
                this.dataSelectUom.push({ "id": d.id, "text": d.nama });
              });

              this.AccKegiatanService.getAll().subscribe(x => {
                this.dataselectKegiatan1 = [];
                x['data'].forEach(d => {
                  this.dataselectKegiatan1.push({ "id": d.id, "text": d.nama + " - " + d.kode });
                });

                let dtl: EstSpkBappKendaraanDetail[];
                dtl = this.estBappSpkKendaraan.detail;
                for (let index = 0; index < dtl.length; index++) {
                  const d = dtl[index];
                  this.addBlok(d.blok_id, d.kegiatan_id, d.tanggal_operasi, d.hm_km_awal, d.hm_km_akhir, d.jml_hm_km, d.uom_id, d.qty, d.harga_satuan, d.jumlah, d.keterangan);
                }

              });
            });
          });


        }
      });


    });
    let selectedAkunpph;
    this.estBappSpkKendaraanService.getAllAkunPph().subscribe(x => {
      console.log(x);
      this.dataSelectAkunPph = [];
      let i = x['data'];
      console.log(i);
      i.forEach(d => {
        this.dataSelectAkunPph.push({ "id": d.acc_akun_id, "text": d.kode_akun + ' - ' + d.nama_akun });
        if (this.estBappSpkKendaraan.pph_akun_id == d.acc_akun_id) {
          selectedAkunpph = { "id": d.acc_akun_id, "text": d.kode_akun + ' - ' + d.nama_akun }
        }
      });

      this.entryForm.get('acc_akun_id_pph')!.patchValue(selectedAkunpph);
    });

    let selectedSpk;
    this.estSpkKendaraanService.getAll().subscribe(x => {
      this.dataSelectSpk = [];
      console.log(x)
      x['data'].forEach(d => {
        this.dataSelectSpk.push({ "id": d.id, "text": d.no_spk + "(" + d.nama_supplier + ")" });
        if (this.estBappSpkKendaraan.spk_kendaraan_id == d.id) {
          selectedSpk = { "id": d.id, "text": d.no_spk + "(" + d.nama_supplier + ")" }
        }
      });
      this.entryForm.get('spk_kendaraan_id')!.patchValue(selectedSpk);
    });

    this.gbmOrganisasiService.getAllByType('BLOK').subscribe(x => {
      this.dataSelectAfdeling = [];
      x.forEach(d => {
        this.dataSelectAfdeling.push({ "id": d.id, "text": d.nama + "(" + d.kode + ")" + " - " + d.nama_parent });

      });

      this.AccKegiatanService.getAll().subscribe(x => {
        this.dataselectKegiatan2 = [];
        x['data'].forEach(d => {
          this.dataselectKegiatan2.push({ "id": d.id, "text": d.nama + " - " + d.kode });
        });

        let dtl: EstSpkBappKendaraanOpt[];
        dtl = this.estBappSpkKendaraan.detail_opt;
        for (let index = 0; index < dtl.length; index++) {
          const d = dtl[index];
          this.addBlokOpt(d.afdeling_id, d.kegiatan_id, d.tanggal_opt, d.jumlah_opt, d.ket);
        }

      });

    });

    // this.AccKegiatanService.getAll().subscribe(x => {
    //   this.dataselectKegiatan = [];
    //   x['data'].forEach(d => {
    //     this.dataselectKegiatan.push({ "id": d.id, "text": d.nama });
    //   });

    //         let dtl = [];
    //         dtl = this.estBappSpkKendaraan.detail;
    //         for (let index = 0; index < dtl.length; index++) {
    //           const d = dtl[index];
    //           this.addBlok(d['komponen_perjalanan_dinas_id'], d['nilai'], d['ket']);
    //         }

    // });









  }
  onSubmit() {


    this.isFormSubmitted = true;

    if (this.entryForm.invalid) {
      return;
    }

    let frmData = this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal')!.value, "yyyy-MM-dd", 'en_US');
    frmData['tanggal_tempo'] = formatDate(this.entryForm.get('tanggal_tempo')!.value, "yyyy-MM-dd", 'en_US');
    frmData['periode_mulai'] = formatDate(this.entryForm.get('periode_mulai')!.value, "yyyy-MM-dd", 'en_US');
    frmData['periode_sd'] = formatDate(this.entryForm.get('periode_sd')!.value, "yyyy-MM-dd", 'en_US');
    frmData['subtotal'] = parseFloat(this.entryForm.get('subtotal').value.replace(/[^\d\.\-]/g, ""));
    frmData['jml_opt'] = parseFloat(this.entryForm.get('jml_opt').value.replace(/[^\d\.\-]/g, ""));
    frmData['nilai_invoice'] = parseFloat(this.entryForm.get('nilai_invoice').value.replace(/[^\d\.\-]/g, ""));

    this.entryForm.get('details').value.forEach(x => {
      if (!isNumber(x.jumlah)) {
        x.jumlah = parseFloat(x.jumlah.replace(/[^\d\.\-]/g, ""));
        // x.jml_hm_km = parseFloat(x.jml_hm_km.replace(/[^\d\.\-]/g, ""));
      }
      x.tanggal_operasi = formatDate(x.tanggal_operasi, "yyyy-MM-dd", 'en_US');
    });

    this.entryForm.get('details_opt').value.forEach(x => {
      if (!isNumber(x.jumlah_opt)) {
        x.jumlah_opt = parseFloat(x.jumlah_opt.replace(/[^\d\.\-]/g, ""));
      }
      x.tanggal_opt = formatDate(x.tanggal_opt, "yyyy-MM-dd", 'en_US');
    });

    this.estBappSpkKendaraanService.update(this.estBappSpkKendaraan.id, frmData).subscribe(data => {
      // console.log(data);
      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Edit berhasil',
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
  get details_opt(): FormArray {
    return this.entryForm.get('details_opt') as FormArray;
  };

  addBlokNew() {
    let harga = 0;
    if (this.estSpkKendaraan) {
      harga = this.estSpkKendaraan.harga_sewa
    }
    let toDate: Date = new Date();
    this.details.push(this.builder.group({
      tanggal_operasi: new FormControl(toDate, Validators.required),
      blok_id: new FormControl([], Validators.required),
      kegiatan_id: new FormControl([], Validators.required),
      uom_id: new FormControl([], Validators.required),
      hm_km_awal: new FormControl(0,),
      x_hm_km_awal: new FormControl(0,),
      hm_km_akhir: new FormControl(0,),
      x_hm_km_akhir: new FormControl(0,),
      jml_hm_km: new FormControl(0,),
      x_jml_hm_km: new FormControl(0,),

      x_qty: new FormControl(0,),
      qty: new FormControl(0,),

      harga_satuan: new FormControl(harga,),
      x_harga_satuan: new FormControl(harga,),
      jumlah: new FormControl(0,),
      keterangan: new FormControl('',),
    }));
  }
  addBlokNewOpt() {
    let toDate: Date = new Date();

    this.details_opt.push(this.builder.group({
      tanggal_opt: new FormControl(toDate, Validators.required),
      kegiatan_id: new FormControl([], Validators.required),
      jumlah_opt: new FormControl(0,),
      x_jumlah_opt: new FormControl(0,),
      ket: new FormControl(''),
    }));
  }
  addBlokOpt(afdeling_id, kegiatan_id, tanggal_opt, jumlah_opt, ket,) {

    this.dataselectKegiatan2;

    let selectedKegiatan = [];
    this.dataselectKegiatan2.forEach(a => {
      if (kegiatan_id == a.id) {
        selectedKegiatan = a;
      }
    });

    this.dataSelectAfdeling;

    let selectedAfdeling = [];
    this.dataSelectAfdeling.forEach(a => {
      if (afdeling_id == a.id) {
        selectedAfdeling = a;
      }
    });

    this.details_opt.push(this.builder.group({
      tanggal_opt: new FormControl(new Date(Date.parse(tanggal_opt))),
      afdeling_id: new FormControl(selectedAfdeling),
      kegiatan_id: new FormControl(selectedKegiatan),
      jumlah_opt: new FormControl(jumlah_opt),
      x_jumlah_opt: new FormControl(formatNumber(jumlah_opt, 'en_US', '1.2-2')),
      ket: new FormControl(ket),
    }));
    this.totalSubOpt()
    this.totalGrand()
  }


  addBlok(blok_id, kegiatan_id, tanggal_operasi, hm_km_awal, hm_km_akhir, jml_hm_km, uom_id, qty, harga_satuan, jumlah, keterangan,) {

    this.dataSelectBlok;
    this.dataSelectUom;
    this.dataselectKegiatan1;

    let selectedBlok = [];
    this.dataSelectBlok.forEach(a => {
      if (blok_id == a.id) {
        selectedBlok = a;
      }
    });
    let selectedKegiatan = [];
    this.dataselectKegiatan1.forEach(a => {
      if (kegiatan_id == a.id) {
        selectedKegiatan = a;
      }
    });

    let selectedUom = [];
    this.dataSelectUom.forEach(a => {
      if (uom_id == a.id) {
        selectedUom = a;
      }
    });


    this.details.push(this.builder.group({
      tanggal_operasi: new FormControl(new Date(Date.parse(tanggal_operasi))),
      blok_id: new FormControl(selectedBlok, Validators.required),
      kegiatan_id: new FormControl(selectedKegiatan, Validators.required),
      uom_id: new FormControl(selectedUom, Validators.required),

      hm_km_awal: new FormControl(hm_km_awal),
      x_hm_km_awal: new FormControl(formatNumber(hm_km_awal, 'en_US', '1.2-2')),

      hm_km_akhir: new FormControl(hm_km_akhir),
      x_hm_km_akhir: new FormControl(formatNumber(hm_km_akhir, 'en_US', '1.2-2')),

      qty: new FormControl(qty),
      x_qty: new FormControl(formatNumber(qty, 'en_US', '1.2-2')),

      harga_satuan: new FormControl(harga_satuan),
      x_harga_satuan: new FormControl(formatNumber(harga_satuan, 'en_US', '1.2-2')),

      jml_hm_km: new FormControl(formatNumber(jml_hm_km, 'en_US', '1.2-2')),
      jumlah: new FormControl(formatNumber(jumlah, 'en_US', '1.2-2')),
      // jumlah: new FormControl(jumlah),
      keterangan: new FormControl(keterangan),
    }));
    this.totalSub()
    this.totalGrand()
  }

  removeBlokOpt(blok) {
    let i = this.details_opt.controls.indexOf(blok);
    if (i != -1) {
      let detail = this.entryForm.get('details_opt') as FormArray;
      detail.removeAt(i);
      let data = { details_opt: detail.value };
      this.updateForm(data);
    }
    this.totalSubOpt()
    this.totalGrand()
  }

  removeBlokItem(item) {
    let i = this.details.controls.indexOf(item);
    if (i != -1) {
      // let x=	this.details.controls.splice(i, 1);
      let items = this.entryForm.get('details') as FormArray;
      items.removeAt(i);
      let data = { details: items.value };
      this.updateForm(data);
    }
    this.totalSub()
    this.totalGrand()
  }

  // ----------------------------------------------------------------------


  getSelisihKm(form) {
    let awal = form.get("hm_km_awal").value;
    let akhir = form.get("hm_km_akhir").value;
    let harga = form.get("harga_satuan").value;

    form.get('jml_hm_km').patchValue(akhir - awal);

    form.get('jumlah').patchValue((akhir - awal) * harga);

  }
  totalHarga(form) {
    // let awal = form.get('x_hm_km_awal').value;
    // if (isString(awal)) {
    //   awal = parseFloat(awal.replace(/[^\d\.\-]/g, ""));
    // }
    // form.get('x_hm_km_awal').patchValue(formatNumber(awal, 'en_US', '1.2-2'));
    // form.get('hm_km_awal').patchValue(awal);

    // let akhir = form.get('x_hm_km_akhir').value;
    // if (isString(akhir)) {
    //   akhir = parseFloat(akhir.replace(/[^\d\.\-]/g, ""));
    // }
    // form.get('x_hm_km_akhir').patchValue(formatNumber(akhir, 'en_US', '1.2-2'));
    // form.get('hm_km_akhir').patchValue(akhir);

    let qty = form.get('x_qty').value;
    if (isString(qty)) {
      qty = parseFloat(qty.replace(/[^\d\.\-]/g, ""));
    }
    form.get('x_qty').patchValue(formatNumber(qty, 'en_US', '1.2-2'));
    form.get('qty').patchValue(qty);


    let harga = form.get('x_harga_satuan').value;
    if (isString(harga)) {
      harga = parseFloat(harga.replace(/[^\d\.\-]/g, ""));
    }
    form.get('x_harga_satuan').patchValue(formatNumber(harga, 'en_US', '1.2-2'));
    form.get('harga_satuan').patchValue(harga);

    // let hm_km_jml = (akhir - awal) ;
    let total = qty * harga;

    // form.get('jml_hm_km').patchValue(formatNumber(hm_km_jml, 'en_US', '1.2-2'));

    form.get('jumlah').patchValue(formatNumber(total, 'en_US', '1.2-2'));

    this.totalSub();
    this.totalGrand();
    this.calc_pph();
  }
  totalSub() {
    let subTotal = 0;
    this.entryForm.get('details').value.forEach(x => {
      // console.log(x);
      if (isNumber(x.jumlah)) {
        subTotal += x.jumlah;
      } else {
        subTotal += parseFloat(x.jumlah.replace(/[^\d\.\-]/g, ""));
      }

    });
    this.entryForm.get('subtotal').patchValue(formatNumber(subTotal, 'en_US', '1.2-2'));
  }

  totalHargaOpt(form) {
    let jml = form.get('x_jumlah_opt').value;
    if (isString(jml)) {
      jml = parseFloat(jml.replace(/[^\d\.\-]/g, ""));
    }
    form.get('x_jumlah_opt').patchValue(formatNumber(jml, 'en_US', '1.2-2'));
    form.get('jumlah_opt').patchValue(jml);

    this.totalSubOpt();
    this.totalGrand();
  }

  totalSubOpt() {
    let subTotal = 0;
    this.entryForm.get('details_opt').value.forEach(x => {
      // console.log(x);
      if (isNumber(x.jumlah_opt)) {
        subTotal += x.jumlah_opt;
      } else {
        subTotal += parseFloat(x.jumlah_opt.replace(/[^\d\.\-]/g, ""));
      }
    });
    this.entryForm.get('jml_opt').patchValue(formatNumber(subTotal, 'en_US', '1.2-2'));
  }



  totalGrand() {
    let subTotal = this.entryForm.get('subtotal').value;
    subTotal = isNumber(subTotal) ? subTotal : parseFloat(subTotal.replace(/[^\d\.\-]/g, ""));

    let subTotalOpt = this.entryForm.get('jml_opt').value;
    subTotalOpt = isNumber(subTotalOpt) ? subTotalOpt : parseFloat(subTotalOpt.replace(/[^\d\.\-]/g, ""));

    let pphPersen = parseFloat(this.entryForm.get('pph_persen').value || 0);
    let ppnPersen = parseFloat(this.entryForm.get('ppn_persen').value || 0);

    /** PPH */
    let pphNilai = (pphPersen / 100) * subTotal;
    let totalAfterPPH = subTotal - pphNilai;

    /** PPN */
    let ppnNilai = (ppnPersen / 100) * totalAfterPPH;

    /** GRAND TOTAL */
    let grandTotal = totalAfterPPH + ppnNilai + subTotalOpt;

    this.entryForm.get('pph_nilai').patchValue(
      formatNumber(pphNilai, 'en_US', '1.2-2')
    );

    this.entryForm.get('ppn_nilai').patchValue(
      formatNumber(ppnNilai, 'en_US', '1.2-2')
    );

    this.entryForm.get('nilai_invoice').patchValue(
      formatNumber(grandTotal, 'en_US', '1.2-2')
    );
  }


  calc_pph() {
    // let subTotal = this.entryForm.get('subtotal').value;
    // subTotal = isNumber(subTotal) ? subTotal : parseFloat(subTotal.replace(/[^\d\.\-]/g, ""));
    // let pph_show = this.entryForm.get('pph_nilai').value;
    // pph_show = isNumber(pph_show) ? pph_show : parseFloat(pph_show.replace(/[^\d\.\-]/g, ""));

    // let pphPercent = this.entryForm.get('pph_persen').value;
    // pphPercent = isNumber(pphPercent) ? pphPercent : parseFloat(pphPercent.replace(/[^\d\.\-]/g, ""));

    // pphPercent = (pph_show / parseFloat(subTotal)) * 100;
    // pphPercent.toFixed(4);
    // // this.entryForm.get('pph_persen').patchValue(pphPercent);

    // this.totalSub();
  }




  updateForm(data) {

  }
  recalculate() {
  }
  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();


  }
  asistensiUnitChange(event) {
    // console.log(event);
    if (event.target.checked) {
      this.gbmOrganisasiService.getAllByType("BLOK").subscribe(x => {
        this.dataSelectBlok = [];
        x.forEach(d => {
          this.dataSelectBlok.push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
        });
      });


    } else {
      let org_id = this.entryForm.get('lokasi_id').value['id'];
      this.gbmOrganisasiService.getBlokByEstate(org_id).subscribe(x => {
        this.dataSelectBlok = [];
        x.forEach(d => {
          this.dataSelectBlok.push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
        });
      });

    }
  }
  valueChange($event) {
    // console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
}
