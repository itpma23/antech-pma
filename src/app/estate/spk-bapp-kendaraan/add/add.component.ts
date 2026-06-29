import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate,formatNumber } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { EstSpkBappKendaraanService } from '../../../shared/services/est_spk_bapp_kendaraan.service';
import { GbmOrganisasiService } from '../../../shared/services/gbm_organisasi.service';
import { AccKegiatanService } from '../../../shared/services/acc_kegiatan.service';
import { EstSpkKendaraanService } from '../../../shared/services/est_spk_kendaraan.service';
import { GbmUomService } from '../../../shared/services/gbm_uom.service';
import { EstSpkKendaraan } from 'src/app/shared/models/est_spk_kendaraan.model';
import { isNullOrUndefined, isNumber, isString } from 'util';

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
  dataSelectAfdeling;
  dataSelectKegiatan;
  dataSelectSpk;
  dataSelectBlok;
  dataSelectUom;
  estSpkKendaraan: EstSpkKendaraan;
  dataSelectAkunPph: any[];
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private estBappSpkKendaraanService: EstSpkBappKendaraanService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private GbmUomService: GbmUomService,
    private AccKegiatanService: AccKegiatanService,
    private estSpkKendaraanService: EstSpkKendaraanService,

    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();
    this.entryForm = this.builder.group({

      no_bapp: new FormControl('', Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      tanggal_tempo: new FormControl(toDate,Validators.required),
      periode_mulai: new FormControl(toDate, Validators.required),
      periode_sd: new FormControl(toDate, Validators.required),
      deskripsi: new FormControl(''),

      pph_persen: new FormControl(0),
      pph_nilai: new FormControl(0),

      ppn_persen: new FormControl(0),
      ppn_nilai: new FormControl(0),
      nilai_invoice: new FormControl(0),
      subtotal: new FormControl(0),
      jml_opt: new FormControl(0),

      lokasi_id: new FormControl([], Validators.required),
      spk_kendaraan_id: new FormControl([], Validators.required),
      is_asistensi_unit: new FormControl(0),
      acc_akun_id_pph:new FormControl([], Validators.required),
      details: this.builder.array([]),
      details_opt: this.builder.array([])
    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }
  public options: any;

  private loadSelect2(): void {


    this.GbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x=>{
      this.dataSelectLokasi=[];
      x.forEach(d => {
        // console.log(x);
        this.dataSelectLokasi.push({"id":d.id,"text":d.nama});
      });

      this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {

        // if (x.id==252 || x.id==265) {
          // console.log('SBNE dan SBME');

          let org_id = x.id;
            this.GbmOrganisasiService.getMesinBlokByMillEstate(org_id).subscribe(x => {
              // console.log(x);
              this.dataSelectBlok = [];
              x.forEach(d => {
                this.dataSelectBlok.push({ "id": d.id, "text": d.kode + ' - ' + d.nama+ ' - ' + d.nama_parent  });
              });
            });

            this.estSpkKendaraanService.getAllByEstateId(org_id).subscribe(x => {
              this.dataSelectSpk = [];
              let i = x['data'];
              i.forEach(d => {
                this.dataSelectSpk.push({ "id": d.id, "text": d.no_spk +"-"+d.nama_supplier  });
              });
              this.entryForm.controls['spk_kendaraan_id'].valueChanges.subscribe(x => {
                this.estSpkKendaraanService.getById(x.id).subscribe((data) => {
                this.estSpkKendaraan=data['data'];
                 console.log(  this.estSpkKendaraan);
                 this.entryForm.get('deskripsi')!.patchValue(this.estSpkKendaraan['kode_kendaraan']+'-'+this.estSpkKendaraan['nama_kendaraan']);
                })
                // this.tampilItemPermintaan();th
              });
            });
        // }
      });

    });

    this.GbmOrganisasiService.getAllByType('BLOK').subscribe(x=>{
      this.dataSelectAfdeling=[];
      x.forEach(d => {
        this.dataSelectAfdeling.push({ "id": d.id, "text": d.nama + "(" + d.kode + ")" + " - " + d.nama_parent });

      });
    });

    this.AccKegiatanService.getAll().subscribe(x => {
      this.dataSelectKegiatan = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama +'-'+d.kode });
      });
    });

    this.GbmUomService.getAll().subscribe(x => {
      this.dataSelectUom = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectUom.push({ "id": d.id, "text": d.nama });
      });
    });
    this.estBappSpkKendaraanService.getAllAkunPph().subscribe(x => {
      console.log(x);
      this.dataSelectAkunPph = [];
      let i = x['data'];
      console.log(i);
      i.forEach(d => {
        this.dataSelectAkunPph.push({ "id": d.acc_akun_id, "text": d.kode_akun + ' - ' + d.nama_akun });
      });
    });

  }
  asistensiUnitChange(event) {
    // console.log(event);
    if (event.target.checked) {
      this.GbmOrganisasiService.getAllByType("BLOK").subscribe(x => {
        this.dataSelectBlok = [];
        x.forEach(d => {
          this.dataSelectBlok.push({ "id": d.id, "text": d.kode + ' - ' + d.nama  });
        });
      });


    } else {
        let org_id = this.entryForm.get('lokasi_id').value['id'];
        this.GbmOrganisasiService.getBlokByEstate(org_id).subscribe(x => {
          this.dataSelectBlok = [];
          x.forEach(d => {
            this.dataSelectBlok.push({ "id": d.id, "text": d.kode + ' - ' + d.nama  });
          });
        });

    }
  }
  onSubmit() {
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


    let frmData = this.entryForm.value;
    frmData['tanggal']=formatDate( this.entryForm.get('tanggal')!.value,"yyyy-MM-dd",'en_US');
    frmData['tanggal_tempo']=formatDate( this.entryForm.get('tanggal_tempo')!.value,"yyyy-MM-dd",'en_US');
    frmData['periode_mulai']=formatDate( this.entryForm.get('periode_mulai')!.value,"yyyy-MM-dd",'en_US');
    frmData['periode_sd']=formatDate( this.entryForm.get('periode_sd')!.value,"yyyy-MM-dd",'en_US');
    frmData['subtotal'] = parseFloat(this.entryForm.get('subtotal').value.replace(/[^\d\.\-]/g, ""));
    // frmData['jml_opt'] = parseFloat(this.entryForm.get('jml_opt').value.replace(/[^\d\.\-]/g, ""));
    frmData['nilai_invoice'] = parseFloat(this.entryForm.get('nilai_invoice').value.replace(/[^\d\.\-]/g, ""));

    this.entryForm.get('details').value.forEach(x => {
      if (!isNumber(x.jumlah)) {
        x.jumlah = parseFloat(x.jumlah.replace(/[^\d\.\-]/g, ""));
        // x.jml_hm_km = parseFloat(x.jml_hm_km.replace(/[^\d\.\-]/g, ""));
      }
       x.tanggal_operasi=formatDate( x.tanggal_operasi,"yyyy-MM-dd",'en_US');
    });

    this.entryForm.get('details_opt').value.forEach(x => {
      if (!isNumber(x.jumlah_opt)) {
        x.jumlah_opt = parseFloat(x.jumlah_opt.replace(/[^\d\.\-]/g, ""));
      }
      x.tanggal_opt=formatDate( x.tanggal_opt,"yyyy-MM-dd",'en_US');
    });


  //  console.log(frmData);
    this.estBappSpkKendaraanService.create(frmData).subscribe(data => {
      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Data berhasil disimpan dengan Nomor:'+data['data'],
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



  tampilItemPermintaan() {

    let spk_kendaraan_id = this.entryForm.get('spk_kendaraan_id')!.value['id']
    this.estSpkKendaraanService.getById(spk_kendaraan_id).subscribe(res => {
      this.details.clear();
      let dtl = [];
      dtl = res['data']['detail'];
      for (let index = 0; index < dtl.length; index++) {
        const d = dtl[index];
        this.addBlokItem();
      }



    })


  }


  addBlokItem() {
      let toDate: Date = new Date();
      let harga=0;
      if (this.estSpkKendaraan){
        harga=this.estSpkKendaraan.harga_sewa
      }
      this.details.push(this.builder.group({

        tanggal_operasi: new FormControl(toDate, Validators.required),
        blok_id: new FormControl([],Validators.required),
        kegiatan_id: new FormControl([],Validators.required),
        uom_id: new FormControl([],Validators.required),

        hm_km_awal: new FormControl(0, ),
        x_hm_km_awal: new FormControl(0, ),
        hm_km_akhir: new FormControl(0, ),
        x_hm_km_akhir: new FormControl(0, ),
        jml_hm_km: new FormControl(0, ),

        x_qty: new FormControl(0, ),
        qty: new FormControl(0, ),

        harga_satuan: new FormControl(harga, ),
        x_harga_satuan: new FormControl(harga, ),
        jumlah: new FormControl(0, ),
        keterangan: new FormControl('', ),
      }));
  }
  addBlokOpt() {
    let toDate: Date = new Date();

    this.details_opt.push(this.builder.group({

      tanggal_opt: new FormControl(toDate, Validators.required),
      kegiatan_id: new FormControl([],),
      afdeling_id: new FormControl([],), /// afdeling ini = Blok
      jumlah_opt: new FormControl(0, ),
      x_jumlah_opt: new FormControl(0, ),
      ket: new FormControl('', ),
    }));
}


  removeBlokItem(blok) {
    let i = this.details.controls.indexOf(blok);
    if (i != -1) {
      let detail = this.entryForm.get('details') as FormArray;
      detail.removeAt(i);
      let data = { details: detail.value };
      this.updateForm(data);
    }
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

  // getSelisihKm(form) {
  //   let awal = form.get("hm_km_awal").value;
  //   let akhir = form.get("hm_km_akhir").value;
  //   let harga = form.get("harga_satuan").value;

  //     form.get('jml_hm_km').patchValue(akhir-awal );

  //     form.get('jumlah').patchValue((akhir-awal)*harga);

  //     this.totalSub();
  // }

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

    let harga = form.get('x_harga_satuan').value;
    if (isString(harga)) {
      harga = parseFloat(harga.replace(/[^\d\.\-]/g, ""));
    }
    form.get('x_harga_satuan').patchValue(formatNumber(harga, 'en_US', '1.2-2'));
    form.get('harga_satuan').patchValue(harga);

    let qty = form.get('x_qty').value;
    if (isString(qty)) {
      qty = parseFloat(qty.replace(/[^\d\.\-]/g, ""));
    }
    form.get('x_qty').patchValue(formatNumber(qty, 'en_US', '1.2-2'));
    form.get('qty').patchValue(qty);

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

  let pphPersen = this.entryForm.get('pph_persen').value || 0;
  let ppnPersen = this.entryForm.get('ppn_persen').value || 0;

  pphPersen = parseFloat(pphPersen);
  ppnPersen = parseFloat(ppnPersen);

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

    // this.totalGrand();
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
  valueChange($event) {

  }
}
