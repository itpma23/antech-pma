import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';


import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';;
import { PksLab } from 'src/app/shared/models/pks_lab.model';
import { PksLabService } from 'src/app/shared/services/pks_lab.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { PksTankiService } from 'src/app/shared/services/pks_tanki.service';


declare var $: any;
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'edit-cmp',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.css'],
})

export class EditComponent implements OnInit, AfterViewInit {
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
  public dataSelectEstate: any[] = [];
  public dataSelectItem: any[] = [];
  public dataSelectSupplier: any[] = [];
  public dataSelectTanki: any[] = [];

  pksLab: PksLab;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private pksLabService: PksLabService,
    private invItemService: InvItemService,
    private gbmSupplierService: GbmSupplierService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private PksTankiService: PksTankiService


  ) {
    let toDate: Date = new Date();
    let time: Date = new Date();

    this.entryForm = this.builder.group({
      tipe: new FormControl([], Validators.required),
      mill_id: new FormControl([], Validators.required),
      tanki_id: new FormControl([], Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      
      ffa: new FormControl(0, Validators.required),
      moisture: new FormControl(0, Validators.required),
      kadar_air: new FormControl(0, Validators.required),
      dirt: new FormControl(0, Validators.required),
      dobi: new FormControl(0, Validators.required),
      jumlah: new FormControl(0, Validators.required),
    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

    console.log(this.pksLab);
    let date: Date = new Date();
    let strDate = formatDate(date, "yyyy-MM-dd", "en_US");
    let tanggal = new Date(Date.parse(this.pksLab['tanggal']));


    // this.entryForm.get('jam_masuk').patchValue(strDate + " " + this.pksLab['jam_masuk']);
    // this.entryForm.get('jam_keluar').patchValue(strDate + " " + this.pksLab['jam_keluar']);
    this.entryForm.get('tanggal').patchValue(tanggal);
    
    this.entryForm.controls['ffa'].patchValue(this.pksLab.ffa);
    this.entryForm.controls['moisture'].patchValue(this.pksLab.moisture);
    // this.entryForm.controls['kadar_air'].patchValue(this.pksLab.kadar_air);
    this.entryForm.controls['dirt'].patchValue(this.pksLab.dirt);
    this.entryForm.controls['dobi'].patchValue(this.pksLab.dobi);
    this.entryForm.controls['jumlah'].patchValue(this.pksLab.jumlah);
    // this.entryForm.controls['no_transaksi'].patchValue(this.pksLab.no_transaksi);
    // this.entryForm.controls['tinggi'].patchValue(this.pksLab.tinggi);
    // this.entryForm.controls['suhu'].patchValue(this.pksLab.suhu);



  }
  private loadSelect2(): void {


    this.dataSelectTipe = [
      { id: 'INT', text: 'INTERNAL' },
      { id: 'EXT', text: 'EXTERNAL' },
      { id: 'AFL', text: 'AFILIASI' },

    ];

    let selectTipe;
    this.dataSelectTipe.forEach(a => {
      if (a.id == this.pksLab.tipe) {
        selectTipe = a;
      }
    });
    this.entryForm.controls['tipe'].patchValue(selectTipe);
    let selectMill;
    this.GbmOrganisasiService.getAllByType('MILL').subscribe(x => {
      console.log(x);
      this.dataSelectMill = [];
      x.forEach(d => {
        this.dataSelectMill.push({ "id": d.id, "text": d.nama });
      });

      this.dataSelectMill.forEach(a => {
        if (a.id == this.pksLab.mill_id) {
          selectMill = a;
        }

      });
      this.entryForm.controls['mill_id'].patchValue(selectMill);

    });

    // let selectEstate;
    // this.GbmOrganisasiService.getAllByType('ESTATE').subscribe(x => {
    //   console.log(x);
    //   this.dataSelectEstate = [];
    //   x.forEach(d => {
    //     this.dataSelectEstate.push({ "id": d.id, "text": d.nama });
    //   });
    //   this.dataSelectEstate.forEach(a => {
    //     if (a.id == this.pksLab.estate_id) {
    //       selectEstate = a;
    //     }
    //   });
    //   this.entryForm.controls['estate_id'].patchValue(selectEstate);
    // });

    // let selectItem;
    // this.invItemService.getAll().subscribe(x => {
    //   console.log(x);
    //   this.dataSelectItem = [];
    //   x['data'].forEach(d => {
    //     this.dataSelectItem.push({ "id": d.id, "text": d.nama });
    //   });
    //   this.dataSelectItem.forEach(a => {
    //     if (a.id == this.pksLab.item_id) {
    //       selectItem = a;
    //     }
    //   });
    //   this.entryForm.controls['item_id'].patchValue(selectItem);
    // });

    // let selectSupplier;
    // this.gbmSupplierService.getAll().subscribe(x => {
    //   this.dataSelectSupplier = [];
    //   x['data'].forEach(d => {
    //     this.dataSelectSupplier.push({ "id": d.id, "text": d.nama_supplier });
    //   });
    //   this.dataSelectSupplier.forEach(a => {
    //     if (a.id == this.pksLab.supplier_id) {
    //       selectSupplier = a;
    //     }
    //     this.entryForm.controls['supplier_id'].patchValue(selectSupplier);
    //   });
    // });

    let selectTanki;
    this.PksTankiService.getAll().subscribe(x => {

      this.dataSelectTanki = [];
      x['data'].forEach(d => {
        this.dataSelectTanki.push({ "id": d.id, "text": d.nama_tanki });
      });

      this.dataSelectTanki.forEach(a => {
        if (a.id == this.pksLab.tanki_id) {
          selectTanki = a;
        }
        this.entryForm.controls['tanki_id'].patchValue(selectTanki);
      });

    });




  }

  onSubmit() {
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    // let frmData=new FormData();
    // if (this.entryForm.invalid) {
    //   return;
    // }

    // let jam_masuk = formatDate(this.entryForm.get('jam_masuk').value, "HH:mm", "en_US");
    // let jam_keluar = formatDate(this.entryForm.get('jam_keluar').value, "HH:mm", "en_US");

    let dataSubmit: PksLab = {
      'mill_id': this.entryForm.get('mill_id').value.id,
      'tanki_id': this.entryForm.get('tanki_id').value.id,
      'tanggal': formatDate(this.entryForm.get('tanggal').value, "yyy-MM-dd", "en_US"),
      
      'ffa': this.entryForm.get('ffa').value,
      'moisture': this.entryForm.get('moisture').value,
      // 'kadar_air': this.entryForm.get('kadar_air').value,
      'dirt': this.entryForm.get('dirt').value,
      'dobi': this.entryForm.get('dobi').value,
      'jumlah': this.entryForm.get('jumlah').value,
      // 'no_transaksi': this.entryForm.get('no_transaksi').value,
      // 'tinggi': this.entryForm.get('tinggi').value,
      // 'suhu': this.entryForm.get('suhu').value,
    };
    console.log(dataSubmit);
    this.pksLabService.update(this.pksLab.id, dataSubmit).subscribe(data => {

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
          text: 'Proses Edit Gagal',
          type: 'warning',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
      }
    });
  }



  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {

    this.loadSelect2();

  }
  valueChange($event) {
    console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.entryForm.patchValue({
      img: file
    });
    this.entryForm.get('img').updateValueAndValidity();
    this.isChangePhoto = true;
    console.log(this.isChangePhoto);
  }
}
