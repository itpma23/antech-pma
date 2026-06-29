import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";

import { PrcPp } from 'src/app/shared/models/prc_pp.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { PrcPpService } from 'src/app/shared/services/prc_pp.service';
import { formatDate, formatNumber } from '@angular/common';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { PrcApprovallSettingService } from 'src/app/shared/services/prc_approvall_setting.service';
declare var swal: any;
import { isNullOrUndefined, isNumber, isString } from 'util';
import { InvLaporanService } from 'src/app/shared/services/inv_laporan.service';
import { InvPemakaianBarang } from 'src/app/shared/models/inv_pemakaian_barang.model';
import { InvPemakaianBarangOnlineService } from 'src/app/shared/services/inv_pemakaian_barang_online.service';
import { InvApprovalSettingPbService } from 'src/app/shared/services/inv_approvall_setting_pb.service';
@Component({
  moduleId: module.id,
  selector: 'pp-approval-cmp',
  styleUrls: ['approval.component.css'],
  templateUrl: 'approval.component.html'
})

export class ApprovaFinalComponent implements OnInit, AfterViewInit {
  isFormSubmitted = false;
  isChangePhoto = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  entryForm: FormGroup;
  categories: any[] = [];
  event: EventEmitter<any> = new EventEmitter();
  InvPemakaianBarang: InvPemakaianBarang;
  dbName;
  pathName;
  PATH_URL;

  dataSelectTanki;
  dataSelectSimbol;
  dataSelectLokasi;
  dataSelectKode;
  dataSelectKaryawan;
  dataSelectItem;

  dataItem;
  status_id = '1';

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private PrcPpService: PrcPpService,
    private authenticationService: AuthenticationService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private invPemakaianBarangService: InvPemakaianBarangOnlineService,
    private KaryawanService: KaryawanService,
    private InvItemService: InvItemService,
    private InvApprovalSettingPbService: InvApprovalSettingPbService,
    private invLaporanService: InvLaporanService,
  ) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;

    let toDate: Date = new Date();

    this.entryForm = this.builder.group({
      karyawan_id: new FormControl([]),
      lokasi_id: new FormControl([], Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      no_transaksi: new FormControl('', Validators.required),
      catatan: new FormControl(''),
      note_approve: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      status_id: new FormControl("1", Validators.required),
      details: this.builder.array([]),

    });




  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {

    // this.entryForm.controls['awal'].patchValue(this.PrcPp.awal);
    // this.entryForm.controls['akhir'].patchValue(this.PrcPp.akhir);
    this.entryForm.controls['no_transaksi'].patchValue(this.InvPemakaianBarang.no_transaksi);
    this.entryForm.controls['catatan'].patchValue(this.InvPemakaianBarang.catatan);
    this.entryForm.controls['status'].patchValue(this.InvPemakaianBarang.last_approve_position);

    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.InvPemakaianBarang.tanggal)));


  }
  public options: any;


  private loadSelect2(): void {


    let selectedLokasi;
    this.GbmOrganisasiService.getAllByType("UNIT").subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
        if (this.InvPemakaianBarang.lokasi_id == d.id) {
          selectedLokasi = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectedLokasi);
    });

    let selectedItem;
    this.InvItemService.getAll().subscribe(x => {
      this.dataSelectItem = [];
      this.dataItem = x['data'];
      x['data'].forEach(d => {
        this.dataSelectItem.push({ "id": d.id, "text": d.kode + " - " + d.nama })
      });
      let dtl = [];
      dtl = this.InvPemakaianBarang.detail;
      for (let index = 0; index < dtl.length; index++) {
        const d = dtl[index];
        this.addBlok(d['item_id'], d['qty'], d['ket'], d['id'], d['stok']);
      }
    });

    let next_kode_pb = '';
    if (this.InvPemakaianBarang.last_approve_position == 'PB1') {
      next_kode_pb = 'PB2'
    } else if (this.InvPemakaianBarang.last_approve_position == 'PB2') {
      next_kode_pb = 'PB3'
    } if (this.InvPemakaianBarang.last_approve_position == 'PB3') {
      next_kode_pb = 'PB4'
    } if (this.InvPemakaianBarang.last_approve_position == 'PB4') {
      next_kode_pb = 'PB5'
    } if (this.InvPemakaianBarang.last_approve_position == 'PB5') {
      next_kode_pb = 'PB6'
    }
    this.InvApprovalSettingPbService.getKaryawanByLokasiAndKode(this.InvPemakaianBarang.lokasi_id, next_kode_pb, 1).subscribe(p => {
      this.dataSelectKaryawan = [];
      console.log(p)
      p['data'].forEach(d => {
        this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama + "(" + d.nip + ")" });

      });
    });
    // let selectedKaryawan;
    // this.KaryawanService.getAll().subscribe(x=>{
    //   this.dataSelectKaryawan=[];
    //   x['data'].forEach(d => {
    //     this.dataSelectKaryawan.push({"id":d.id,"text":d.nama+"("+d.nama+")"});

    //   });

    // });

    this.dataSelectKode = [
      { id: 'PB1', text: 'PB1' },
      { id: 'PB2', text: 'PB2' },
      { id: 'PB3', text: 'PB3' },
      { id: 'PB4', text: 'PB4' },
      { id: 'PB5', text: 'PB5' },
      { id: 'PB6', text: 'PB6' },
    ];

  }

  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };
  addBlok(item_id, qty, ket, id, stok) {
    // this.details.push(this.builder.group(new InvoiceBlok()));
    let selectedItem;
    this.dataSelectItem.forEach(a => {
      if (item_id == a.id) {
        selectedItem = a;
      }
    });

    let uom;
    this.dataItem.forEach(x => {
      if (item_id == x.id) {
        uom = x.uom;
      }
    });

    this.details.push(this.builder.group({
      id: new FormControl(id, Validators.required),
      item: new FormControl(selectedItem, Validators.required),
      uom: new FormControl(uom),
      qty: new FormControl(qty, Validators.required),
      ket: new FormControl(ket),
      stok: new FormControl(formatNumber(stok, 'en_US', '1.2-2')),
    }));
  }
  removeBlok(Blok) {
    let i = this.details.controls.indexOf(Blok);

    if (i != -1) {
      //  let x=	this.details.controls.splice(i, 1);
      let bloks = this.entryForm.get('details') as FormArray;
      bloks.removeAt(i);
      let data = { details: bloks.value };
      this.updateForm(data);
    }
  }
  updateForm(data) {
    const bloks = data.details;
    let sub = 0;
    for (let i of bloks) {
      sub = sub + parseFloat(i.jumlah_janjang);
    }
    console.log(sub);
    //this.entryForm.get('total').patchValue( sub);
  }

  // onSubmit() {
  //   console.log(this.entryForm);

  //   this.isFormSubmitted = true;
  //   // let frmData=new FormData();
  //   if (this.entryForm.invalid) {
  //     return;
  //   }


  //   let frmData = this.entryForm.value;
  //   frmData['status'] = this.entryForm.get('status').value;
  //   frmData['note_approve'] = this.entryForm.get('note_approve').value;;
  //   frmData['is_finish'] = 1;
  //   frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
  //   console.log(frmData);

  //   this.invPemakaianBarangService.approve(this.InvPemakaianBarang.id, frmData).subscribe(data => {
  //     console.log(data);
  //     if (data['status'] == 'OK') {
  //       console.log('ok');
  //       swal({
  //         title: 'Info!',
  //         text: 'Data berhasil diSimpan',
  //         type: 'success',
  //         confirmButtonClass: "btn btn-success",
  //         buttonsStyling: false
  //       })
  //       this.event.emit('OK');
  //       this.bsModalRef.hide();
  //     }
  //   });
  // }

  onSubmit() {
    console.log(this.entryForm);
    this.isFormSubmitted = true;

    if (this.entryForm.invalid) {
      return;
    }

    let frmData = this.entryForm.value;
    frmData['status'] = this.entryForm.get('status').value;
    frmData['note_approve'] = this.entryForm.get('note_approve').value;
    frmData['is_finish'] = 1;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');

    // Langsung APPROVE tanpa POSTING
    this.invPemakaianBarangService.approve(this.InvPemakaianBarang.id, frmData).subscribe(approveResponse => {
      if (approveResponse['status'] === 'OK') {
        swal({
          title: 'Info!',
          text: 'Data berhasil diSimpan',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        });
        this.event.emit('OK');
        this.bsModalRef.hide();
      } else {
        swal({
          title: 'Gagal!',
          text: 'Approve gagal: ' + (approveResponse['data'] || ''),
          type: 'warning',
          confirmButtonClass: "btn btn-danger",
          buttonsStyling: false
        });
      }
    });
  }



  posting() {
    let that = this;
    let data;
    swal({
      title: 'Yakin akan diposting?',
      text: "Data tidak bisa akan dapat diubah !",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Ya, posting data!',
      cancelButtonText: 'Batal',

      buttonsStyling: false
    }).then(function () {
      that.invPemakaianBarangService.posting(that.InvPemakaianBarang.id, data).subscribe(data => {


        if (data['status'] == 'OK') {
          swal({
            title: 'Info!',
            text: 'Posting berhasil.',
            type: 'success',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          })
        } else {
          console.log(data);
          let items = [];
          if (data['data']) {
            items = data['data'];
            let msg = '';
            if (Array.isArray(items)) {
              console.log(items);
              items.forEach(element => {
                msg = msg + element['kode'] + '-' + element['nama'] + ', Stok:' + element['stok'] + '\n';
              });
              swal({
                title: 'Info! Silahkan Melakukan Reject Approval',
                text: 'Ada Stok Minus.' + msg,
                type: 'warning',
                confirmButtonClass: "btn btn-success",
                buttonsStyling: false
              })
            } else {
              swal({
                title: 'Info! Silahkan Melakukan Reject Approval',
                text: 'Posting gagal:' + data['data'],
                type: 'warning',
                confirmButtonClass: "btn btn-success",
                buttonsStyling: false
              })


            }
          } else {
            swal({
              title: 'Info! Silahkan Melakukan Reject Approval',
              text: 'Posting gagal',
              type: 'warning',
              confirmButtonClass: "btn btn-success",
              buttonsStyling: false
            })

          }
        }
      });

    });
  }

  reject() {
    console.log(this.entryForm);

    this.isFormSubmitted = true;
    // let frmData=new FormData();
    // if (this.entryForm.invalid) {
    //   return;
    // }


    let frmData = this.entryForm.value;
    frmData['status'] = this.entryForm.get('status').value;
    frmData['note_approve'] = this.entryForm.get('note_approve').value;;
    frmData['is_finish'] = 0;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    console.log(frmData);

    this.invPemakaianBarangService.reject(this.InvPemakaianBarang.id, frmData).subscribe(data => {
      console.log(data);
      // if (data['status'] == 'OK') {
      //   console.log('ok');
      swal({
        title: 'Info!',
        text: 'Data berhasil diSimpan',
        type: 'success',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      })
      this.event.emit('OK');
      this.bsModalRef.hide();
      // }
    });
  }

  statusChange($event) {
    this.status_id = $event.value;
    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;
  }
  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {
    console.log('INI APPROVE FINAL')
    this.loadSelect2();

  }
  valueChange($event) {
    console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }

  getUOM(form) {
    this.dataItem.forEach(x => {
      if (x.id == form.get('item').value.id) {
        form.get('uom').patchValue(x.uom);
      }
    });
  }
  cekStok(item) {
    let frmData = this.entryForm.value;
    let tanggal = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    let lokasi_id = (this.entryForm.get('lokasi_id').value['id']);
    let item_id = item.get('item').value['id'];
    let barang = item.get('item').value['text'];
    console.log(lokasi_id + '/' + item_id + '/' + tanggal)
    this.invLaporanService.cekStokByLokasi(lokasi_id, item_id, tanggal).subscribe(d => {
      let stok = 0
      console.log(d['data'])
      if (!isNullOrUndefined(d['data'])) {
        stok = d['data']['stok'];
      }
      this.entryForm.controls['status'].patchValue(stok);
    })
  }
  download(id) {
    this.invPemakaianBarangService.getById(id).subscribe(data => {
      // console.log(data);
      let filename = data['data']['file_info']['name']
      this.PrcPpService.download(id, filename);
    });
  }

}
