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
import { isNullOrUndefined, isNumber, isString } from 'util';
import { PrcApprovallSettingService } from 'src/app/shared/services/prc_approvall_setting.service';
import { InvLaporanService } from 'src/app/shared/services/inv_laporan.service';
declare var swal: any;

@Component({
  moduleId: module.id,
  selector: 'pp-approval-cmp',
  styleUrls: ['approval.component.css'],
  templateUrl: 'approval.component.html'
})

export class ApprovalComponent implements OnInit,AfterViewInit{
  isFormSubmitted=false;
  isChangePhoto=false;
	datepickerConfig = {
		dateInputFormat: 'DD-MM-YYYY',
		containerClass: 'theme-red'
	}
  entryForm: FormGroup;
  categories: any[] = [];
  event: EventEmitter<any>=new EventEmitter();
  PrcPp:PrcPp;
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

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private PrcPpService: PrcPpService,
    private prcApprovallSettingService: PrcApprovallSettingService,
    private authenticationService: AuthenticationService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private KaryawanService: KaryawanService,
    private InvItemService: InvItemService,
    private invLaporanService: InvLaporanService,
    ) {
      this.dbName= this.authenticationService.getUserDB();
      this.pathName= this.authenticationService.getUserPath();
      this.PATH_URL=SERVER_PATH_URL;

      let toDate: Date = new Date();

      this.entryForm = this.builder.group({
        karyawan_id: new FormControl([], Validators.required),
        lokasi_id: new FormControl([], Validators.required),
        tanggal: new FormControl(toDate, Validators.required),
        no_pp: new FormControl('', Validators.required),
        catatan: new FormControl('', Validators.required),

        details: this.builder.array([]),

      });




  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {

    // this.entryForm.controls['awal'].patchValue(this.PrcPp.awal);
    // this.entryForm.controls['akhir'].patchValue(this.PrcPp.akhir);
    this.entryForm.controls['no_pp'].patchValue(this.PrcPp.no_pp);
    this.entryForm.controls['catatan'].patchValue(this.PrcPp.catatan);

    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.PrcPp.tanggal)));


  }
  public options: any;


  private loadSelect2(): void {


    let selectedLokasi;
    this.GbmOrganisasiService.getAllByType("UNIT").subscribe(x=>{
      this.dataSelectLokasi=[];
      x.forEach(d => {
        this.dataSelectLokasi.push({"id":d.id,"text":d.nama});
        if (this.PrcPp.lokasi_id == d.id) {
          selectedLokasi = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectedLokasi);
    });

    let selectedItem;
    this.InvItemService.getAll().subscribe(x=>{
      this.dataSelectItem=[];
      this.dataItem = x['data'];
      x['data'].forEach(d => {
        this.dataSelectItem.push({"id":d.id,"text":d.kode+" - "+d.nama })
      });
      let dtl = [];
      dtl = this.PrcPp.detail;
      for (let index = 0; index < dtl.length; index++) {
        const d = dtl[index];
        this.addBlok(d['item_id'], d['qty'],  d['ket'],d['id'],d['stok']);
      }
    });

    this.prcApprovallSettingService.getKaryawanByLokasiAndKode(this.PrcPp.lokasi_id,"PP1").subscribe(p=>{
      this.dataSelectKaryawan=[];
      console.log(p)
      p['data'].forEach(d => {
        this.dataSelectKaryawan.push({"id":d.id,"text":d.nama+"("+d.nip+")"});

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
      { id: 'PP1', text: 'PP1' },
      { id: 'PP2', text: 'PP2' },
      { id: 'PP3', text: 'PP3' },
      { id: 'PP4', text: 'PP4' },
      { id: 'PP5', text: 'PP5' },
      { id: 'PP6', text: 'PP6' },
    ];
    // let selectedKode;
    // this.dataSelectKode.forEach(d => {
    //   if (this.PrcPp.kode == d.id) {
    //     selectedKode = { "id": d.id, "text": d.text }
    //   }
    // });
    // this.entryForm.get('kode_id').patchValue(selectedKode);

    // let selectedSimbol;
    // this.dataSelectSimbol.forEach(d => {
    //   if (this.PrcPp.simbol == d.id) {
    //     selectedSimbol = d;
    //   }
    // });
    // this.entryForm.get("simbol").patchValue(selectedSimbol);

  }

  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };
  addBlok(item_id, qty, ket,id,stok) {
    // this.details.push(this.builder.group(new InvoiceBlok()));
    let selectedItem;
    this.dataSelectItem.forEach(a => {
      if (item_id == a.id) {
        selectedItem =a;
      }
    });

    let uom;
    this.dataItem.forEach(x=> {
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
      stok:formatNumber(stok, 'en_US', '1.2-2')
    }));
  }
  removeBlok(Blok) {
    let i = this.details.controls.indexOf(Blok);

    if(i != -1) {
    //  let x=	this.details.controls.splice(i, 1);
      let bloks = this.entryForm.get('details') as FormArray;
      bloks.removeAt(i);
    	let data = {details: bloks.value};
    	this.updateForm(data);
    }
  }
  updateForm(data) {
    const bloks = data.details;
    let sub = 0;
    for(let i of bloks){
      sub=sub+ parseFloat( i.jumlah_janjang);
    }
    console.log(sub);
    //this.entryForm.get('total').patchValue( sub);
  }

  onSubmit(){
    console.log(this.entryForm);

    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }


    let frmData = this.entryForm.value;
    frmData['status']='';
    frmData['note_approve']='';
    frmData['is_ready_po']=0;
    frmData['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');
    console.log(frmData);

    this.PrcPpService.approve(this.PrcPp.id,frmData).subscribe(data=>{
      if( data['status']=='OK'){
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Data berhasil diSimpan',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        this.event.emit('OK');
        this.bsModalRef.hide();
      }
    });
  }


  onClose(){
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();

    // console.log(this.PrcPp);
    // this.entryForm = this.builder.group({
    //   nip: new FormControl(this.PrcPp.nip,[Validators.required]),
    //   nama: new FormControl(this.PrcPp.nama, [Validators.required]),
    //   jenis_kelamin: new FormControl(this.PrcPp.jenis_kelamin, [Validators.required]),
    //   tgl_lahir:   new FormControl(new Date(Date.parse(this.PrcPp.tgl_lahir)), Validators.required),
    //   tempat_lahir: new FormControl(this.PrcPp.tempat_lahir, []),
    //   alamat: new FormControl(this.PrcPp.alamat, []),
    //   username: new FormControl(this.PrcPp.username, []),
    //   password: new FormControl(this.PrcPp.password, []),
    // });


  }
  valueChange($event){
    console.log($event);

  //  let selectedOptions = $event.target['options'];
  //  let selectedIndex = selectedOptions.selectedIndex;
  // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }

 getUOM(form) {
    this.dataItem.forEach(x=> {
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
    console.log(lokasi_id+'/'+item_id+'/'+tanggal)
    this.invLaporanService.cekStokByLokasi(lokasi_id,item_id,tanggal).subscribe(d=>{
      let stok = 0
      console.log(d['data'])
     if ( !isNullOrUndefined(d['data'])  ){
      stok=d['data']['stok'];
     }
      swal({
        title: 'Stok : ' + stok,
        text: 'Item ' + barang,
        type: 'success',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      })
    })



  }
}
