import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { InvPermintaanBarangService } from 'src/app/shared/services/inv_permintaan_barang.service';
import { InvPemakaianBarangOnlineService } from 'src/app/shared/services/inv_pemakaian_barang_online.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { AccKegiatanKelompokService } from 'src/app/shared/services/acc_kegiatan_kelompok.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmUomService } from 'src/app/shared/services/gbm_uom.service';
import { AccKegiatanService } from 'src/app/shared/services/acc_kegiatan.service';
import { TrkKendaraanService } from 'src/app/shared/services/trk_kendaraan.service';

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
  dataSelectLokasiAfd;
  dataSelectLokasiTraksi;
  dataSelectGudang;
  dataSelectBlok;
  dataSelectKegiatan;
  dataSelectKaryawan;
  dataSelectUom;
  dataSelectItem;
  dataSelectTipe;
  dataSelectTraksi;
  dataSelectPermintaan;
  stokSaatIni: any;
  stokMinimum: number;

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private invPermintaanBarangService: InvPermintaanBarangService,
    private invPemakaianBarangService: InvPemakaianBarangOnlineService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private accKegiatanService: AccKegiatanService,
    private karyawanService: KaryawanService,
    private gbmUomService: GbmUomService,
    private invItemService: InvItemService,
    private trkKendaraanService: TrkKendaraanService,
    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();
    this.entryForm = this.builder.group({

      no_transaksi: new FormControl('(AutoNumber)'),
      tanggal: new FormControl(toDate, Validators.required),
      catatan: new FormControl(''),
      lokasi_id: new FormControl([], Validators.required),
      lokasi_afd_id: new FormControl([]),
      lokasi_traksi_id: new FormControl([]),
      gudang_id: new FormControl([], Validators.required),
      karyawan_id: new FormControl([], Validators.required),
      inv_permintaan_id: new FormControl([]),
      tipe: new FormControl([], Validators.required),


      details: this.builder.array([])

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }
  public options: any;

  private loadSelect2(): void {

    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });

      this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {

        let org_id = x.id;
        this.GbmOrganisasiService.getGudangCentralAndVirtualByUnit(org_id).subscribe(x => {
          this.dataSelectGudang = [];
          x.forEach(d => {
            this.dataSelectGudang.push({ "id": d.id, "text": d.nama });
          });
          this.entryForm.controls['gudang_id'].valueChanges.subscribe(x => {

          });
        });

        this.invPermintaanBarangService.getAllBelumPemakaianByLokasi(org_id).subscribe(x => {
          this.dataSelectPermintaan = [];
          let i = x['data'];
          i.forEach(d => {
            this.dataSelectPermintaan.push({ "id": d.id, "text": d.no_transaksi });
          });
        });

        let afdst_id = x.id;
        this.GbmOrganisasiService.getAfdStByUnit(afdst_id).subscribe(x => {
          this.dataSelectLokasiAfd = [];
          console.log(x);
          x.forEach(d => {
            this.dataSelectLokasiAfd.push({ "id": d.id, "text": d.nama });
          });
          this.entryForm.controls['lokasi_afd_id'].valueChanges.subscribe(af => {
            console.log(af)
            let afd_id = af.id;
            if (afd_id) {
              this.GbmOrganisasiService.getBlokByAfdeling(afd_id).subscribe(b => {
                this.dataSelectBlok = [];
                // console.log(b);
                b.forEach(d => {
                  this.dataSelectBlok.push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
                });
              });
            }
          });
        });

        let trk_parent_id = x.id;
        this.GbmOrganisasiService.getAllByType('TRAKSI').subscribe(x => {
          // this.GbmOrganisasiService.getTraksiByUnit(trk_parent_id).subscribe(x => {
          this.dataSelectLokasiTraksi = [];
          x.forEach(d => {
            this.dataSelectLokasiTraksi.push({ "id": d.id, "text": d.nama });
          });
          this.entryForm.controls['lokasi_traksi_id'].valueChanges.subscribe(x => {
            console.log(x)
            let trk_id = x['id'];
            if (trk_id) {
              this.trkKendaraanService.getByTraksiId(trk_id).subscribe(x => {
                this.dataSelectTraksi = [];
                let i = x['data'];
                i.forEach(d => {
                  this.dataSelectTraksi.push({ "id": d.id, "text": d.kode + '-' + d.nama });
                });
              });
            }
          });


        });

        this.entryForm.controls['inv_permintaan_id'].valueChanges.subscribe(x => {
          this.tampilItemPermintaan();
        });


      });

    });

    this.dataSelectTipe = [
      { id: 'TRAKSI', text: 'TRAKSI' },
      { id: 'UNIT', text: 'UNIT' },
      // { id: 'WORKSHOP', text: 'WORKSHOP' },
    ];

    this.entryForm.get('tipe').valueChanges.subscribe(x => {
      let tipe = '';

      if (x.id === 'TRAKSI') {
        this.entryForm.controls['lokasi_afd_id'].disable();
        this.entryForm.controls['lokasi_afd_id'].patchValue([]);
        this.entryForm.controls['lokasi_traksi_id'].enable();
        this.entryForm.controls['lokasi_traksi_id'].patchValue([]);

        tipe = 'TRAKSI_ALL';

        this.details.controls.forEach(d => {
          d.get('blok_id').disable();
          d.get('blok_id').patchValue([]);
          d.get('traksi_id').enable();
          d.get('traksi_id').patchValue([]);
        });

      } else if (x.id === 'UNIT') {
        this.entryForm.controls['lokasi_traksi_id'].disable();
        this.entryForm.controls['lokasi_traksi_id'].patchValue([]);
        this.entryForm.controls['lokasi_afd_id'].enable();
        this.entryForm.controls['lokasi_afd_id'].patchValue([]);

        tipe = 'BAHAN';

        this.details.controls.forEach(d => {
          d.get('blok_id').enable();
          d.get('blok_id').patchValue([]);
          d.get('traksi_id').disable();
          d.get('traksi_id').patchValue([]);
        });
      }

      this.accKegiatanService.getAllbyTipe(tipe).subscribe(res => {
        this.dataSelectKegiatan = [];
        let data = res['data'] || [];
        data.forEach(d => {
          this.dataSelectKegiatan.push({ id: d.id, text: `${d.nama} - ${d.kode}` });
        });
      });

    });

    this.karyawanService.getAll().subscribe(x => {
      this.dataSelectKaryawan = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama });
      });
    });



    this.invItemService.getAll().subscribe(x => {
      this.dataSelectItem = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectItem.push({ "id": d.id, "text": d.kode + ' - ' + d.nama + "(" + d.uom + ")" });
      });
    });

    this.gbmUomService.getAll().subscribe(x => {
      this.dataSelectUom = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectUom.push({ "id": d.id, "text": d.nama });
      });
    });




    this.GbmOrganisasiService.getAllByType('BLOK_MESIN').subscribe(x => {
      this.dataSelectBlok = [];
      x.forEach(d => {
        this.dataSelectBlok.push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
      });
    });




  }
  onSubmitClear() {
    this.isFormSubmitted = true;
    console.log(this.entryForm);
    if (this.entryForm.invalid) {
      return;
    }
    let frmData = this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    this.invPemakaianBarangService.create(frmData).subscribe(data => {
      if (data['status'] == 'OK') {
        swal({
          title: 'Info!',
          text: 'Data berhasil disimpan dengan Nomor:' + data['data'],
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        // this.event.emit('OK');
        // this.bsModalRef.hide();
        this.isFormSubmitted = false;
        let toDate: Date = new Date();
        this.entryForm = this.builder.group({
          no_transaksi: new FormControl('(AutoNumber)'),
          tanggal: new FormControl(toDate, Validators.required),
          catatan: new FormControl(''),
          lokasi_id: new FormControl([], Validators.required),
          lokasi_afd_id: new FormControl([]),
          lokasi_traksi_id: new FormControl([]),
          gudang_id: new FormControl([], Validators.required),
          karyawan_id: new FormControl([], Validators.required),
          inv_permintaan_id: new FormControl([]),
          tipe: new FormControl([], Validators.required),

          details: this.builder.array([])
        });
        this.loadSelect2();
        return;
      } else {
        swal({
          title: 'Proses Simpan Gagal!',
          text: '' + data['data'],
          type: 'warning',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
      }
    });
  }
  onSubmit() {
    this.isFormSubmitted = true;

    console.log(this.entryForm);
    if (this.entryForm.invalid) {
      return;
    }



    let frmData = this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    this.invPemakaianBarangService.create(frmData).subscribe(data => {
      if (data['status'] == 'OK') {
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
          title: 'Proses Simpan Gagal!',
          text: '' + data['data'],
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


  addBlokItem() {
    let group;

    if (this.entryForm.get('tipe').value.id == 'TRAKSI') {
      group = this.builder.group({
        qty: new FormControl('1', Validators.required),
        item_id: new FormControl([]),
        blok_id: new FormControl({ value: [], disabled: true }),
        traksi_id: new FormControl([]),
        kegiatan_id: new FormControl([], Validators.required),
        ket: new FormControl('', Validators.required),
      });
    } else {
      group = this.builder.group({
        qty: new FormControl('1', Validators.required),
        item_id: new FormControl([]),
        blok_id: new FormControl([]),
        traksi_id: new FormControl({ value: [], disabled: true }),
        kegiatan_id: new FormControl([], Validators.required),
        ket: new FormControl('', Validators.required),
      });
    }

    // Pasang listener di sini
    group.get('item_id').valueChanges.subscribe(item => {
      const itemId = item && item.id;
      const gudangId = this.entryForm.get('gudang_id').value && this.entryForm.get('gudang_id').value.id;
      if (itemId && gudangId) {
        this.ambilStok(itemId, gudangId);
        this.ambilBufferStok(itemId);
      }
    });

    // Kalau gudang_id berubah, stok juga diambil ulang
    this.entryForm.get('gudang_id').valueChanges.subscribe(gudang => {
      const gudangId = gudang && gudang.id;
      const itemId = group.get('item_id').value && group.get('item_id').value.id;
      if (itemId && gudangId) {
        this.ambilStok(itemId, gudangId);
      }
    });

    this.details.push(group);
  }



  removeBlokItem(blok) {
    let i = this.details.controls.indexOf(blok);
    if (i != -1) {
      let detail = this.entryForm.get('details') as FormArray;
      detail.removeAt(i);
      let data = { details: detail.value };
      this.updateForm(data);
    }
  }
  addBlokPermintaan(item_id, traksi_id, blok_id, kegiatan_id, qty, ket) {

    // this.dataSelectBlok;
    // this.dataSelectKegiatan;
    // this.dataSelectUom;
    // this.dataSelectItem;

    let selectedItem;
    this.dataSelectItem.forEach(a => {
      if (item_id == a.id) {
        selectedItem = a;
      }
    });
    // let selectedUom;
    // this.dataSelectUom.forEach(a => {
    //   if (uom_id == a.id) {
    //     selectedUom = a;
    //   }
    // });
    let selectedTraksi = [];
    this.dataSelectTraksi.forEach(a => {
      if (traksi_id == a.id) {
        selectedTraksi = a;
      }
    });
    let selectedBlok = [];
    this.dataSelectBlok.forEach(a => {
      if (blok_id == a.id) {
        selectedBlok = a;
      }
    });
    let selectedKegiatan = [];
    this.dataSelectKegiatan.forEach(a => {
      if (kegiatan_id == a.id) {
        selectedKegiatan = a;
      }
    });

    let fb = this.builder.group({

      item_id: new FormControl(selectedItem),
      // uom_id: new FormControl(selectedUom),
      traksi_id: new FormControl(selectedTraksi),
      blok_id: new FormControl(selectedBlok),
      kegiatan_id: new FormControl(selectedKegiatan, Validators.required),
      qty: new FormControl(qty),
      ket: new FormControl(ket),

    });

    this.details.push(fb);
  }

  tampilItemPermintaan() {

    let permintaan_id = this.entryForm.get('inv_permintaan_id').value['id']
    this.invPermintaanBarangService.getById(permintaan_id).subscribe(res => {
      this.details.clear();
      let dtl = [];
      dtl = res['data']['detail'];
      for (let index = 0; index < dtl.length; index++) {
        const d = dtl[index];
        this.addBlokPermintaan(d['item_id'], d['traksi_id'], d['blok_id'], d['kegiatan_id'], d['qty'], d['ket']);
      }
      let selectLokasiAfd: any = [];
      this.dataSelectLokasiAfd = [];
      this.GbmOrganisasiService.getAllByType('AFDELING_STASIUN').subscribe(x => {
        this.dataSelectLokasiAfd = [];
        x.forEach(d => {
          this.dataSelectLokasiAfd.push({ "id": d.id, "text": d.nama });
          if (res['data']['lokasi_afd_id'] == d.id) {
            selectLokasiAfd = { "id": d.id, "text": d.nama }
          }
        });
        this.entryForm.get('lokasi_afd_id').patchValue(selectLokasiAfd);
      });

      let selectLokasiTraksi: any = [];
      this.dataSelectLokasiTraksi = [];
      this.GbmOrganisasiService.getAllByType('TRAKSI').subscribe(x => {
        this.dataSelectLokasiTraksi = [];
        x.forEach(d => {
          this.dataSelectLokasiTraksi.push({ "id": d.id, "text": d.nama });
          if (res['data']['lokasi_traksi_id'] == d.id) {
            console.log(d);
            selectLokasiTraksi = { "id": d.id, "text": d.nama }
          }
        });
        this.entryForm.get('lokasi_traksi_id').patchValue(selectLokasiTraksi);
      });

      let selectGudang;
      this.GbmOrganisasiService.getAllByType('GUDANG').subscribe(x => {
        this.dataSelectGudang = [];
        x.forEach(d => {
          this.dataSelectGudang.push({ "id": d.id, "text": d.nama });
          if (res['data']['gudang_id'] == d.id) {
            selectGudang = { "id": d.id, "text": d.nama }
          }
        });
        this.entryForm.get('gudang_id').patchValue(selectGudang);
      });

      let selectKaryawan;
      this.karyawanService.getAll().subscribe(x => {
        this.dataSelectKaryawan = [];
        x['data'].forEach(d => {
          this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama });
          if (res['data']['karyawan_id'] == d.id) {
            selectKaryawan = { "id": d.id, "text": d.nama }
          }
        });
        this.entryForm.get('karyawan_id').patchValue(selectKaryawan);
      });

      let selectTipe;
      this.dataSelectTipe.forEach(a => {
        if (a.id == res['data']['tipe']) {
          selectTipe = a;
        }
      });
      this.entryForm.controls['tipe'].patchValue(selectTipe);
      this.entryForm.controls['catatan'].patchValue(res['data']['catatan']);

    })


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

  ambilStok(itemId: number, gudangId: number) {
    this.invPemakaianBarangService
      .getStokByItemAndGudang(itemId, gudangId)
      .subscribe(
        (res: any) => {
          if (res && res.status === 'OK') {
            const stok = Number(res.data);
            if (!isNaN(stok)) {
              this.stokSaatIni = stok;
            } else {
              this.stokSaatIni = 0;
            }
          } else {
            this.stokSaatIni = 0;
            // Kalau status tidak OK tapi bukan error HTTP, bisa kasih alert juga kalau mau
          }
        },
        (error) => {
          // error handling untuk HTTP error
          if (error.status === 404) {
            swal({
              title: 'Info!',
              text: 'Item ini belum terdaftar di gudang',
              icon: 'info',
              buttons: {
                confirm: {
                  className: 'btn btn-success'
                }
              },
              // Sweetalert v2 pake icon, bukan type
            });
          } else {
            // Error lain bisa ditangani juga
            swal({
              title: 'Error!',
              text: 'Terjadi kesalahan: ' + error.message,
              icon: 'error',
              buttons: {
                confirm: {
                  className: 'btn btn-danger'
                }
              },
            });
          }
          this.stokSaatIni = 0;
        }
      );
  }

  ambilBufferStok(itemId: number) {
    this.invPemakaianBarangService
      .getBufferStok(itemId)
      .subscribe((res: any) => {
        if (res && res.status === 'OK') {
          const stok = Number(res.data);
          if (!isNaN(stok)) {
            this.stokMinimum = stok;
          } else {
            this.stokMinimum = 0;
          }
        } else {
          this.stokMinimum = 0;
        }
      });
  }

  getItemTextById(itemId: number): string {
    const found = this.dataSelectItem.find(i => i.id === itemId);
    return found ? found.text : 'Nama item tidak ditemukan';
  }

  validateQty(index: number) {
    console.log('test index', index)
    const detailGroup = this.details.at(index);
    const qty = detailGroup.get('qty').value;
    const stokSaatIni = this.stokSaatIni
    const stokMinimum = this.stokMinimum;

    if (qty > stokSaatIni) {
      swal({
        title: 'Stok Kurang!',
        text: `Qty melebihi stok saat ini (${stokSaatIni}). Silakan melakukan PP.`,
        icon: 'warning',
        buttons: { confirm: { className: 'btn btn-warning' } },
      });
      // Bisa juga reset qty ke stokSaatIni atau 0 jika mau:
      // detailGroup.get('qty').setValue(stokSaatIni);
    } else if (qty < stokMinimum) {
      swal({
        title: 'Stok Minimal Dilanggar!',
        text: `Qty kurang dari buffer stok minimum (${stokMinimum}). Periksa kembali.`,
        icon: 'info',
        buttons: { confirm: { className: 'btn btn-info' } },
      });
    }
  }




}
