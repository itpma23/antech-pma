import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';


import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';;
import { PksSounding } from 'src/app/shared/models/pks_sounding.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { PksSoundingService } from 'src/app/shared/services/pks_sounding.service';
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
  public dataTankiDetail: any[] = [];


  pksSounding: PksSounding;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private pksSoundingService: PksSoundingService,
    private invItemService: InvItemService,
    private gbmSupplierService: GbmSupplierService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private PksTankiService: PksTankiService


  ) {
    let toDate: Date = new Date();
    let time: Date = new Date();

    this.entryForm = this.builder.group({
      mill_id: new FormControl([], Validators.required),
      tanki_id: new FormControl([], Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      no_transaksi: new FormControl('', Validators.required),
      sounding: new FormControl(0, Validators.required),
      meja_ukur: new FormControl(0, Validators.required),
      tinggi: new FormControl(0, Validators.required),
      hasil_1: new FormControl(0, Validators.required),
      hasil_2: new FormControl(0, Validators.required),
      hasil_total: new FormControl(0, Validators.required),
      suhu: new FormControl(0, Validators.required),
      cal: new FormControl(0, Validators.required),
      density: new FormControl(0, Validators.required),
      // kg: new FormControl(0, Validators.required),
    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

    console.log(this.pksSounding);
    let date: Date = new Date();
    let strDate = formatDate(date, "yyyy-MM-dd", "en_US");
    let tanggal = new Date(Date.parse(this.pksSounding['tanggal']));


    // this.entryForm.get('jam_masuk').patchValue(strDate + " " + this.pksSounding['jam_masuk']);
    // this.entryForm.get('jam_keluar').patchValue(strDate + " " + this.pksSounding['jam_keluar']);
    this.entryForm.get('tanggal').patchValue(tanggal);

    this.entryForm.controls['no_transaksi'].patchValue(this.pksSounding.no_transaksi);
    this.entryForm.controls['sounding'].patchValue(this.pksSounding.sounding);
    this.entryForm.controls['meja_ukur'].patchValue(this.pksSounding.meja_ukur);
    this.entryForm.controls['tinggi'].patchValue(this.pksSounding.tinggi);
    this.entryForm.controls['density'].patchValue(this.pksSounding.density);
    this.entryForm.controls['hasil_1'].patchValue(this.pksSounding.hasil_1);
    this.entryForm.controls['hasil_2'].patchValue(this.pksSounding.hasil_2);
    this.entryForm.controls['hasil_total'].patchValue(this.pksSounding.hasil_total);
    // this.entryForm.controls['tinggi_dari'].patchValue(this.pksSounding.tinggi_dari);
    // this.entryForm.controls['tinggi_sd'].patchValue(this.pksSounding.tinggi_sd);
    // this.entryForm.controls['kg'].patchValue(this.pksSounding.kg);
    this.entryForm.controls['suhu'].patchValue(this.pksSounding.suhu);
    this.entryForm.controls['cal'].patchValue(this.pksSounding.cal);


    this.valueChange();
  }
  private loadSelect2(): void {


    this.dataSelectTipe = [
      { id: 'INT', text: 'INTERNAL' },
      { id: 'EXT', text: 'EXTERNAL' },
      { id: 'AFL', text: 'AFILIASI' },

    ];

    // let selectTipe;
    // this.dataSelectTipe.forEach(a => {
    //   if (a.id == this.pksSounding.tipe) {
    //     selectTipe = a;
    //   }
    // });
    // this.entryForm.controls['tipe'].patchValue(selectTipe);

    let selectMill;
    this.GbmOrganisasiService.getAllByType('MILL').subscribe(x => {
      console.log(x);
      this.dataSelectMill = [];
      x.forEach(d => {
        this.dataSelectMill.push({ "id": d.id, "text": d.nama });
      });
      this.dataSelectMill.forEach(a => {
        if (a.id == this.pksSounding.mill_id) {
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
    //     if (a.id == this.pksSounding.estate_id) {
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
    //     if (a.id == this.pksSounding.item_id) {
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
    //     if (a.id == this.pksSounding.supplier_id) {
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
        if (a.id == this.pksSounding.tanki_id) {
          selectTanki = a;
        }
        this.entryForm.controls['tanki_id'].patchValue(selectTanki);
      });
      console.log(selectTanki);
    });




  }


  processSounding(){
    let data = {
      tanki_id: this.entryForm.get("tanki_id").value.id,
      sounding: this.entryForm.get("sounding").value,
      suhu: this.entryForm.get("suhu").value,
    };
    this.pksSoundingService.processSounding(data).subscribe(x=> {

      this.entryForm.get("meja_ukur").patchValue(x['data'].meja_ukur);
      this.entryForm.get("tinggi").patchValue(x['data'].tinggi);
      this.entryForm.get("density").patchValue(x['data'].density);
      this.entryForm.get("hasil_1").patchValue(x['data'].hasil_1);
      this.entryForm.get("hasil_2").patchValue(x['data'].hasil_2);
      this.entryForm.get("hasil_total").patchValue(
        (x['data'].hasil_total).toFixed(2)
      );
      this.entryForm.get("cal").patchValue(x['data'].cal);


      console.log(x);
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

    // let dataSubmit: PksSounding = {
    //   'mill_id': this.entryForm.get('mill_id').value.id,
    //   'tanki_id': this.entryForm.get('tanki_id').value.id,
    //   'tanggal': formatDate(this.entryForm.get('tanggal').value, "yyy-MM-dd", "en_US"),
    //   'no_transaksi': this.entryForm.get('no_transaksi').value,
    //   'tinggi': this.entryForm.get('tinggi').value,
    //   'suhu': this.entryForm.get('suhu').value,
    // };

    let frmData = this.entryForm.value;
    frmData['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');

    this.pksSoundingService.update(this.pksSounding.id, frmData).subscribe(data => {

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



  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();

  }
  valueChange(){
    this.entryForm.controls['tanki_id'].valueChanges.subscribe(val=> {
      this.getTankiDetail(val['id']);
    });
    this.entryForm.controls['tinggi'].valueChanges.subscribe(val=> {
      this.getVolume();
    });
  }

  getTankiDetail(id) {
    // this.PksTankiService.getAllDetail(id).subscribe(x=>{
    //   this.dataTankiDetail = x;
    // });
  }

  getVolume() {
    let tinggi = this.entryForm.controls['tinggi'].value;

    this.entryForm.controls['volume'].patchValue(0);
    this.dataTankiDetail['data'].forEach(d => {
      if (tinggi>=d.tinggi_dari && tinggi<=d.tinggi_sd) {
        this.entryForm.controls['volume'].patchValue(d.volume);
      //   console.log(d.volume);
      }
    });
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
